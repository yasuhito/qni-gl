import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { Runner } from "@pixi/runner";

export class GateSource {
  static size = Gate.size;

  gateClass: typeof Gate;
  x: number; // 左上の x 座標
  y: number; // 左上の y 座標
  graphics: PIXI.Graphics;

  newGateRunner: Runner;
  enterGateRunner: Runner;
  leaveGateRunner: Runner;
  grabGateRunner: Runner;

  get width(): number {
    const klass = this.constructor as typeof GateSource;
    return klass.size;
  }

  get height(): number {
    const klass = this.constructor as typeof GateSource;
    return klass.size;
  }

  constructor(gateClass: typeof Gate, x: number, y: number) {
    this.gateClass = gateClass;
    this.x = x;
    this.y = y;
    this.graphics = new PIXI.Graphics();

    this.newGateRunner = new Runner("newGate");
    this.enterGateRunner = new Runner("enterGate");
    this.leaveGateRunner = new Runner("leaveGate");
    this.grabGateRunner = new Runner("grabGate");
  }

  generateNewGate(): void {
    const gate = new this.gateClass(
      this.x + Gate.size / 2,
      this.y + Gate.size / 2
    );
    this.newGateRunner.emit(gate);
    // this.graphics.addChild(gate.sprite);

    gate.enterGateRunner.add(this);
    gate.leaveGateRunner.add(this);
    gate.grabGateRunner.add(this);
  }

  private enterGate(gate: Gate) {
    this.enterGateRunner.emit(gate);
  }

  private leaveGate(gate: Gate) {
    this.leaveGateRunner.emit(gate);
  }

  private grabGate(gate: Gate, globalPosition: PIXI.Point) {
    this.generateNewGate();
    this.grabGateRunner.emit(gate, globalPosition);
  }
}
