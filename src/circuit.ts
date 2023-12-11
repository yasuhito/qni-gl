import { CircuitStep } from "./circuit-step";
import { Container } from "pixi.js";
import { List as ListContainer } from "@pixi/ui";
import { Signal } from "typed-signals";
import { Dropzone, WireType } from "./dropzone";
import { Write0Gate } from "./write0-gate";
import { Write1Gate } from "./write1-gate";
import { MeasurementGate } from "./measurement-gate";

/**
 * Represents the options for a {@link Circuit}.
 */
export interface CircuitOptions {
  minWireCount: number;
  stepCount: number;
}

/**
 * Signals that fire in a {@link CircuitStep} and propagate to the {@link Circuit}.
 */
export type CircuitStepSignalToCircuitHandler = Signal<
  (circuit: Circuit, circuitStep: CircuitStep) => void
>;

/**
 * Signals that fire in a {@link Dropzone} and propagate to the {@link Circuit}.
 */
export type DropzoneSignalToCircuitHandler = Signal<
  (circuit: Circuit, circuitStep: CircuitStep, dropzone: Dropzone) => void
>;

/**
 * @noInheritDoc
 */
export class Circuit extends Container {
  /** Minimum number of wires (bits). */
  minWireCount = 1;
  /** Maximum number of wires (bits). */
  maxWireCount = 32;
  /** Signal emitted when mouse hovers over a {@link CircuitStep}. */
  onStepHover: CircuitStepSignalToCircuitHandler;
  /** Signal emitted when a {@link CircuitStep} is activated. */
  onStepActivated: CircuitStepSignalToCircuitHandler;
  /** Signal emitted when a {@link Gate} snaps to a {@link Dropzone}. */
  onGateSnap: DropzoneSignalToCircuitHandler;

  /** Layout container for arranging {@link CircuitStep}s in a row. */
  private circuitStepsContainer: ListContainer;

  /**
   * Returns the number of wires (bits) in the {@link Circuit}.
   */
  get wireCount() {
    const wireCount = this.stepAt(0).wireCount;

    this.steps.forEach((each: CircuitStep) => {
      if (each.wireCount !== wireCount) {
        throw new Error("All steps must have the same number of wires");
      }
    });

    return wireCount;
  }

  /**
   * Returns an array of {@link CircuitStep}s in the {@link Circuit}.
   */
  get steps(): CircuitStep[] {
    return this.circuitStepsContainer.children as CircuitStep[];
  }

  private get stepCount() {
    return this.steps.length;
  }

  /**
   * Returns a new {@link Circuit} instance.
   *
   * @param {CircuitOptions} options - The options for the Circuit.
   */
  constructor(options: CircuitOptions) {
    super();

    this.minWireCount = options.minWireCount;

    this.onStepHover = new Signal();
    this.onStepActivated = new Signal();
    this.onGateSnap = new Signal();

    // TODO: レスポンシブ対応。モバイルではステップを縦に並べる
    this.circuitStepsContainer = new ListContainer({
      type: "horizontal",
    });
    this.addChild(this.circuitStepsContainer);

    for (let i = 0; i < options.stepCount; i++) {
      const circuitStep = new CircuitStep(this.minWireCount);
      this.circuitStepsContainer.addChild(circuitStep);

      circuitStep.onSnap.connect(this.onSnap.bind(this));
      circuitStep.onHover.connect(this.emitOnStepHoverSignal.bind(this));
      circuitStep.onActivate.connect(
        this.deactivateAllOtherCircuitSteps.bind(this)
      );
    }
  }

  onSnap(circuitStep: CircuitStep, dropzone: Dropzone) {
    for (let wireIndex = 0; wireIndex < this.wireCount; wireIndex++) {
      let wireType = WireType.Classical;

      for (let stepIndex = 0; stepIndex < this.stepCount; stepIndex++) {
        const dropzone = this.stepAt(stepIndex).dropzoneAt(wireIndex);

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

  stepAt(stepIndex: number) {
    return this.steps[stepIndex];
  }

  /**
   * Returns the index of the given {@link CircuitStep} within the {@link Circuit}.
   */
  stepIndex(step: CircuitStep) {
    for (let i = 0; i < this.circuitStepsContainer.children.length; i++) {
      const each = this.circuitStepsContainer.children[i];
      if (step === each) {
        return i;
      }
    }

    throw new Error("Step not found");
  }

  // 最後のビットが使われていなければ true を返す
  isLastQubitUnused() {
    return this.steps.every((each) => !each.hasGateAt(each.wireCount - 1));
  }

  /**
   * Delete unused upper wires.
   */
  removeUnusedUpperWires() {
    while (
      this.isLastQubitUnused() &&
      this.maxQubitCountForAllSteps > this.minWireCount
    ) {
      this.steps.forEach((each) => {
        each.deleteLastDropzone();
      });
    }
  }

  protected get maxQubitCountForAllSteps() {
    return Math.max(...this.steps.map((each) => each.wireCount));
  }

  serialize() {
    return this.steps.map((each) => each.serialize());
  }

  toJSON() {
    return {
      steps: this.steps,
    };
  }

  toCircuitJSON() {
    const cols = [];
    for (const each of this.steps) {
      cols.push(each.toCircuitJSON());
    }
    return `{"cols":[${cols.join(",")}]}`;
  }

  protected emitOnStepHoverSignal(circuitStep: CircuitStep) {
    this.onStepHover.emit(this, circuitStep);
  }

  /**
   * Deactivates all other {@link CircuitStep}s except for the specified {@link CircuitStep}.
   */
  private deactivateAllOtherCircuitSteps(circuitStep: CircuitStep) {
    this.circuitStepsContainer.children.forEach((each: CircuitStep) => {
      if (each !== circuitStep && each.isActive()) {
        each.deactivate();
      }
    });

    this.onStepActivated.emit(this, circuitStep);
  }
}
