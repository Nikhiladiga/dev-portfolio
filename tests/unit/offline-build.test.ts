import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";

it("rejects outbound requests in guarded build processes", () => {
  const guard = fileURLToPath(
    new URL("../helpers/deny-network.cjs", import.meta.url),
  );
  const result = spawnSync(
    process.execPath,
    [
      "--require",
      guard,
      "--input-type=module",
      "--eval",
      'await fetch("https://example.com")',
    ],
    { encoding: "utf8" },
  );

  expect(result.status).not.toBe(0);
  expect(`${result.stdout}${result.stderr}`).toContain(
    "Build attempted outbound network access",
  );
});
