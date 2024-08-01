import { describe, it, expect, beforeEach } from "vitest";
import { CircuitStepComponent } from "../../src/circuit-step-component";
import { HGate } from "../../src/h-gate";
import { XGate } from "../../src/x-gate";
import { ControlGate } from "../../src/control-gate";
import { YGate } from "../../src/y-gate";
import { ZGate } from "../../src/z-gate";
import { RnotGate } from "../../src/rnot-gate";
import { SGate } from "../../src/s-gate";

describe("CircuitStepComponent", () => {
  let circuitStep: CircuitStepComponent;

  beforeEach(() => {
    circuitStep = new CircuitStepComponent(3); // Create a circuit step with 3 qubits
  });

  describe("serialize", () => {
    it("should serialize an empty circuit step", () => {
      expect(circuitStep.serialize()).toEqual([]);
    });

    describe("H Gate", () => {
      it("should serialize a circuit step with a single H gate", () => {
        const hGate = new HGate();

        circuitStep.dropzoneAt(1).addChild(hGate);

        expect(circuitStep.serialize()).toEqual([{ type: "H", targets: [1] }]);
      });

      it("should serialize multiple H gates on different qubits", () => {
        const hGate1 = new HGate();
        const hGate2 = new HGate();

        circuitStep.dropzoneAt(0).addChild(hGate1);
        circuitStep.dropzoneAt(1).addChild(hGate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "H", targets: [0, 1] },
        ]);
      });
    });

    describe("X Gate", () => {
      it("should serialize a single X gate", () => {
        const xGate = new XGate();

        circuitStep.dropzoneAt(1).addChild(xGate);

        expect(circuitStep.serialize()).toEqual([{ type: "X", targets: [1] }]);
      });

      it("should serialize multiple X gates", () => {
        const xGate1 = new XGate();
        const xGate2 = new XGate();

        circuitStep.dropzoneAt(0).addChild(xGate1);
        circuitStep.dropzoneAt(2).addChild(xGate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "X", targets: [0, 2] },
        ]);
      });

      it("should serialize a controlled X gate (CNOT)", () => {
        const xGate = new XGate();
        const controlGate = new ControlGate();

        circuitStep.dropzoneAt(0).addChild(controlGate);
        circuitStep.dropzoneAt(2).addChild(xGate);

        expect(circuitStep.serialize()).toEqual([
          { type: "X", targets: [2], controls: [0] },
        ]);
      });

      it("should serialize a multi-controlled X gate (Toffoli)", () => {
        const xGate = new XGate();
        const controlGate1 = new ControlGate();
        const controlGate2 = new ControlGate();

        circuitStep.dropzoneAt(0).addChild(controlGate1);
        circuitStep.dropzoneAt(1).addChild(controlGate2);
        circuitStep.dropzoneAt(2).addChild(xGate);

        expect(circuitStep.serialize()).toEqual([
          { type: "X", targets: [2], controls: [0, 1] },
        ]);
      });
    });

    describe("Y Gate", () => {
      it("should serialize a single Y gate", () => {
        const yGate = new YGate();
        circuitStep.dropzoneAt(1).addChild(yGate);
        expect(circuitStep.serialize()).toEqual([{ type: "Y", targets: [1] }]);
      });

      it("should serialize multiple Y gates", () => {
        const yGate1 = new YGate();
        const yGate2 = new YGate();
        circuitStep.dropzoneAt(0).addChild(yGate1);
        circuitStep.dropzoneAt(2).addChild(yGate2);
        expect(circuitStep.serialize()).toEqual([
          { type: "Y", targets: [0, 2] },
        ]);
      });

      it.skip("should serialize a controlled Y gate", () => {
        const yGate = new YGate();
        const controlGate = new ControlGate();
        circuitStep.dropzoneAt(0).addChild(controlGate);
        circuitStep.dropzoneAt(2).addChild(yGate);
        expect(circuitStep.serialize()).toEqual([
          { type: "Y", targets: [2], controls: [0] },
        ]);
      });

      it.skip("should serialize a multi-controlled Y gate", () => {
        const yGate = new YGate();
        const controlGate1 = new ControlGate();
        const controlGate2 = new ControlGate();

        circuitStep.dropzoneAt(0).addChild(controlGate1);
        circuitStep.dropzoneAt(1).addChild(controlGate2);
        circuitStep.dropzoneAt(2).addChild(yGate);

        expect(circuitStep.serialize()).toEqual([
          { type: "Y", targets: [2], controls: [0, 1] },
        ]);
      });
    });

    describe("Z Gate", () => {
      it("should serialize a single Z gate", () => {
        const zGate = new ZGate();

        circuitStep.dropzoneAt(1).addChild(zGate);

        expect(circuitStep.serialize()).toEqual([{ type: "Z", targets: [1] }]);
      });

      it("should serialize multiple Z gates", () => {
        const zGate1 = new ZGate();
        const zGate2 = new ZGate();

        circuitStep.dropzoneAt(0).addChild(zGate1);
        circuitStep.dropzoneAt(2).addChild(zGate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "Z", targets: [0, 2] },
        ]);
      });
    });

    describe("Rnot Gate", () => {
      it("should serialize a single Rnot gate", () => {
        const rnotGate = new RnotGate();

        circuitStep.dropzoneAt(1).addChild(rnotGate);

        expect(circuitStep.serialize()).toEqual([
          { type: "X^½", targets: [1] },
        ]);
      });

      it("should serialize multiple Rnot gates", () => {
        const rnotGate1 = new RnotGate();
        const rnotGate2 = new RnotGate();

        circuitStep.dropzoneAt(0).addChild(rnotGate1);
        circuitStep.dropzoneAt(2).addChild(rnotGate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "X^½", targets: [0, 2] },
        ]);
      });
    });

    describe("S Gate", () => {
      it("should serialize a single S gate", () => {
        const sGate = new SGate();

        circuitStep.dropzoneAt(1).addChild(sGate);

        expect(circuitStep.serialize()).toEqual([{ type: "S", targets: [1] }]);
      });

      it("should serialize multiple S gates", () => {
        const sGate1 = new SGate();
        const sGate2 = new SGate();

        circuitStep.dropzoneAt(0).addChild(sGate1);
        circuitStep.dropzoneAt(2).addChild(sGate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "S", targets: [0, 2] },
        ]);
      });
    });

    describe("Multiple Gate Types", () => {
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
    });
  });
});
