import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fetchMediumArticles } from "../src/lib/medium";
import type { Article } from "../src/lib/types";

const snapshotPath = resolve("src/content/articles/snapshot.json");

async function main(): Promise<void> {
  const stored = JSON.parse(await readFile(snapshotPath, "utf8")) as Array<
    Omit<Article, "pubDate"> & { pubDate: string }
  >;
  const fallback = stored.map((article) => ({
    ...article,
    pubDate: new Date(article.pubDate),
  }));
  const result = await fetchMediumArticles({ fallback });

  if (result.source !== "live" || result.articles.length === 0) {
    throw new Error("Refusing to replace the article snapshot without live data.");
  }

  const serialized = result.articles.map((article) => ({
    ...article,
    pubDate: article.pubDate.toISOString().slice(0, 10),
  }));
  await writeFile(snapshotPath, `${JSON.stringify(serialized, null, 2)}\n`);
}

await main();
