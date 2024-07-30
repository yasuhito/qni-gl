import * as PIXI from "pixi.js";
import { Container } from "pixi.js";
import { QubitCircle } from "./qubit-circle";
import { StateVectorRenderer } from "./state-vector-renderer";
import { STATE_VECTOR_EVENTS } from "./state-vector-events";

type QubitCount = number;

class InvalidQubitCountError extends Error {
  constructor(value: QubitCount, maxQubitCount: QubitCount) {
    super(`Invalid qubit count: ${value}. Must not exceed ${maxQubitCount}.`);
    this.name = "InvalidQubitCountError";
  }
}

interface StateVectorConfig {
  initialQubitCount: QubitCount;
  maxQubitCount: QubitCount;
  viewport: PIXI.Rectangle;
}

/**
 * Represents a component that visualizes the state vector.
 * @noInheritDoc
 */
export class StateVectorComponent extends Container {
  private _qubitCount: QubitCount = 0;
  private maxQubitCount: QubitCount;
  private renderer: StateVectorRenderer;

  set qubitCount(newValue: QubitCount) {
    const validatedCount = this.validateQubitCount(newValue);

    if (this._qubitCount === validatedCount) return;

    this._qubitCount = validatedCount;
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

  constructor(config: StateVectorConfig) {
    super();

    this.maxQubitCount = config.maxQubitCount;
    this.renderer = new StateVectorRenderer(
      this,
      config.initialQubitCount,
      config.viewport
    );
    this.qubitCount = config.initialQubitCount;
    this.setViewport(config.viewport);
  }

  setViewport(viewport: PIXI.Rectangle) {
    const visibleQubitCirclesChanged = this.renderer.setViewport(viewport);

    if (visibleQubitCirclesChanged) {
      this.emitVisibleQubitCirclesChanged();
    }
  }

  qubitCircleAt(index: number): QubitCircle | undefined {
    return this.renderer.qubitCircleAt(index);
  }

  private validateQubitCount(value: QubitCount): QubitCount {
    if (value < 0 || value > this.maxQubitCount) {
      throw new InvalidQubitCountError(value, this.maxQubitCount);
    }
    return value;
  }

  private updateStateVector(): void {
    this.updateRendererLayout();
    this.redrawStateVector();
    this.notifyQubitCountChange();
  }

  private updateRendererLayout(): void {
    this.renderer.updateQubitCircleLayout(this._qubitCount);
  }

  private redrawStateVector(): void {
    this.renderer.draw();
  }

  private notifyQubitCountChange(): void {
    this.emit(STATE_VECTOR_EVENTS.QUBIT_COUNT_CHANGED, this.qubitCount);
  }

  private emitVisibleQubitCirclesChanged() {
    this.emit(
      STATE_VECTOR_EVENTS.VISIBLE_QUBIT_CIRCLES_CHANGED,
      this.visibleQubitCircleIndices
    );
  }
}
