import * as PIXI from "pixi.js";
import { Colors } from "./colors";
import { Container } from "pixi.js";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";
import { List as ListContainer } from "@pixi/ui";
import { QubitCircle } from "./qubit-circle";
import { Spacing } from "./spacing";
import { spacingInPx } from "./util";

/**
 * @noInheritDoc
 */
export class StateVectorComponent extends Container {
  private _qubitCount = 1;
  protected body: PIXI.Graphics;
  protected qubitCircles: ListContainer;

  set qubitCount(value: number) {
    this._qubitCount = value;
    this.redraw();
    console.log(`qubitCount = ${this._qubitCount}`);
  }

  get qubitCircleCount() {
    return Math.pow(2, this._qubitCount);
  }

  get amplitudes() {
    return this.qubitCircles.children as Array<QubitCircle>;
  }

  constructor(qubitCount: number) {
    super();

    this.body = new PIXI.Graphics();
    this.addChild(this.body);

    this.qubitCircles = new ListContainer({
      type: "horizontal",
      elementsMargin: spacingInPx(0.5),
      vertPadding: spacingInPx(5),
      horPadding: spacingInPx(4),
    });
    this.addChild(this.qubitCircles);

    this.qubitCount = qubitCount;
  }

  private redraw() {
    this.body.clear();

    this.qubitCircles.children.forEach((child) => {
      child.destroy();
    });
    this.qubitCircles.removeChildren();

    for (let i = 0; i < Math.pow(2, this._qubitCount); i++) {
      this.qubitCircles.addChild(new QubitCircle(0, 0));
    }

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

  protected get bodyWidth() {
    return this.qubitCircles.width + this.qubitCircles.horPadding * 2;
  }

  protected get bodyHeight() {
    return this.qubitCircles.height + this.qubitCircles.vertPadding * 2;
  }
}
