// @vitest-environment jsdom

import { describe, expect, test } from "vitest";
import { HGate } from "../../src/h-gate";

describe("HGate", () => {
  test("gateType", () => {
    expect(HGate.gateType).toBe("HGate");
  });
});
