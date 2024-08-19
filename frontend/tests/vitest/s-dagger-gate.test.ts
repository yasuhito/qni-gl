// @vitest-environment jsdom

import { beforeEach, describe, expect, test } from "vitest";
import { SDaggerGate } from "../../src/s-dagger-gate";

describe("SDaggerGate", () => {
  let gate: SDaggerGate;

  beforeEach(() => {
    gate = new SDaggerGate();
  });

  test("label", () => {
    expect(gate.label).toBe("S†");
  });
});
