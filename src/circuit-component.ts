import { CircuitStep } from "./circuit-step";
import { Container } from "pixi.js";
import { DropzoneComponent, WireType } from "./dropzone-component";
import { List as ListContainer } from "@pixi/ui";
import { Signal } from "typed-signals";

/**
 * Represents the options for a {@link CircuitComponent}.
 */
export interface CircuitOptions {
  minWireCount: number;
  stepCount: number;
}

/**
 * Signals that fire in a {@link CircuitStep} and propagate to the {@link CircuitComponent}.
 */
export type CircuitStepSignalToCircuitHandler = Signal<
  (circuit: CircuitComponent, circuitStep: CircuitStep) => void
>;

/**
 * Signals that fire in a {@link DropzoneComponent} and propagate to the {@link CircuitComponent}.
 */
export type DropzoneSignalToCircuitHandler = Signal<
  (
    circuit: CircuitComponent,
    circuitStep: CircuitStep,
    dropzone: DropzoneComponent
  ) => void
>;

/**
 * Represents a quantum circuit that holds multiple {@link CircuitStep}s.
 *
 * @noInheritDoc
 */
export class CircuitComponent extends Container {
  /** Minimum number of qubits. */
  minQubitCount = 1;
  /** Minimum number of wires. */
  minWireCount = 1;
  /** Maximum number of wires. */
  maxWireCount = 32;
  /** Signal emitted when mouse hovers over a {@link CircuitStep}. */
  onStepHover: CircuitStepSignalToCircuitHandler;
  /** Signal emitted when a {@link CircuitStep} is activated. */
  onStepActivated: CircuitStepSignalToCircuitHandler;
  /** Signal emitted when a {@link Gate} snaps to a {@link DropzoneComponent}. */
  onGateSnapToDropzone: DropzoneSignalToCircuitHandler;

  /** Layout container for arranging {@link CircuitStep}s in a row. */
  private circuitStepsContainer: ListContainer;

  /**
   * Returns the number of wires (bits) in the {@link CircuitComponent}.
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

  get qubitCountInUse() {
    const qubitCount = Math.max(
      ...this.steps.map((each) => {
        return each.qubitCountInUse;
      })
    );

    if (qubitCount == 0) {
      return this.minQubitCount;
    }

    return qubitCount;
  }

  /**
   * Returns an array of {@link CircuitStep}s in the {@link CircuitComponent}.
   */
  get steps(): CircuitStep[] {
    return this.circuitStepsContainer.children as CircuitStep[];
  }

  /**
   * Returns a new {@link CircuitComponent} instance.
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
      circuitStep.onActivate.connect(this.deactivateAllOtherSteps.bind(this));
    }
  }

  private redrawDropzoneInputAndOutputWires(
    circuitStep: CircuitStep,
    dropzone: DropzoneComponent
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

  /**
   * Retrieves the {@link CircuitStep} at the specified index.
   */
  stepAt(stepIndex: number) {
    if (stepIndex < 0 || stepIndex >= this.steps.length) {
      throw new Error("Step index out of bounds");
    }

    return this.steps[stepIndex];
  }

  /**
   * Delete unused upper wires.
   */
  removeUnusedUpperWires() {
    while (
      this.isLastWireUnused() &&
      this.maxWireCountForAllSteps > this.minWireCount
    ) {
      this.steps.forEach((each) => {
        each.deleteLastDropzone();
      });
    }
  }

  private isLastWireUnused() {
    return this.steps.every((each) => !each.hasGateAt(each.wireCount - 1));
  }

  protected get maxWireCountForAllSteps() {
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

  private emitOnStepHoverSignal(circuitStep: CircuitStep) {
    this.onStepHover.emit(this, circuitStep);
  }

  /**
   * Deactivates all other {@link CircuitStep}s except for the specified {@link CircuitStep}.
   */
  private deactivateAllOtherSteps(circuitStep: CircuitStep) {
    this.steps.forEach((each: CircuitStep) => {
      if (each !== circuitStep && each.isActive()) {
        each.deactivate();
      }
    });

    this.onStepActivated.emit(this, circuitStep);
  }
}
