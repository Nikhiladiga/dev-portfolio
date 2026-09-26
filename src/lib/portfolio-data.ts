import { fetchGitHubData } from "./github";
import { fetchMediumArticles } from "./medium";
import type { Article, Project } from "./types";

export async function buildPortfolioData(input: {
  projects: Project[];
  fallbackArticles: Article[];
  fallbackPublicRepos: number;
  fetchImpl?: typeof fetch;
}) {
  const [github, medium] = await Promise.all([
    fetchGitHubData({
      projects: input.projects,
      fallbackPublicRepos: input.fallbackPublicRepos,
      fetchImpl: input.fetchImpl,
    }),
    fetchMediumArticles({
      fallback: input.fallbackArticles,
      fetchImpl: input.fetchImpl,
    }),
  ]);

  return {
    projects: github.projects,
    articles: medium.articles,
    publicRepos: github.publicRepos,
    sources: { github: github.source, medium: medium.source },
  };
}
