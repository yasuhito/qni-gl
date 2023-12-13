import { test, expect } from "@playwright/test";
import { fail } from "assert";

test.describe("Gate Palette", () => {
  let gatePalette;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");

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

  test.describe("Control Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      const gate = gatePalette.gates.ControlGate;

      await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);

      await expect(page).toHaveScreenshot("control-gate-hover.png");
    });
  });

  test.describe("Anti Control Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      const gate = gatePalette.gates.AntiControlGate;

      await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);

      await expect(page).toHaveScreenshot("anti-control-gate-hover.png");
    });
  });

  test.describe("|0> Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      const gate = gatePalette.gates.Write0Gate;

      await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);

      await expect(page).toHaveScreenshot("write0-gate-hover.png");
    });
  });

  test.describe("|1> Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      const gate = gatePalette.gates.Write1Gate;

      await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);

      await expect(page).toHaveScreenshot("write1-gate-hover.png");
    });
  });

  test.describe("Measurement Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      const gate = gatePalette.gates.MeasurementGate;

      await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);

      await expect(page).toHaveScreenshot("measurement-gate-hover.png");
    });
  });

  test.describe("Bloch Sphere", () => {
    test("changes style when mouseover", async ({ page }) => {
      const gate = gatePalette.gates.BlochSphere;

      await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);

      await expect(page).toHaveScreenshot("bloch-sphere-hover.png");
    });
  });

  test.describe("QFT Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      const gate = gatePalette.gates.QFTGate;

      await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);

      await expect(page).toHaveScreenshot("qft-gate-hover.png");
    });
  });

  test.describe("QFT† Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      const gate = gatePalette.gates.QFTDaggerGate;

      await page.mouse.move(gate.x + gate.width / 2, gate.y + gate.height / 2);

      await expect(page).toHaveScreenshot("qft-dagger-gate-hover.png");
    });
  });
});
