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
  private phaseContainer: PIXI.Container;
  private phaseHand: PIXI.Graphics;

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

    this.resize(size);
    this.probability = probability;
    this.phase = phase;
  }

  public resize(newSize: Size): void {
    if (this.size === newSize) return; // サイズが変わらない場合は何もしない

    this.size = newSize;

    // 中心座標を再計算
    const newCenter = this.center;

    // 確率円を再描画
    this.probabilityCircle.clear();
    if (this._probability > 0) {
      this.probabilityCircle.beginFill(Colors["bg-brand"], 1);
      const radius =
        (Spacing.size.qubitCircle[this.size] / 2 -
          Spacing.borderWidth.qubitCircle[this.size]) *
        Math.sqrt(this._probability * 0.01);
      this.probabilityCircle.drawCircle(newCenter.x, newCenter.y, radius);
      this.probabilityCircle.endFill();
    }

    // ボーダーを再描画
    this.drawBorder(this._probability);

    // 位相の針を再描画
    this.phaseContainer.position.set(newCenter.x, newCenter.y);
    // this.phaseContainer.pivot.set(
    //   Spacing.width.qubitCircle.phaseHand[this.size] / 2,
    //   0
    // );
    this.drawPhaseHand(this._probability, this._phase);

    // コンテナのサイズを更新
    this.width = this.height = Spacing.size.qubitCircle[this.size];
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
    this.border.clear();

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
