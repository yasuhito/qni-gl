import * as PIXI from "pixi.js";
import { Colors } from "./colors";
import { Container } from "pixi.js";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";
import { GridLayout } from "./grid-layout";
import { QubitCircle } from "./qubit-circle";
import { Spacing } from "./spacing";
import { spacingInPx } from "./util";
import { Size } from "./size";

/**
 * Represents a component that visualizes the state vector.
 * @noInheritDoc
 */
export class StateVectorComponent extends Container {
  qubitCircleSize: Size = "xl";

  private _qubitCount = 1;
  private body: PIXI.Graphics;
  private qubitCirclesGridContainer: GridLayout;

  set qubitCount(value: number) {
    this._qubitCount = value;

    if (this.qubitCount == 1) {
      this.qubitCircleSize = "xl";
      this.qubitCirclesGridContainer.cols = 2;
    } else if (this.qubitCount == 2) {
      this.qubitCircleSize = "xl";
      this.qubitCirclesGridContainer.cols = 4;
    } else if (this.qubitCount == 3) {
      this.qubitCircleSize = "xl";
      this.qubitCirclesGridContainer.cols = 4;
    } else if (this.qubitCount == 4) {
      this.qubitCircleSize = "lg";
      this.qubitCirclesGridContainer.cols = 8;
    } else if (this.qubitCount == 5) {
      this.qubitCircleSize = "base";
      this.qubitCirclesGridContainer.cols = 8;
    } else if (this.qubitCount == 6) {
      this.qubitCircleSize = "base";
      this.qubitCirclesGridContainer.cols = 16;
    } else if (this.qubitCount == 7) {
      this.qubitCircleSize = "base";
      this.qubitCirclesGridContainer.cols = 16;
    } else if (this.qubitCount == 8) {
      this.qubitCircleSize = "sm";
      this.qubitCirclesGridContainer.cols = 32;
    } else if (this.qubitCount == 9) {
      this.qubitCircleSize = "xs";
      this.qubitCirclesGridContainer.cols = 32;
      this.qubitCirclesGridContainer.elementsMargin = spacingInPx(0.25);
    } else if (this.qubitCount == 10) {
      this.qubitCircleSize = "xs";
      this.qubitCirclesGridContainer.cols = 64;
      this.qubitCirclesGridContainer.elementsMargin = spacingInPx(0.25);
    }

    this.clear();
    this.draw();
  }

  get qubitCount() {
    return this._qubitCount;
  }

  get qubitCircleCount() {
    return Math.pow(2, this._qubitCount);
  }

  get qubitCircles() {
    return this.qubitCirclesGridContainer.children as Array<QubitCircle>;
  }

  private get bodyWidth() {
    return (
      this.qubitCirclesGridContainer.width +
      this.qubitCirclesGridContainer.horPadding * 2
    );
  }

  private get bodyHeight() {
    return (
      this.qubitCirclesGridContainer.height +
      this.qubitCirclesGridContainer.vertPadding * 2
    );
  }

  constructor(qubitCount: number) {
    super();

    this.body = new PIXI.Graphics();
    this.addChild(this.body);

    this.qubitCirclesGridContainer = new GridLayout({
      cols: 2,
      elementsMargin: spacingInPx(0.5),
      vertPadding: spacingInPx(5),
      horPadding: spacingInPx(4),
    });
    this.addChild(this.qubitCirclesGridContainer);

    this.qubitCount = qubitCount;
  }

  private draw() {
    this.drawQubitCircles();
    this.drawBody();
  }

  private clear() {
    this.body.clear();

    this.qubitCircles.forEach((child) => {
      child.destroy();
    });
    this.qubitCirclesGridContainer.removeChildren();
  }

  private drawBody() {
    this.body.lineStyle(1, Colors.border.stateVector.default, 1, 0);
    this.body.beginFill(Colors.bg.default);
    this.body.drawRoundedRect(
      0,
      0,
      this.bodyWidth,
      this.bodyHeight,
      Spacing.cornerRadius.stateVector
    );
    this.body.endFill();

    this.body.filters = [
      new DropShadowFilter({ offset: { x: 0, y: 4 }, blur: 3, alpha: 0.07 }),
      new DropShadowFilter({ offset: { x: 0, y: 2 }, blur: 2, alpha: 0.06 }),
    ];
  }

  private drawQubitCircles() {
    this.qubitCircles.forEach((child) => {
      child.destroy();
    });

    for (let i = 0; i < this.qubitCircleCount; i++) {
      this.qubitCirclesGridContainer.addChild(
        new QubitCircle(0, 0, this.qubitCircleSize)
      );
    }
    this.qubitCirclesGridContainer.arrangeChildren();
  }
}
