import { expect, test } from "./fixtures";
import { dragAndDrop } from "./test-helpers";

test.describe("H gate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("URL encode/decode: H gate", async ({ page, circuitInfo }) => {
    const gate = circuitInfo.gatePalette.hGate;
    await dragAndDrop(page, gate, { step: 0, bit: 0 });
    const urlHash = await page.evaluate(() => location.hash);
    expect(urlHash).toContain("#circuit={%22cols%22:[[%22H%22,1]]}");
  });
});
