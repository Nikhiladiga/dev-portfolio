import { readFileSync } from "node:fs";
import { load } from "cheerio";
import { beforeAll, expect, it } from "vitest";
import { buildSite } from "../helpers/build-site";

let html: string;

beforeAll(() => {
  buildSite();
  html = readFileSync("dist/index.html", "utf8");
});

it("contains complete portfolio content in raw HTML", () => {
  expect(html).toContain("Typesense");
  expect(html).toContain("US20240430231A1");
  expect(html).toContain("Say NO to cookie-cutter AI designs");

  const expectedProjects = [
    "create-typesense-app",
    "react-wsx",
    "google-street-view-clone",
    "ios-http-server",
    "react-speedtest",
    "webkitgtk-kiosk-app",
  ];

  for (const repo of expectedProjects) {
    expect(html).toContain(repo);
  }
  expect(html).toContain("https://www.npmjs.com/package/react-wsx");
});

it("serves an optimized profile portrait", () => {
  const $ = load(html);
  const portrait = $('img[src="/nikhil-320.webp"]');
  expect(portrait).toHaveLength(1);
  expect(portrait.attr("srcset")).toContain("/nikhil.webp 512w");
  expect(readFileSync("dist/nikhil-320.webp").byteLength).toBeLessThan(30_000);
  expect(readFileSync("dist/nikhil.webp").byteLength).toBeLessThan(100_000);
});

it("uses one h1 and approved section order", () => {
  const $ = load(html);
  expect($("h1").length).toBe(1);
  expect($("nav").length).toBeGreaterThan(0);
  expect($("main").length).toBe(1);
  expect($("footer").length).toBe(1);
  const ids = $("main > section")
    .map((_index, node) => $(node).attr("id"))
    .get();
  expect(ids).toEqual([
    "home",
    "stats",
    "stack",
    "projects",
    "open-source",
    "patent",
    "writing",
  ]);
});

it("uses crawlable anchors and a root résumé path", () => {
  const $ = load(html);
  expect($('a[href="#projects"]').length).toBeGreaterThan(0);
  expect($('[data-project-stats="empty"]').length).toBe(0);
  expect($('a[href="/resume.pdf"]').length).toBeGreaterThan(0);
});
