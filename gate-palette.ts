import * as PIXI from "pixi.js";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";
import { Gate } from "./gate";
import { GateSource } from "./gate-source";
import { Runner } from "@pixi/runner";
import { spacingInPx } from "./util";
import * as tailwindColors from "tailwindcss/colors";

export class GatePalette {
  static horizontalPadding = spacingInPx(6);
  static verticalPadding = spacingInPx(4);
  static gapBetweenGates = spacingInPx(2);
  static cornerRadius = spacingInPx(3);
  static backgroundColor = tailwindColors.white;
  static borderWidth = 1;
  static borderColor = tailwindColors.zinc["400"];

  x: number; // 左上の x 座標
  y: number; // 左上の y 座標
  graphics: PIXI.Graphics;
  gateClasses: (typeof Gate)[][] = [];
  gates = {};

  newGateRunner: Runner;
  enterGateRunner: Runner;
  leaveGateRunner: Runner;
  grabGateRunner: Runner;

  get width(): number {
    return (
      Gate.size * this.horizontalGateCount +
      GatePalette.gapBetweenGates * (this.horizontalGateCount - 1) +
      GatePalette.horizontalPadding * 2
    );
  }

  private get horizontalGateCount(): number {
    if (this.gateClasses[1] === undefined) {
      this.gateClasses[1] = [];
    }
    if (this.gateClasses[2] === undefined) {
      this.gateClasses[2] = [];
    }

    return Math.max(this.gateClasses[1].length, this.gateClasses[2].length);
  }

  get height(): number {
    let gateRows = 0;
    for (const each of this.gateClasses) {
      if (each !== undefined && each.length > 0) {
        gateRows += 1;
      }
    }

    return (
      Gate.size * gateRows +
      GatePalette.gapBetweenGates * (gateRows - 1) +
      GatePalette.verticalPadding * 2
    );
  }

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.graphics = new PIXI.Graphics();

    this.newGateRunner = new Runner("newGate");
    this.enterGateRunner = new Runner("enterGate");
    this.leaveGateRunner = new Runner("leaveGate");
    this.grabGateRunner = new Runner("grabGate");

    this.draw();
  }

  addGate(gateClass: typeof Gate, row = 1): Gate {
    if (this.gateClasses[row] === undefined) {
      this.gateClasses[row] = [];
    }
    this.gateClasses[row].push(gateClass);
    const x =
      this.x +
      GatePalette.horizontalPadding +
      (this.gateClasses[row].length - 1) *
        (Gate.size + GatePalette.gapBetweenGates);
    const y =
      this.y +
      GatePalette.verticalPadding +
      (row - 1) * (Gate.size + GatePalette.gapBetweenGates);
    const gateSource = new GateSource(gateClass, x, y);
    this.graphics.addChild(gateSource.graphics);

    gateSource.newGateRunner.add(this);
    gateSource.enterGateRunner.add(this);
    gateSource.leaveGateRunner.add(this);
    gateSource.grabGateRunner.add(this);

    const gate = gateSource.generateNewGate();
    this.gates[gate.gateType()] = gate;

    this.draw();

    return gate;
  }

  draw(): void {
    this.graphics.clear();

    this.graphics.lineStyle(1, GatePalette.borderColor, 1, 0);
    this.graphics.beginFill(GatePalette.backgroundColor);
    this.graphics.drawRoundedRect(
      this.x,
      this.y,
      this.width,
      this.height,
      GatePalette.cornerRadius
    );
    this.graphics.endFill();

    // TODO: dropshadow の定義を別ファイルに移動
    this.graphics.filters = [
      new DropShadowFilter({ offset: { x: 0, y: 4 }, blur: 3, alpha: 0.07 }),
      new DropShadowFilter({ offset: { x: 0, y: 2 }, blur: 2, alpha: 0.06 }),
    ];
  }

  toJSON(): string {
    const json = {
      gatePalette: {
        x: this.x,
        y: this.y,
        gates: this.gates,
      },
    };
    return JSON.stringify(json);
  }

  private newGate(gate: Gate) {
    this.newGateRunner.emit(gate);
  }

  private enterGate(gate: Gate) {
    this.enterGateRunner.emit(gate);
  }

  private leaveGate(gate: Gate) {
    this.leaveGateRunner.emit(gate);
  }

  private grabGate(gate: Gate, globalPosition: PIXI.Point) {
    this.grabGateRunner.emit(gate, globalPosition);
  }
}
