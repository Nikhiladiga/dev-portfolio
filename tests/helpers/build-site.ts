import { execFileSync } from "node:child_process";

export function buildSite(): void {
  execFileSync("npm", ["run", "build:site"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      SITE_URL: "https://nikhiladiga.pages.dev",
      PORTFOLIO_OFFLINE: "1",
    },
    stdio: "pipe",
  });
}
