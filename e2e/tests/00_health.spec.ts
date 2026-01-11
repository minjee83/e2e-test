import { test, expect } from "@playwright/test";

test("health check", async ({ page }) => {
  await page.goto("/login", { timeout: 3000 });
  await expect(page).toHaveURL(/login/);
});
