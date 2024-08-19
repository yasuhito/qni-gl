// @vitest-environment jsdom

import { beforeEach, describe, expect, test } from "vitest";
import { HGate } from "../../src/h-gate";

describe("HGate", () => {
  let gate: HGate;

  beforeEach(() => {
    gate = new HGate();
  });

  test("gateType", () => {
    expect(HGate.gateType).toBe("HGate");
  });

  test("label", () => {
    expect(gate.label).toBe("H");
  });

  test("toJSON", () => {
    expect(gate.toJSON()).toBe('"H"');
  });
});
