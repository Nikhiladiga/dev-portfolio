import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const root = new URL("../../", import.meta.url);

describe("Cloudflare deployment contract", () => {
  it("targets the existing Pages project and static output", () => {
    const wrangler = JSON.parse(
      readFileSync(new URL("wrangler.jsonc", root), "utf8"),
    );
    expect(wrangler.name).toBe("nikhiladiga");
    expect(wrangler.pages_build_output_dir).toBe("./dist");
    expect(wrangler).not.toHaveProperty("assets");
  });

  it("uploads to Cloudflare Pages instead of creating a Worker", () => {
    const workflow = readFileSync(
      new URL(".github/workflows/ci.yml", root),
      "utf8",
    );
    expect(workflow).toContain("schedule:");
    expect(workflow).toContain("workflow_dispatch:");
    expect(workflow).toContain("npm run content:refresh");
    expect(workflow).toContain("cloudflare/wrangler-action@v4");
    expect(workflow).toContain("deployments: write");
    expect(workflow).toContain(
      "command: pages deploy dist --project-name nikhiladiga --branch ${{ github.head_ref || github.ref_name }}",
    );
    expect(workflow).toContain("gitHubToken: ${{ secrets.GITHUB_TOKEN }}");
    expect(workflow).toContain('PLAYWRIGHT_REUSE_BUILD: "1"');
    expect(workflow).not.toContain("npm run build:site");
    expect(workflow).not.toMatch(/^\s+command: deploy\s*$/m);
    expect(workflow).not.toContain("gh-pages");
    expect(
      existsSync(new URL(".github/workflows/refresh-content.yml", root)),
    ).toBe(false);
    expect(existsSync(new URL(".github/workflows/deploy.yml", root))).toBe(false);
  });

  it("uses the Pages command for manual deployments", () => {
    const packageJson = JSON.parse(
      readFileSync(new URL("package.json", root), "utf8"),
    );
    expect(packageJson.scripts.deploy).toContain(
      "wrangler pages deploy dist --project-name nikhiladiga",
    );
    expect(packageJson.scripts.deploy).not.toContain("wrangler deploy");
  });

  it("ships baseline security headers", () => {
    const headers = readFileSync(new URL("public/_headers", root), "utf8");
    expect(headers).toContain("X-Content-Type-Options: nosniff");
    expect(headers).toContain("Permissions-Policy:");
    expect(headers).toContain("X-Frame-Options: DENY");
  });
});
