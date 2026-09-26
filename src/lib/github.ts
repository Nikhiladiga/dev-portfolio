import { z } from "astro/zod";
import type { Project } from "./types";
import { fetchWithTimeout } from "./http";

const profileSchema = z.object({
  login: z.string().min(1),
  public_repos: z.number().int().nonnegative(),
});

const repositorySchema = z.object({
  name: z.string().min(1),
  html_url: z.string().url(),
  stargazers_count: z.number().int().nonnegative(),
  forks_count: z.number().int().nonnegative(),
  watchers_count: z.number().int().nonnegative(),
  fork: z.boolean(),
  archived: z.boolean(),
});

const repositoriesSchema = z.array(repositorySchema);

export type GitHubRepository = z.infer<typeof repositorySchema>;

export interface GitHubData {
  projects: Project[];
  publicRepos: number;
  source: "live" | "fallback";
}

function fallbackData(projects: Project[], publicRepos: number): GitHubData {
  return {
    projects: [...projects].sort((left, right) => left.order - right.order),
    publicRepos,
    source: "fallback",
  };
}

export function mergeGitHubProjects(
  projects: Project[],
  repositories: GitHubRepository[],
): Project[] {
  const byName = new Map<string, GitHubRepository>();

  for (const repository of repositories) {
    if (repository.fork || repository.archived || byName.has(repository.name)) {
      continue;
    }
    byName.set(repository.name, repository);
  }

  return [...projects]
    .sort((left, right) => left.order - right.order)
    .map((project) => {
      const repository = byName.get(project.repository);
      if (!repository || !project.showStats) return { ...project, stats: undefined };

      const stats = {
        stars: repository.stargazers_count,
        forks: repository.forks_count,
        watchers: repository.watchers_count,
      };
      const hasVisibleStat = Object.values(stats).some((value) => value > 0);

      return { ...project, stats: hasVisibleStat ? stats : undefined };
    });
}

export async function fetchGitHubData(options: {
  projects: Project[];
  fallbackPublicRepos: number;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}): Promise<GitHubData> {
  const fallback = fallbackData(options.projects, options.fallbackPublicRepos);
  if (process.env.PORTFOLIO_OFFLINE === "1") return fallback;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [profileResponse, repositoriesResponse] = await Promise.all([
      fetchWithTimeout(
        "https://api.github.com/users/Nikhiladiga",
        { headers },
        options.timeoutMs,
        options.fetchImpl,
      ),
      fetchWithTimeout(
        "https://api.github.com/users/Nikhiladiga/repos?sort=updated&per_page=100",
        { headers },
        options.timeoutMs,
        options.fetchImpl,
      ),
    ]);

    if (!profileResponse.ok || !repositoriesResponse.ok) {
      throw new Error(
        `GitHub returned ${profileResponse.status}/${repositoriesResponse.status}`,
      );
    }

    const profile = profileSchema.parse(await profileResponse.json());
    const repositories = repositoriesSchema.parse(
      await repositoriesResponse.json(),
    );

    return {
      projects: mergeGitHubProjects(options.projects, repositories),
      publicRepos: profile.public_repos,
      source: "live",
    };
  } catch {
    console.warn("[portfolio] GitHub unavailable; using checked-in fallback.");
    return fallback;
  }
}
