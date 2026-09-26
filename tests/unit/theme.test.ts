import { expect, it } from "vitest";
import { resolveTheme } from "../../src/lib/theme";

it("uses valid storage before system preference", () => {
  expect(resolveTheme("light", true)).toBe("light");
  expect(resolveTheme("dark", false)).toBe("dark");
});

it("uses system preference for missing or corrupt storage", () => {
  expect(resolveTheme(null, true)).toBe("dark");
  expect(resolveTheme("corrupt", false)).toBe("light");
});
