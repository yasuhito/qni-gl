// @vitest-environment jsdom

import { beforeEach, describe, expect, test } from "vitest";
import { XGate } from "../../src/x-gate";

describe("XGate", () => {
  let gate: XGate;

  beforeEach(() => {
    gate = new XGate();
  });

  test("label", () => {
    expect(gate.label).toBe("X");
  });
});
