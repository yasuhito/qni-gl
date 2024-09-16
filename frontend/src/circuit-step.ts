import { CIRCUIT_STEP_EVENTS, DROPZONE_EVENTS } from "./events";
import { DropzoneList } from "./dropzone-list";
import { CircuitStepState } from "./circuit-step-state";
import { Container } from "pixi.js";
import { ControlGate } from "./control-gate";
import { Dropzone } from "./dropzone";
import { Operation } from "./operation";
import { SwapGate } from "./swap-gate";
import { XGate } from "./x-gate";
import { groupBy, need } from "./util";
import { SerializedOperation } from "./types";
import { HGate } from "./h-gate";

/**
 * Represents a single step in a quantum circuit.
 *
 * This class manages a collection of Dropzones, each corresponding to a qubit in the circuit.
 * It handles the placement and interaction of operations within the step, including
 * special operations like swap gates and controlled operations.
 */
export class CircuitStep extends Container {
  /** The padding space around the dropzones within the circuit step. */
  static readonly PADDING = Dropzone.sizeInPx / 2;

  private dropzoneList!: DropzoneList;
  private state!: CircuitStepState;

  /**
   *  Returns the number of wires (qubits) in this circuit step.
   */
  get wireCount() {
    return this.dropzoneList.size;
  }

  /**
   * Returns all {@link Dropzone}s in this circuit step.
   */
  get dropzones(): Dropzone[] {
    return this.dropzoneList.all;
  }

  /**
   *  Returns true if all dropzones in this circuit step are empty (have no operations).
   */
  get isEmpty(): boolean {
    return this.dropzones.every((each) => each.operation === null);
  }

  /**
   * Returns the number of the highest qubit with an operation placed on it.
   * Qubit numbers start from 1.
   * Returns 0 if all qubits are empty (no operations placed).
   *
   * Examples:
   * - [X, _, H, _] => returns 3 (3rd qubit is the last with an operation)
   * - [_, _, _, X] => returns 4 (4th qubit is the last with an operation)
   * - [H, _, _, _] => returns 1 (only the 1st qubit has an operation)
   * - [_, _, _, _] => returns 0 (all qubits are empty)
   */
  get highestOccupiedQubitNumber() {
    return this.dropzones.reduce(
      (maxIndex, dropzone, currentIndex) =>
        dropzone.isOccupied() ? currentIndex + 1 : maxIndex,
      0
    );
  }

  /**
   * Checks if the pointer is currently over this circuit step.
   *
   * Returns true if the pointer is over the circuit step, false otherwise.
   */
  get isHovered(): boolean {
    return this.state.isHover();
  }

  /**
   * Checks if this circuit step is currently in an active state.
   *
   * Returns true if the circuit step is active, false otherwise.
   */
  get isActive(): boolean {
    return this.state.isActive();
  }

  private get occupiedDropzones() {
    return this.dropzoneList.occupied;
  }

  private get operations(): Operation[] {
    return this.occupiedDropzones.map((each) => each.operation as Operation);
  }

  private get controlBits(): number[] {
    return this.dropzoneList
      .filterByOperationType(ControlGate)
      .map((dropzone) => this.qubitNumberOf(dropzone));
  }

  /**
   * Creates a new CircuitStep instance.
   *
   * @param wireCount The number of wires (qubits) in this circuit step.
   */
  constructor(wireCount: number) {
    super();

    this.initializeState();
    this.initializeDropzoneList();
    this.createDropzones(wireCount);
    this.setupEventListeners();
  }

  private initializeState(): void {
    this.state = new CircuitStepState();
  }

  private initializeDropzoneList(): void {
    this.dropzoneList = new DropzoneList({
      padding: CircuitStep.PADDING,
    });
    this.addChild(this.dropzoneList);
  }

  private createDropzones(wireCount: number): void {
    for (let i = 0; i < wireCount; i++) {
      this.appendNewDropzone();
    }
  }

  private setupEventListeners(): void {
    this.on("pointerover", this.maybeSetHoverState, this)
      .on("pointerout", this.maybeSetIdleState, this)
      .on("pointerdown", this.activate, this);
    this.eventMode = "static";
  }

  /**
   * Retrieves a Dropzone at the specified index.
   *
   * @param index The index of the Dropzone to fetch.
   *
   * This method returns the Dropzone at the specified index.
   * If the index is out of bounds, it throws an error.
   */
  fetchDropzone(index: number) {
    return this.dropzoneList.fetch(index);
  }

  /**
   * Checks if an operation is present at the specified qubit index.
   *
   * @param index The index of the qubit to check.
   *
   * This method returns true if there is an operation placed on the dropzone
   * at the specified qubit index, and false otherwise.
   * If the qubit index is out of bounds, it will throw an error.
   */
  hasOperationAt(index: number) {
    const dropzone = this.fetchDropzone(index);

    return dropzone.isOccupied();
  }

  /**
   * Appends a new Dropzone to the end of the circuit step.
   * The method returns the newly created and appended Dropzone.
   */
  appendNewDropzone() {
    const dropzone = this.dropzoneList.append();

    dropzone.on(DROPZONE_EVENTS.OPERATION_SNAPPED, this.onDropzoneSnap, this);
    dropzone.on(
      DROPZONE_EVENTS.OPERATION_GRABBED,
      (operation, globalPosition) => {
        this.emit(
          CIRCUIT_STEP_EVENTS.OPERATION_GRABBED,
          operation,
          globalPosition
        );
      }
    );

    return dropzone;
  }

