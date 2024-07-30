import * as PIXI from "pixi.js";
import { Colors } from "./colors";
import { QubitCircleManager } from "./qubit-circle-manager";
import { StateVectorLayout } from "./state-vector-layout";
import { QubitCircle } from "./qubit-circle";
import { logger } from "./util";
import { STATE_VECTOR_EVENTS } from "./state-vector-events";

export class StateVectorRenderer {
  private layout: StateVectorLayout;
  private qubitCircleManager: QubitCircleManager;
  private backgroundGraphics: PIXI.Graphics;
  private container: PIXI.Container;
  private currentViewport: PIXI.Rectangle;
  private visibleQubitCirclesStartIndexX: number = 0;
  private visibleQubitCirclesStartIndexY: number = 0;

  constructor(
    container: PIXI.Container,
    qubitCount: number,
    viewport: PIXI.Rectangle
  ) {
    this.container = container;
    this.layout = new StateVectorLayout(qubitCount);
    this.currentViewport = viewport;
    this.backgroundGraphics = new PIXI.Graphics();
    this.container.addChildAt(this.backgroundGraphics, 0);
    this.qubitCircleManager = new QubitCircleManager(
      this.layout,
      this.container
    );
  }

  get visibleQubitCircleIndices(): number[] {
    return this.qubitCircleManager.visibleQubitCircleIndices;
  }

  drawBackground(): void {
    this.backgroundGraphics.clear();
    this.backgroundGraphics.beginFill(Colors["bg-component"], 1);
    this.backgroundGraphics.drawRect(
      0,
      0,
      this.layout.width,
      this.layout.height
    );
    this.backgroundGraphics.endFill();
  }

  drawQubitCircles(): Set<number> {
    const endIndexX = this.layout.visibleQubitCirclesEndIndex(
      this.currentViewport.x,
      this.currentViewport.width,
      this.layout.cols
    );
    const endIndexY = this.layout.visibleQubitCirclesEndIndex(
      this.currentViewport.y,
      this.currentViewport.height,
      this.layout.rows
    );

    return this.qubitCircleManager.updateVisibleQubitCircles(
      this.visibleQubitCirclesStartIndexX,
      this.visibleQubitCirclesStartIndexY,
      endIndexX,
      endIndexY
    );
  }

  updateQubitCircleLayout(qubitCount: number): void {
    this.layout.qubitCount = qubitCount;
    this.visibleQubitCirclesStartIndexX = 0;
    this.visibleQubitCirclesStartIndexY = 0;
    this.qubitCircleManager.resizeAllQubitCircles(this.layout.qubitCircleSize);
  }

  updateVisibleQubitCircles(viewport: PIXI.Rectangle): boolean {
    const newVisibleQubitCirclesStartIndexX =
      this.layout.visibleQubitCirclesStartIndex(viewport.x);
    const newVisibleQubitCirclesStartIndexY =
      this.layout.visibleQubitCirclesStartIndex(viewport.y);

    if (
      newVisibleQubitCirclesStartIndexX !==
        this.visibleQubitCirclesStartIndexX ||
      newVisibleQubitCirclesStartIndexY !== this.visibleQubitCirclesStartIndexY
    ) {
      this.visibleQubitCirclesStartIndexX = newVisibleQubitCirclesStartIndexX;
      this.visibleQubitCirclesStartIndexY = newVisibleQubitCirclesStartIndexY;
      this.currentViewport = viewport.clone();
      return true;
    }

    return false;
  }

  draw() {
    const startTime = performance.now();

    this.drawBackground();
    const visibleIndices = this.drawQubitCircles();

    if (visibleIndices.size > 0) {
      this.container.emit(
        STATE_VECTOR_EVENTS.VISIBLE_QUBIT_CIRCLES_CHANGED,
        Array.from(visibleIndices)
      );
    }

    const endTime = performance.now();
    logger.log(`Draw execution time: ${endTime - startTime} ms`);
  }

  qubitCircleAt(index: number): QubitCircle | undefined {
    return this.qubitCircleManager.qubitCircleAt(index);
  }
}
