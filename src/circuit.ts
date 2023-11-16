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

  onStepHover: Signal<(circuitStep: CircuitStep) => void>;

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
      circuitStep.onClick.connect(this.onCircuitStepClick.bind(this));
    }
  }

  toJSON() {
    return {
      steps: this.circuitSteps,
    };
  }

  protected onCircuitStepHover(circuitStep: CircuitStep) {
    this.onStepHover.emit(circuitStep);
  }

  protected onCircuitStepClick(circuitStep: CircuitStep) {
    this._circuitSteps.children.forEach((each: CircuitStep) => {
      if (each.isActive() && each !== circuitStep) {
        each.deactivate();
      }
    });
  }
}
