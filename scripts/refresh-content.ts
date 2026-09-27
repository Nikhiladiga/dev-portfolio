import { readFile, rename, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { XMLParser } from "fast-xml-parser";
import readingTime from "reading-time";
import sax from "sax";
import { z } from "astro/zod";
import {
  articleSchema,
  githubSnapshotSchema,
} from "../src/content.schema";
import type { Article, GitHubSnapshot } from "../src/lib/types";

const GITHUB_PROFILE_URL = "https://api.github.com/users/Nikhiladiga";
const GITHUB_REPOSITORIES_URL =
  "https://api.github.com/users/Nikhiladiga/repos?sort=updated&per_page=100";
const MEDIUM_FEED_URL = "https://medium.com/feed/@nikhiladigaz";

const githubProfileSchema = z.object({
  login: z.string().min(1),
  public_repos: z.number().int().nonnegative(),
});

const githubRepositorySchema = z.object({
  name: z.string().min(1),
  html_url: z.url(),
  stargazers_count: z.number().int().nonnegative(),
  forks_count: z.number().int().nonnegative(),
  watchers_count: z.number().int().nonnegative(),
  fork: z.boolean(),
  archived: z.boolean(),
});

const projectCatalogSchema = z.array(z.object({ id: z.string().min(1) }));

function decodeEntities(value: string): string {
  const named: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };

  return value.replace(
    /&(#(?:x[\da-f]+|\d+)|amp|apos|gt|lt|nbsp|quot);/gi,
    (match, entity: string) => {
      if (!entity.startsWith("#")) return named[entity.toLowerCase()] ?? match;
      const radix = entity[1]?.toLowerCase() === "x" ? 16 : 10;
      const digits = entity.slice(radix === 16 ? 2 : 1);
      const codePoint = Number.parseInt(digits, radix);
      return Number.isSafeInteger(codePoint) && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : match;
    },
  );
}

function textValue(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim();
  }
  if (!value || typeof value !== "object") return "";

  const record = value as Record<string, unknown>;
  const cdata = record["#cdata"];
  const text = record["#text"];
  if (Array.isArray(cdata)) {
    return cdata.map((part) => decodeEntities(String(part))).join("").trim();
  }
  if (typeof cdata === "string") return decodeEntities(cdata).trim();
  if (typeof text === "string" || typeof text === "number") {
    return String(text).trim();
  }
  return "";
}

function stripMarkup(value: string): string {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function assertWellFormedXml(xml: string): void {
  const validator = sax.parser(true);
  let validationError: Error | undefined;
  validator.onerror = (error) => {
    validationError = error;
    validator.resume();
  };
  validator.write(xml).close();
  if (validationError) throw new Error("Medium feed is not valid XML");
}

function stableId(guid: string, url: string): string {
  if (guid && !guid.startsWith("http")) return guid;
  return new URL(url).pathname.split("/").filter(Boolean).at(-1) ?? url;
}

export function parseMediumFeed(xml: string): Article[] {
  assertWellFormedXml(xml);
  const parser = new XMLParser({
    ignoreAttributes: false,
    parseTagValue: false,
    trimValues: true,
    cdataPropName: "#cdata",
  });
  const parsed = parser.parse(xml) as {
    rss?: { channel?: { item?: unknown | unknown[] } };
  };
  const channel = parsed.rss?.channel;
  if (!channel || typeof channel !== "object" || Array.isArray(channel)) {
    throw new Error("Medium feed has an invalid RSS envelope");
  }
  const items = asArray(channel.item);
  const seen = new Set<string>();
  const articles: Article[] = [];

  for (const rawItem of items) {
    if (!rawItem || typeof rawItem !== "object") continue;
    const item = rawItem as Record<string, unknown>;
    const title = stripMarkup(textValue(item.title));
    const url = textValue(item.link);
    const guid = textValue(item.guid);
    const pubDate = new Date(textValue(item.pubDate));

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      continue;
    }
    if (
      parsedUrl.protocol !== "https:" ||
      !title ||
      Number.isNaN(pubDate.getTime()) ||
      seen.has(parsedUrl.href)
    ) {
      continue;
    }

    seen.add(parsedUrl.href);
    const content = stripMarkup(textValue(item["content:encoded"]));
    const tags = asArray(item.category)
      .map((category) => stripMarkup(textValue(category)))
      .filter(Boolean);
    articles.push({
      id: stableId(guid, parsedUrl.href),
      title,
      url: parsedUrl.href,
      pubDate,
      tags,
      readingMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)),
    });
  }

  return articles
    .sort((left, right) => right.pubDate.getTime() - left.pubDate.getTime())
    .slice(0, 10);
}

