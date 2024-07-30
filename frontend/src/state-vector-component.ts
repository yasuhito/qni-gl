import * as PIXI from "pixi.js";
import { Container } from "pixi.js";
import { QubitCircle } from "./qubit-circle";
import { need } from "./util";
import { StateVectorRenderer } from "./state-vector-renderer";
import { STATE_VECTOR_EVENTS } from "./state-vector-events";

/**
 * Represents a component that visualizes the state vector.
 * @noInheritDoc
 */
export class StateVectorComponent extends Container {
  private _qubitCount = 0;
  private maxQubitCount: number;
  private renderer: StateVectorRenderer;

  set qubitCount(value: number) {
    need(
      value <= this.maxQubitCount,
      "qubitCount must not exceed maxQubitCount. Attempted to set {qubitCount}, but maxQubitCount is {maxQubitCount}.",
      { value, maxQubitCount: this.maxQubitCount }
    );

    if (this._qubitCount === value) return;

    this._qubitCount = value;
    this.updateStateVector();
  }

  get qubitCount() {
    return this._qubitCount;
  }

  get qubitCircleCount() {
    return Math.pow(2, this.qubitCount);
  }

  get visibleQubitCircleIndices() {
    return this.renderer.visibleQubitCircleIndices;
  }

  constructor(
    qubitCount: number,
    maxQubitCount: number,
    viewport: PIXI.Rectangle
  ) {
    super();

    this.renderer = new StateVectorRenderer(this, qubitCount, viewport);
    this.maxQubitCount = maxQubitCount;
    this.qubitCount = qubitCount;
    this.setViewport(viewport);
  }

  setViewport(viewport: PIXI.Rectangle) {
    const visibleQubitCirclesChanged = this.renderer.setViewport(viewport);

    if (visibleQubitCirclesChanged) {
      this.emit(
        STATE_VECTOR_EVENTS.VISIBLE_QUBIT_CIRCLES_CHANGED,
        this.renderer.visibleQubitCircleIndices
      );
    }
  }

  qubitCircleAt(index: number): QubitCircle | undefined {
    return this.renderer.qubitCircleAt(index);
  }

  private updateStateVector() {
    this.renderer.updateQubitCircleLayout(this.qubitCount);
    this.renderer.draw();
    this.emit(STATE_VECTOR_EVENTS.QUBIT_COUNT_CHANGED, this.qubitCount);
  }
}
