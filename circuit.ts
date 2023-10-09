import * as PIXI from "pixi.js";
import { CircuitStep } from "./circuit-step";
import { Container } from "pixi.js";
import { List } from "@pixi/ui";

export class Circuit extends Container {
  qubitCount: number; // 量子ビットの数
  stepCount: number; // ステップ数
  view: PIXI.Graphics;
  circuitSteps: CircuitStep[] = [];
  list: List;

  get width(): number {
    return this.circuitSteps[0].width;
  }

  get height(): number {
    return this.circuitSteps.length * this.circuitSteps[0].height;
  }

  // x, y は回路の右上の座標 (モバイルの場合)
  constructor(qubitCount: number, stepCount: number) {
    super();

    this.qubitCount = qubitCount;
    this.stepCount = stepCount;

    this.view = new PIXI.Graphics();
    this.addChild(this.view);

    this.list = new List({
      type: "horizontal",
    });
    this.view.addChild(this.list);

    for (let i = 0; i < this.stepCount; i++) {
      const circuitStep = new CircuitStep(this.qubitCount);
      this.list.addChild(circuitStep);
    }

    // for (let i = 0; i < this.stepCount; i++) {
    //   const circuitStep = new CircuitStep(
    //     this.qubitCount,
    //     this.x,
    //     this.y + i * CircuitStep.height
    //   );
    //   this.circuitSteps.push(circuitStep);
    //   this.view.addChild(circuitStep);
    // }
  }

  toJSON() {
    return {
      steps: this.circuitSteps,
    };
  }
}
