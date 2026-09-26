import { XMLParser } from "fast-xml-parser";
import readingTime from "reading-time";
import type { Article } from "./types";
import { fetchWithTimeout } from "./http";

const MEDIUM_FEED_URL = "https://medium.com/feed/@nikhiladigaz";

type XmlValue = string | number | Record<string, unknown> | undefined | null;

function textValue(value: XmlValue): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim();
  }
  if (!value || typeof value !== "object") return "";

  const cdata = value["#cdata"];
  const text = value["#text"];
  if (Array.isArray(cdata)) return cdata.join("").trim();
  if (typeof cdata === "string") return cdata.trim();
  if (typeof text === "string" || typeof text === "number") {
    return String(text).trim();
  }
  return "";
}

function stripMarkup(value: string): string {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function stableId(guid: string, url: string): string {
  if (guid && !guid.startsWith("http")) return guid;
  const slug = new URL(url).pathname.split("/").filter(Boolean).at(-1);
  return slug || url;
}

export function parseMediumFeed(xml: string): Article[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    parseTagValue: false,
    trimValues: true,
    cdataPropName: "#cdata",
  });
  const parsed = parser.parse(xml) as {
    rss?: { channel?: { item?: Record<string, unknown> | Record<string, unknown>[] } };
  };
  const items = asArray(parsed.rss?.channel?.item);
  const seen = new Set<string>();
  const articles: Article[] = [];

  for (const item of items) {
    const title = stripMarkup(textValue(item.title as XmlValue));
    const url = textValue(item.link as XmlValue);
    const guid = textValue(item.guid as XmlValue);
    const dateValue = textValue(item.pubDate as XmlValue);
    const pubDate = new Date(dateValue);

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      continue;
    }
    if (
      !title ||
      parsedUrl.protocol !== "https:" ||
      Number.isNaN(pubDate.getTime()) ||
      seen.has(parsedUrl.href)
    ) {
      continue;
    }

    seen.add(parsedUrl.href);
    const categories = asArray(item.category as XmlValue | XmlValue[])
      .map((category) => textValue(category as XmlValue))
      .filter(Boolean);
    const content = stripMarkup(textValue(item["content:encoded"] as XmlValue));
    const readingMinutes = content
      ? Math.max(1, Math.ceil(readingTime(content).minutes))
      : undefined;

    articles.push({
      id: stableId(guid, parsedUrl.href),
      title,
      url: parsedUrl.href,
      pubDate,
      tags: categories,
      readingMinutes,
    });
  }

  return articles
    .sort((left, right) => right.pubDate.getTime() - left.pubDate.getTime())
    .slice(0, 10);
}

export async function fetchMediumArticles(options: {
  fallback: Article[];
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}): Promise<{ articles: Article[]; source: "live" | "fallback" }> {
  const fallback = { articles: options.fallback, source: "fallback" as const };
  if (process.env.PORTFOLIO_OFFLINE === "1") return fallback;

  try {
    const response = await fetchWithTimeout(
      MEDIUM_FEED_URL,
      { headers: { Accept: "application/rss+xml, application/xml;q=0.9" } },
      options.timeoutMs,
      options.fetchImpl,
    );
    if (!response.ok) throw new Error(`Medium returned ${response.status}`);

    const articles = parseMediumFeed(await response.text());
    if (articles.length === 0) throw new Error("Medium feed contained no articles");
    return { articles, source: "live" };
  } catch {
    console.warn("[portfolio] Medium unavailable; using checked-in fallback.");
    return fallback;
  }
}
