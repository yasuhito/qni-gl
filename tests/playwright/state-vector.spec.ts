import { appData, centerPosition } from "./test-helpers";
import { test, expect } from "@playwright/test";

test.describe("Dropzone", () => {
  let app;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    app = await appData(page);
  });

  test("1 qubit", async ({ page }) => {
    const hGate = app.gatePalette.gates.HGate;
    const dropzone = app.circuit.steps[0].dropzones[0];

    await page.mouse.move(centerPosition(hGate).x, centerPosition(hGate).y);
    await page.mouse.down();
    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("state-vector-1qubit.png");
  });

  test("2 qubit", async ({ page }) => {
    const hGate = app.gatePalette.gates.HGate;
    const dropzone = app.circuit.steps[0].dropzones[1];

    await page.mouse.move(centerPosition(hGate).x, centerPosition(hGate).y);
    await page.mouse.down();
    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("state-vector-2qubit.png");
  });

  test("3 qubit", async ({ page }) => {
    const hGate = app.gatePalette.gates.HGate;

    await page.mouse.move(centerPosition(hGate).x, centerPosition(hGate).y);
    await page.mouse.down();

    app = await appData(page);
    const dropzone = app.circuit.steps[0].dropzones[2];

    await page.mouse.move(dropzone.x, dropzone.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("state-vector-3qubit.png");
  });

  test("4 qubit", async ({ page }) => {
    const hGate = app.gatePalette.gates.HGate;

    await page.mouse.move(centerPosition(hGate).x, centerPosition(hGate).y);
    await page.mouse.down();

    // 3 ビットめに H ゲートを配置
    app = await appData(page);
    const dropzoneBit3 = app.circuit.steps[0].dropzones[2];

    await page.mouse.move(dropzoneBit3.x, dropzoneBit3.y);
    await page.mouse.up();

    // 4 ビットめに H ゲートを配置
    await page.mouse.down();

    app = await appData(page);
    const dropzoneBit4 = app.circuit.steps[0].dropzones[3];
    await page.mouse.move(dropzoneBit4.x, dropzoneBit4.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("state-vector-4qubit.png");
  });

  test("5 qubit", async ({ page }) => {
    const hGate = app.gatePalette.gates.HGate;

    await page.mouse.move(centerPosition(hGate).x, centerPosition(hGate).y);
    await page.mouse.down();

    // 3 ビットめに H ゲートを配置
    app = await appData(page);
    const dropzoneBit3 = app.circuit.steps[0].dropzones[2];

    await page.mouse.move(dropzoneBit3.x, dropzoneBit3.y);
    await page.mouse.up();

    // 4 ビットめに H ゲートを配置
    await page.mouse.down();

    app = await appData(page);
    const dropzoneBit4 = app.circuit.steps[0].dropzones[3];
    await page.mouse.move(dropzoneBit4.x, dropzoneBit4.y);
    await page.mouse.up();

    // 5 ビットめに H ゲートを配置
    await page.mouse.down();

    app = await appData(page);
    const dropzoneBit5 = app.circuit.steps[0].dropzones[4];
    await page.mouse.move(dropzoneBit5.x, dropzoneBit5.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("state-vector-5qubit.png");
  });

  test("6 qubit", async ({ page }) => {
    const hGate = app.gatePalette.gates.HGate;

    await page.mouse.move(centerPosition(hGate).x, centerPosition(hGate).y);
    await page.mouse.down();

    // 3 ビットめに H ゲートを配置
    app = await appData(page);
    const dropzoneBit3 = app.circuit.steps[0].dropzones[2];

    await page.mouse.move(dropzoneBit3.x, dropzoneBit3.y);
    await page.mouse.up();

    // 4 ビットめに H ゲートを配置
    await page.mouse.down();

    app = await appData(page);
    const dropzoneBit4 = app.circuit.steps[0].dropzones[3];
    await page.mouse.move(dropzoneBit4.x, dropzoneBit4.y);
    await page.mouse.up();

    // 5 ビットめに H ゲートを配置
    await page.mouse.down();

    app = await appData(page);
    const dropzoneBit5 = app.circuit.steps[0].dropzones[4];
    await page.mouse.move(dropzoneBit5.x, dropzoneBit5.y);
    await page.mouse.up();

    // 6 ビットめに H ゲートを配置
    await page.mouse.down();

    app = await appData(page);
    const dropzoneBit6 = app.circuit.steps[0].dropzones[5];
    await page.mouse.move(dropzoneBit6.x, dropzoneBit6.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("state-vector-6qubit.png");
  });

  test("7 qubit", async ({ page }) => {
    const hGate = app.gatePalette.gates.HGate;

    await page.mouse.move(centerPosition(hGate).x, centerPosition(hGate).y);
    await page.mouse.down();

    // 3 ビットめに H ゲートを配置
    app = await appData(page);
    const dropzoneBit3 = app.circuit.steps[0].dropzones[2];

    await page.mouse.move(dropzoneBit3.x, dropzoneBit3.y);
    await page.mouse.up();

    // 4 ビットめに H ゲートを配置
    await page.mouse.down();

    app = await appData(page);
    const dropzoneBit4 = app.circuit.steps[0].dropzones[3];
    await page.mouse.move(dropzoneBit4.x, dropzoneBit4.y);
    await page.mouse.up();

    // 5 ビットめに H ゲートを配置
    await page.mouse.down();

    app = await appData(page);
    const dropzoneBit5 = app.circuit.steps[0].dropzones[4];
    await page.mouse.move(dropzoneBit5.x, dropzoneBit5.y);
    await page.mouse.up();

    // 6 ビットめに H ゲートを配置
    await page.mouse.down();

    app = await appData(page);
    const dropzoneBit6 = app.circuit.steps[0].dropzones[5];
    await page.mouse.move(dropzoneBit6.x, dropzoneBit6.y);
    await page.mouse.up();

    // 7 ビットめに H ゲートを配置
    await page.mouse.down();

    app = await appData(page);
    const dropzoneBit7 = app.circuit.steps[0].dropzones[6];
    await page.mouse.move(dropzoneBit7.x, dropzoneBit7.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("state-vector-7qubit.png");
  });

  test("8 qubit", async ({ page }) => {
    const hGate = app.gatePalette.gates.HGate;

    await page.mouse.move(centerPosition(hGate).x, centerPosition(hGate).y);
    await page.mouse.down();

    // 3 ビットめに H ゲートを配置
    app = await appData(page);
    const dropzoneBit3 = app.circuit.steps[0].dropzones[2];

    await page.mouse.move(dropzoneBit3.x, dropzoneBit3.y);
    await page.mouse.up();

    // 4 ビットめに H ゲートを配置
    await page.mouse.down();

    app = await appData(page);
    const dropzoneBit4 = app.circuit.steps[0].dropzones[3];
    await page.mouse.move(dropzoneBit4.x, dropzoneBit4.y);
    await page.mouse.up();

    // 5 ビットめに H ゲートを配置
    await page.mouse.down();

    app = await appData(page);
    const dropzoneBit5 = app.circuit.steps[0].dropzones[4];
    await page.mouse.move(dropzoneBit5.x, dropzoneBit5.y);
    await page.mouse.up();

    // 6 ビットめに H ゲートを配置
    await page.mouse.down();

    app = await appData(page);
    const dropzoneBit6 = app.circuit.steps[0].dropzones[5];
    await page.mouse.move(dropzoneBit6.x, dropzoneBit6.y);
    await page.mouse.up();

    // 7 ビットめに H ゲートを配置
    await page.mouse.down();

    app = await appData(page);
    const dropzoneBit7 = app.circuit.steps[0].dropzones[6];
    await page.mouse.move(dropzoneBit7.x, dropzoneBit7.y);
    await page.mouse.up();

    // 8 ビットめに H ゲートを配置
    await page.mouse.down();

    app = await appData(page);
    const dropzoneBit8 = app.circuit.steps[0].dropzones[7];
    await page.mouse.move(dropzoneBit8.x, dropzoneBit8.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("state-vector-8qubit.png");
  });

  test("9 qubit", async ({ page }) => {
    const hGate = app.gatePalette.gates.HGate;

    await page.mouse.move(centerPosition(hGate).x, centerPosition(hGate).y);
    await page.mouse.down();

    // 3 ビットめに H ゲートを配置
    app = await appData(page);
    const dropzoneBit3 = app.circuit.steps[0].dropzones[2];

    await page.mouse.move(dropzoneBit3.x, dropzoneBit3.y);
    await page.mouse.up();

    // 4 ビットめに H ゲートを配置
    await page.mouse.down();

    app = await appData(page);
    const dropzoneBit4 = app.circuit.steps[0].dropzones[3];
    await page.mouse.move(dropzoneBit4.x, dropzoneBit4.y);
    await page.mouse.up();

    // 5 ビットめに H ゲートを配置
    await page.mouse.down();

    app = await appData(page);
    const dropzoneBit5 = app.circuit.steps[0].dropzones[4];
    await page.mouse.move(dropzoneBit5.x, dropzoneBit5.y);
    await page.mouse.up();

    // 6 ビットめに H ゲートを配置
    await page.mouse.down();

    app = await appData(page);
    const dropzoneBit6 = app.circuit.steps[0].dropzones[5];
    await page.mouse.move(dropzoneBit6.x, dropzoneBit6.y);
    await page.mouse.up();

    // 7 ビットめに H ゲートを配置
    await page.mouse.down();

    app = await appData(page);
    const dropzoneBit7 = app.circuit.steps[0].dropzones[6];
    await page.mouse.move(dropzoneBit7.x, dropzoneBit7.y);
    await page.mouse.up();

    // 8 ビットめに H ゲートを配置
    await page.mouse.down();

    app = await appData(page);
    const dropzoneBit8 = app.circuit.steps[0].dropzones[7];
    await page.mouse.move(dropzoneBit8.x, dropzoneBit8.y);
    await page.mouse.up();

    // 9 ビットめに H ゲートを配置
    await page.mouse.down();

    app = await appData(page);
    const dropzoneBit9 = app.circuit.steps[0].dropzones[8];
    await page.mouse.move(dropzoneBit9.x, dropzoneBit9.y);
    await page.mouse.up();

    await expect(page).toHaveScreenshot("state-vector-9qubit.png");
  });
});
