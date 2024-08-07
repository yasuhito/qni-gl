import * as PIXI from "pixi.js";
import { Container } from "pixi.js";
import { Colors } from "./colors";
import { spacingInPx } from "./util";
import { CircuitStepComponent } from "./circuit-step-component";

export class CircuitStepMarkerManager extends Container {
  private static readonly MARKER_WIDTH = spacingInPx(1);
  private static readonly COLOR_HOVER = Colors["bg-brand-hover"];
  private static readonly COLOR_ACTIVE = Colors["bg-brand"];
  private static readonly COLOR_DEFAULT = 0x000000;

  private markers: PIXI.Graphics[] = [];
  private _steps: CircuitStepComponent[];

  constructor(steps: CircuitStepComponent[]) {
    super();

    this.steps = steps;
    this.initMarkers();
  }

  update(steps: CircuitStepComponent[]): void {
    this.steps = steps;
    this.updateMarkerPositions();
    this.updateMarkerVisibility();
  }

  private get steps() {
    return this._steps;
  }

  private set steps(steps: CircuitStepComponent[]) {
    if (steps.length === 0) {
      throw new Error("Steps array is empty");
    }

    this._steps = steps;
  }

  private get stepCount() {
    return this._steps.length;
  }

  private get stepWidth() {
    return this.stepAt(0).dropzonesWidth;
  }

  private get stepHeight() {
    return this.stepAt(0).dropzonesHeight;
  }

  private initMarkers() {
    for (let i = 0; i < this.stepCount; i++) {
      const marker = new PIXI.Graphics();
      this.drawMarker(marker, CircuitStepMarkerManager.COLOR_DEFAULT, 0);
      this.addChild(marker);
      this.markers.push(marker);
    }
    this.updateMarkerPositions();
    this.updateMarkerVisibility();
  }

  private updateMarkerPositions() {
    this.markers.forEach((marker, index) => {
      marker.position.x = this.markerXPosition(index);
    });
  }

  private markerXPosition(index: number): number {
    return (
      (index + 1) * this.stepWidth - CircuitStepMarkerManager.MARKER_WIDTH / 2
    );
  }

  private updateMarkerVisibility() {
    this.steps.forEach((step, index) => {
      this.hideMarker(index);

      if (step.isActive()) {
        this.drawActiveStepMarker(index);
      }
      if (step.isHovered()) {
        this.drawHoveredStepMarker(index);
      }
    });
  }

  private drawActiveStepMarker(index: number) {
    this.drawMarker(
      this.markerAt(index),
      CircuitStepMarkerManager.COLOR_ACTIVE
    );
  }

  private drawHoveredStepMarker(index: number) {
    this.drawMarker(this.markerAt(index), CircuitStepMarkerManager.COLOR_HOVER);
  }

  private hideMarker(index: number) {
    this.markerAt(index).alpha = 0;
  }

  private stepAt(index: number): CircuitStepComponent {
    const step = this._steps[index];
    if (!step) {
      throw new Error(`Step not found at index ${index}`);
    }

    return step;
  }

  private markerAt(index: number): PIXI.Graphics {
    const marker = this.markers[index];
    if (!marker) {
      throw new Error(`Marker not found at index ${index}`);
    }

    return marker;
  }

  private drawMarker(
    marker: PIXI.Graphics,
    color: PIXI.ColorSource,
    alpha: number = 1
  ) {
    marker
      .clear()
      .beginFill(color)
      .drawRect(0, 0, CircuitStepMarkerManager.MARKER_WIDTH, this.stepHeight)
      .endFill();
    marker.alpha = alpha;
  }
}
