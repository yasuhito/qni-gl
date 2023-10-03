import { test, expect } from "@playwright/test";
import { fail } from "assert";

test.describe("Gate Palette", () => {
  let gatePalette;

  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");

    const appEl = await page.locator("#app");
    const dataApp = await appEl.getAttribute("data-app");

    if (dataApp === null) {
      fail("data-app is null");
    }

    const app = JSON.parse(dataApp);
    gatePalette = app.gatePalette;
  });

  test.describe("H Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      await page.mouse.move(
        gatePalette.gates.HGate.x + gatePalette.gates.HGate.width / 2,
        gatePalette.gates.HGate.y + gatePalette.gates.HGate.height / 2
      );

      await expect(page).toHaveScreenshot("h-gate-hover.png");
    });
  });

  test.describe("X Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      await page.mouse.move(
        gatePalette.gates.XGate.x + gatePalette.gates.XGate.width / 2,
        gatePalette.gates.XGate.y + gatePalette.gates.XGate.height / 2
      );

      await expect(page).toHaveScreenshot("x-gate-hover.png");
    });
  });

  test.describe("Y Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      await page.mouse.move(
        gatePalette.gates.YGate.x + gatePalette.gates.YGate.width / 2,
        gatePalette.gates.YGate.y + gatePalette.gates.YGate.height / 2
      );

      await expect(page).toHaveScreenshot("y-gate-hover.png");
    });
  });

  test.describe("Z Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      await page.mouse.move(
        gatePalette.gates.ZGate.x + gatePalette.gates.ZGate.width / 2,
        gatePalette.gates.ZGate.y + gatePalette.gates.ZGate.height / 2
      );

      await expect(page).toHaveScreenshot("z-gate-hover.png");
    });
  });

  test.describe("√X Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      await page.mouse.move(
        gatePalette.gates.RnotGate.x + gatePalette.gates.RnotGate.width / 2,
        gatePalette.gates.RnotGate.y + gatePalette.gates.RnotGate.height / 2
      );

      await expect(page).toHaveScreenshot("rnot-gate-hover.png");
    });
  });

  test.describe("S Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      await page.mouse.move(
        gatePalette.gates.SGate.x + gatePalette.gates.SGate.width / 2,
        gatePalette.gates.SGate.y + gatePalette.gates.SGate.height / 2
      );

      await expect(page).toHaveScreenshot("s-gate-hover.png");
    });
  });
});
