import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const root = new URL("../../", import.meta.url);

describe("Cloudflare deployment contract", () => {
  it("uses the claimed Workers project and static asset output", () => {
    const wrangler = JSON.parse(
      readFileSync(new URL("wrangler.jsonc", root), "utf8"),
    );
    expect(wrangler.name).toBe("nikhiladiga");
    expect(wrangler.assets.directory).toBe("./dist");
    expect(wrangler.assets.not_found_handling).toBe("404-page");
  });

  it("deploys through Wrangler and never through GitHub Pages", () => {
    const workflow = readFileSync(
      new URL(".github/workflows/refresh-content.yml", root),
      "utf8",
    );
    expect(workflow).toContain("cloudflare/wrangler-action@v4");
    expect(workflow).toContain("command: deploy");
    expect(workflow).not.toContain("gh-pages");
    expect(existsSync(new URL(".github/workflows/deploy.yml", root))).toBe(false);
  });

  it("ships baseline security headers", () => {
    const headers = readFileSync(new URL("public/_headers", root), "utf8");
    expect(headers).toContain("X-Content-Type-Options: nosniff");
    expect(headers).toContain("Permissions-Policy:");
    expect(headers).toContain("X-Frame-Options: DENY");
  });
});
