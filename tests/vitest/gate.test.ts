// @vitest-environment jsdom

import { describe, expect, test } from "vitest";
import { GateComponent } from "../../src/gate-component";

describe("Gate", () => {
  test("size", () => {
    expect(GateComponent.size).toBe(32);
  });
});
