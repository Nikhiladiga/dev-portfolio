import { readFileSync, statSync } from "node:fs";
import { load } from "cheerio";
import { beforeAll, expect, it } from "vitest";
import { buildSite } from "../helpers/build-site";

beforeAll(buildSite);

it("emits canonical, social, and structured metadata", () => {
  const $ = load(readFileSync("dist/index.html", "utf8"));
  expect($("title").text()).toBe("Nikhil Adiga — Software Engineer");
  expect($('link[rel="canonical"]').attr("href")).toBe(
    "https://nikhiladiga.pages.dev/",
  );
  expect($('meta[property="og:image"]').attr("content")).toBe(
    "https://nikhiladiga.pages.dev/og.png",
  );
  expect($('meta[name="twitter:card"]').attr("content")).toBe(
    "summary_large_image",
  );
  expect($('link[type="application/rss+xml"]').attr("href")).toBe(
    "https://nikhiladiga.pages.dev/rss.xml",
  );

  const jsonLd = JSON.parse(
    $('script[type="application/ld+json"]').text(),
  ) as { "@graph": Array<{ "@type": string; sameAs?: string[] }> };
  const graph = jsonLd["@graph"];
  expect(graph.map((node) => node["@type"])).toEqual(
    expect.arrayContaining(["Person", "WebSite"]),
  );
  const person = graph.find((node) => node["@type"] === "Person");
  expect(person?.sameAs).toContain("https://github.com/Nikhiladiga");
});

it("generates crawl and sharing assets", () => {
  expect(readFileSync("dist/robots.txt", "utf8")).toContain(
    "Sitemap: https://nikhiladiga.pages.dev/sitemap-index.xml",
  );
  expect(readFileSync("dist/rss.xml", "utf8")).toContain("<rss");
  expect(readFileSync("dist/sitemap-index.xml", "utf8")).toContain(
    "https://nikhiladiga.pages.dev/",
  );
  expect(statSync("dist/og.png").size).toBeGreaterThan(10_000);
});
