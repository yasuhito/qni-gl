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
  private stepCount: number;
  private stepWidth: number;
  private stepHeight: number;

  constructor(steps: CircuitStepComponent[]) {
    super();

    this.initializeFromSteps(steps);
    this.initMarkers();
  }

  private initializeFromSteps(steps: CircuitStepComponent[]) {
    this.stepCount = steps.length;
    const firstStep = this.firstStep(steps);
    this.stepWidth = firstStep.dropzonesWidth;
    this.stepHeight = firstStep.dropzonesHeight;
  }

  private firstStep(steps: CircuitStepComponent[]): CircuitStepComponent {
    if (steps.length === 0) {
      throw new Error("Steps array is empty");
    }
    return steps[0];
  }

  private initMarkers() {
    for (let i = 0; i < this.stepCount; i++) {
      const marker = new PIXI.Graphics();
      marker.position.x = this.markerXPosition(i);
      this.drawMarker(marker, CircuitStepMarkerManager.COLOR_DEFAULT, 0);
      this.addChild(marker);
      this.markers.push(marker);
    }
  }

  update(steps: CircuitStepComponent[]) {
    this.initializeFromSteps(steps);
    this.updateMarkerPositions();
    steps.forEach((step, index) => {
      this.hideMarker(index);

      if (step.isActive()) {
        this.showActiveStepMarker(index);
      }
      if (step.isHovered()) {
        this.showHoveredStepMarker(index);
      }
    });
  }

  private updateMarkerPositions() {
    this.markers.forEach((marker, index) => {
      marker.position.x = this.markerXPosition(index);
    });
  }

  private markerXPosition(index: number): number {
    console.log(CircuitStepMarkerManager.MARKER_WIDTH / 2);
    return (
      (index + 1) * this.stepWidth - CircuitStepMarkerManager.MARKER_WIDTH / 2
    );
  }

  private showActiveStepMarker(index: number) {
    this.drawMarker(this.markers[index], CircuitStepMarkerManager.COLOR_ACTIVE);
  }

  private showHoveredStepMarker(index: number) {
    this.drawMarker(this.markers[index], CircuitStepMarkerManager.COLOR_HOVER);
  }

  private hideMarker(index: number) {
    if (!this.markers[index]) {
      throw new Error(`Marker not found at index ${index}`);
    }
    this.markers[index].alpha = 0;
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
