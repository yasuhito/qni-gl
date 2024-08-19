// @vitest-environment jsdom

import { beforeEach, describe, expect, test } from "vitest";
import { MeasurementGate } from "../../src/measurement-gate";

describe("MeasurementGate", () => {
  let gate: MeasurementGate;

  beforeEach(() => {
    gate = new MeasurementGate();
  });

  test("label", () => {
    expect(gate.label).toBe("M");
  });
});
