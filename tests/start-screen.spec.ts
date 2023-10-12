import { test, expect } from "@playwright/test";

test.describe("Start screen", () => {
  test("Gate palette and an empty quantum circuit are displayed", async ({
    page,
  }) => {
    // TODO: ポート番号を設定から取得する
    await page.goto("http://localhost:5173/");

    await expect(page).toHaveScreenshot("start-screen.png");
  });
});
