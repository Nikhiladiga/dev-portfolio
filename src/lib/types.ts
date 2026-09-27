import type { z } from "astro/zod";
import type {
  articleSchema,
  githubSnapshotSchema,
  ossSchema,
  patentSchema,
  projectSchema,
  repositoryStatsSchema,
} from "../content.schema";

export type RepositoryStats = Omit<
  z.infer<typeof repositoryStatsSchema>,
  "id"
>;
export type Project = z.infer<typeof projectSchema> & {
  id: string;
  stats?: RepositoryStats;
};
export type Article = z.infer<typeof articleSchema>;
export type OpenSourceWork = z.infer<typeof ossSchema> & { id: string };
export type Patent = z.infer<typeof patentSchema> & { id: string };
export type GitHubSnapshot = z.infer<typeof githubSnapshotSchema>;

export interface PortfolioStats {
  publicRepositories: number;
  patents: number;
  openSourceProjects: number;
  articles: number;
}
