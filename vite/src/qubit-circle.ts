import * as PIXI from "pixi.js";
import { Colors } from "./colors";
import { Container } from "pixi.js";
import { Size } from "./size";
import { Spacing } from "./spacing";

/**
 * @noInheritDoc
 */
export class QubitCircle extends Container {
  private _probability = 0;
  private _phase = 0;
  private _size: Size = "xs";
  private probabilityCircle: PIXI.Graphics;
  private border: PIXI.Graphics;
  private phaseContainer: PIXI.Container;
  private phaseHand: PIXI.Graphics;

  set probability(newValue: number) {
    if (this._probability === newValue) return;

    const oldProbability = this._probability;
    this._probability = newValue;

    this.maybePaintProbabilityCircle();

    // 確率が0から正の値、または正の値から0に変わった場合のみボーダーを更新
    if (
      (oldProbability === 0 && newValue > 0) ||
      (oldProbability > 0 && newValue === 0)
    ) {
      this.drawBorder();
    }

    this.updatePhaseHand();
  }

  get probability() {
    return this._probability;
  }

  set phase(newValue: number) {
    if (this._phase === newValue) return;

    this._phase = newValue;
    this.updatePhaseRotation();
  }

  get size(): Size {
    return this._size;
  }

  set size(newValue: Size) {
    if (this._size === newValue) return;

    this._size = newValue;

    // 各要素を更新
    this.maybePaintProbabilityCircle();
    this.drawBorder();
    this.updatePhaseHand();

    // phaseContainer の位置を更新
    this.phaseContainer.position.set(this.sizeInPx / 2, this.sizeInPx / 2);
  }

  constructor(probability: number, phase: number, size: Size = "xl") {
    super();

    this.probabilityCircle = new PIXI.Graphics();
    this.addChild(this.probabilityCircle);

    this.border = new PIXI.Graphics();
    this.addChild(this.border);

    this.phaseContainer = new PIXI.Container();
    this.phaseContainer.pivot = new PIXI.Point(
      Spacing.width.qubitCircle.phaseHand[this._size] / 2,
      0
    );
    this.phaseContainer.position.set(this.sizeInPx / 2, this.sizeInPx / 2);
    this.phaseHand = new PIXI.Graphics();
    this.phaseContainer.addChild(this.phaseHand);
    this.addChild(this.phaseContainer);

    this.size = size;
    this.probability = probability;
    this.phase = phase;
    this.drawBorder();
    this.maybePaintProbabilityCircle();
    this.updatePhaseRotation();
  }

  private maybePaintProbabilityCircle() {
    this.probabilityCircle.clear();

    if (this.probability === 0) return;

    this.probabilityCircle.beginFill(Colors["bg-brand"], 1);
    const probability_scale_factor = 0.01;
    const radius =
      (this.sizeInPx / 2 - Spacing.borderWidth.qubitCircle[this._size]) *
      Math.sqrt(this.probability * probability_scale_factor);
    this.probabilityCircle.drawCircle(
      this.sizeInPx / 2,
      this.sizeInPx / 2,
      radius
    );
    this.probabilityCircle.endFill();
  }

  private updatePhaseHand() {
    this.phaseHand.clear();

    if (this.probability === 0) return;

    this.phaseHand
      .beginFill(Colors["border.icon"], 1)
      .drawRect(
        -Spacing.width.qubitCircle.phaseHand[this.size] / 2,
        0,
        Spacing.width.qubitCircle.phaseHand[this.size],
        this.handLength
      )
      .endFill();

    this.updatePhaseRotation();
  }

  private get handLength() {
    return this.height / 2;
  }

  private drawBorder() {
    this.border.clear();

    this.border.lineStyle(
      Spacing.borderWidth.qubitCircle[this._size],
      this.borderColor(),
      1,
      0
    );
    this.border.drawCircle(
      this.sizeInPx / 2,
      this.sizeInPx / 2,
      this.sizeInPx / 2
    );
  }

  private updatePhaseRotation() {
    this.phaseContainer.rotation = Math.PI - this._phase;
  }

  private borderColor() {
    if (this.probability === 0) {
      return Colors["border-component-strong-disabled"];
    }

    return Colors["border-component-strong"];
  }

  private get sizeInPx() {
    return Spacing.size.qubitCircle[this._size];
  }
}
