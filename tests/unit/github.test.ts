import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchGitHubData,
  mergeGitHubProjects,
  type GitHubRepository,
} from "../../src/lib/github";
import type { Project } from "../../src/lib/types";

const project = (repository: string, order: number): Project => ({
  id: repository,
  title: repository,
  description: repository,
  repository,
  repositoryUrl: `https://github.com/Nikhiladiga/${repository}`,
  technologies: ["TypeScript"],
  order,
  showStats: true,
});

const repository = (
  name: string,
  stars: number,
  overrides: Partial<GitHubRepository> = {},
): GitHubRepository => ({
  name,
  html_url: `https://github.com/Nikhiladiga/${name}`,
  stargazers_count: stars,
  forks_count: 0,
  watchers_count: stars,
  fork: false,
  archived: false,
  ...overrides,
});

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.PORTFOLIO_OFFLINE;
});

describe("mergeGitHubProjects", () => {
  it("keeps local order and ignores duplicate, forked, archived, and unapproved repos", () => {
    const result = mergeGitHubProjects(
      [project("ios-http-server", 2), project("react-speedtest", 1)],
      [
        repository("react-speedtest", 3, { forks_count: 1 }),
        repository("react-speedtest", 99),
        repository("unapproved", 50),
        repository("forked", 20, { fork: true }),
        repository("archived", 20, { archived: true }),
        repository("ios-http-server", 4),
      ],
    );

    expect(result.map((item) => item.repository)).toEqual([
      "react-speedtest",
      "ios-http-server",
    ]);
    expect(result[0].stats).toEqual({ stars: 3, forks: 1, watchers: 3 });
  });

  it("does not render a meaningless zero-stat row", () => {
    const [result] = mergeGitHubProjects(
      [project("react-speedtest", 1)],
      [repository("react-speedtest", 0)],
    );

    expect(result.stats).toBeUndefined();
  });
});

it("returns validated live GitHub data", async () => {
  const profile = readFileSync("tests/fixtures/github-profile.json", "utf8");
  const repos = readFileSync("tests/fixtures/github-repos.json", "utf8");
  const responses = [
    new Response(profile, { status: 200 }),
    new Response(repos, { status: 200 }),
  ];
  const fetchImpl: typeof fetch = vi.fn(async () => responses.shift()!);

  await expect(
    fetchGitHubData({
      projects: [project("react-speedtest", 1)],
      fallbackPublicRepos: 12,
      fetchImpl,
    }),
  ).resolves.toMatchObject({ publicRepos: 38, source: "live" });
});

it("falls back when GitHub returns malformed data", async () => {
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
  const fetchImpl: typeof fetch = vi.fn(async () =>
    new Response('{"public_repos":"many"}', { status: 200 }),
  );
  const projects = [project("react-speedtest", 1)];

  await expect(
    fetchGitHubData({
      projects,
      fallbackPublicRepos: 12,
      fetchImpl,
    }),
  ).resolves.toEqual({ projects, publicRepos: 12, source: "fallback" });
});
