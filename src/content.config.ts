import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import {
  articleSchema,
  githubSnapshotSchema,
  ossSchema,
  patentSchema,
  projectSchema,
} from "./content.schema";

const projects = defineCollection({
  loader: file("src/content/projects/catalog.json"),
  schema: projectSchema,
});

const oss = defineCollection({
  loader: file("src/content/oss/catalog.json"),
  schema: ossSchema,
});

const patents = defineCollection({
  loader: file("src/content/patents/catalog.json"),
  schema: patentSchema,
});

const articles = defineCollection({
  loader: file("src/content/articles/snapshot.json"),
  schema: articleSchema,
});

const github = defineCollection({
  loader: file("src/content/github/snapshot.json"),
  schema: githubSnapshotSchema,
});

export const collections = { projects, oss, patents, articles, github };
