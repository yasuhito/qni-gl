import * as PIXI from "pixi.js";
import { Colors } from "./colors";
import { Container } from "pixi.js";
import { Spacing } from "./spacing";
import { spacingInPx } from "./util";
import * as tailwindColors from "tailwindcss/colors";

export class QubitCircle extends Container {
  protected _body: PIXI.Graphics;
  protected _phase: PIXI.Graphics;

  constructor() {
    super()

    this._body = new PIXI.Graphics();
    this.addChild(this._body);

    this._body.lineStyle(
      Spacing.borderWidth.gate,
      tailwindColors.zinc["500"],
      1,
      0
    );
    this._body.beginFill(Colors.bg.brand.default, 1);
    this._body.drawRoundedRect(
      0,
      0,
      spacingInPx(16),
      spacingInPx(16),
      Spacing.cornerRadius.full
    );
    this._body.endFill();

    this._phase = new PIXI.Graphics()
    this.addChild(this._phase)

    this._phase.beginFill(tailwindColors.zinc["900"], 1);
    this._phase.drawRect(
      this.width / 2 - 1,
      0,
      2,
      this.height / 2
    );
    this._phase.endFill();
  }
}
