import { expect, test } from "@playwright/test";

for (const width of [320, 768, 1440]) {
  test(`has no page overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
  });
}

test("long project copy cannot create horizontal page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/");

  const description = page.locator("[data-project-description]").first();
  await expect(description).toBeVisible();
  await description.evaluate((element) => {
    element.textContent = "repository".repeat(80);
  });

  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
});
