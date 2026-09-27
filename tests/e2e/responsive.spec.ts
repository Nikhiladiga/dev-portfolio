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

test("career timeline progresses vertically and alternates across its rail", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#experience");

  const entries = await page.locator("[data-career-entry]").evaluateAll((nodes) =>
    nodes.map((node) => {
      const card = node.querySelector(".career-card");
      if (!(card instanceof HTMLElement)) {
        throw new Error("Career entry is missing its card");
      }

      const rect = card.getBoundingClientRect();
      return { left: rect.left, top: rect.top };
    }),
  );

  expect(entries).toHaveLength(4);
  for (let index = 1; index < entries.length; index += 1) {
    expect(entries[index].top).toBeGreaterThan(entries[index - 1].top);
  }
  expect(entries[0].left).toBeLessThan(entries[1].left);
  expect(entries[2].left).toBeLessThan(entries[3].left);
});
