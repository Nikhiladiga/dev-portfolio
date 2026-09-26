export function getSiteOrigin(value: string): URL {
  const url = new URL(value);
  if (url.protocol !== "https:") {
    throw new Error("Production SITE_URL must use HTTPS");
  }
  url.pathname = "/";
  url.search = "";
  url.hash = "";
  return url;
}

export function absoluteUrl(path: string, origin: URL): string {
  return new URL(path.replace(/^\/+/, ""), origin).href;
}
