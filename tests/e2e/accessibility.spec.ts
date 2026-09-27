import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function seriousViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  return results.violations
    .filter(
      ({ impact }) => impact === "serious" || impact === "critical",
    )
    .map(({ id, nodes }) => ({
      id,
      targets: nodes.flatMap(({ target }) => target),
    }));
}

test("the page exposes semantic navigation and content", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.locator("h1")).toHaveCount(1);
  await expect(
    page.locator('nav[aria-label="Primary navigation"] > a').first(),
  ).toHaveAccessibleName(/^NA\b/);
  const targets = await page.locator('nav[aria-label="Primary navigation"] a[href^="#"]').evaluateAll((links) =>
    links.map((link) => link.getAttribute("href")).filter(Boolean),
  );
  for (const target of targets) {
    await expect(page.locator(target!)).toHaveCount(1);
  }
  await expect(page.locator('a[href="/resume.pdf"]')).not.toHaveCount(0);
});

for (const theme of ["light", "dark"] as const) {
  test(`${theme} theme has no serious accessibility violations`, async ({
    page,
  }) => {
    await page.addInitScript(
      (value) => localStorage.setItem("portfolio-theme", value),
      theme,
    );
    await page.goto("/");

    expect(await seriousViolations(page)).toEqual([]);
  });
}

test("keyboard focus remains visible on every interactive element", async ({
  page,
}) => {
  await page.goto("/");
  const interactive = page.locator(
    'a[href], button:not([disabled]), summary, input, textarea, select',
  );
  const interactiveCount = await interactive.count();
  await interactive.evaluateAll((elements) => {
    elements.forEach((element, index) => {
      (element as HTMLElement).dataset.focusQa = String(index);
    });
  });

  const visited = new Set<string>();
  for (let index = 0; index < interactiveCount; index += 1) {
    await page.keyboard.press("Tab");
    const focus = await page.evaluate(() => {
      const element = document.activeElement as HTMLElement | null;
      if (!element) return null;
      const style = getComputedStyle(element);
      return {
        key: element.dataset.focusQa ?? "missing",
        outline: style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0,
        shadow: style.boxShadow !== "none",
        visible: element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0,
      };
    });
    expect(focus).not.toBeNull();
    expect(focus?.visible).toBe(true);
    expect(focus?.outline || focus?.shadow).toBe(true);
    visited.add(focus!.key);
  }

  expect(visited.size).toBe(interactiveCount);
});

test("dark-theme keyboard focus contrasts with the cyan footer", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("portfolio-theme", "dark"));
  await page.reload();

  const footerLink = page.locator('footer a[href*="github.com"]').first();
  const interactiveCount = await page
    .locator('a[href], button:not([disabled]), summary, input, textarea, select')
    .count();
  for (let index = 0; index < interactiveCount; index += 1) {
    await page.keyboard.press("Tab");
    if (await footerLink.evaluate((element) => element === document.activeElement)) {
      break;
    }
  }

  await expect(footerLink).toBeFocused();
  const colors = await footerLink.evaluate((element) => ({
    outline: getComputedStyle(element).outlineColor,
    surface: getComputedStyle(element.closest("footer")!).backgroundColor,
  }));
  expect(colors.outline).not.toBe(colors.surface);
});
