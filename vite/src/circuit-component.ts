import { CircuitStepComponent } from "./circuit-step-component";
import { Container } from "pixi.js";
import { DropzoneComponent, WireType } from "./dropzone-component";
import { List as ListContainer } from "@pixi/ui";

/**
 * Represents the options for a {@link CircuitComponent}.
 */
export interface CircuitOptions {
  minWireCount: number;
  stepCount: number;
}

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

  minStepCount = 5;

  /** Layout container for arranging {@link CircuitStepComponent}s in a row. */
  private circuitStepsContainer: ListContainer;

  /**
   * Returns the number of wires (bits) in the {@link CircuitComponent}.
   */
  get wireCount() {
    let wireCount = this.minWireCount;
    if (this.steps.length > 0) {
      wireCount = this.stepAt(0).wireCount;
    }

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

  get activeStepIndex() {
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      if (step.isActive()) {
        return i;
      }
    }

    return null;
  }

  /**
   * Returns a new {@link CircuitComponent} instance.
   *
   * @param {CircuitOptions} options - The options for the Circuit.
   */
  constructor(options: CircuitOptions) {
    super();

    this.minStepCount = options.stepCount;
    this.minWireCount = options.minWireCount;

    // TODO: レスポンシブ対応。モバイルではステップを縦に並べる
    this.circuitStepsContainer = new ListContainer({
      type: "horizontal",
    });
    this.addChild(this.circuitStepsContainer);

    for (let i = 0; i < options.stepCount; i++) {
      this.appendStep();
    }
  }

  private appendStep(wireCount = this.minWireCount) {
    const circuitStep = new CircuitStepComponent(wireCount);
    this.circuitStepsContainer.addChild(circuitStep);

    circuitStep.on(
      "gateSnapToDropzone",
      this.redrawDropzoneInputAndOutputWires,
      this
    );
    circuitStep.on("hover", this.emitOnStepHoverSignal, this);
    circuitStep.on("activated", this.deactivateAllOtherSteps, this);
    circuitStep.on("grabGate", (gate, globalPosition) => {
      this.emit("grabGate", gate, globalPosition);
    });
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

    this.emit("gateSnapToDropzone", this, circuitStep, dropzone);
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

  update(): void {
    const activeStepIndex = this.activeStepIndex;
    if (activeStepIndex == null) {
      throw new Error("activeStepIndex == null");
    }

    this.removeEmptySteps();
    this.appendMinimumSteps();
    this.removeUnusedUpperWires();
    this.updateSwapConnections();
    this.updateControlledUConnections();

    this.stepAt(activeStepIndex).activate();
  }

  private removeEmptySteps(): void {
    for (const each of this.emptySteps) {
      each.destroy();
    }
  }

  private appendMinimumSteps(): void {
    const nsteps = this.minStepCount - this.steps.length;

    for (let i = 0; i < nsteps; i++) {
      this.appendStep(this.wireCount);
    }
  }

  private get emptySteps(): CircuitStepComponent[] {
    return this.steps.filter((each) => each.isEmpty);
  }

  /**
   * Delete unused upper wires.
   */
  private removeUnusedUpperWires() {
    while (
      this.isLastWireUnused() &&
      this.maxWireCountForAllSteps > this.minWireCount
    ) {
      this.steps.forEach((each) => {
        each.deleteLastDropzone();
      });
    }
  }

  maybeAppendWire() {
    const firstStepWireCount = this.steps[0].wireCount;

    this.steps.forEach((each) => {
      if (each.wireCount !== firstStepWireCount) {
        throw new Error("All steps must have the same number of wires");
      }

      if (each.wireCount < this.maxWireCount) {
        each.appendNewDropzone();
      }
    });
  }

  private updateSwapConnections() {
    this.steps.forEach((each) => {
      each.updateSwapConnections();
    });
  }

  private updateControlledUConnections() {
    this.steps.forEach((each) => {
      each.updateControlledUConnections();
      each.updateFreeDropzoneConnections();
    });
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
    const cols: string[] = [];
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

    this.emit("stepActivated", this, circuitStep);
  }
}
