// @vitest-environment jsdom

import { describe, expect, test } from "vitest";
import { Gate } from "../gate";
import * as tailwindColors from "tailwindcss/colors";

describe("Gate", () => {
  test("size", () => {
    expect(Gate.size).toBe(32);
  });
});
