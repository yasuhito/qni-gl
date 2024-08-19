// @vitest-environment jsdom

import { beforeEach, describe, expect, test } from "vitest";
import { HGate } from "../../src/h-gate";

describe("HGate", () => {
  let gate: HGate;

  beforeEach(() => {
    gate = new HGate();
  });

  test("gateType", () => {
    expect(gate.gateType).toBe("HGate");
  });

  test("label", () => {
    expect(gate.label).toBe("H");
  });

  test("toJSON", () => {
    expect(gate.toJSON()).toBe('"H"');
  });

  test("serialize", () => {
    expect(gate.serialize([0])).toEqual({ type: "H", targets: [0] });
  });
});
