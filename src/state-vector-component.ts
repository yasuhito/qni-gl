import * as PIXI from "pixi.js";
import { Colors } from "./colors";
import { Container } from "pixi.js";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";
import { GridLayout } from "./grid-layout";
import { QubitCircle } from "./qubit-circle";
import { Spacing } from "./spacing";
import { spacingInPx } from "./util";

/**
 * Represents a component that visualizes the state vector.
 * @noInheritDoc
 */
export class StateVectorComponent extends Container {
  private _qubitCount = 1;
  private body: PIXI.Graphics;
  private qubitCirclesGridContainer: GridLayout;

  set qubitCount(value: number) {
    this._qubitCount = value;
    if (this.qubitCount == 2) {
      this.qubitCirclesGridContainer.cols = 4;
    } else if (this.qubitCount == 3) {
      this.qubitCirclesGridContainer.cols = 4;
    } else if (this.qubitCount == 4) {
      this.qubitCirclesGridContainer.cols = 8;
    } else if (this.qubitCount == 5) {
      this.qubitCirclesGridContainer.cols = 8;
    } else if (this.qubitCount == 6) {
      this.qubitCirclesGridContainer.cols = 16;
    } else if (this.qubitCount == 7) {
      this.qubitCirclesGridContainer.cols = 16;
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
    this.body.beginFill(Colors.bg.default.default);
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
    for (let i = 0; i < this.qubitCircleCount; i++) {
      this.qubitCirclesGridContainer.addChild(new QubitCircle(0, 0));
    }
  }
}
