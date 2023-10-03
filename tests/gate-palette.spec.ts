import { test, expect } from "@playwright/test";
import { fail } from "assert";

test.describe("Gate Palette", () => {
  let gatePalette;

  test.beforeEach(async ({ page }) => {
    // TODO: ポート番号を設定から取得する
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
      const gate = gatePalette.gates.HGate;

      await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);

      await expect(page).toHaveScreenshot("h-gate-hover.png");
    });
  });

  test.describe("X Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      const gate = gatePalette.gates.XGate;

      await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);

      await expect(page).toHaveScreenshot("x-gate-hover.png");
    });
  });

  test.describe("Y Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      const gate = gatePalette.gates.YGate;

      await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);

      await expect(page).toHaveScreenshot("y-gate-hover.png");
    });
  });

  test.describe("Z Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      const gate = gatePalette.gates.ZGate;

      await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);

      await expect(page).toHaveScreenshot("z-gate-hover.png");
    });
  });

  test.describe("√X Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      const gate = gatePalette.gates.RnotGate;

      await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);

      await expect(page).toHaveScreenshot("rnot-gate-hover.png");
    });
  });

  test.describe("S Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      const gate = gatePalette.gates.SGate;

      await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);

      await expect(page).toHaveScreenshot("s-gate-hover.png");
    });
  });

  test.describe("S† Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      const gate = gatePalette.gates.SDaggerGate;

      await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);

      await expect(page).toHaveScreenshot("s†-gate-hover.png");
    });
  });

  test.describe("T Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      const gate = gatePalette.gates.TGate;

      await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);

      await expect(page).toHaveScreenshot("t-gate-hover.png");
    });
  });

  test.describe("T† Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      const gate = gatePalette.gates.TDaggerGate;

      await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);

      await expect(page).toHaveScreenshot("t†-gate-hover.png");
    });
  });

  test.describe("Phase Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      const gate = gatePalette.gates.PhaseGate;

      await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);

      await expect(page).toHaveScreenshot("phase-gate-hover.png");
    });
  });

  test.describe("Rx Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      const gate = gatePalette.gates.RxGate;

      await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);

      await expect(page).toHaveScreenshot("rx-gate-hover.png");
    });
  });

  test.describe("Ry Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      const gate = gatePalette.gates.RyGate;

      await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);

      await expect(page).toHaveScreenshot("ry-gate-hover.png");
    });
  });

  test.describe("Rz Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      const gate = gatePalette.gates.RzGate;

      await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);

      await expect(page).toHaveScreenshot("rz-gate-hover.png");
    });
  });

  test.describe("Swap Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      const gate = gatePalette.gates.SwapGate;

      await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);

      await expect(page).toHaveScreenshot("swap-gate-hover.png");
    });
  });
});
