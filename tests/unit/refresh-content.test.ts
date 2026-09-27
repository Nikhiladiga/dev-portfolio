import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  buildGitHubSnapshot,
  parseMediumFeed,
  refreshContent,
} from "../../scripts/refresh-content";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  const { rm } = await import("node:fs/promises");
  await Promise.all(
    temporaryDirectories.splice(0).map((path) =>
      rm(path, { recursive: true, force: true }),
    ),
  );
});

it("keeps only safe unique Medium articles newest first", () => {
  const result = parseMediumFeed(`
    <rss><channel>
      <item><guid>old</guid><title>Old</title><link>https://medium.com/old</link><pubDate>2026-01-01</pubDate></item>
      <item><guid>new</guid><title><![CDATA[<b>New</b>]]></title><link>https://medium.com/new</link><pubDate>2026-02-01</pubDate></item>
      <item><guid>duplicate</guid><title>Duplicate</title><link>https://medium.com/new</link><pubDate>2026-03-01</pubDate></item>
      <item><guid>unsafe</guid><title>Unsafe</title><link>javascript:alert(1)</link><pubDate>2026-04-01</pubDate></item>
      <item><guid>invalid</guid><title>Invalid date</title><link>https://medium.com/invalid</link><pubDate>not-a-date</pubDate></item>
    </channel></rss>
  `);

  expect(result.map(({ id }) => id)).toEqual(["new", "old"]);
  expect(result[0].title).toBe("New");
});

it("preserves string values and normalizes XML entities and markup", () => {
  const result = parseMediumFeed(`
    <rss><channel><item>
      <guid>encoded</guid>
      <title>true</title>
      <link>https://medium.com/encoded?a=1&amp;b=2</link>
      <pubDate>2026-02-01</pubDate>
      <category><![CDATA[<b>AI</b> &amp; Search]]></category>
    </item></channel></rss>
  `);

  expect(result).toEqual([
    expect.objectContaining({
      id: "encoded",
      title: "true",
      url: "https://medium.com/encoded?a=1&b=2",
      tags: ["AI & Search"],
    }),
  ]);
});

it("maps selected non-fork non-archived GitHub repositories", () => {
  const snapshot = buildGitHubSnapshot(
    { login: "Nikhiladiga", public_repos: 38 },
    [
      {
        name: "selected",
        html_url: "https://github.com/Nikhiladiga/selected",
        stargazers_count: 3,
        forks_count: 1,
        watchers_count: 3,
        fork: false,
        archived: false,
      },
      {
        name: "forked",
        html_url: "https://github.com/Nikhiladiga/forked",
        stargazers_count: 9,
        forks_count: 0,
        watchers_count: 9,
        fork: true,
        archived: false,
      },
      {
        name: "zero",
        html_url: "https://github.com/Nikhiladiga/zero",
        stargazers_count: 0,
        forks_count: 0,
        watchers_count: 0,
        fork: false,
        archived: false,
      },
    ],
    ["selected", "forked", "zero"],
  );

  expect(snapshot).toEqual({
    publicRepositories: 38,
    repositories: [{ id: "selected", stars: 3, forks: 1, watchers: 3 }],
  });
});

describe("refreshContent", () => {
  async function fixture() {
    const directory = await mkdtemp(join(tmpdir(), "portfolio-refresh-"));
    temporaryDirectories.push(directory);
    const projectCatalogPath = join(directory, "projects.json");
    const githubSnapshotPath = join(directory, "github.json");
    const articleSnapshotPath = join(directory, "articles.json");
    const originalGitHub = '[{"id":"profile","publicRepositories":1,"repositories":[]}]\n';
    const originalArticles = '[{"id":"old","title":"Old","url":"https://medium.com/old","pubDate":"2025-01-01","tags":[]}]\n';

    await Promise.all([
      writeFile(
        projectCatalogPath,
        '[{"id":"selected","title":"Selected","description":"Selected project","repositoryUrl":"https://github.com/Nikhiladiga/selected","technologies":["TypeScript"]}]\n',
      ),
      writeFile(githubSnapshotPath, originalGitHub),
      writeFile(articleSnapshotPath, originalArticles),
    ]);

    return {
      projectCatalogPath,
      githubSnapshotPath,
      articleSnapshotPath,
      originalGitHub,
      originalArticles,
    };
  }

  it("writes both validated snapshots", async () => {
    const paths = await fixture();
    const responses = [
      Response.json({ login: "Nikhiladiga", public_repos: 38 }),
      Response.json([
        {
          name: "selected",
          html_url: "https://github.com/Nikhiladiga/selected",
          stargazers_count: 3,
          forks_count: 1,
          watchers_count: 3,
          fork: false,
          archived: false,
        },
      ]),
      new Response(
        "<rss><channel><item><guid>new</guid><title>New</title><link>https://medium.com/new</link><pubDate>2026-02-01</pubDate></item></channel></rss>",
      ),
    ];

    await refreshContent({
      ...paths,
      fetchImpl: async () => responses.shift()!,
    });

    expect(JSON.parse(await readFile(paths.githubSnapshotPath, "utf8"))).toEqual([
      {
        id: "profile",
        publicRepositories: 38,
        repositories: [
          { id: "selected", stars: 3, forks: 1, watchers: 3 },
        ],
      },
    ]);
    expect(JSON.parse(await readFile(paths.articleSnapshotPath, "utf8"))).toEqual([
      {
        id: "new",
        title: "New",
        url: "https://medium.com/new",
        pubDate: "2026-02-01",
        tags: [],
        readingMinutes: 1,
      },
    ]);
  });

  it("leaves both snapshots untouched when a source is malformed", async () => {
    const paths = await fixture();
    const responses = [
      Response.json({ login: "Nikhiladiga", public_repos: 38 }),
      Response.json([]),
      new Response("<not-rss />"),
    ];

    await expect(
      refreshContent({
        ...paths,
        fetchImpl: async () => responses.shift()!,
      }),
    ).rejects.toThrow();

    expect(await readFile(paths.githubSnapshotPath, "utf8")).toBe(
      paths.originalGitHub,
    );
    expect(await readFile(paths.articleSnapshotPath, "utf8")).toBe(
      paths.originalArticles,
    );
  });

  it("leaves both snapshots untouched when the feed is truncated", async () => {
    const paths = await fixture();
    const responses = [
      Response.json({ login: "Nikhiladiga", public_repos: 38 }),
      Response.json([]),
      new Response(
        "<rss><channel><item><guid>new</guid><title>New</title><link>https://medium.com/new</link><pubDate>2026-02-01</pubDate></item>",
      ),
    ];

    await expect(
      refreshContent({
        ...paths,
        fetchImpl: async () => responses.shift()!,
      }),
    ).rejects.toThrow("Medium feed is not valid XML");

    expect(await readFile(paths.githubSnapshotPath, "utf8")).toBe(
      paths.originalGitHub,
    );
    expect(await readFile(paths.articleSnapshotPath, "utf8")).toBe(
      paths.originalArticles,
    );
  });
});
