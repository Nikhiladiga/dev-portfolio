import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import { buildSite } from "../helpers/build-site";

describe("static Astro shell", () => {
  beforeAll(buildSite);

  it("emits identity and canonical metadata in raw HTML", () => {
    const html = readFileSync("dist/index.html", "utf8");
    expect(html).toContain("Nikhil Adiga");
    expect(html).toContain(
      '<link rel="canonical" href="https://nikhiladiga.pages.dev/">',
    );
    expect(html).not.toContain('<div id="root"></div>');
  });
});
