import { expect, test } from "./fixtures";
import { dragAndDrop } from "./test-helpers";

test.describe("Insert gate between steps", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Insert a gate before the first step", async ({ page, circuitInfo }) => {
    const hGate = circuitInfo.gatePalette.hGate;

    await dragAndDrop(page, hGate, { beforeStep: 0, bit: 0 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B%22H%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("insert-h-gate-before-step0.png");
  });

  test("Insert a gate before the gate on the first step", async ({
    page,
    circuitInfo,
  }) => {
    const hGate = circuitInfo.gatePalette.hGate;

    await dragAndDrop(page, hGate, { step: 0, bit: 0 });
    await dragAndDrop(page, hGate, { beforeStep: 0, bit: 0 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B%22H%22%5D%2C%5B%22H%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("insert-h-gate-before-step0-gate0.png");
  });

  test("Insert a gate after the first step", async ({ page, circuitInfo }) => {
    const hGate = circuitInfo.gatePalette.hGate;

    await dragAndDrop(page, hGate, { afterStep: 0, bit: 0 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B1%5D%2C%5B%22H%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("insert-h-gate-after-step0.png");
  });

  test("Insert a gate after the gate on the first step", async ({
    page,
    circuitInfo,
  }) => {
    const hGate = circuitInfo.gatePalette.hGate;

    await dragAndDrop(page, hGate, { step: 0, bit: 0 });
    await dragAndDrop(page, hGate, { afterStep: 0, bit: 0 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B%22H%22%5D%2C%5B%22H%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("insert-h-gate-after-step0-gate0.png");
  });
});
