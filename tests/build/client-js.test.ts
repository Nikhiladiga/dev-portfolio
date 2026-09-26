import { readFileSync } from "node:fs";
import { load } from "cheerio";
import { beforeAll, expect, it } from "vitest";
import { buildSite } from "../helpers/build-site";

beforeAll(buildSite);

it("hydrates only the theme toggle", () => {
  const html = readFileSync("dist/index.html", "utf8");
  const $ = load(html);

  expect($("astro-island").length).toBe(1);
  expect($("canvas").length).toBe(0);
  expect(html).not.toContain("three");
});
