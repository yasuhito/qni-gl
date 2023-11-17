import { CircuitStep } from "./circuit-step";
import { Container } from "pixi.js";
import { List } from "@pixi/ui";
import { Signal } from "typed-signals";

/**
 * @noInheritDoc
 */
export class Circuit extends Container {
  qubitCount: number; // 量子ビットの数
  stepCount: number; // ステップ数
  view: Container;

  onStepHover: Signal<(circuit: Circuit, circuitStep: CircuitStep) => void>;
  onStepActivated: Signal<(circuit: Circuit, circuitStep: CircuitStep) => void>;

  protected _circuitSteps: List;

  get width(): number {
    return this._circuitSteps[0].width;
  }

  get height(): number {
    return this._circuitSteps[0].height * this._circuitSteps.children.length;
  }

  get circuitSteps(): CircuitStep[] {
    return this._circuitSteps.children as CircuitStep[];
  }

  constructor(qubitCount: number, stepCount: number) {
    super();

    this.onStepHover = new Signal();
    this.onStepActivated = new Signal();

    this.qubitCount = qubitCount;
    this.stepCount = stepCount;

    this.view = new Container();
    this.addChild(this.view);

    this._circuitSteps = new List({
      type: "horizontal",
    });
    this.view.addChild(this._circuitSteps);

    for (let i = 0; i < this.stepCount; i++) {
      const circuitStep = new CircuitStep(this.qubitCount);
      this._circuitSteps.addChild(circuitStep);

      circuitStep.onHover.connect(this.onCircuitStepHover.bind(this));
      circuitStep.onHover.connect((_step) => {
        console.dir(this.serialize())
      });
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

  serialize() {
    return this.circuitSteps.map(each => each.serialize())
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
