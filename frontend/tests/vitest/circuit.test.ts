import { describe, it, expect, beforeEach } from "vitest";
import { Circuit } from "../../src/circuit";
import { CircuitStep } from "../../src/circuit-step";
import { MIN_QUBIT_COUNT } from "../../src/constants";
import { HGate } from "../../src/h-gate";
import { XGate } from "../../src/x-gate";

describe("Circuit", () => {
  let circuit: Circuit;
  const wireCount = 3;

  beforeEach(() => {
    circuit = new Circuit({ minWireCount: wireCount, stepCount: 5 });
  });

  describe("steps", () => {
    it("returns an array of CircuitStep", () => {
      expect(circuit.steps).toBeInstanceOf(Array);
      expect(circuit.steps.length).toBe(5);
      circuit.steps.forEach((step) => {
        expect(step).toBeInstanceOf(CircuitStep);
      });
    });
  });

  describe("activeStepIndex", () => {
    it("returns null in the initial state", () => {
      expect(circuit.activeStepIndex).toBeNull();
    });

    it("returns the index of the active step", () => {
      circuit.fetchStep(1).activate();
      expect(circuit.activeStepIndex).toBe(1);
    });

    it("returns the new index when the active step changes", () => {
      circuit.fetchStep(1).activate();
      expect(circuit.activeStepIndex).toBe(1);

      circuit.fetchStep(3).activate();
      expect(circuit.activeStepIndex).toBe(3);
    });

    it("returns null when all steps are inactive", () => {
      circuit.fetchStep(1).activate();
      expect(circuit.activeStepIndex).toBe(1);

      circuit.fetchStep(1).deactivate();
      expect(circuit.activeStepIndex).toBeNull();
    });
  });

  describe("wireCount", () => {
    it("returns the correct number of wires", () => {
      expect(circuit.wireCount).toBe(3);
    });

    it("returns the correct wire count after adding a wire", () => {
      circuit.maybeAppendWire();

      expect(circuit.wireCount).toBe(4);
      circuit.steps.forEach((step) => {
        expect(step.wireCount).toBe(4);
      });
    });

    it("throws an error if steps have different wire counts", () => {
      circuit["stepList"].addChild(new CircuitStep(1));

      expect(() => circuit.wireCount).toThrow(
        "All steps must have the same number of wires"
      );
    });
  });

  describe("highestOccupiedQubitNumber", () => {
    it("returns MIN_QUBIT_COUNT when all steps are empty", () => {
      expect(circuit.highestOccupiedQubitNumber).toBe(MIN_QUBIT_COUNT);
    });

    it("returns the highest occupied qubit number across all steps", () => {
      circuit.fetchStep(0).fetchDropzone(1).addChild(new HGate());
      expect(circuit.highestOccupiedQubitNumber).toBe(2);

      circuit.fetchStep(1).fetchDropzone(2).addChild(new XGate());
      expect(circuit.highestOccupiedQubitNumber).toBe(3);
    });

    it("updates correctly when gates are removed", () => {
      const hGate = new HGate();
      const step0Dropzone1 = circuit.fetchStep(0).fetchDropzone(1);
      step0Dropzone1.addChild(hGate);

      const xGate = new XGate();
      const step2Dropzone2 = circuit.fetchStep(2).fetchDropzone(2);
      step2Dropzone2.addChild(xGate);

      expect(circuit.highestOccupiedQubitNumber).toBe(3);

      step2Dropzone2.removeChild(xGate);
      expect(circuit.highestOccupiedQubitNumber).toBe(2);

      step0Dropzone1.removeChild(hGate);
      expect(circuit.highestOccupiedQubitNumber).toBe(MIN_QUBIT_COUNT);
    });
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