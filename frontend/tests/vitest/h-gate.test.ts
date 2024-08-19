// @vitest-environment jsdom

import { describe, expect, test } from "vitest";
import { HGate } from "../../src/h-gate";

describe("HGate", () => {
  test("gateType", () => {
    expect(HGate.gateType).toBe("HGate");
  });

  test("label", () => {
    const gate = new HGate();
    expect(gate.label).toBe("H");
  });
});
