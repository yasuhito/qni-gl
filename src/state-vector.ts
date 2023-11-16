import * as PIXI from "pixi.js";
import * as tailwindColors from "tailwindcss/colors";
import { Container } from "pixi.js";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";
import { List } from "@pixi/ui";
import { QubitCircle } from "./qubit-circle";

export class StateVector extends Container {
  protected _qubitCount = 1;
  protected graphics: PIXI.Graphics;
  protected qubitCircles: List;

  set qubitCount(value: number) {
    this._qubitCount = value;
  }

  get qubitCircleCount() {
    return Math.pow(2, this._qubitCount);
  }

  get amplitudes() {
    return this.qubitCircles.children as Array<QubitCircle>;
  }

  constructor(qubitCount: number) {
    super();

    this.qubitCount = qubitCount;

    this.graphics = new PIXI.Graphics();
    this.addChild(this.graphics);

    this.graphics.lineStyle(1, tailwindColors.zinc["400"], 1, 0);
    this.graphics.beginFill(tailwindColors.white);
    this.graphics.drawRoundedRect(
      0,
      0,
      64 * this.qubitCircleCount + 2 * (this.qubitCircleCount - 1) + 32,
      64 + 40,
      16
    );
    this.graphics.endFill();

    this.qubitCircles = new List({
      type: "horizontal",
      elementsMargin: 2,
      vertPadding: 20,
      horPadding: 16,
    });
    for (let i = 0; i < Math.pow(2, this._qubitCount); i++) {
      this.qubitCircles.addChild(
        new QubitCircle(this.randomProbability, this.randomPhase)
      );
    }
    this.addChild(this.qubitCircles);

    this.graphics.filters = [
      new DropShadowFilter({ offset: { x: 0, y: 4 }, blur: 3, alpha: 0.07 }),
      new DropShadowFilter({ offset: { x: 0, y: 2 }, blur: 2, alpha: 0.06 }),
    ];
  }

  protected get randomProbability() {
    return Math.floor(Math.random() * 101);
  }

  protected get randomPhase() {
    return Math.floor(Math.random() * 361) - 180;
  }
}
