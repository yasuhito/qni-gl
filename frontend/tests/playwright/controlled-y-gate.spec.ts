import { expect, test } from "./fixtures";
import { activateStep, dragAndDrop } from "./test-helpers";

test.describe("Controlled-Y gate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Place a controlled-Y gate (00)", async ({ page, circuitInfo }) => {
    const controlGate = circuitInfo.gatePalette.controlGate;
    const yGate = circuitInfo.gatePalette.yGate;

    await dragAndDrop(page, controlGate, { step: 0, bit: 0 });
    await dragAndDrop(page, yGate, { step: 0, bit: 1 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B%E2%80%A2%22%2C%22Y%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("controlled-y-gate-00.png");
  });

  test("Place a controlled-Y gate (01)", async ({ page, circuitInfo }) => {
    const controlGate = circuitInfo.gatePalette.controlGate;
    const yGate = circuitInfo.gatePalette.yGate;
    const xGate = circuitInfo.gatePalette.xGate;

    await dragAndDrop(page, xGate, { step: 0, bit: 0 });
    await dragAndDrop(page, controlGate, { step: 1, bit: 0 });
    await dragAndDrop(page, yGate, { step: 1, bit: 1 });
    await activateStep(page, 1);

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B%22X%22%5D%2C%5B%E2%80%A2%22%2C%22Y%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("controlled-y-gate-01.png");
  });

  test("Place a controlled-Y gate (10)", async ({ page, circuitInfo }) => {
    const controlGate = circuitInfo.gatePalette.controlGate;
    const yGate = circuitInfo.gatePalette.yGate;
    const xGate = circuitInfo.gatePalette.xGate;

    await dragAndDrop(page, xGate, { step: 0, bit: 1 });
    await dragAndDrop(page, controlGate, { step: 1, bit: 0 });
    await dragAndDrop(page, yGate, { step: 1, bit: 1 });
    await activateStep(page, 1);

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B1%2C%22X%22%5D%2C%5B%E2%80%A2%22%2C%22Y%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("controlled-y-gate-10.png");
  });

  test("Place a controlled-Y gate (11)", async ({ page, circuitInfo }) => {
    const controlGate = circuitInfo.gatePalette.controlGate;
    const yGate = circuitInfo.gatePalette.yGate;
    const xGate = circuitInfo.gatePalette.xGate;

    await dragAndDrop(page, xGate, { step: 0, bit: 0 });
    await dragAndDrop(page, xGate, { step: 0, bit: 1 });
    await dragAndDrop(page, controlGate, { step: 1, bit: 0 });
    await dragAndDrop(page, yGate, { step: 1, bit: 1 });
    await activateStep(page, 1);

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B%22X%22%2C%22X%22%5D%2C%5B%E2%80%A2%22%2C%22Y%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("controlled-y-gate-11.png");
  });

  test("Place a controlled-Y gate with 2 controls (000)", async ({
    page,
    circuitInfo,
  }) => {
    const controlGate = circuitInfo.gatePalette.controlGate;
    const yGate = circuitInfo.gatePalette.yGate;

    await dragAndDrop(page, controlGate, { step: 0, bit: 0 });
    await dragAndDrop(page, controlGate, { step: 0, bit: 1 });
    await dragAndDrop(page, yGate, { step: 0, bit: 2 });
    await activateStep(page, 0);

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B%E2%80%A2%22%2C%22%E2%80%A2%22%2C%22Y%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("controlled-y-gate-000.png");
  });

  test("Place a controlled-Y gate with 2 controls (011)", async ({
    page,
    circuitInfo,
  }) => {
    const controlGate = circuitInfo.gatePalette.controlGate;
    const yGate = circuitInfo.gatePalette.yGate;
    const xGate = circuitInfo.gatePalette.xGate;

    await dragAndDrop(page, xGate, { step: 0, bit: 0 });
    await dragAndDrop(page, xGate, { step: 0, bit: 1 });
    await dragAndDrop(page, controlGate, { step: 1, bit: 0 });
    await dragAndDrop(page, controlGate, { step: 1, bit: 1 });
    await dragAndDrop(page, yGate, { step: 1, bit: 2 });
    await activateStep(page, 1);

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B%22X%22%2C%22X%22%5D%2C%5B%E2%80%A2%22%2C%E2%80%A2%22%2C%22Y%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("controlled-y-gate-011.png");
  });

  test("Place a controlled-YY gate (000)", async ({ page, circuitInfo }) => {
    const controlGate = circuitInfo.gatePalette.controlGate;
    const yGate = circuitInfo.gatePalette.yGate;

    await dragAndDrop(page, controlGate, { step: 0, bit: 0 });
    await dragAndDrop(page, yGate, { step: 0, bit: 1 });
    await dragAndDrop(page, yGate, { step: 0, bit: 2 });

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B%E2%80%A2%22%2C%22Y%22%2C%22Y%22%5D%5D%7D');

    await expect(page).toHaveScreenshot("controlled-yy-gate-000.png");
  });

  test("Place a controlled-YY gate (011)", async ({ page, circuitInfo }) => {
    const controlGate = circuitInfo.gatePalette.controlGate;
    const yGate = circuitInfo.gatePalette.yGate;
    const xGate = circuitInfo.gatePalette.xGate;

    await dragAndDrop(page, xGate, { step: 0, bit: 0 });
    await dragAndDrop(page, controlGate, { step: 1, bit: 0 });
    await dragAndDrop(page, yGate, { step: 1, bit: 1 });
    await dragAndDrop(page, yGate, { step: 1, bit: 2 });
    await activateStep(page, 1);

    const url = await page.evaluate(() => location.pathname);
    expect(url).toContain('%7B%22cols%22%3A%5B%5B%22X%22%5D%2C%5B%E2%80%A2%22%2C1%5D%5D%2C%5B%22Y%22%2C1%5D%5D%2C%5B%22Y%22%2C1%5D%5D%7D');

    await expect(page).toHaveScreenshot("controlled-yy-gate-011.png");
  });
});
