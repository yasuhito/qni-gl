// @vitest-environment jsdom

import { describe, expect, test } from "vitest";
import { Gate } from "../gate";
import * as tailwindColors from "tailwindcss/colors";

describe("Gate", () => {
  test("size", () => {
    expect(Gate.size).toBe(32);
  });

  test("color.body", () => {
    expect(Gate.color.body).toBe(tailwindColors.emerald["500"]);
  });
});
