// @vitest-environment jsdom

import { describe, expect, test } from "vitest";
import { HGate } from "../h-gate";
import * as tailwindColors from "tailwindcss/colors";

describe("HGate", () => {
  test("style", () => {
    expect(HGate.style.idleBodyColor).toBe(tailwindColors.emerald["500"]);
    expect(HGate.style.idleBorderColor).toBe(tailwindColors.emerald["600"]);
    expect(HGate.style.idleBorderWidth).toBe(1);
    expect(HGate.style.hoverBodyColor).toBe(tailwindColors.emerald["500"]);
    expect(HGate.style.hoverBorderColor).toBe(tailwindColors.purple["500"]);
    expect(HGate.style.hoverBorderWidth).toBe(2);
    expect(HGate.style.grabbedBodyColor).toBe(tailwindColors.purple["500"]);
    expect(HGate.style.grabbedBorderColor).toBe(tailwindColors.purple["600"]);
    expect(HGate.style.grabbedBorderWidth).toBe(1);
    expect(HGate.style.activeBodyColor).toBe(tailwindColors.emerald["500"]);
    expect(HGate.style.activeBorderColor).toBe(tailwindColors.teal["300"]);
    expect(HGate.style.activeBorderWidth).toBe(2);
  });
});
