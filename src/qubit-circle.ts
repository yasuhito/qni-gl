import * as PIXI from "pixi.js";
import { Colors } from "./colors";
import { Container } from "pixi.js";
import { Spacing } from "./spacing";

/**
 * @noInheritDoc
 */
export class QubitCircle extends Container {
  protected _probabilityValue = 0;
  protected _probabilityCircle: PIXI.Graphics;
  protected _border: PIXI.Graphics;
  protected _phase: PIXI.Container; /* 位相の針を回転させるためのコンテナ */
  protected _phaseHand: PIXI.Graphics; /* 位相の針 */

  /**
   * 確率をセットする
   */
  set probability(value: number) {
    this._probabilityValue = value;

    if (this.probability > 0) {
      this._probabilityCircle.beginFill(Colors.bg.brand.default, 1);
    }

    const radius =
      (Spacing.size.qubitCircle / 2 - Spacing.borderWidth.gate) *
      Math.sqrt(this.probability * 0.01);
    this._probabilityCircle.drawCircle(this.center.x, this.center.y, radius);
    this._probabilityCircle.endFill();
  }

  get probability() {
    return this._probabilityValue;
  }

  /**
   * 位相をセットする
   */
  set phase(value: number) {
    if (this._probabilityValue > 0) {
      this._phaseHand
        .beginFill(Colors.icon.default, 1)
        .drawRect(0, 0, Spacing.width.phaseHand, this.handLength)
        .endFill();
    }
    this._phase.rotation = Math.PI - (value / 180) * Math.PI;
  }

  constructor(probability: number, phase: number) {
    super();

    this._probabilityCircle = new PIXI.Graphics();
    this.addChild(this._probabilityCircle);

    this._border = new PIXI.Graphics();
    this.addChild(this._border);

    this._phase = new PIXI.Container();
    this._phase.pivot = new PIXI.Point(Spacing.width.phaseHand / 2, 0);
    this._phase.position.set(this.center.x, this.center.y);
    this._phaseHand = new PIXI.Graphics();
    this._phase.addChild(this._phaseHand);
    this.addChild(this._phase);

    this.probability = probability;
    // 枠線を描画
    this._border.lineStyle(
      Spacing.borderWidth.gate,
      this.borderColor(probability),
      1,
      0
    );
    this._border.drawCircle(
      this.center.x,
      this.center.y,
      Spacing.size.qubitCircle / 2
    );
    this.phase = phase;
  }

  protected get center() {
    return new PIXI.Point(
      Spacing.size.qubitCircle / 2,
      Spacing.size.qubitCircle / 2
    );
  }

  protected get handLength() {
    return this.height / 2;
  }

  protected borderColor(probability: number) {
    if (probability === 0) {
      return Colors.border.qubitCircle.disabled;
    }

    return Colors.border.qubitCircle.default;
  }
}
