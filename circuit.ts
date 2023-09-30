import * as PIXI from "pixi.js";
import { CircuitStep } from "./circuit-step";

export class Circuit {
  qubitCount: number; // 量子ビットの数
  stepCount: number; // ステップ数
  x: number; // 左上の x 座標
  y: number; // 左上の y 座標
  graphics: PIXI.Graphics;
  circuitSteps: CircuitStep[] = [];

  get width(): number {
    return this.circuitSteps[0].width;
  }

  get height(): number {
    return this.circuitSteps.length * this.circuitSteps[0].height;
  }

  constructor(qubitCount: number, stepCount: number, x: number, y: number) {
    this.qubitCount = qubitCount;
    this.stepCount = stepCount;
    this.x = x;
    this.y = y;
    this.graphics = new PIXI.Graphics();

    for (let i = 0; i < this.stepCount; i++) {
      const circuitStep = new CircuitStep(
        this.qubitCount,
        this.x,
        this.y + i * CircuitStep.height
      );
      this.circuitSteps.push(circuitStep);
      this.graphics.addChild(circuitStep.graphics);
    }
  }

  toJSON() {
    return "";
  }
}
