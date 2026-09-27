import { describe, expect, it } from "vitest";
import {
  articleSchema,
  githubSnapshotSchema,
  patentSchema,
  projectSchema,
} from "../../src/content.schema";

describe("content schemas", () => {
  it("accepts a project without duplicated repository controls", () => {
    expect(
      projectSchema.parse({
        title: "React Speedtest",
        description: "A browser speed test built with React and ndt7.",
        repositoryUrl: "https://github.com/Nikhiladiga/react-speedtest",
        technologies: ["React", "JavaScript"],
      }),
    ).toEqual({
      title: "React Speedtest",
      description: "A browser speed test built with React and ndt7.",
      repositoryUrl: "https://github.com/Nikhiladiga/react-speedtest",
      technologies: ["React", "JavaScript"],
    });
  });

  it("accepts a complete GitHub snapshot", () => {
    expect(
      githubSnapshotSchema.parse({
        publicRepositories: 38,
        repositories: [
          { id: "react-speedtest", stars: 3, forks: 1, watchers: 3 },
        ],
      }).publicRepositories,
    ).toBe(38);
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
      }),
    ).toThrow();
  });
});
