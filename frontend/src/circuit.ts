import { CircuitStep } from "./circuit-step";
import { Container } from "pixi.js";
import { List } from "@pixi/ui";
import { QubitCount, WireType } from "./types";
import { MAX_QUBIT_COUNT, MIN_QUBIT_COUNT } from "./constants";
import { CIRCUIT_EVENTS, CIRCUIT_STEP_EVENTS } from "./events";
import { CircuitStepMarkerManager } from "./circuit-step-marker-manager";

/**
 * Represents the options for a {@link Circuit}.
 */
export interface CircuitOptions {
  minWireCount: number;
  stepCount: number;
}

/**
 * Represents a quantum circuit that holds multiple {@link CircuitStep}s.
 */
export class Circuit extends Container {
  private minWireCount: number;
  private maxWireCount: QubitCount = MAX_QUBIT_COUNT;
  private minStepCount: number;
  private stepList: List;
  private markerManager: CircuitStepMarkerManager;

  /**
   * Returns an array of {@link CircuitStep}s in the {@link Circuit}.
   */
  get steps(): CircuitStep[] {
    return this.stepList.children as CircuitStep[];
  }

  /**
   * Gets the index of the active (currently selected) step.
   * Returns null if no step is active.
   */
  get activeStepIndex() {
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.fetchStep(i);
      if (step.isActive) {
        return i;
      }
    }

    return null;
  }

  /**
   * Returns the number of wires (bits) in the {@link Circuit}.
   */
  get wireCount() {
    let wireCount = this.minWireCount;
    wireCount = this.fetchStep(0).wireCount;

    this.steps.forEach((each) => {
      if (each.wireCount !== wireCount) {
        throw new Error("All steps must have the same number of wires");
      }
    });

    return wireCount;
  }

  /**
   * Returns the highest occupied qubit number in the circuit.
   * This calculates the highest qubit number used across all steps in the circuit.
   * If the circuit is empty, it returns the minimum qubit count (MIN_QUBIT_COUNT).
   */
  get highestOccupiedQubitNumber(): QubitCount {
    const qubitNumber = Math.max(
      ...this.steps.map((each) => {
        return each.highestOccupiedQubitNumber;
      })
    );

    if (qubitNumber == 0) {
      return MIN_QUBIT_COUNT;
    }

    return qubitNumber as QubitCount;
  }

  /**
   * Returns a new {@link Circuit} instance.
   *
   * @param {CircuitOptions} options - The options for the Circuit.
   */
  constructor(options: CircuitOptions) {
    super();

    this.minWireCount = options.minWireCount;
    this.minStepCount = options.stepCount;

    // TODO: レスポンシブ対応。モバイルではステップを縦に並べる
    this.stepList = new List({
      type: "horizontal",
    });
    this.addChild(this.stepList);

    for (let i = 0; i < options.stepCount; i++) {
      this.appendStep();
    }

    this.markerManager = new CircuitStepMarkerManager({ steps: this.steps });
    this.addChild(this.markerManager);

    this.markerManager.zIndex = 1;
    this.sortableChildren = true;
  }

  fetchStep(index: number) {
    if (index < 0 || index >= this.steps.length) {
      throw new Error(`Step index out of bounds: ${index}`);
    }

    return this.steps[index];
  }

  maybeAppendWire() {
    const firstStepWireCount = this.fetchStep(0).wireCount;

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

  private appendStep(wireCount = this.minWireCount) {
    const circuitStep = new CircuitStep(wireCount);
    this.stepList.addChild(circuitStep);

    circuitStep.on(
      CIRCUIT_STEP_EVENTS.OPERATION_SNAPPED,
      this.onGateSnapToDropzone,
      this
    );
    circuitStep.on(
      CIRCUIT_STEP_EVENTS.HOVERED,
      this.emitOnStepHoverSignal,
      this
    );
    circuitStep.on(CIRCUIT_STEP_EVENTS.ACTIVATED, this.activateStep, this);
    circuitStep.on(
      CIRCUIT_STEP_EVENTS.OPERATION_GRABBED,
      (gate, globalPosition) => {
        this.emit(CIRCUIT_EVENTS.OPERATION_GRABBED, gate, globalPosition);
      }
    );
  }

  private onGateSnapToDropzone() {
    this.redrawDropzoneInputAndOutputWires();
    this.updateConnections();
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

  update(): void {
    const activeStepIndex = this.activeStepIndex;
    if (activeStepIndex == null) {
      throw new Error("activeStepIndex == null");
    }

    this.removeEmptySteps();
    this.appendMinimumSteps();
    this.removeUnusedUpperWires();
    this.updateConnections();

    this.fetchStep(activeStepIndex).activate();
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
        each.removeLastDropzone();
      });
    }
  }

  private updateConnections() {
    this.steps.forEach((each) => {
      each.updateConnections();
    });
  }

  private isLastWireUnused() {
    return this.steps.every((each) => !each.hasOperationAt(each.wireCount - 1));
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
    const output = Array(this.highestOccupiedQubitNumber * 2)
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
        if (qubitIndex < this.highestOccupiedQubitNumber) {
          const operation = dropzone.operation;

          if (operation) {
            const operationLabel = dropzone.operation.label;
            // label は 1 文字または 2 文字になる。
            // このため、1 文字の場合は 2 文字分のスペースを確保する。
            if (operationLabel.length == 1) {
              output[qubitIndex * 2] += `${operationLabel}────`;
            } else {
              output[qubitIndex * 2] += `${operationLabel}───`;
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
        if (each.isActive) {
          each.deactivate();
        }
        // this.markerManager.hideMarker(index);
      } else {
        // this.markerManager.activateMarker(index);
      }
    });
    this.markerManager.update(this.steps);

    this.emit(CIRCUIT_EVENTS.CIRCUIT_STEP_ACTIVATED, circuitStep);
  }
}
