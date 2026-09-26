import { expect, it } from "vitest";
import { absoluteUrl, getSiteOrigin } from "../../src/lib/site";

it("normalizes HTTPS production origins", () => {
  expect(getSiteOrigin("https://nikhiladiga.pages.dev/").href).toBe(
    "https://nikhiladiga.pages.dev/",
  );
  expect(() => getSiteOrigin("http://example.com")).toThrow("HTTPS");
  expect(
    absoluteUrl("/og.png", new URL("https://nikhiladiga.pages.dev/")),
  ).toBe("https://nikhiladiga.pages.dev/og.png");
});
