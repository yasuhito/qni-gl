// @vitest-environment jsdom

import { describe, expect, test } from "vitest";
import { XGate } from "../../src/x-gate";

describe("XGate", () => {
  test("label", () => {
    const gate = new XGate();
    expect(gate.label).toBe("X");
  });
});
