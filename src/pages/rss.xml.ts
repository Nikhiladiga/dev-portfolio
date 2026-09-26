import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { PROFILE } from "../data/profile";
import { fetchMediumArticles } from "../lib/medium";

export const GET = (async ({ site }) => {
  if (!site) throw new Error("Astro site is required");
  const fallback = (await getCollection("articles")).map(({ data }) => data);
  const { articles } = await fetchMediumArticles({ fallback });

  return rss({
    title: `${PROFILE.name} — Articles`,
    description: PROFILE.statement,
    site,
    items: articles.map((article) => ({
      title: article.title,
      pubDate: article.pubDate,
      link: article.url,
      categories: article.tags,
    })),
  });
}) satisfies APIRoute;
