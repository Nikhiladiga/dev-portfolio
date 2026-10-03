const expected = "https://nikhiladiga.in";

if (process.env.SITE_URL && process.env.SITE_URL !== expected) {
  console.error(
    `SITE_URL must equal ${expected} for production builds, but got: ${process.env.SITE_URL}`,
  );
  process.exit(1);
}
