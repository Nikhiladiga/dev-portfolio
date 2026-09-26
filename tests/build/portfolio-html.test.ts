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
  expect(html).toContain("google-street-view-clone");
  expect(html).toContain("Say NO to cookie-cutter AI designs");
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
