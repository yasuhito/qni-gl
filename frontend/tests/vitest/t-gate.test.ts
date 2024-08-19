// @vitest-environment jsdom

import { beforeEach, describe, expect, test } from "vitest";
import { TGate } from "../../src/t-gate";

describe("TGate", () => {
  let gate: TGate;

  beforeEach(() => {
    gate = new TGate();
  });

  test("label", () => {
    expect(gate.label).toBe("T");
  });
});
