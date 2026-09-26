import { readFileSync } from "node:fs";
import { afterEach, expect, it, vi } from "vitest";
import { fetchMediumArticles, parseMediumFeed } from "../../src/lib/medium";

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.PORTFOLIO_OFFLINE;
});

it("normalizes a safe RSS fixture", () => {
  const [article] = parseMediumFeed(
    readFileSync("tests/fixtures/medium-feed.xml", "utf8"),
  );

  expect(article).toMatchObject({
    id: "safe-article-id",
    title: "A safe article",
    url: "https://nikhiladigaz.medium.com/a-safe-article-123456789abc",
    tags: ["Astro", "Testing"],
  });
  expect(article.pubDate.toISOString()).toBe("2026-09-06T10:00:00.000Z");
});

it("drops executable URLs, unsafe markup, and invalid dates", () => {
  const xml = "<rss><channel><item><guid>bad</guid><title><![CDATA[<script>alert(1)</script>Unsafe]]></title><link>javascript:alert(1)</link><pubDate>not-a-date</pubDate></item></channel></rss>";

  expect(parseMediumFeed(xml)).toEqual([]);
});

it("deduplicates by URL and sorts newest first", () => {
  const xml = `<rss><channel>
    <item><guid>older</guid><title>Older</title><link>https://medium.com/older</link><pubDate>2026-01-01</pubDate></item>
    <item><guid>newer</guid><title>Newer</title><link>https://medium.com/newer</link><pubDate>2026-02-01</pubDate></item>
    <item><guid>duplicate</guid><title>Duplicate</title><link>https://medium.com/newer</link><pubDate>2026-03-01</pubDate></item>
  </channel></rss>`;

  expect(parseMediumFeed(xml).map(({ id }) => id)).toEqual(["newer", "older"]);
});

it("uses committed data when fetch fails", async () => {
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
  const fallback = [
    {
      id: "fallback",
      title: "Fallback",
      url: "https://medium.com/fallback",
      pubDate: new Date("2026-01-01"),
      tags: [],
    },
  ];

  await expect(
    fetchMediumArticles({
      fallback,
      fetchImpl: async () => {
        throw new Error("offline");
      },
      timeoutMs: 10,
    }),
  ).resolves.toEqual({ articles: fallback, source: "fallback" });
});
