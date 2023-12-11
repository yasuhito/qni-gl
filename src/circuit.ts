import { CircuitStep } from "./circuit-step";
import { Container } from "pixi.js";
import { Dropzone, WireType } from "./dropzone";
import { List as ListContainer } from "@pixi/ui";
import { Signal } from "typed-signals";

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
  onGateSnapToDropzone: DropzoneSignalToCircuitHandler;

  /** Layout container for arranging {@link CircuitStep}s in a row. */
  private circuitStepsContainer: ListContainer;

  /**
   * Returns the number of wires (bits) in the {@link Circuit}.
   */
  get wireCount() {
    const wireCount = this.stepAt(0).wireCount;

    this.steps.forEach((each) => {
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
    this.onGateSnapToDropzone = new Signal();

    // TODO: レスポンシブ対応。モバイルではステップを縦に並べる
    this.circuitStepsContainer = new ListContainer({
      type: "horizontal",
    });
    this.addChild(this.circuitStepsContainer);

    for (let i = 0; i < options.stepCount; i++) {
      const circuitStep = new CircuitStep(this.minWireCount);
      this.circuitStepsContainer.addChild(circuitStep);

      circuitStep.onGateSnapToDropzone.connect(
        this.redrawDropzoneInputAndOutputWires.bind(this)
      );
      circuitStep.onHover.connect(this.emitOnStepHoverSignal.bind(this));
      circuitStep.onActivate.connect(
        this.deactivateAllOtherCircuitSteps.bind(this)
      );
    }
  }

  private redrawDropzoneInputAndOutputWires(
    circuitStep: CircuitStep,
    dropzone: Dropzone
  ) {
    for (let wireIndex = 0; wireIndex < this.wireCount; wireIndex++) {
      let wireType = WireType.Classical;

      this.steps.forEach((each) => {
        const dropzone = each.dropzoneAt(wireIndex);

        if (dropzone.isOccupied()) {
          if (dropzone.hasWriteGate()) {
            dropzone.inputWireType = wireType;
            wireType = WireType.Quantum;
            dropzone.outputWireType = wireType;
          } else if (dropzone.hasMeasurementGate()) {
            dropzone.inputWireType = wireType;
            wireType = WireType.Classical;
            dropzone.outputWireType = wireType;
          }
        } else {
          dropzone.inputWireType = wireType;
          dropzone.outputWireType = wireType;
        }
        dropzone.redrawWires();
      });
    }

    this.onGateSnapToDropzone.emit(this, circuitStep, dropzone);
  }

  stepAt(stepIndex: number) {
    return this.steps[stepIndex];
  }

  /**
   * Returns the index of the given {@link CircuitStep} within the {@link Circuit}.
   */
  stepIndex(step: CircuitStep) {
    for (let i = 0; i < this.steps.length; i++) {
      const each = this.steps[i];
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
