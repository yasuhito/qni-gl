// @vitest-environment jsdom

import { describe, expect, test } from "vitest";
import { HGate } from "../src/h-gate";
import * as tailwindColors from "tailwindcss/colors";

describe("HGate", () => {
  test("style", () => {
    const hGate = new HGate();

    expect(hGate.style.idleBodyColor).toBe(tailwindColors.emerald["500"]);
    expect(hGate.style.idleBorderColor).toBe(tailwindColors.emerald["700"]);
    expect(hGate.style.idleBorderWidth).toBe(1);
    expect(hGate.style.hoverBodyColor).toBe(tailwindColors.emerald["500"]);
    expect(hGate.style.hoverBorderColor).toBe(tailwindColors.purple["500"]);
    expect(hGate.style.hoverBorderWidth).toBe(2);
    expect(hGate.style.grabbedBodyColor).toBe(tailwindColors.purple["500"]);
    expect(hGate.style.grabbedBorderColor).toBe(tailwindColors.purple["700"]);
    expect(hGate.style.grabbedBorderWidth).toBe(1);
    expect(hGate.style.activeBodyColor).toBe(tailwindColors.emerald["500"]);
    expect(hGate.style.activeBorderColor).toBe(tailwindColors.teal["300"]);
    expect(hGate.style.activeBorderWidth).toBe(2);
  });
});
