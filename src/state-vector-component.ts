import * as PIXI from "pixi.js";
import { Colors } from "./colors";
import { Container } from "pixi.js";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";
import { List as ListContainer } from "@pixi/ui";
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
  private qubitCirclesListContainer: ListContainer;

  set qubitCount(value: number) {
    this._qubitCount = value;
    this.clear();
    this.draw();
  }

  get qubitCircleCount() {
    return Math.pow(2, this._qubitCount);
  }

  get qubitCircles() {
    return this.qubitCirclesListContainer.children as Array<QubitCircle>;
  }

  private get bodyWidth() {
    return (
      this.qubitCirclesListContainer.width +
      this.qubitCirclesListContainer.horPadding * 2
    );
  }

  private get bodyHeight() {
    return (
      this.qubitCirclesListContainer.height +
      this.qubitCirclesListContainer.vertPadding * 2
    );
  }

  constructor(qubitCount: number) {
    super();

    this.body = new PIXI.Graphics();
    this.addChild(this.body);

    this.qubitCirclesListContainer = new ListContainer({
      type: "horizontal",
      elementsMargin: spacingInPx(0.5),
      vertPadding: spacingInPx(5),
      horPadding: spacingInPx(4),
    });
    this.addChild(this.qubitCirclesListContainer);

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
    this.qubitCirclesListContainer.removeChildren();
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
      this.qubitCirclesListContainer.addChild(new QubitCircle(0, 0));
    }
  }
}
