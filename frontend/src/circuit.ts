import { CircuitStep } from "./circuit-step";
import { Container } from "pixi.js";
import { List as ListContainer } from "@pixi/ui";
import { QubitCount, WireType } from "./types";
import { MAX_QUBIT_COUNT, MIN_QUBIT_COUNT } from "./constants";
import { CIRCUIT_STEP_EVENTS } from "./events";
import { CircuitStepMarkerManager } from "./circuit-step-marker-manager";

/**
 * Represents the options for a {@link Circuit}.
 */
export interface CircuitOptions {
  minWireCount: number;
  stepCount: number;
}

export const CIRCUIT_EVENTS = {
  OPERATION_GRABBED: "circuit:grab-gate",
  ACTIVATE_STEP: "circuit:activate-step",
};

/**
 * Represents a quantum circuit that holds multiple {@link CircuitStep}s.
 */
export class Circuit extends Container {
  /** Minimum number of wires. */
  minWireCount = 1;
  /** Maximum number of wires. */
  maxWireCount: QubitCount = MAX_QUBIT_COUNT;

  minStepCount = 5;

  /** Layout container for arranging {@link CircuitStep}s in a row. */
  circuitStepsContainer: ListContainer;
  private markerManager: CircuitStepMarkerManager;

  /**
   * Returns the number of wires (bits) in the {@link Circuit}.
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

  get occupiedDropzoneCount(): QubitCount {
    const qubitCount = Math.max(
      ...this.steps.map((each) => {
        return each.occupiedDropzoneCount;
      })
    );

    if (qubitCount == 0) {
      return MIN_QUBIT_COUNT;
    }

    return qubitCount as QubitCount;
  }

  /**
   * Returns an array of {@link CircuitStep}s in the {@link Circuit}.
   */
  get steps(): CircuitStep[] {
    return this.circuitStepsContainer.children as CircuitStep[];
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
   * Returns a new {@link Circuit} instance.
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

    this.markerManager = new CircuitStepMarkerManager({ steps: this.steps });
    this.addChild(this.markerManager);

    this.markerManager.zIndex = 1;
    this.sortableChildren = true;
  }

  private appendStep(wireCount = this.minWireCount) {
    const circuitStep = new CircuitStep(wireCount);
    this.circuitStepsContainer.addChild(circuitStep);

    circuitStep.on(
      CIRCUIT_STEP_EVENTS.GATE_SNAPPED,
      this.onGateSnapToDropzone,
      this
    );
    circuitStep.on(
      CIRCUIT_STEP_EVENTS.HOVERED,
      this.emitOnStepHoverSignal,
      this
    );
    circuitStep.on(CIRCUIT_STEP_EVENTS.ACTIVATED, this.activateStep, this);
    circuitStep.on(CIRCUIT_STEP_EVENTS.GATE_GRABBED, (gate, globalPosition) => {
      this.emit(CIRCUIT_EVENTS.OPERATION_GRABBED, gate, globalPosition);
    });
  }

  private onGateSnapToDropzone() {
    this.redrawDropzoneInputAndOutputWires();
    this.updateSwapConnections();
    this.updateGateConnections();
  }

  private redrawDropzoneInputAndOutputWires() {
    for (let wireIndex = 0; wireIndex < this.wireCount; wireIndex++) {
      let wireType = WireType.Classical;

      this.steps.forEach((each) => {
        const dropzone = each.fetchDropzone(wireIndex);

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

    // this.emit("gateSnapToDropzone", this, circuitStep, dropzone);
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

  update(): void {
    const activeStepIndex = this.activeStepIndex;
    if (activeStepIndex == null) {
      throw new Error("activeStepIndex == null");
    }

    this.removeEmptySteps();
    this.appendMinimumSteps();
    this.removeUnusedUpperWires();
    this.updateSwapConnections();
    this.updateGateConnections();

    this.stepAt(activeStepIndex).activate();
    this.markerManager.update(this.steps);
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

  private get emptySteps(): CircuitStep[] {
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

    this.markerManager.update(this.steps);
  }

  private updateSwapConnections() {
    this.steps.forEach((each) => {
      each.updateSwapConnections();
    });
  }

  private updateGateConnections() {
    this.steps.forEach((each) => {
      each.updateControlledUConnections();
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
    const cols: string[] = [];
    for (const each of this.steps) {
      cols.push(each.toJSON());
    }
    return `{"cols":[${cols.join(",")}]}`;
  }

  toString() {
    const output = Array(this.occupiedDropzoneCount * 2)
      .fill("")
      .map((_, i) => {
        if (i % 2 == 0) {
          return `${i / 2}: ───`;
        } else {
          return "";
        }
      });

    this.steps.forEach((step) => {
      step.dropzones.forEach((dropzone, qubitIndex) => {
        if (qubitIndex < this.occupiedDropzoneCount) {
          const gate = dropzone.operation;

          if (gate) {
            const gateLabel = dropzone.operation.label;
            // gateLabel は 1 文字または 2 文字になる。
            // このため、1 文字の場合は 2 文字分のスペースを確保する。
            if (gateLabel.length == 1) {
              output[qubitIndex * 2] += `${gateLabel}────`;
            } else {
              output[qubitIndex * 2] += `${gateLabel}───`;
            }
          } else {
            output[qubitIndex * 2] += `─────`;
          }
        }
      });
    });

    return output.join("\n");
  }

  private emitOnStepHoverSignal(circuitStep: CircuitStep) {
    this.markerManager.update(this.steps);
    this.emit("stepHover", this, circuitStep);
  }

  /**
   * Deactivates all other {@link CircuitStep}s except for the specified {@link CircuitStep}.
   */
  private activateStep(circuitStep: CircuitStep) {
    this.steps.forEach((each: CircuitStep) => {
      if (each !== circuitStep) {
        if (each.isActive()) {
          each.deactivate();
        }
        // this.markerManager.hideMarker(index);
      } else {
        // this.markerManager.activateMarker(index);
      }
    });
    this.markerManager.update(this.steps);

    this.emit(CIRCUIT_EVENTS.ACTIVATE_STEP, circuitStep);
  }
}