  /**
   * Removes the last Dropzone from the circuit step.
   *
   * This method removes the Dropzone at the end of the dropzone list.
   * If the list is already empty, this method has no effect.
   */
  removeLastDropzone() {
    this.dropzoneList.removeLast();
  }

  /**
   * Activates this circuit step.
   *
   * If the step is already active, this method has no effect.
   */
  activate() {
    if (this.isActive) {
      return;
    }

    this.state.setActive();
    this.emit(CIRCUIT_STEP_EVENTS.ACTIVATED, this);
  }

  /**
   * Deactivates this circuit step.
   *
   * Sets the state of the circuit step to idle.
   */
  deactivate() {
    this.state.setIdle();
  }

  /**
   * Updates the connections between operations in the circuit step.
   * This method handles the visual connections for swap operations and controlled operations.
   */
  updateConnections(): void {
    this.updateSwapConnections();
    this.updateControlledUConnections();
  }

  /**
   * Serializes the current state of the circuit step into a JSON-compatible format.
   *
   * This method converts the operations in the circuit step into a serialized representation,
   * including information about the type of operation and target qubits. For controlled operations,
   * it also includes control qubits.
   *
   * Returns an array of serialized operations, each represented as an object.
   */
  serialize(): SerializedOperation[] {
    const result: SerializedOperation[] = [];
    const operations = this.operations;

    for (const [operationClass, sameOps] of groupBy(
      operations,
      (op) => op.constructor
    )) {
      if (
        operationClass === ControlGate &&
        operations.some((op) => op instanceof XGate || op instanceof HGate)
      ) {
        continue; // Skip ControlGate if X or H gate is present
      }

      // const sameOperations = sameOps as Operation[];
      const targetBits = sameOps.map((each) =>
        this.dropzoneList.findIndexOf(each)
      );
      const operation = sameOps[0];
      const serializedGate =
        operation instanceof XGate || operation instanceof HGate
          ? operation.serialize(targetBits, this.controlBits)
          : operation.serialize(targetBits);
      result.push(serializedGate);
    }

    return result;
  }

  toJSON() {
    const jsons = this.dropzones.map((each) => each.toJSON());
    return `[${jsons.join(",")}]`;
  }

  private qubitNumberOf(dropzone: Dropzone): number {
    const num = this.dropzones.indexOf(dropzone);
    need(num !== -1, "dropzone not found.");

    return num;
  }

  private updateSwapConnections(): void {
    const swapDropzones = this.dropzoneList.filterByOperationType(SwapGate);
    const swapBits = swapDropzones.map((each) => this.qubitNumberOf(each));

    if (swapDropzones.length !== 2) {
      for (const dropzone of this.dropzones) {
        dropzone.swapConnectTop = false;
        dropzone.swapConnectBottom = false;
      }
    } else {
      const [minBit, maxBit] = [Math.min(...swapBits), Math.max(...swapBits)];

      for (const dropzone of this.dropzones) {
        const bit = this.qubitNumberOf(dropzone);
        dropzone.swapConnectTop = bit > minBit && bit <= maxBit;
        dropzone.swapConnectBottom = bit >= minBit && bit < maxBit;
      }
    }

    this.applyConnectionUpdates();
  }

  private updateControlledUConnections(): void {
    const controllableDropzones = this.controllableDropzones();
    const controlDropzones =
      this.dropzoneList.filterByOperationType(ControlGate);
    const allControlBits = controlDropzones.map((dz) => this.qubitNumberOf(dz));

    const activeControlBits = allControlBits.slice(0, controlDropzones.length);
    const controllableBits = controllableDropzones.map((dz) =>
      this.qubitNumberOf(dz)
    );
    const activeOperationBits = activeControlBits.concat(controllableBits);

    if (activeControlBits.length > 0 && activeOperationBits.length > 0) {
      const [minBit, maxBit] = [
        Math.min(...activeOperationBits),
        Math.max(...activeOperationBits),
      ];

      for (const dropzone of this.dropzones) {
        const bit = this.qubitNumberOf(dropzone);
        dropzone.controlConnectTop = bit > minBit && bit <= maxBit;
        dropzone.controlConnectBottom = bit >= minBit && bit < maxBit;
      }

      // Set controls for XGates
      for (const each of controllableDropzones) {
        need(
          each.operation instanceof XGate || each.operation instanceof HGate,
          "operation is not XGate or HGate"
        );
        each.operation.controls = allControlBits;
      }
    } else {
      for (const dropzone of this.dropzones) {
        dropzone.controlConnectTop = false;
        dropzone.controlConnectBottom = false;
      }
    }

    this.applyConnectionUpdates();
  }

  private applyConnectionUpdates(): void {
    for (const dropzone of this.dropzones) {
      dropzone.connectTop =
        dropzone.swapConnectTop || dropzone.controlConnectTop;
      dropzone.connectBottom =
        dropzone.swapConnectBottom || dropzone.controlConnectBottom;
    }
  }

  private controllableDropzones(): Dropzone[] {
    return this.dropzoneList
      .filterByOperationType(XGate)
      .concat(this.dropzoneList.filterByOperationType(HGate));
  }

  private onDropzoneSnap(dropzone: Dropzone) {
    this.emit(CIRCUIT_STEP_EVENTS.OPERATION_SNAPPED, this, dropzone);
  }

  private maybeSetHoverState() {
    if (this.state.isIdle()) {
      this.state.setHover();
    }
    this.emit(CIRCUIT_STEP_EVENTS.HOVERED, this);
  }

  private maybeSetIdleState() {
    if (this.state.isHover()) {
      this.state.setIdle();
    }
  }
}
