import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { Runner } from "@pixi/runner";
import { SwapGate } from "./swap-gate";
import { ControlGate } from "./control-gate";
import { AntiControlGate } from "./anti-control-gate";
import { Write0Gate } from "./write0-gate";
import { Write1Gate } from "./write1-gate";
import { MeasurementGate } from "./measurement-gate";
import * as tailwindColors from "tailwindcss/colors";

export class GateSource {
  static size = Gate.size;
  static borderColor = tailwindColors.zinc["300"];

  gateClass: typeof Gate;
  x: number; // 左上の x 座標
  y: number; // 左上の y 座標
  graphics: PIXI.Graphics;

  newGateRunner: Runner;
  enterGateRunner: Runner;
  leaveGateRunner: Runner;
  grabGateRunner: Runner;

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

  generateNewGate(): Gate {
    const gate = new this.gateClass(
      this.x + Gate.size / 2,
      this.y + Gate.size / 2
    );
    this.newGateRunner.emit(gate);

    gate.enterGateRunner.add(this);
    gate.leaveGateRunner.add(this);
    gate.grabGateRunner.add(this);

    // 枠線を入れる
    if (
      this.gateClass === SwapGate ||
      this.gateClass === ControlGate ||
      this.gateClass === AntiControlGate ||
      this.gateClass === Write0Gate ||
      this.gateClass === Write1Gate ||
      this.gateClass === MeasurementGate
    ) {
      this.graphics.lineStyle(1, GateSource.borderColor, 1, 0);
      this.graphics.drawRoundedRect(
        this.x,
        this.y,
        gate.width,
        gate.height,
        gate.cornerRadius
      );
    }

    return gate;
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
