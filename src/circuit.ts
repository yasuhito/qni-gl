import { CircuitStep } from "./circuit-step";
import { Container } from "pixi.js";
import { List } from "@pixi/ui";
import { Signal } from "typed-signals";

/**
 * @noInheritDoc
 */
export class Circuit extends Container {
  minQubitCount: number; // 最小の量子ビット数
  stepCount: number; // ステップ数
  view: Container;

  onStepHover: Signal<(circuit: Circuit, circuitStep: CircuitStep) => void>;
  onStepActivated: Signal<(circuit: Circuit, circuitStep: CircuitStep) => void>;

  protected _circuitSteps: List;

  get qubitCount() {
    return this.circuitSteps[0].qubitCount;
  }

  get width(): number {
    return this._circuitSteps[0].width;
  }

  get height(): number {
    return this._circuitSteps[0].height * this._circuitSteps.children.length;
  }

  get circuitSteps(): CircuitStep[] {
    return this._circuitSteps.children as CircuitStep[];
  }

  constructor(minQubitCount: number, stepCount: number) {
    super();

    this.onStepHover = new Signal();
    this.onStepActivated = new Signal();

    this.minQubitCount = minQubitCount;
    this.stepCount = stepCount;

    this.view = new Container();
    this.addChild(this.view);

    this._circuitSteps = new List({
      type: "horizontal",
    });
    this.view.addChild(this._circuitSteps);

    for (let i = 0; i < this.stepCount; i++) {
      const circuitStep = new CircuitStep(this.minQubitCount);
      this._circuitSteps.addChild(circuitStep);

      circuitStep.onHover.connect(this.onCircuitStepHover.bind(this));
      circuitStep.onActivate.connect(
        this.deactivateAllOtherCircuitSteps.bind(this)
      );
    }
  }

  stepIndex(step: CircuitStep) {
    for (let i = 0; i < this._circuitSteps.children.length; i++) {
      const each = this._circuitSteps.children[i];
      if (step === each) {
        return i;
      }
    }

    return;
  }

  // 最後のビットが使われていなければ true を返す
  isLastQubitUnused() {
    return this.circuitSteps.every(
      (each) => !each.hasGateAt(each.qubitCount - 1)
    );
  }

  /**
   * 使われていない上位ビットをまとめて削除する
   */
  removeUnusedUpperQubits() {
    while (
      this.isLastQubitUnused() &&
      this.maxQubitCountForAllSteps > this.minQubitCount
    ) {
      this.circuitSteps.forEach((each) => {
        each.decrementQubitCount();
      });
    }
  }

  protected get maxQubitCountForAllSteps() {
    return Math.max(...this.circuitSteps.map((each) => each.qubitCount));
  }

  serialize() {
    return this.circuitSteps.map((each) => each.serialize());
  }

  toJSON() {
    return {
      steps: this.circuitSteps,
    };
  }

  toCircuitJSON() {
    const cols = [];
    for (const each of this.circuitSteps) {
      cols.push(each.toCircuitJSON());
    }
    return `{"cols":[${cols.join(",")}]}`;
  }

  protected onCircuitStepHover(circuitStep: CircuitStep) {
    this.onStepHover.emit(this, circuitStep);
  }

  protected deactivateAllOtherCircuitSteps(circuitStep: CircuitStep) {
    // 他のすべてのステップを非アクティブにする
    this._circuitSteps.children.forEach((each: CircuitStep) => {
      if (each.isActive() && each !== circuitStep) {
        each.deactivate();
      }
    });

    // シグナルを飛ばす
    this.onStepActivated.emit(this, circuitStep);
  }
}
