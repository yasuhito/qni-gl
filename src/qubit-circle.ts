import * as PIXI from "pixi.js";
import * as tailwindColors from "tailwindcss/colors";
import { Colors } from "./colors";
import { Container } from "pixi.js";
import { Spacing } from "./spacing";
import { spacingInPx } from "./util";

export class QubitCircle extends Container {
  probability = 0;
  protected _probability: PIXI.Graphics;
  protected _border: PIXI.Graphics;
  protected _phase: PIXI.Container;

  set phase(value: number) {
    this._phase.rotation = Math.PI - (value / 180) * Math.PI;
  }

  constructor(probability: number, phase: number) {
    super();

    this.probability = probability;
    this._probability = new PIXI.Graphics();
    this._probability.pivot = new PIXI.Point(spacingInPx(8), spacingInPx(8));
    this.addChild(this._probability);
    this._border = new PIXI.Graphics();
    this.addChild(this._border);

    this._phase = new PIXI.Container();
    this._phase.position.set(spacingInPx(8), spacingInPx(8));
    this._phase.pivot = new PIXI.Point(1, 0);
    const phaseHand = new PIXI.Graphics();
    this._phase.addChild(phaseHand);
    this.addChild(this._phase);

    // 確率の円を描画
    if (probability > 0) {
      this._probability.beginFill(Colors.bg.brand.default, 1);
    }
    // r * r * 3.14 = 16sp * 16sp * 3.14
    // r * r * 3.14 = 16sp * 16sp * 3.14 * probability
    // r^2 = 16sp*16sp*probability
    const radius = Math.sqrt(
      spacingInPx(8) * spacingInPx(8) * this.probability * 0.01
    );
    this._probability.x = spacingInPx(8) - radius;
    this._probability.y = spacingInPx(8) - radius;
    this._probability.drawRoundedRect(
      spacingInPx(8),
      spacingInPx(8),
      radius * 2,
      radius * 2,
      Spacing.cornerRadius.full
    );
    this._probability.endFill();

    // 枠線を描画
    this._border.lineStyle(Spacing.borderWidth.gate, this.borderColor, 1, 0);
    this._border.drawRoundedRect(
      0,
      0,
      spacingInPx(16),
      spacingInPx(16),
      Spacing.cornerRadius.full
    );

    // 位相の針を描画
    if (probability > 0) {
      phaseHand.beginFill(tailwindColors.zinc["900"], 1);
      phaseHand.drawRect(-1, 0, 2, this.height / 2);
      phaseHand.endFill();

      this.phase = phase
    }
  }

  protected get borderColor() {
    if (this.probability === 0) {
      return tailwindColors.zinc["200"];
    }

    return tailwindColors.zinc["500"];
  }
}
