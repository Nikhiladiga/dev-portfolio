import { expect, it } from "vitest";
import { absoluteUrl, getSiteOrigin } from "../../src/lib/site";

it("normalizes HTTPS production origins", () => {
  expect(getSiteOrigin("https://nikhiladiga.in/").href).toBe(
    "https://nikhiladiga.in/",
  );
  expect(() => getSiteOrigin("http://example.com")).toThrow("HTTPS");
  expect(
    absoluteUrl("/og.png", new URL("https://nikhiladiga.in/")),
  ).toBe("https://nikhiladiga.in/og.png");
});
