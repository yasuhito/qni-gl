// @vitest-environment jsdom

import { beforeEach, describe, expect, test } from "vitest";
import { TDaggerGate } from "../../src/t-dagger-gate";

describe("TDaggerGate", () => {
  let gate: TDaggerGate;

  beforeEach(() => {
    gate = new TDaggerGate();
  });

  test("label", () => {
    expect(gate.label).toBe("T†");
  });

  test("toJSON", () => {
    expect(gate.toJSON()).toBe('"T†"');
  });
});
