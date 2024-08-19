// @vitest-environment jsdom

import { beforeEach, describe, expect, test } from "vitest";
import { ControlGate } from "../../src/control-gate";

describe("ControlGate", () => {
  let gate: ControlGate;

  beforeEach(() => {
    gate = new ControlGate();
  });

  test("label", () => {
    expect(gate.label).toBe("@");
  });

  test("toJSON", () => {
    expect(gate.toJSON()).toBe('"•"');
  });
});
