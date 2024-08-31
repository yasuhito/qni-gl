import { CircuitStep } from "./circuit-step";
import { Container, Point } from "pixi.js";
import { List } from "@pixi/ui";
import { QubitCount, WireType } from "./types";
import { MAX_QUBIT_COUNT, MIN_QUBIT_COUNT } from "./constants";
import { CIRCUIT_EVENTS, CIRCUIT_STEP_EVENTS } from "./events";
import { CircuitStepMarkerManager } from "./circuit-step-marker-manager";
import { OperationComponent } from "./operation-component";

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
  private minWireCount = 1;
  private maxWireCount: QubitCount = MAX_QUBIT_COUNT;
  private minStepCount = 5;
  private stepList: List;
  private markerManager: CircuitStepMarkerManager;

  /**
   * Returns an array of {@link CircuitStep}s in the {@link Circuit}.
   */
  get steps(): CircuitStep[] {
    return this.stepList.children as CircuitStep[];
  }

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
    if (this.steps.length == 0) {
      return this.minWireCount;
    }

    const wireCount = this.fetchStep(0).wireCount;

    this.steps.forEach((each) => {
      if (each.wireCount !== wireCount) {
        throw new Error("All steps must have the same number of wires");
      }
    });

    return wireCount;
  }

  get highestOccupiedQubitNumber(): QubitCount {
    const qubitNumber = Math.max(
      ...this.steps.map((each) => {
        return each.highestOccupiedQubitNumber;
      })
    );

    if (qubitNumber === 0) {
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

    this.minStepCount = options.stepCount;
    this.minWireCount = options.minWireCount;

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
  }

  /**
   * Retrieves the {@link CircuitStep} at the specified index.
   */
  fetchStep(index: number) {
    if (index < 0 || index >= this.steps.length) {
      throw new Error(`Step index out of bounds: ${index}`);
    }

    return this.steps[index];
  }

  update(): void {
    const activeStepIndex = this.activeStepIndex;
    if (activeStepIndex == null) {
      throw new Error("activeStepIndex == null");
    }

    this.removeEmptySteps();
    this.appendMinimumSteps();
    this.removeUnusedUpperWires();
    this.redrawDropzoneInputAndOutputWires();
    this.updateConnections();

    this.fetchStep(activeStepIndex).activate();
    this.markerManager.update(this.steps);
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

    return output.join("\n").trim();
  }

  private appendStep(wireCount = this.minWireCount) {
    const circuitStep = new CircuitStep(wireCount);
    this.stepList.addChild(circuitStep);

    circuitStep.on(
      CIRCUIT_STEP_EVENTS.OPERATION_SNAPPED,
      this.onGateSnapToDropzone,
      this
    );
    circuitStep.on(CIRCUIT_STEP_EVENTS.HOVERED, this.updateStepMarker, this);
    circuitStep.on(CIRCUIT_STEP_EVENTS.ACTIVATED, this.activateStep, this);
    circuitStep.on(
      CIRCUIT_STEP_EVENTS.OPERATION_GRABBED,
      this.emitOnGateGrabSignal,
      this
    );
  }

  private onGateSnapToDropzone() {
    this.redrawDropzoneInputAndOutputWires();
    this.updateConnections();
  }

  private updateStepMarker() {
    this.markerManager.update(this.steps);
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
      }
    });
    this.markerManager.update(this.steps);

    this.emit(CIRCUIT_EVENTS.CIRCUIT_STEP_ACTIVATED, circuitStep);
  }

  private emitOnGateGrabSignal(
    gate: OperationComponent,
    globalPosition: Point
  ) {
    this.emit(CIRCUIT_EVENTS.OPERATION_GRABBED, gate, globalPosition);
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
}
