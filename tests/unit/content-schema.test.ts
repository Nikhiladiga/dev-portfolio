import { describe, expect, it } from "vitest";
import {
  articleSchema,
  patentSchema,
  projectSchema,
} from "../../src/content.schema";
import { PROJECT_ALLOWLIST } from "../../src/data/project-allowlist";

describe("content schemas", () => {
  it("accepts a complete project", () => {
    expect(
      projectSchema.parse({
        title: "React Speedtest",
        description: "A browser speed test built with React and ndt7.",
        repository: "react-speedtest",
        repositoryUrl: "https://github.com/Nikhiladiga/react-speedtest",
        technologies: ["React", "JavaScript"],
        order: 3,
        showStats: true,
      }).repository,
    ).toBe("react-speedtest");
  });

  it("rejects non-HTTPS article URLs", () => {
    expect(() =>
      articleSchema.parse({
        id: "unsafe",
        title: "Unsafe",
        url: "javascript:alert(1)",
        pubDate: "2026-09-06",
        tags: [],
      }),
    ).toThrow();
  });

  it("requires a patent source URL", () => {
    expect(() =>
      patentSchema.parse({
        title: "Port-to-port tunnel",
        number: "US20240430231A1",
        description: "Secure remote access.",
        order: 1,
      }),
    ).toThrow();
  });

  it("contains only the approved repositories", () => {
    expect(PROJECT_ALLOWLIST).toEqual([
      "google-street-view-clone",
      "ios-http-server",
      "react-speedtest",
      "webkitgtk-kiosk-app",
    ]);
  });
});
