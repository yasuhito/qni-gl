import { describe, it, expect, beforeEach } from "vitest";
import { Circuit } from "../../src/circuit";

describe("Circuit", () => {
  let circuit: Circuit;

  beforeEach(() => {
    circuit = new Circuit({ minWireCount: 3, stepCount: 5 });
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
});
