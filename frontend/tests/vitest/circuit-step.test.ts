import { describe, it, expect, beforeEach } from "vitest";
import { CircuitStep } from "../../src/circuit-step";
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
import { MeasurementGate, SwapGate } from "../../src";

describe("CircuitStep", () => {
  let circuitStep: CircuitStep;

  beforeEach(() => {
    circuitStep = new CircuitStep(3);
  });

  describe("height", () => {
    it("has the correct height considering padding", () => {
      const dropzoneHeight = circuitStep.fetchDropzoneByIndex(0).totalSize;
      const numDropzones = 3;
      const padding = CircuitStep.PADDING;

      expect(circuitStep.height).toEqual(
        dropzoneHeight * numDropzones + padding * 2
      );
    });
  });

  describe("serialize", () => {
    it("should serialize an empty circuit step", () => {
      expect(circuitStep.serialize()).toEqual([]);
    });

    describe("H Gate", () => {
      it("should serialize a circuit step with a single H gate", () => {
        const hGate = new HGate();

        circuitStep.fetchDropzoneByIndex(1).addChild(hGate);

        expect(circuitStep.serialize()).toEqual([{ type: "H", targets: [1] }]);
      });

      it("should serialize multiple H gates on different qubits", () => {
        const hGate1 = new HGate();
        const hGate2 = new HGate();

        circuitStep.fetchDropzoneByIndex(0).addChild(hGate1);
        circuitStep.fetchDropzoneByIndex(1).addChild(hGate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "H", targets: [0, 1] },
        ]);
      });
    });

    describe("X Gate", () => {
      it("should serialize a single X gate", () => {
        const xGate = new XGate();

        circuitStep.fetchDropzoneByIndex(1).addChild(xGate);

        expect(circuitStep.serialize()).toEqual([{ type: "X", targets: [1] }]);
      });

      it("should serialize multiple X gates", () => {
        const xGate1 = new XGate();
        const xGate2 = new XGate();

        circuitStep.fetchDropzoneByIndex(0).addChild(xGate1);
        circuitStep.fetchDropzoneByIndex(2).addChild(xGate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "X", targets: [0, 2] },
        ]);
      });

      it("should serialize a controlled X gate (CNOT)", () => {
        const xGate = new XGate();
        const controlGate = new ControlGate();

        circuitStep.fetchDropzoneByIndex(0).addChild(controlGate);
        circuitStep.fetchDropzoneByIndex(2).addChild(xGate);

        expect(circuitStep.serialize()).toEqual([
          { type: "X", targets: [2], controls: [0] },
        ]);
      });

      it("should serialize a multi-controlled X gate (Toffoli)", () => {
        const xGate = new XGate();
        const controlGate1 = new ControlGate();
        const controlGate2 = new ControlGate();

        circuitStep.fetchDropzoneByIndex(0).addChild(controlGate1);
        circuitStep.fetchDropzoneByIndex(1).addChild(controlGate2);
        circuitStep.fetchDropzoneByIndex(2).addChild(xGate);

        expect(circuitStep.serialize()).toEqual([
          { type: "X", targets: [2], controls: [0, 1] },
        ]);
      });
    });

    describe("Y Gate", () => {
      it("should serialize a single Y gate", () => {
        const yGate = new YGate();
        circuitStep.fetchDropzoneByIndex(1).addChild(yGate);
        expect(circuitStep.serialize()).toEqual([{ type: "Y", targets: [1] }]);
      });

      it("should serialize multiple Y gates", () => {
        const yGate1 = new YGate();
        const yGate2 = new YGate();
        circuitStep.fetchDropzoneByIndex(0).addChild(yGate1);
        circuitStep.fetchDropzoneByIndex(2).addChild(yGate2);
        expect(circuitStep.serialize()).toEqual([
          { type: "Y", targets: [0, 2] },
        ]);
      });
    });

    describe("Z Gate", () => {
      it("should serialize a single Z gate", () => {
        const zGate = new ZGate();

        circuitStep.fetchDropzoneByIndex(1).addChild(zGate);

        expect(circuitStep.serialize()).toEqual([{ type: "Z", targets: [1] }]);
      });

      it("should serialize multiple Z gates", () => {
        const zGate1 = new ZGate();
        const zGate2 = new ZGate();

        circuitStep.fetchDropzoneByIndex(0).addChild(zGate1);
        circuitStep.fetchDropzoneByIndex(2).addChild(zGate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "Z", targets: [0, 2] },
        ]);
      });
    });

    describe("Rnot Gate", () => {
      it("should serialize a single Rnot gate", () => {
        const rnotGate = new RnotGate();

        circuitStep.fetchDropzoneByIndex(1).addChild(rnotGate);

        expect(circuitStep.serialize()).toEqual([
          { type: "X^½", targets: [1] },
        ]);
      });

      it("should serialize multiple Rnot gates", () => {
        const rnotGate1 = new RnotGate();
        const rnotGate2 = new RnotGate();

        circuitStep.fetchDropzoneByIndex(0).addChild(rnotGate1);
        circuitStep.fetchDropzoneByIndex(2).addChild(rnotGate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "X^½", targets: [0, 2] },
        ]);
      });
    });

    describe("S Gate", () => {
      it("should serialize a single S gate", () => {
        const sGate = new SGate();

        circuitStep.fetchDropzoneByIndex(1).addChild(sGate);

        expect(circuitStep.serialize()).toEqual([{ type: "S", targets: [1] }]);
      });

      it("should serialize multiple S gates", () => {
        const sGate1 = new SGate();
        const sGate2 = new SGate();

        circuitStep.fetchDropzoneByIndex(0).addChild(sGate1);
        circuitStep.fetchDropzoneByIndex(2).addChild(sGate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "S", targets: [0, 2] },
        ]);
      });
    });

    describe("S† Gate", () => {
      it("should serialize a single S† gate", () => {
        const sDaggerGate = new SDaggerGate();

        circuitStep.fetchDropzoneByIndex(1).addChild(sDaggerGate);

        expect(circuitStep.serialize()).toEqual([{ type: "S†", targets: [1] }]);
      });

      it("should serialize multiple S† gates", () => {
        const sDaggerGate1 = new SDaggerGate();
        const sDaggerGate2 = new SDaggerGate();

        circuitStep.fetchDropzoneByIndex(0).addChild(sDaggerGate1);
        circuitStep.fetchDropzoneByIndex(2).addChild(sDaggerGate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "S†", targets: [0, 2] },
        ]);
      });
    });

    describe("T Gate", () => {
      it("should serialize a single T gate", () => {
        const tGate = new TGate();

        circuitStep.fetchDropzoneByIndex(1).addChild(tGate);

        expect(circuitStep.serialize()).toEqual([{ type: "T", targets: [1] }]);
      });

      it("should serialize multiple T gates", () => {
        const tGate1 = new TGate();
        const tGate2 = new TGate();

        circuitStep.fetchDropzoneByIndex(0).addChild(tGate1);
        circuitStep.fetchDropzoneByIndex(2).addChild(tGate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "T", targets: [0, 2] },
        ]);
      });
    });

    describe("T† Gate", () => {
      it("should serialize a single T† gate", () => {
        const tDaggerGate = new TDaggerGate();

        circuitStep.fetchDropzoneByIndex(1).addChild(tDaggerGate);

        expect(circuitStep.serialize()).toEqual([{ type: "T†", targets: [1] }]);
      });

      it("should serialize multiple T† gates", () => {
        const tDaggerGate1 = new TDaggerGate();
        const tDaggerGate2 = new TDaggerGate();

        circuitStep.fetchDropzoneByIndex(0).addChild(tDaggerGate1);
        circuitStep.fetchDropzoneByIndex(2).addChild(tDaggerGate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "T†", targets: [0, 2] },
        ]);
      });
    });

    describe("|0> Gate", () => {
      it("should serialize a single |0> gate", () => {
        const write0Gate = new Write0Gate();

        circuitStep.fetchDropzoneByIndex(1).addChild(write0Gate);

        expect(circuitStep.serialize()).toEqual([
          { type: "|0>", targets: [1] },
        ]);
      });

      it("should serialize multiple |0> gates", () => {
        const write0Gate1 = new Write0Gate();
        const write0Gate2 = new Write0Gate();

        circuitStep.fetchDropzoneByIndex(0).addChild(write0Gate1);
        circuitStep.fetchDropzoneByIndex(2).addChild(write0Gate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "|0>", targets: [0, 2] },
        ]);
      });
    });

    describe("|1> Gate", () => {
      it("should serialize a single |1> gate", () => {
        const write1Gate = new Write1Gate();

        circuitStep.fetchDropzoneByIndex(1).addChild(write1Gate);

        expect(circuitStep.serialize()).toEqual([
          { type: "|1>", targets: [1] },
        ]);
      });

      it("should serialize multiple |1> gates", () => {
        const write1Gate1 = new Write1Gate();
        const write1Gate2 = new Write1Gate();

        circuitStep.fetchDropzoneByIndex(0).addChild(write1Gate1);
        circuitStep.fetchDropzoneByIndex(2).addChild(write1Gate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "|1>", targets: [0, 2] },
        ]);
      });
    });

    describe("Swap Gate", () => {
      it("should serialize a single Swap gate", () => {
        const swapGate = new SwapGate();

        circuitStep.fetchDropzoneByIndex(1).addChild(swapGate);

        expect(circuitStep.serialize()).toEqual([
          { type: "Swap", targets: [1] },
        ]);
      });

      it("should serialize multiple Swap gates", () => {
        const swapGate1 = new SwapGate();
        const swapGate2 = new SwapGate();

        circuitStep.fetchDropzoneByIndex(0).addChild(swapGate1);
        circuitStep.fetchDropzoneByIndex(2).addChild(swapGate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "Swap", targets: [0, 2] },
        ]);
      });
    });

    describe("Control Gate", () => {
      it("should serialize a single control gate", () => {
        const controlGate = new ControlGate();

        circuitStep.fetchDropzoneByIndex(1).addChild(controlGate);

        expect(circuitStep.serialize()).toEqual([{ type: "•", targets: [1] }]);
      });

      it("should serialize multiple control gates", () => {
        const controlGate1 = new ControlGate();
        const controlGate2 = new ControlGate();

        circuitStep.fetchDropzoneByIndex(0).addChild(controlGate1);
        circuitStep.fetchDropzoneByIndex(2).addChild(controlGate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "•", targets: [0, 2] },
        ]);
      });
    });

    describe("Measurement Gate", () => {
      it("should serialize a single measurement gate", () => {
        const measurementGate = new MeasurementGate();

        circuitStep.fetchDropzoneByIndex(1).addChild(measurementGate);

        expect(circuitStep.serialize()).toEqual([
          { type: "Measure", targets: [1] },
        ]);
      });

      it("should serialize multiple measurement gates", () => {
        const measurementGate1 = new MeasurementGate();
        const measurementGate2 = new MeasurementGate();

        circuitStep.fetchDropzoneByIndex(0).addChild(measurementGate1);
        circuitStep.fetchDropzoneByIndex(2).addChild(measurementGate2);

        expect(circuitStep.serialize()).toEqual([
          { type: "Measure", targets: [0, 2] },
        ]);
      });
    });

    describe("Multiple Gate Types", () => {
      it("should serialize a circuit step with multiple gates", () => {
        const hGate = new HGate();
        const xGate = new XGate();

        circuitStep.fetchDropzoneByIndex(0).addChild(hGate);
        circuitStep.fetchDropzoneByIndex(2).addChild(xGate);

        expect(circuitStep.serialize()).toEqual([
          { type: "H", targets: [0] },
          { type: "X", targets: [2] },
        ]);
      });
    });
  });
});
