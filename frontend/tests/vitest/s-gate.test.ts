// @vitest-environment jsdom

import { beforeEach, describe, expect, test } from "vitest";
import { SGate } from "../../src/s-gate";

describe("SGate", () => {
  let gate: SGate;

  beforeEach(() => {
    gate = new SGate();
  });

  test("label", () => {
    expect(gate.label).toBe("S");
  });
});
