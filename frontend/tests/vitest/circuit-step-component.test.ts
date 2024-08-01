import { describe, it, expect, beforeEach } from "vitest";
import { CircuitStepComponent } from "../../src/circuit-step-component";
import { HGate } from "../../src/h-gate";
import { XGate } from "../../src/x-gate";
import { ControlGate } from "../../src/control-gate";
import { YGate } from "../../src/y-gate";
import { ZGate } from "../../src/z-gate";
import { RnotGate } from "../../src/rnot-gate";
import { SGate } from "../../src/s-gate";
import { SDaggerGate } from "../../src/s-dagger-gate";
import { TGate } from "../../src/t-gate";
import { TDaggerGate } from "../../src/t-dagger-gate";
import { Write0Gate } from "../../src/write0-gate";
import { Write1Gate } from "../../src/write1-gate";
import { SwapGate } from "../../src";

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

    describe("S† Gate", () => {
      it("should serialize a single S† gate", () => {
        const sDaggerGate = new SDaggerGate();

        circuitStep.dropzoneAt(1).addChild(sDaggerGate);

        expect(circuitStep.serialize()).toEqual([{ type: "S†", targets: [1] }]);
      });

      it("should serialize multiple S† gates", () => {
        const sDaggerGate1 = new SDaggerGate();
        const sDaggerGate2 = new SDaggerGate();

        circuitStep.dropzoneAt(0).addChild(sDaggerGate1);
        circuitStep.dropzoneAt(2).addChild(sDaggerGate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "S†", targets: [0, 2] },
        ]);
      });
    });

    describe("T Gate", () => {
      it("should serialize a single T gate", () => {
        const tGate = new TGate();

        circuitStep.dropzoneAt(1).addChild(tGate);

        expect(circuitStep.serialize()).toEqual([{ type: "T", targets: [1] }]);
      });

      it("should serialize multiple T gates", () => {
        const tGate1 = new TGate();
        const tGate2 = new TGate();

        circuitStep.dropzoneAt(0).addChild(tGate1);
        circuitStep.dropzoneAt(2).addChild(tGate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "T", targets: [0, 2] },
        ]);
      });
    });

    describe("T† Gate", () => {
      it("should serialize a single T† gate", () => {
        const tDaggerGate = new TDaggerGate();

        circuitStep.dropzoneAt(1).addChild(tDaggerGate);

        expect(circuitStep.serialize()).toEqual([{ type: "T†", targets: [1] }]);
      });

      it("should serialize multiple T† gates", () => {
        const tDaggerGate1 = new TDaggerGate();
        const tDaggerGate2 = new TDaggerGate();

        circuitStep.dropzoneAt(0).addChild(tDaggerGate1);
        circuitStep.dropzoneAt(2).addChild(tDaggerGate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "T†", targets: [0, 2] },
        ]);
      });
    });

    describe("|0> Gate", () => {
      it("should serialize a single |0> gate", () => {
        const write0Gate = new Write0Gate();

        circuitStep.dropzoneAt(1).addChild(write0Gate);

        expect(circuitStep.serialize()).toEqual([
          { type: "|0>", targets: [1] },
        ]);
      });

      it("should serialize multiple |0> gates", () => {
        const write0Gate1 = new Write0Gate();
        const write0Gate2 = new Write0Gate();

        circuitStep.dropzoneAt(0).addChild(write0Gate1);
        circuitStep.dropzoneAt(2).addChild(write0Gate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "|0>", targets: [0, 2] },
        ]);
      });
    });

    describe("|1> Gate", () => {
      it("should serialize a single |1> gate", () => {
        const write1Gate = new Write1Gate();

        circuitStep.dropzoneAt(1).addChild(write1Gate);

        expect(circuitStep.serialize()).toEqual([
          { type: "|1>", targets: [1] },
        ]);
      });

      it("should serialize multiple |1> gates", () => {
        const write1Gate1 = new Write1Gate();
        const write1Gate2 = new Write1Gate();

        circuitStep.dropzoneAt(0).addChild(write1Gate1);
        circuitStep.dropzoneAt(2).addChild(write1Gate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "|1>", targets: [0, 2] },
        ]);
      });
    });

    describe("Swap Gate", () => {
      it("should serialize a single Swap gate", () => {
        const swapGate = new SwapGate();

        circuitStep.dropzoneAt(1).addChild(swapGate);

        expect(circuitStep.serialize()).toEqual([
          { type: "Swap", targets: [1] },
        ]);
      });

      it("should serialize multiple Swap gates", () => {
        const swapGate1 = new SwapGate();
        const swapGate2 = new SwapGate();

        circuitStep.dropzoneAt(0).addChild(swapGate1);
        circuitStep.dropzoneAt(2).addChild(swapGate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "Swap", targets: [0, 2] },
        ]);
      });
    });

    describe("Control Gate", () => {
      it("should serialize a single control gate", () => {
        const controlGate = new ControlGate();

        circuitStep.dropzoneAt(1).addChild(controlGate);

        expect(circuitStep.serialize()).toEqual([{ type: "•", targets: [1] }]);
      });

      it("should serialize multiple control gates", () => {
        const controlGate1 = new ControlGate();
        const controlGate2 = new ControlGate();

        circuitStep.dropzoneAt(0).addChild(controlGate1);
        circuitStep.dropzoneAt(2).addChild(controlGate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "•", targets: [0, 2] },
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
