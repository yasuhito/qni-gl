import * as PIXI from "pixi.js";
import { Colors } from "./colors";
import { Container } from "pixi.js";
import { Size } from "./size";
import { Spacing } from "./spacing";

/**
 * @noInheritDoc
 */
export class QubitCircle extends Container {
  size: Size = "xl";

  private _probabilityValue = 0;
  private _probabilityCircle: PIXI.Graphics;
  private _border: PIXI.Graphics;
  private _phaseValue = 0;
  private _phase: PIXI.Container; /* 位相の針を回転させるためのコンテナ */
  private _phaseHand: PIXI.Graphics; /* 位相の針 */

  /**
   * 確率をセットする
   */
  set probability(value: number) {
    this._probabilityValue = value;

    this._probabilityCircle.clear();

    if (this.probability > 0) {
      this._probabilityCircle.beginFill(Colors.bg.brand.default, 1);
    }

    const radius =
      (Spacing.size.qubitCircle[this.size] / 2 -
        Spacing.borderWidth.qubitCircle[this.size]) *
      Math.sqrt(this.probability * 0.01);
    this._probabilityCircle.drawCircle(this.center.x, this.center.y, radius);
    this._probabilityCircle.endFill();

    this.drawPhaseHand(this.probability, this._phaseValue);
    this.drawBorder(this.probability);
  }

  get probability() {
    return this._probabilityValue;
  }

  /**
   * 位相をセットする
   */
  set phase(value: number) {
    this._phaseValue = value;
    this.drawPhaseHand(this.probability, value);
  }

  constructor(probability: number, phase: number, size: Size = "xl") {
    super();

    this.size = size;

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
    this.drawBorder(probability);
    this.phase = phase;
  }

  protected get center() {
    return new PIXI.Point(
      Spacing.size.qubitCircle[this.size] / 2,
      Spacing.size.qubitCircle[this.size] / 2
    );
  }

  protected get handLength() {
    return this.height / 2;
  }

  protected drawBorder(probability: number) {
    this._border.lineStyle(
      Spacing.borderWidth.qubitCircle[this.size],
      this.borderColor(probability),
      1,
      0
    );
    this._border.drawCircle(
      this.center.x,
      this.center.y,
      Spacing.size.qubitCircle[this.size] / 2
    );
  }

  protected drawPhaseHand(probability: number, phase: number) {
    this._phaseHand.clear();

    if (probability > 0) {
      this._phaseHand
        .beginFill(Colors.icon.default, 1)
        .drawRect(
          0,
          0,
          Spacing.width.qubitCircle.phaseHand[this.size],
          this.handLength
        )
        .endFill();
    }

    this._phase.rotation = Math.PI - (phase / 180) * Math.PI;
  }

  protected borderColor(probability: number) {
    if (probability === 0) {
      return Colors.border.qubitCircle.disabled;
    }

    return Colors.border.qubitCircle.default;
  }
}
