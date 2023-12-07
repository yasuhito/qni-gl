import { CircuitStep } from "./circuit-step";
import { Container } from "pixi.js";
import { List } from "@pixi/ui";
import { Signal } from "typed-signals";
import { Dropzone, WireType } from "./dropzone";
import { Write0Gate } from "./write0-gate";
import { Write1Gate } from "./write1-gate";
import { MeasurementGate } from "./measurement-gate";

export interface CircuitOptions {
  minWireCount: number;
  stepCount: number;
}

/**
 * @noInheritDoc
 */
export class Circuit extends Container {
  /** 最小のワイヤ数 (ビット数) */
  minWireCount = 1;
  /** 最大のワイヤ数 (ビット数) */
  maxWireCount = 32;
  view: Container;

  onStepHover: Signal<(circuit: Circuit, circuitStep: CircuitStep) => void>;
  onStepActivated: Signal<(circuit: Circuit, circuitStep: CircuitStep) => void>;
  onGateSnap: Signal<
    (circuit: Circuit, circuitStep: CircuitStep, dropzone: Dropzone) => void
  >;

  protected _circuitSteps: List;

  /**
   * 量子回路内のワイヤ数 (ビット数) を返す
   */
  get wireCount() {
    const wireCount = this.circuitStepAt(0).wireCount;

    for (let i = 1; i < this.stepCount; i++) {
      if (this.circuitStepAt(i).wireCount !== wireCount) {
        throw new Error("All steps must have the same number of wires");
      }
    }

    return wireCount;
  }

  get width(): number {
    return this._circuitSteps[0].width;
  }

  get height(): number {
    return this._circuitSteps[0].height * this._circuitSteps.children.length;
  }

  get circuitSteps(): CircuitStep[] {
    return this._circuitSteps.children as CircuitStep[];
  }

  protected get stepCount() {
    return this.circuitSteps.length;
  }

  constructor(options: CircuitOptions) {
    super();

    this.onStepHover = new Signal();
    this.onStepActivated = new Signal();
    this.onGateSnap = new Signal();

    this.minWireCount = options.minWireCount;

    this.view = new Container();
    this.addChild(this.view);

    this._circuitSteps = new List({
      type: "horizontal",
    });
    this.view.addChild(this._circuitSteps);

    for (let i = 0; i < options.stepCount; i++) {
      const circuitStep = new CircuitStep(this.minWireCount);
      circuitStep.onSnap.connect(this.onSnap.bind(this));
      this._circuitSteps.addChild(circuitStep);

      circuitStep.onHover.connect(this.onCircuitStepHover.bind(this));
      circuitStep.onActivate.connect(
        this.deactivateAllOtherCircuitSteps.bind(this)
      );
    }
  }

  onSnap(circuitStep: CircuitStep, dropzone: Dropzone) {
    for (let wireIndex = 0; wireIndex < this.wireCount; wireIndex++) {
      let wireType = WireType.Classical;

      for (let stepIndex = 0; stepIndex < this.stepCount; stepIndex++) {
        const dropzone = this.circuitStepAt(stepIndex).dropzoneAt(wireIndex);

        if (dropzone.isOccupied()) {
          if (
            dropzone.operation instanceof Write0Gate ||
            dropzone.operation instanceof Write1Gate
          ) {
            dropzone.inputWireType = wireType;
            wireType = WireType.Quantum;
            dropzone.outputWireType = wireType;
          } else if (dropzone.operation instanceof MeasurementGate) {
            dropzone.inputWireType = wireType;
            wireType = WireType.Classical;
            dropzone.outputWireType = wireType;
          }
        } else {
          dropzone.inputWireType = wireType;
          dropzone.outputWireType = wireType;
        }
        dropzone.redrawWires();
      }
    }

    this.onGateSnap.emit(this, circuitStep, dropzone);
  }

  circuitStepAt(stepIndex: number) {
    return this.circuitSteps[stepIndex];
  }

  stepIndex(step: CircuitStep) {
    for (let i = 0; i < this._circuitSteps.children.length; i++) {
      const each = this._circuitSteps.children[i];
      if (step === each) {
        return i;
      }
    }

    return;
  }

  // 最後のビットが使われていなければ true を返す
  isLastQubitUnused() {
    return this.circuitSteps.every(
      (each) => !each.hasGateAt(each.wireCount - 1)
    );
  }

  /**
   * Delete unused upper wires.
   */
  removeUnusedUpperWires() {
    while (
      this.isLastQubitUnused() &&
      this.maxQubitCountForAllSteps > this.minWireCount
    ) {
      this.circuitSteps.forEach((each) => {
        each.deleteLastDropzone();
      });
    }
  }

  protected get maxQubitCountForAllSteps() {
    return Math.max(...this.circuitSteps.map((each) => each.wireCount));
  }

  serialize() {
    return this.circuitSteps.map((each) => each.serialize());
  }

  toJSON() {
    return {
      steps: this.circuitSteps,
    };
  }

  toCircuitJSON() {
    const cols = [];
    for (const each of this.circuitSteps) {
      cols.push(each.toCircuitJSON());
    }
    return `{"cols":[${cols.join(",")}]}`;
  }

  protected onCircuitStepHover(circuitStep: CircuitStep) {
    this.onStepHover.emit(this, circuitStep);
  }

  protected deactivateAllOtherCircuitSteps(circuitStep: CircuitStep) {
    // 他のすべてのステップを非アクティブにする
    this._circuitSteps.children.forEach((each: CircuitStep) => {
      if (each.isActive() && each !== circuitStep) {
        each.deactivate();
      }
    });

    // シグナルを飛ばす
    this.onStepActivated.emit(this, circuitStep);
  }
}
