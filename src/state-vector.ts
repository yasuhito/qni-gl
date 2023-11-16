import * as PIXI from "pixi.js";
import * as tailwindColors from "tailwindcss/colors";
import { Container } from "pixi.js";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";
import { List } from "@pixi/ui";
import { QubitCircle } from "./qubit-circle";

export class StateVector extends Container {
  protected graphics: PIXI.Graphics;
  protected qubitCircles: List;

  constructor() {
    super();

    this.graphics = new PIXI.Graphics();
    this.addChild(this.graphics);

    this.graphics.lineStyle(1, tailwindColors.zinc["400"], 1, 0);
    this.graphics.beginFill(tailwindColors.white);
    this.graphics.drawRoundedRect(0, 0, 130 + 32, 64 + 40, 16);
    this.graphics.endFill();

    this.qubitCircles = new List({
      type: "horizontal",
      elementsMargin: 2,
      children: [new QubitCircle(1, 90), new QubitCircle(0, 0)],
      vertPadding: 20,
      horPadding: 16,
    });
    this.addChild(this.qubitCircles);

    this.graphics.filters = [
      new DropShadowFilter({ offset: { x: 0, y: 4 }, blur: 3, alpha: 0.07 }),
      new DropShadowFilter({ offset: { x: 0, y: 2 }, blur: 2, alpha: 0.06 }),
    ];
  }
}
