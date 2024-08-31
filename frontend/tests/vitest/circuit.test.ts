import { describe, it, expect, beforeEach, vi } from "vitest";
import { Circuit } from "../../src/circuit";
import { CircuitStep } from "../../src/circuit-step";
import { MIN_QUBIT_COUNT } from "../../src/constants";
import { HGate } from "../../src/h-gate";
import { XGate } from "../../src/x-gate";
import { YGate } from "../../src/y-gate";
import { ZGate } from "../../src/z-gate";
import { TGate } from "../../src/t-gate";
import { SDaggerGate } from "../../src/s-dagger-gate";
import { RnotGate } from "../../src/rnot-gate";
import { Write0Gate } from "../../src/write0-gate";
import { WireType } from "../../src/types";

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

    it("returns minWireCount when there are no steps", () => {
      const emptyCircuit = new Circuit({ minWireCount: 3, stepCount: 0 });
      expect(emptyCircuit.wireCount).toBe(3);
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

  describe("update", () => {
    it("correctly updates the circuit", () => {
      const activeStep = circuit.fetchStep(2);
      activeStep.activate();

      circuit.update();

      expect(circuit.steps.length).toBe(5);
      expect(circuit.wireCount).toBe(3);
      expect(activeStep.isActive).toBe(true);
    });

    it("throws an error when there is no active step", () => {
      expect(() => circuit.update()).toThrow("activeStepIndex == null");
    });
  });

  describe("serialize", () => {
    it("returns correctly serialized circuit", () => {
      const hGate = new HGate();
      const xGate = new XGate();

      circuit.fetchStep(0).fetchDropzone(0).addChild(hGate);
      circuit.fetchStep(1).fetchDropzone(1).addChild(xGate);

      const serialized = circuit.serialize();

      expect(serialized).toEqual([
        [{ type: "H", targets: [0] }],
        [{ type: "X", targets: [1] }],
        [],
        [],
        [],
      ]);
    });

    it("correctly serializes an empty circuit", () => {
      const serialized = circuit.serialize();

      expect(serialized).toEqual([[], [], [], [], []]);
    });
  });

  describe("toJSON", () => {
    it("returns a correctly formatted JSON string", () => {
      const hGate = new HGate();
      const xGate = new XGate();

      circuit.fetchStep(0).fetchDropzone(0).addChild(hGate);
      circuit.fetchStep(1).fetchDropzone(1).addChild(xGate);

      const expectedJSON =
        '{"cols":[["H",1,1],[1,"X",1],[1,1,1],[1,1,1],[1,1,1]]}';
      expect(circuit.toJSON()).toBe(`${expectedJSON}`);
    });

    it("returns JSON with empty steps for an empty circuit", () => {
      const expectedJSON = '{"cols":[[1,1,1],[1,1,1],[1,1,1],[1,1,1],[1,1,1]]}';
      expect(circuit.toJSON()).toBe(`${expectedJSON}`);
    });
  });

  describe("toString", () => {
    it("should return a string representation of an empty circuit", () => {
      const emptyCircuit = new Circuit({ minWireCount: 3, stepCount: 5 });
      const expected = "0: ────────────────────────────";
      expect(emptyCircuit.toString()).toBe(expected);
    });

    it("should return a string representation of a circuit with gates", () => {
      const circuit = new Circuit({ minWireCount: 3, stepCount: 5 });
      circuit.fetchStep(0).fetchDropzone(0).addChild(new HGate());
      circuit.fetchStep(1).fetchDropzone(1).addChild(new XGate());
      circuit.fetchStep(2).fetchDropzone(2).addChild(new YGate());
      circuit.fetchStep(3).fetchDropzone(0).addChild(new ZGate());
      circuit.fetchStep(4).fetchDropzone(1).addChild(new TGate());

      const expected = `
0: ───H──────────────Z─────────

1: ────────X──────────────T────

2: ─────────────Y──────────────`.trim();
      expect(circuit.toString()).toBe(expected);
    });

    it("should handle gates with two-character labels correctly", () => {
      const circuit = new Circuit({ minWireCount: 2, stepCount: 3 });
      circuit.fetchStep(0).fetchDropzone(0).addChild(new SDaggerGate());
      circuit.fetchStep(1).fetchDropzone(1).addChild(new RnotGate());

      const expected = `
0: ───S†─────────────

1: ────────√X────────`.trim();
      expect(circuit.toString()).toBe(expected);
    });
  });

  describe("onGateSnapToDropzone", () => {
    it("should update wire types when a gate snaps to a dropzone", () => {
      const write0 = new Write0Gate();
      const dropzone = circuit.fetchStep(0).fetchDropzone(0);

      dropzone.snap(write0);

      expect(dropzone.inputWireType).toBe(WireType.Classical);
      expect(dropzone.outputWireType).toBe(WireType.Quantum);
    });
  });

  describe("updateStepMarker", () => {
    it("updates the marker manager with the current steps", () => {
      const circuit = new Circuit({ minWireCount: 3, stepCount: 5 });
      const updateSpy = vi.spyOn(circuit["markerManager"], "update");

      circuit["updateStepMarker"]();

      expect(updateSpy).toHaveBeenCalledWith(circuit.steps);
    });
  });
});
