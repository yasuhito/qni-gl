import * as PIXI from "pixi.js";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";
import { Gate } from "./gate";
import { GateSource } from "./gate-source";
import { Runner } from "@pixi/runner";

export class GatePalette {
  static horizontalPadding = 24;
  static verticalPadding = 16;
  static horizontalGapBetweenGates = 8;
  static cornerRadius = 12;

  x: number; // 左上の x 座標
  y: number; // 左上の y 座標
  graphics: PIXI.Graphics;
  gateClasses: (typeof Gate)[] = [];

  newGateRunner: Runner;
  enterGateRunner: Runner;
  leaveGateRunner: Runner;
  grabGateRunner: Runner;

  get width(): number {
    return 560;
  }

  get height(): number {
    return 104;
  }

  constructor(x: number, y: number) {
    const klass = this.constructor as typeof GatePalette;

    this.x = x;
    this.y = y;
    this.graphics = new PIXI.Graphics();

    this.newGateRunner = new Runner("newGate");
    this.enterGateRunner = new Runner("enterGate");
    this.leaveGateRunner = new Runner("leaveGate");
    this.grabGateRunner = new Runner("grabGate");

    this.graphics.lineStyle(1, 0xd4d4d8, 1, 0); // Zinc/300 https://tailwindcss.com/docs/customizing-colors
    this.graphics.beginFill(0xffffff, 1);
    this.graphics.drawRoundedRect(
      this.x,
      this.y,
      this.width,
      this.height,
      klass.cornerRadius
    );
    this.graphics.endFill();

    // TODO: dropshadow の定義を別ファイルに移動
    this.graphics.filters = [
      new DropShadowFilter({ offset: { x: 0, y: 4 }, blur: 3, alpha: 0.07 }),
      new DropShadowFilter({ offset: { x: 0, y: 2 }, blur: 2, alpha: 0.06 }),
    ];
  }

  addGate(gateClass: typeof Gate): void {
    this.gateClasses.push(gateClass);
    const x =
      this.x +
      GatePalette.horizontalPadding +
      (this.gateClasses.length - 1) *
        (Gate.size + GatePalette.horizontalGapBetweenGates);
    const y = this.y + GatePalette.verticalPadding;
    const gateSource = new GateSource(gateClass, x, y);
    this.graphics.addChild(gateSource.graphics);

    gateSource.newGateRunner.add(this);
    gateSource.enterGateRunner.add(this);
    gateSource.leaveGateRunner.add(this);
    gateSource.grabGateRunner.add(this);

    gateSource.generateNewGate();
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
