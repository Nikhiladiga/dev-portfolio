import { z } from "astro/zod";

const httpsUrl = z
  .string()
  .url()
  .refine((value) => value.startsWith("https://"), "URL must use HTTPS");

export const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  repository: z.string().min(1),
  repositoryUrl: httpsUrl,
  demoUrl: httpsUrl.optional(),
  technologies: z.array(z.string().min(1)).min(1),
  order: z.number().int().positive(),
  showStats: z.boolean().default(true),
});

export const ossSchema = z.object({
  title: z.string().min(1),
  role: z.string().min(1),
  description: z.string().min(1),
  url: httpsUrl,
  order: z.number().int().positive(),
});

export const patentSchema = z.object({
  title: z.string().min(1),
  number: z.string().min(1),
  description: z.string().min(1),
  url: httpsUrl,
  order: z.number().int().positive(),
});

export const articleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  url: httpsUrl,
  pubDate: z.coerce.date(),
  tags: z.array(z.string().min(1)).default([]),
  readingMinutes: z.number().int().positive().optional(),
});
