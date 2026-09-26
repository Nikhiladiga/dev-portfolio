const expected = "https://nikhiladiga.pages.dev";

if (process.env.SITE_URL !== expected) {
  console.error(`SITE_URL must equal ${expected} for production builds.`);
  process.exit(1);
}
