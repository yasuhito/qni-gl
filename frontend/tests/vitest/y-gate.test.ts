// @vitest-environment jsdom

import { beforeEach, describe, expect, test } from "vitest";
import { YGate } from "../../src/y-gate";

describe("YGate", () => {
  let gate: YGate;

  beforeEach(() => {
    gate = new YGate();
  });

  test("label", () => {
    expect(gate.label).toBe("Y");
  });
});
