// @vitest-environment jsdom

import { beforeEach, describe, expect, test } from "vitest";
import { SwapGate } from "../../src/swap-gate";

describe("SwapGate", () => {
  let gate: SwapGate;

  beforeEach(() => {
    gate = new SwapGate();
  });

  test("label", () => {
    expect(gate.label).toBe("×");
  });
});
