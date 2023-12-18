import { CircuitStepComponent } from "./circuit-step-component";
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
 * Signals that fire in a {@link CircuitStepComponent} and propagate to the {@link CircuitComponent}.
 */
export type CircuitStepSignalToCircuitHandler = Signal<
  (circuit: CircuitComponent, circuitStep: CircuitStepComponent) => void
>;

/**
 * Signals that fire in a {@link DropzoneComponent} and propagate to the {@link CircuitComponent}.
 */
export type DropzoneSignalToCircuitHandler = Signal<
  (
    circuit: CircuitComponent,
    circuitStep: CircuitStepComponent,
    dropzone: DropzoneComponent
  ) => void
>;

/**
 * Represents a quantum circuit that holds multiple {@link CircuitStepComponent}s.
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

  /** Signal emitted when a {@link CircuitStepComponent} is activated. */
  onStepActivated: CircuitStepSignalToCircuitHandler;
  /** Signal emitted when a {@link GateComponent} snaps to a {@link DropzoneComponent}. */
  onGateSnapToDropzone: DropzoneSignalToCircuitHandler;

  /** Layout container for arranging {@link CircuitStepComponent}s in a row. */
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
   * Returns an array of {@link CircuitStepComponent}s in the {@link CircuitComponent}.
   */
  get steps(): CircuitStepComponent[] {
    return this.circuitStepsContainer.children as CircuitStepComponent[];
  }

  /**
   * Returns a new {@link CircuitComponent} instance.
   *
   * @param {CircuitOptions} options - The options for the Circuit.
   */
  constructor(options: CircuitOptions) {
    super();

    this.minWireCount = options.minWireCount;

    this.onStepActivated = new Signal();
    this.onGateSnapToDropzone = new Signal();

    // TODO: レスポンシブ対応。モバイルではステップを縦に並べる
    this.circuitStepsContainer = new ListContainer({
      type: "horizontal",
    });
    this.addChild(this.circuitStepsContainer);

    for (let i = 0; i < options.stepCount; i++) {
      const circuitStep = new CircuitStepComponent(this.minWireCount);
      this.circuitStepsContainer.addChild(circuitStep);

      circuitStep.on(
        "gateSnapToDropzone",
        this.redrawDropzoneInputAndOutputWires,
        this
      );
      circuitStep.on("hover", this.emitOnStepHoverSignal, this);
      circuitStep.on("activate", this.deactivateAllOtherSteps, this);
    }
  }

  private redrawDropzoneInputAndOutputWires(
    circuitStep: CircuitStepComponent,
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
   * Retrieves the {@link CircuitStepComponent} at the specified index.
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

  private emitOnStepHoverSignal(circuitStep: CircuitStepComponent) {
    this.emit("stepHover", this, circuitStep);
  }

  /**
   * Deactivates all other {@link CircuitStepComponent}s except for the specified {@link CircuitStepComponent}.
   */
  private deactivateAllOtherSteps(circuitStep: CircuitStepComponent) {
    this.steps.forEach((each: CircuitStepComponent) => {
      if (each !== circuitStep && each.isActive()) {
        each.deactivate();
      }
    });

    this.onStepActivated.emit(this, circuitStep);
  }
}
