// @vitest-environment jsdom

import { describe, expect, test } from "vitest";
import { Gate } from "../gate";
import * as tailwindColors from "tailwindcss/colors";

describe("Gate", () => {
  test("size", () => {
    expect(Gate.size).toBe(32);
  });

  test("style", () => {
    expect(Gate.style.idleBodyColor).toBe(tailwindColors.emerald["500"]);
    expect(Gate.style.idleBorderColor).toBe(tailwindColors.emerald["600"]);
    expect(Gate.style.idleBorderWidth).toBe(1);
    expect(Gate.style.hoverBodyColor).toBe(tailwindColors.emerald["500"]);
    expect(Gate.style.hoverBorderColor).toBe(tailwindColors.purple["500"]);
    expect(Gate.style.hoverBorderWidth).toBe(2);
    expect(Gate.style.grabbedBodyColor).toBe(tailwindColors.purple["500"]);
    expect(Gate.style.grabbedBorderColor).toBe(tailwindColors.purple["600"]);
    expect(Gate.style.grabbedBorderWidth).toBe(1);
    expect(Gate.style.activeBodyColor).toBe(tailwindColors.emerald["500"]);
    expect(Gate.style.activeBorderColor).toBe(tailwindColors.teal["300"]);
    expect(Gate.style.activeBorderWidth).toBe(2);
  });
});
