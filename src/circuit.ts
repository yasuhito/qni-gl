import { CircuitStep } from "./circuit-step";
import { Container } from "pixi.js";
import { List } from "@pixi/ui";

/**
 * @noInheritDoc
 */
export class Circuit extends Container {
  qubitCount: number; // 量子ビットの数
  stepCount: number; // ステップ数
  view: Container;
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
    }
  }

  toJSON() {
    return {
      steps: this.circuitSteps,
    };
  }
}
