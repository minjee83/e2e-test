import { test, expect } from "@playwright/test";

test("login success", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Email").fill(
    process.env.TEST_USER_EMAIL || "test@ex.com"
  );
  await page.getByLabel("Password").fill(
    process.env.TEST_USER_PASSWORD || "pw1234"
  );

  await page.getByRole("button", { name: "Log in" }).click();

  console.log("CURRENT URL:", page.url());

  // redirect 확인
  await expect(page).toHaveURL("/dashboard");

  // 로그인 성공 UI 확인
  await expect(page.getByText("Dashboard")).toBeVisible();
  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
});

test("login fail", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Email").fill("wrong@example.com");
  await page.getByLabel("Password").fill("wrongpassword");

  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page).toHaveURL(/login\?err=1/);
  await expect(page.getByRole("alert")).toHaveText("Invalid credentials");
});
