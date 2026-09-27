import { readFileSync, statSync } from "node:fs";
import { load, type CheerioAPI } from "cheerio";
import { beforeAll, expect, it } from "vitest";
import { buildSite } from "../helpers/build-site";

let html: string;
let $: CheerioAPI;
const articleSnapshot = JSON.parse(
  readFileSync("src/content/articles/snapshot.json", "utf8"),
) as Array<{ title: string; url: string }>;
const [{ repositories: repositorySnapshot }] = JSON.parse(
  readFileSync("src/content/github/snapshot.json", "utf8"),
) as Array<{
  repositories: Array<{
    id: string;
    stars: number;
    forks: number;
    watchers: number;
  }>;
}>;

beforeAll(() => {
  buildSite();
  html = readFileSync("dist/index.html", "utf8");
  $ = load(html);
});

function pngDimensions(path: string): { width: number; height: number } {
  const bytes = readFileSync(path);
  expect([...bytes.subarray(0, 8)]).toEqual([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ]);
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

it("emits a complete semantic portfolio shell", () => {
  expect($("h1")).toHaveLength(1);
  expect($("nav").length).toBeGreaterThan(0);
  expect($("main")).toHaveLength(1);
  expect($("footer")).toHaveLength(1);
  expect(
    $("main > section")
      .map((_index, node) => $(node).attr("id"))
      .get(),
  ).toEqual([
    "home",
    "stats",
    "stack",
    "experience",
    "projects",
    "open-source",
    "patent",
    "writing",
  ]);
  expect(html).toContain("Nikhil Adiga");
  expect(html).toContain("US20240430231A1");
  expect(html).toContain("create-typesense-app");
  expect(html).toContain("webkitgtk-kiosk-app");
  expect(
    $("#writing ol a")
      .map((_index, node) => $(node).attr("href"))
      .get(),
  ).toEqual(articleSnapshot.map(({ url }) => url));
  for (const { title } of articleSnapshot) {
    expect($("#writing").text()).toContain(title);
  }
  expect($("#writing a").last().attr("href")).toBe(
    "https://nikhiladigaz.medium.com",
  );
  expect($("#writing a").last().text()).toContain("See all articles");
});

it("renders the career timeline and snapshot statistics as crawlable content", () => {
  const entries = $("#experience [data-career-entry]");
  expect(entries).toHaveLength(4);
  expect(entries.eq(0).text()).toContain("Typesense");
  expect(entries.eq(0).text()).toContain("Starting Nov 2026");
  expect(entries.eq(1).text()).toContain("Vinyl Equity");
  expect(entries.eq(2).text()).toContain("Sclera");
  expect(entries.eq(3).text()).toContain("Access Research Labs");

  const statistics = $('[data-project-stats="visible"]');
  expect(statistics).toHaveLength(repositorySnapshot.length);
  for (const repository of repositorySnapshot) {
    const project = $("#projects article").filter((_index, node) =>
      $(node).text().includes(`/ ${repository.id}`),
    );
    expect(project).toHaveLength(1);
    expect(project.find('[data-project-stats="visible"]').text()).toContain(
      `Stars${repository.stars}`,
    );
    expect(project.find('[data-project-stats="visible"]').text()).toContain(
      `Forks${repository.forks}`,
    );
    expect(project.find('[data-project-stats="visible"]').text()).toContain(
      `Watchers${repository.watchers}`,
    );
  }
});

it("uses crawlable links, local SVG icons, and optimized portraits", () => {
  expect($('a[href="#projects"]').length).toBeGreaterThan(0);
  expect($('a[href="#experience"]').length).toBeGreaterThan(0);
  expect($('a[href="/resume.pdf"]').length).toBeGreaterThan(0);
  expect($('svg[data-external-link-icon="true"]').length).toBeGreaterThan(0);
  expect(html).not.toContain("↗");

  const portrait = $('img[src="/nikhil-320.webp"]');
  expect(portrait).toHaveLength(1);
  expect(portrait.attr("srcset")).toContain("/nikhil.webp 512w");
  expect(readFileSync("dist/nikhil-320.webp").byteLength).toBeLessThan(30_000);
  expect(readFileSync("dist/nikhil.webp").byteLength).toBeLessThan(100_000);
});

it("ships metadata and structured identity", () => {
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
  ) as {
    "@graph": Array<{
      "@type": string;
      name?: string;
      alternateName?: string[];
      sameAs?: string[];
    }>;
  };
  expect(jsonLd["@graph"].map((node) => node["@type"])).toEqual(
    expect.arrayContaining(["Person", "WebSite"]),
  );
  expect(
    jsonLd["@graph"].find((node) => node["@type"] === "Person")?.sameAs,
  ).toContain("https://github.com/Nikhiladiga");
});

it("copies fixed crawl and sharing assets into the build", () => {
  expect($('link[rel="icon"]').attr("href")).toBe("/favicon.png");
  expect($('link[rel="icon"]').attr("sizes")).toBe("192x192");
  expect(pngDimensions("public/favicon.png")).toEqual({
    width: 192,
    height: 192,
  });
  expect(pngDimensions("public/og.png")).toEqual({
    width: 1200,
    height: 630,
  });
  expect(pngDimensions("dist/favicon.png")).toEqual({
    width: 192,
    height: 192,
  });
  expect(pngDimensions("dist/og.png")).toEqual({
    width: 1200,
    height: 630,
  });
  expect(readFileSync("dist/robots.txt", "utf8")).toContain(
    "Sitemap: https://nikhiladiga.pages.dev/sitemap-index.xml",
  );
  expect(readFileSync("dist/rss.xml", "utf8")).toContain("<rss");
  expect(readFileSync("dist/sitemap-index.xml", "utf8")).toContain(
    "https://nikhiladiga.pages.dev/",
  );
  expect(statSync("dist/og.png").size).toBeGreaterThan(10_000);
});

it("ships a native theme control without framework islands", () => {
  expect($("astro-island")).toHaveLength(0);
  expect($("[data-theme-toggle]")).toHaveLength(1);
  expect($("canvas")).toHaveLength(0);
  expect(html).not.toContain("three");
});
