import { expect, test } from "./fixtures";

test.describe("Discard gates", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Discard gate", async ({ page, circuitInfo, idle }) => {
    const gate = circuitInfo.gatePalette.hGate;

    await page.mouse.move(gate.x, gate.y);
    await page.mouse.down();
    await page.mouse.up();
    await idle.waitFor();

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B%22H%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("discard-gate.png");
  });
});