export function buildGitHubSnapshot(
  profileInput: unknown,
  repositoriesInput: unknown,
  projectIds: readonly string[],
): GitHubSnapshot {
  const profile = githubProfileSchema.parse(profileInput);
  const repositories = z.array(githubRepositorySchema).parse(repositoriesInput);
  const selected = new Set(projectIds);
  const seen = new Set<string>();
  const statistics: GitHubSnapshot["repositories"] = [];

  for (const repository of repositories) {
    if (
      !selected.has(repository.name) ||
      repository.fork ||
      repository.archived ||
      seen.has(repository.name)
    ) {
      continue;
    }
    seen.add(repository.name);

    const stats = {
      id: repository.name,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
      watchers: repository.watchers_count,
    };
    if (stats.stars > 0 || stats.forks > 0 || stats.watchers > 0) {
      statistics.push(stats);
    }
  }

  return githubSnapshotSchema.parse({
    publicRepositories: profile.public_repos,
    repositories: statistics,
  });
}

export interface RefreshOptions {
  projectCatalogPath: string;
  githubSnapshotPath: string;
  articleSnapshotPath: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

async function checkedResponse(
  responsePromise: Promise<Response>,
  source: string,
): Promise<Response> {
  const response = await responsePromise;
  if (!response.ok) throw new Error(`${source} returned ${response.status}`);
  return response;
}

async function replaceBoth(
  githubPath: string,
  githubJson: string,
  articlePath: string,
  articleJson: string,
): Promise<void> {
  const [originalGitHub, originalArticles] = await Promise.all([
    readFile(githubPath),
    readFile(articlePath),
  ]);
  const nonce = `${process.pid}-${Date.now()}`;
  const githubTemp = `${githubPath}.${nonce}.tmp`;
  const articleTemp = `${articlePath}.${nonce}.tmp`;
  let githubReplaced = false;

  await Promise.all([
    writeFile(githubTemp, githubJson),
    writeFile(articleTemp, articleJson),
  ]);

  try {
    await rename(githubTemp, githubPath);
    githubReplaced = true;
    await rename(articleTemp, articlePath);
  } catch (error) {
    if (githubReplaced) await writeFile(githubPath, originalGitHub);
    await writeFile(articlePath, originalArticles);
    throw error;
  } finally {
    await Promise.allSettled([rm(githubTemp), rm(articleTemp)]);
  }
}

export async function refreshContent(options: RefreshOptions): Promise<void> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? 8_000;
  const signal = () => AbortSignal.timeout(timeoutMs);
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const projectCatalog = projectCatalogSchema.parse(
    JSON.parse(await readFile(options.projectCatalogPath, "utf8")),
  );
  const [profileResponse, repositoriesResponse, mediumResponse] =
    await Promise.all([
      checkedResponse(
        fetchImpl(GITHUB_PROFILE_URL, { headers, signal: signal() }),
        "GitHub profile",
      ),
      checkedResponse(
        fetchImpl(GITHUB_REPOSITORIES_URL, { headers, signal: signal() }),
        "GitHub repositories",
      ),
      checkedResponse(
        fetchImpl(MEDIUM_FEED_URL, {
          headers: { Accept: "application/rss+xml, application/xml;q=0.9" },
          signal: signal(),
        }),
        "Medium",
      ),
    ]);

  const github = buildGitHubSnapshot(
    await profileResponse.json(),
    await repositoriesResponse.json(),
    projectCatalog.map(({ id }) => id),
  );
  const articles = parseMediumFeed(await mediumResponse.text());
  if (articles.length === 0) {
    throw new Error("Medium feed contained no valid articles");
  }
  articleSchema.array().parse(articles);

  const githubJson = `${JSON.stringify(
    [{ id: "profile", ...github }],
    null,
    2,
  )}\n`;
  const articleJson = `${JSON.stringify(
    articles.map((article) => ({
      ...article,
      pubDate: article.pubDate.toISOString().slice(0, 10),
    })),
    null,
    2,
  )}\n`;

  await replaceBoth(
    options.githubSnapshotPath,
    githubJson,
    options.articleSnapshotPath,
    articleJson,
  );
}

const isDirectExecution =
  process.argv[1] !== undefined &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isDirectExecution) {
  await refreshContent({
    projectCatalogPath: resolve("src/content/projects/catalog.json"),
    githubSnapshotPath: resolve("src/content/github/snapshot.json"),
    articleSnapshotPath: resolve("src/content/articles/snapshot.json"),
  });
}
