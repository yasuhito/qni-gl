// @vitest-environment jsdom

import { beforeEach, describe, expect, test } from "vitest";
import { Write0Gate } from "../../src/write0-gate";

describe("Write0Gate", () => {
  let gate: Write0Gate;

  beforeEach(() => {
    gate = new Write0Gate();
  });

  test("label", () => {
    expect(gate.label).toBe("0");
  });
});
