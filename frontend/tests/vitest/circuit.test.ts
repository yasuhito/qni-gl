import { describe, it, expect, beforeEach } from "vitest";
import { Circuit } from "../../src/circuit";
import { CircuitStep } from "../../src/circuit-step";

describe("Circuit", () => {
  let circuit: Circuit;
  const wireCount = 3;

  beforeEach(() => {
    circuit = new Circuit({ minWireCount: wireCount, stepCount: 5 });
  });

  describe("fetchStep", () => {
    it("retrieves the step with the correct index", () => {
      const step = circuit.fetchStep(2);

      expect(step).toBeDefined();
      expect(step).toBe(circuit.steps[2]);
    });

    it("throws an error with a negative index", () => {
      expect(() => circuit.fetchStep(-1)).toThrow(
        "Step index out of bounds: -1"
      );
    });

    it("throws an error with an index out of range", () => {
      expect(() => circuit.fetchStep(5)).toThrow("Step index out of bounds: 5");
    });
  });

  describe("maybeAppendWire", () => {
    it("appends a wire when all steps have the same wire count and it's less than maxWireCount", () => {
      circuit.maybeAppendWire();

      expect(circuit.wireCount).toBe(wireCount + 1);
    });

    it("does not append a wire when wire count is equal to maxWireCount", () => {
      circuit["maxWireCount"] = wireCount;

      circuit.maybeAppendWire();

      expect(circuit.wireCount).toBe(wireCount);
    });

    it("throws an error when steps have different wire counts", () => {
      circuit["stepList"].addChild(new CircuitStep(1));

      expect(() => circuit.maybeAppendWire()).toThrow(
        "All steps must have the same number of wires"
      );
    });
  });
});
