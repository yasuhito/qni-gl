import { describe, it, expect, beforeEach } from "vitest";
import { CircuitStepComponent } from "../../src/circuit-step-component";
import { HGate } from "../../src/h-gate";
import { XGate } from "../../src/x-gate";
import { ControlGate } from "../../src/control-gate";

describe("CircuitStepComponent", () => {
  let circuitStep: CircuitStepComponent;

  beforeEach(() => {
    circuitStep = new CircuitStepComponent(3); // Create a circuit step with 3 qubits
  });

  describe("serialize", () => {
    it("should serialize an empty circuit step", () => {
      expect(circuitStep.serialize()).toEqual([]);
    });

    it("should serialize a circuit step with a single H gate", () => {
      const hGate = new HGate();

      circuitStep.dropzoneAt(1).addChild(hGate);

      expect(circuitStep.serialize()).toEqual([{ type: "H", targets: [1] }]);
    });

    it("should serialize a circuit step with multiple gates", () => {
      const hGate = new HGate();
      const xGate = new XGate();

      circuitStep.dropzoneAt(0).addChild(hGate);
      circuitStep.dropzoneAt(2).addChild(xGate);

      expect(circuitStep.serialize()).toEqual([
        { type: "H", targets: [0] },
        { type: "X", targets: [2] },
      ]);
    });

    it("should serialize a controlled X gate", () => {
      const xGate = new XGate();
      const controlGate = new ControlGate();

      circuitStep.dropzoneAt(0).addChild(controlGate);
      circuitStep.dropzoneAt(2).addChild(xGate);

      expect(circuitStep.serialize()).toEqual([
        { type: "X", targets: [2], controls: [0] },
      ]);
    });
  });
});
