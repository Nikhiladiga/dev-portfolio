import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    fileParallelism: false,
    include: ["tests/unit/**/*.test.ts", "tests/build/**/*.test.ts"],
    restoreMocks: true,
  },
});
