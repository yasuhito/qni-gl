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

  private _probability = 0;
  private probabilityCircle: PIXI.Graphics;
  private border: PIXI.Graphics;
  private _phase = 0;
  private phaseContainer: PIXI.Container; /* 位相の針を回転させるためのコンテナ */
  private phaseHand: PIXI.Graphics; /* 位相の針 */

  /**
   * 確率をセットする
   */
  set probability(value: number) {
    this._probability = value;

    this.probabilityCircle.clear();

    if (this.probability > 0) {
      this.probabilityCircle.beginFill(Colors["bg-brand"], 1);
    }

    const radius =
      (Spacing.size.qubitCircle[this.size] / 2 -
        Spacing.borderWidth.qubitCircle[this.size]) *
      Math.sqrt(this.probability * 0.01);
    this.probabilityCircle.drawCircle(this.center.x, this.center.y, radius);
    this.probabilityCircle.endFill();

    this.drawPhaseHand(this.probability, this._phase);
    this.drawBorder(this.probability);
  }

  get probability() {
    return this._probability;
  }

  /**
   * 位相をセットする
   */
  set phase(value: number) {
    this._phase = value;
    this.drawPhaseHand(this.probability, value);
  }

  constructor(probability: number, phase: number, size: Size = "xl") {
    super();

    this.size = size;

    this.probabilityCircle = new PIXI.Graphics();
    this.addChild(this.probabilityCircle);

    this.border = new PIXI.Graphics();
    this.addChild(this.border);

    this.phaseContainer = new PIXI.Container();
    this.phaseContainer.pivot = new PIXI.Point(
      Spacing.width.qubitCircle.phaseHand[this.size] / 2,
      0
    );
    this.phaseContainer.position.set(this.center.x, this.center.y);
    this.phaseHand = new PIXI.Graphics();
    this.phaseContainer.addChild(this.phaseHand);
    this.addChild(this.phaseContainer);

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
    this.border.lineStyle(
      Spacing.borderWidth.qubitCircle[this.size],
      this.borderColor(probability),
      1,
      0
    );
    this.border.drawCircle(
      this.center.x,
      this.center.y,
      Spacing.size.qubitCircle[this.size] / 2
    );
  }

  protected drawPhaseHand(probability: number, phase: number) {
    this.phaseHand.clear();

    if (probability > 0) {
      this.phaseHand
        .beginFill(Colors["border.icon"], 1)
        .drawRect(
          0,
          0,
          Spacing.width.qubitCircle.phaseHand[this.size],
          this.handLength
        )
        .endFill();
    }

    this.phaseContainer.rotation = Math.PI - phase;
  }

  protected borderColor(probability: number) {
    if (probability === 0) {
      return Colors["border-component-strong-disabled"];
    }

    return Colors["border-component-strong"];
  }
}
