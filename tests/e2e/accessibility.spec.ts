import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("the page is semantic and free of serious accessibility violations", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.locator("h1")).toHaveCount(1);
  const targets = await page.locator('nav[aria-label="Primary navigation"] a[href^="#"]').evaluateAll((links) =>
    links.map((link) => link.getAttribute("href")).filter(Boolean),
  );
  for (const target of targets) {
    await expect(page.locator(target!)).toHaveCount(1);
  }

  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((violation) =>
    violation.impact === "serious" || violation.impact === "critical",
  );
  expect(
    serious.map((violation) => ({
      id: violation.id,
      targets: violation.nodes.flatMap((node) => node.target),
    })),
  ).toEqual([]);
  await expect(page.locator('a[href="/resume.pdf"]')).not.toHaveCount(0);
});

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
