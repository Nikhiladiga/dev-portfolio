import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const networkGuard = fileURLToPath(
  new URL("./deny-network.cjs", import.meta.url),
);

export function buildSite(): void {
  execFileSync("npm", ["run", "build:site"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_OPTIONS: [process.env.NODE_OPTIONS, `--require=${networkGuard}`]
        .filter(Boolean)
        .join(" "),
      SITE_URL: "https://nikhiladiga.pages.dev",
    },
    stdio: "pipe",
  });
}
