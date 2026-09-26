import { expect, test } from "@playwright/test";

test("theme choice persists across reloads", async ({ page }) => {
  await page.goto("/");
  const toggle = page.locator("[data-theme-toggle]");
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(toggle).toHaveAccessibleName("Switch to light theme");
});

test("theme remains operable when local storage is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, "getItem", {
      configurable: true,
      value: () => {
        throw new Error("storage unavailable");
      },
    });
    Object.defineProperty(Storage.prototype, "setItem", {
      configurable: true,
      value: () => {
        throw new Error("storage unavailable");
      },
    });
  });

  await page.goto("/");
  const toggle = page.locator("[data-theme-toggle]");
  const initial = await page.locator("html").getAttribute("data-theme");
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    initial === "dark" ? "light" : "dark",
  );
  await expect(toggle).toBeEnabled();
});
