import { CircuitStep } from "./circuit-step";
import { Container, Point } from "pixi.js";
import { List } from "@pixi/ui";
import { QubitCount, WireType } from "./types";
import { MAX_QUBIT_COUNT, MIN_QUBIT_COUNT } from "./constants";
import {
  CIRCUIT_STEP_EVENTS,
  DROPZONE_EVENTS,
  OPERATION_EVENTS,
} from "./events";
import { CircuitStepMarkerManager } from "./circuit-step-marker-manager";
import { OperationComponent } from "./operation-component";
import { ControlGate } from "./control-gate";
import { SwapGate } from "./swap-gate";
import { Controllable, isControllable } from "./controllable-mixin";
import { Operation } from "./operation";

type CircuitJson = {
  cols: unknown[][];
};

/**
 * Represents the options for a {@link Circuit}.
 */
export interface CircuitOptions {
  minWireCount: number;
  stepCount: number;
}

export interface CircuitCellPosition {
  stepIndex: number;
  qubitIndex: number;
}

export interface ClipboardOperation {
  label: string;
  relativeStep: number;
  relativeQubit: number;
}

export interface CircuitClipboard {
  operations: ClipboardOperation[];
  width: number;
  height: number;
}

interface PositionedOperation {
  operation: OperationComponent;
  position: CircuitCellPosition;
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
  private stepMarkerUpdatesEnabled = true;

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
      }),
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

  /**
   * ペーストしたゲートの相対位置を保ったまま、回路表示を更新する。
   */
  updateAfterPaste(
    preservedEmptySteps = new Set<CircuitStep>(this.steps)
  ): void {
    const activeStepIndex = this.activeStepIndex;

    this.removeEmptyStepsExcept(preservedEmptySteps);
    this.appendMinimumSteps();
    this.removeUnusedUpperWires();
    this.redrawDropzoneInputAndOutputWires();
    this.updateConnections();

    if (activeStepIndex !== null) {
      this.fetchStep(
        Math.min(activeStepIndex, this.steps.length - 1)
      ).activate();
    }
    this.markerManager.update(this.steps);
  }

  /**
   * ペースト基準から外れた空ステップだけを回路から取り除く。
   */
  removeEmptyStep(step: CircuitStep): void {
    const stepIndex = this.steps.indexOf(step);
    if (stepIndex === -1 || !step.isEmpty) {
      return;
    }

    step.destroy();
    this.stepList.arrangeChildren();
    this.appendMinimumSteps();
    this.redrawDropzoneInputAndOutputWires();
    this.updateConnections();

    this.fetchStep(Math.min(stepIndex, this.steps.length - 1)).activate();
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

  setStepMarkerUpdatesEnabled(enabled: boolean): void {
    this.stepMarkerUpdatesEnabled = enabled;

    this.steps.forEach((step) => {
      step.setHoverEnabled(enabled);
    });
    this.markerManager.update(this.steps);
  }

  serialize() {
    return this.steps.map((each) => each.serialize());
  }

  /**
   * 配置済みゲートのステップ番号と量子ビット番号を返す。
   */
  findOperationPosition(
    operation: OperationComponent,
  ): CircuitCellPosition | null {
    for (let stepIndex = 0; stepIndex < this.steps.length; stepIndex++) {
      const step = this.fetchStep(stepIndex);
      for (
        let qubitIndex = 0;
        qubitIndex < step.dropzones.length;
        qubitIndex++
      ) {
        if (step.fetchDropzone(qubitIndex).operation === operation) {
          return { stepIndex, qubitIndex };
        }
      }
    }

    return null;
  }

  /**
   * 選択中ゲートから、相対位置を保持したクリップボードデータを作る。
   */
  createClipboardFromOperations(
    operations: OperationComponent[],
  ): CircuitClipboard | null {
    const positionedOperations = this.positionedOperations(operations);

    if (positionedOperations.length === 0) {
      return null;
    }

    const minStep = Math.min(
      ...positionedOperations.map((entry) => entry.position.stepIndex),
    );
    const maxStep = Math.max(
      ...positionedOperations.map((entry) => entry.position.stepIndex),
    );
    const minQubit = Math.min(
      ...positionedOperations.map((entry) => entry.position.qubitIndex),
    );
    const maxQubit = Math.max(
      ...positionedOperations.map((entry) => entry.position.qubitIndex),
    );

    return {
      operations: positionedOperations.map(({ operation, position }) => ({
        label: this.operationJsonLabel(operation),
        relativeStep: position.stepIndex - minStep,
        relativeQubit: position.qubitIndex - minQubit,
      })),
      width: maxStep - minStep + 1,
      height: maxQubit - minQubit + 1,
    };
  }

  /**
   * 選択ゲート群の右端ステップと最上段量子ビットを、ペースト基準として返す。
   */
  findClipboardAnchorForOperations(
    operations: OperationComponent[],
  ): CircuitCellPosition | null {
    const positionedOperations = this.positionedOperations(operations);
    if (positionedOperations.length === 0) {
      return null;
    }

    return {
      stepIndex: Math.max(
        ...positionedOperations.map((entry) => entry.position.stepIndex),
      ),
      qubitIndex: Math.min(
        ...positionedOperations.map((entry) => entry.position.qubitIndex),
      ),
    };
  }

  /**
   * Qniが保持する接続情報から、指定ゲートと同じ構造に属するゲートを返す。
   */
  connectedOperationsFor(
    operation: OperationComponent,
  ): OperationComponent[] {
    const position = this.findOperationPosition(operation);
    if (position === null) {
      return [];
    }

    const step = this.fetchStep(position.stepIndex);
    const operations = step.dropzones.flatMap((dropzone) =>
      dropzone.operation === null ? [] : [dropzone.operation],
    );

    if (operation instanceof SwapGate) {
      const swapOperations = operations.filter(
        (candidate) => candidate instanceof SwapGate,
      );

      return swapOperations.length === 2 ? swapOperations : [operation];
    }

    if (isControllable(operation) && operation.controls.length > 0) {
      return operations.filter((candidate) => {
        if (candidate instanceof ControlGate) {
          const candidatePosition = this.findOperationPosition(candidate);

          return (
            candidatePosition !== null &&
            operation.controls.includes(candidatePosition.qubitIndex)
          );
        }

        return (
          isControllable(candidate) &&
          candidate.controls.some((control) =>
            operation.controls.includes(control),
          )
        );
      });
    }

    if (operation instanceof ControlGate) {
      const controllableOperations = operations.filter(
        (candidate): candidate is Operation & Controllable =>
          isControllable(candidate),
      );
      const targetsControlledByOperation = controllableOperations.filter(
        (candidate) =>
          candidate.controls.includes(position.qubitIndex),
      );

      if (targetsControlledByOperation.length > 0) {
        const connectedControlBits = new Set(
          targetsControlledByOperation.flatMap((target) => target.controls),
        );

        return operations.filter((candidate) => {
          if (candidate instanceof ControlGate) {
            const candidatePosition = this.findOperationPosition(candidate);

            return (
              candidatePosition !== null &&
              connectedControlBits.has(candidatePosition.qubitIndex)
            );
          }

          return (
            isControllable(candidate) &&
            candidate.controls.some((control) =>
              connectedControlBits.has(control),
            )
          );
        });
      }

      const controlOperations = operations.filter(
        (candidate) => candidate instanceof ControlGate,
      );

      return controlOperations.length > 1 ? controlOperations : [operation];
    }

    return [operation];
  }

  /**
   * activeCell の右隣にクリップボード内容をステップ挿入し、追加したゲートを返す。
   */
  pasteClipboardAt(
    activeCell: CircuitCellPosition,
    clipboard: CircuitClipboard,
  ): OperationComponent[] {
    if (clipboard.operations.length === 0) {
      return [];
    }

    const insertStartStep = activeCell.stepIndex + 1;
    this.ensureWireCount(activeCell.qubitIndex + clipboard.height);

    for (let i = 0; i < clipboard.width; i++) {
      this.insertStepAt(insertStartStep + i);
    }

    const pastedOperations: OperationComponent[] = [];
    for (const clipboardOperation of clipboard.operations) {
      const operation = CircuitStep.createOperationFromLabel(
        clipboardOperation.label,
      );
      if (operation === null) {
        throw new Error(
          `Unknown operation label in clipboard: ${clipboardOperation.label}`,
        );
      }

      const step = this.fetchStep(
        insertStartStep + clipboardOperation.relativeStep,
      );
      const dropzone = step.fetchDropzone(
        activeCell.qubitIndex + clipboardOperation.relativeQubit,
      );
      dropzone.assign(operation);
      pastedOperations.push(operation);
    }

    this.updateConnections();
    this.redrawDropzoneInputAndOutputWires();

    return pastedOperations;
  }

  /**
   * Circuitインスタンスの状態をJSON文字列としてシリアライズする
   * @returns 回路全体のJSON文字列
   */
  toJSON(preserveEmptySteps = false) {
    const cols: string[] = [];
    for (const each of this.steps) {
      if (preserveEmptySteps || !each.isEmpty) {
        cols.push(each.toJSON());
      }
    }
    return `{"cols":[${cols.join(",")}]}`;
  }

  /**
   * JSONデータからCircuitのインスタンスの状態を復元する
   * @param jsonString 回路全体のJSONデータ文字列
   */
  fromJSON(jsonString: string, preserveEmptySteps = false): void {
    const circuitData = JSON.parse(jsonString) as CircuitJson;

    this.steps.forEach((step) => step.destroy());
    this.stepList.removeChildren();

    circuitData.cols.forEach((stepJson) => {
      const circuitStep = CircuitStep.fromJSON(stepJson);
      this.stepList.addChild(circuitStep);

      circuitStep.on(OPERATION_EVENTS.SNAPPED, this.onGateSnapToDropzone, this);
      circuitStep.on(CIRCUIT_STEP_EVENTS.HOVERED, this.updateStepMarker, this);
      circuitStep.on(CIRCUIT_STEP_EVENTS.ACTIVATED, this.activateStep, this);
      circuitStep.on(OPERATION_EVENTS.GRABBED, this.emitOnGateGrabSignal, this);
      circuitStep.on(DROPZONE_EVENTS.SELECTED, this.emitDropzoneSelected, this);
    });

    if (this.steps.length > 0) {
      this.fetchStep(0).activate();
    }

    if (preserveEmptySteps) {
      this.updateAfterPaste();
    } else {
      this.update();
    }
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

  /**
   * Inserts a new {@link CircuitStep} at the specified index.
   *
   * @param {number} index - The index at which to insert the new step.
   */
  insertStepAt(index: number): CircuitStep {
    if (index < 0 || index > this.steps.length) {
      throw new Error(`Index out of bounds: ${index}`);
    }

    const wireCount =
      this.steps.length > 0 ? this.steps[0].wireCount : this.minWireCount;
    const circuitStep = new CircuitStep(wireCount);
    this.stepList.addChildAt(circuitStep, index);

    circuitStep.on(OPERATION_EVENTS.SNAPPED, this.onGateSnapToDropzone, this);
    circuitStep.on(CIRCUIT_STEP_EVENTS.HOVERED, this.updateStepMarker, this);
    circuitStep.on(CIRCUIT_STEP_EVENTS.ACTIVATED, this.activateStep, this);
    circuitStep.on(OPERATION_EVENTS.GRABBED, this.emitOnGateGrabSignal, this);
    circuitStep.on(DROPZONE_EVENTS.SELECTED, this.emitDropzoneSelected, this);

    this.markerManager.update(this.steps);

    return circuitStep;
  }

  private appendStep(wireCount = this.minWireCount) {
    const circuitStep = new CircuitStep(wireCount);
    this.stepList.addChild(circuitStep);

    circuitStep.on(OPERATION_EVENTS.SNAPPED, this.onGateSnapToDropzone, this);
    circuitStep.on(CIRCUIT_STEP_EVENTS.HOVERED, this.updateStepMarker, this);
    circuitStep.on(CIRCUIT_STEP_EVENTS.ACTIVATED, this.activateStep, this);
    circuitStep.on(OPERATION_EVENTS.GRABBED, this.emitOnGateGrabSignal, this);
    circuitStep.on(DROPZONE_EVENTS.SELECTED, this.emitDropzoneSelected, this);

    // 復元された各オペレーションにインタラクティブ性を設定する
    circuitStep.dropzones.forEach((dropzone) => {
      if (dropzone.operation) {
        dropzone.operation.eventMode = "static";
      }
    });
  }

  /**
   * ペースト先に必要な量子ビット数まで、全ステップへドロップゾーンを追加する。
   */
  private ensureWireCount(requiredWireCount: number): void {
    while (this.wireCount < requiredWireCount) {
      const beforeWireCount = this.wireCount;
      this.maybeAppendWire();
      if (this.wireCount === beforeWireCount) {
        throw new Error(
          `Required wire count exceeds maximum: ${requiredWireCount}`,
        );
      }
    }
  }

  private operationJsonLabel(operation: OperationComponent): string {
    const maybeJsonable = operation as OperationComponent & {
      toJSON?: () => string;
    };

    if (typeof maybeJsonable.toJSON !== "function") {
      throw new Error(`Operation is not JSON serializable: ${operation}`);
    }

    return JSON.parse(maybeJsonable.toJSON());
  }

  private positionedOperations(
    operations: OperationComponent[],
  ): PositionedOperation[] {
    return operations
      .map((operation) => ({
        operation,
        position: this.findOperationPosition(operation),
      }))
      .filter(
        (
          entry,
        ): entry is {
          operation: OperationComponent;
          position: CircuitCellPosition;
        } => entry.position !== null,
      );
  }

  private onGateSnapToDropzone() {
    this.redrawDropzoneInputAndOutputWires();
    this.updateConnections();
  }

  private updateStepMarker() {
    if (!this.stepMarkerUpdatesEnabled) {
      return;
    }

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

    this.emit(CIRCUIT_STEP_EVENTS.ACTIVATED, circuitStep);
  }

  private emitOnGateGrabSignal(
    gate: OperationComponent,
    globalPosition: Point,
    additiveSelection = false,
  ) {
    if (additiveSelection) {
      this.emit(OPERATION_EVENTS.GRABBED, gate, globalPosition, true);
      return;
    }

    this.emit(OPERATION_EVENTS.GRABBED, gate, globalPosition);
  }

  private emitDropzoneSelected(
    circuitStep: CircuitStep,
    dropzone: unknown,
    additiveSelection = false,
  ) {
    if (additiveSelection) {
      this.emit(DROPZONE_EVENTS.SELECTED, circuitStep, dropzone, true);
      return;
    }

    this.emit(DROPZONE_EVENTS.SELECTED, circuitStep, dropzone);
  }

  redrawDropzoneInputAndOutputWires() {
    for (let wireIndex = 0; wireIndex < this.wireCount; wireIndex++) {
      let wireType = WireType.Classical;

      this.steps.forEach((each) => {
        const dropzone = each.fetchDropzone(wireIndex);

        if (dropzone.hasWriteGate()) {
          dropzone.inputWireType = wireType;
          wireType = WireType.Quantum;
          dropzone.outputWireType = wireType;
        } else if (dropzone.hasMeasurementGate()) {
          dropzone.inputWireType = wireType;
          wireType = WireType.Classical;
          dropzone.outputWireType = wireType;
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
    this.stepList.arrangeChildren();
  }

  private removeEmptyStepsExcept(preservedSteps: Set<CircuitStep>): void {
    for (const each of this.emptySteps) {
      if (!preservedSteps.has(each)) {
        each.destroy();
      }
    }
    this.stepList.arrangeChildren();
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

  updateConnections() {
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
