import { test, expect } from "@playwright/test";
import { fail } from "assert";

test.describe("Gate Palette", () => {
  test.describe("H Gate", () => {
    test("changes style when mouseover", async ({ page }) => {
      await page.goto("http://localhost:5173/");

      const app = await page.locator("#app");
      const dataApp = await app.getAttribute("data-app");

      if (dataApp === null) {
        fail("data-app is null");
      }

      const gatePalette = JSON.parse(dataApp).gatePalette;

      await page.mouse.move(
        gatePalette.gates.HGate.x + gatePalette.gates.HGate.width / 2,
        gatePalette.gates.HGate.y + gatePalette.gates.HGate.height / 2
      );

      await expect(page).toHaveScreenshot("h-gate-hover.png");
    });
  });
});
