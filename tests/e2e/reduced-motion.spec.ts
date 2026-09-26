import { expect, test } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

test("reduced motion disables motion while navigation remains native", async ({
  page,
}) => {
  await page.goto("/");
  const duration = await page.locator(".brutal-star").first().evaluate((element) =>
    getComputedStyle(element).animationDuration,
  );
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.001);

  await page.locator('a[href="#projects"]').first().click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator("#projects")).toBeVisible();
});
