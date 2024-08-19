// @vitest-environment jsdom

import { beforeEach, describe, expect, test } from "vitest";
import { RnotGate } from "../../src/rnot-gate";

describe("RnotGate", () => {
  let gate: RnotGate;

  beforeEach(() => {
    gate = new RnotGate();
  });

  test("label", () => {
    expect(gate.label).toBe("√X");
  });
});
