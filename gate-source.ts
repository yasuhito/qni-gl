import * as PIXI from "pixi.js";
import * as tailwindColors from "tailwindcss/colors";
import { BlochSphere } from "./bloch-sphere";
import { Container } from "pixi.js";
import { Gate } from "./gate";
import { PhaseGate } from "./phase-gate";
import { Runner } from "@pixi/runner";
import { Signal } from "typed-signals";
import { XGate } from "./x-gate";

export class GateSource extends Container {
  static size = Gate.size;
  static borderColor = tailwindColors.zinc["300"];

  gateClass: typeof Gate;

  // Container, that holds all inner elements.
  view: Container;
  protected border: PIXI.Graphics;

  // Event that is fired when the button is down.
  onNewGate: Signal<(gate: Gate) => void>;

  enterGateRunner: Runner;
  leaveGateRunner: Runner;
  grabGateRunner: Runner;

  constructor(gateClass: typeof Gate) {
    super();

    this.onNewGate = new Signal();

    this.gateClass = gateClass;
    this.view = new Container();
    this.addChild(this.view);

    this.border = new PIXI.Graphics();
    this.border.width = GateSource.size;
    this.border.height = GateSource.size;
    this.view.addChild(this.border);

    let radius = 4;
    if (
      this.gateClass === XGate ||
      this.gateClass === PhaseGate ||
      this.gateClass === BlochSphere
    ) {
      radius = 9999;
    }
    this.border.lineStyle(1, GateSource.borderColor, 1, 0);
    this.border.drawRoundedRect(this.x, this.y, 32, 32, radius);

    this.enterGateRunner = new Runner("enterGate");
    this.leaveGateRunner = new Runner("leaveGate");
    this.grabGateRunner = new Runner("grabGate");
  }

  generateNewGate(): Gate {
    const gate = new this.gateClass();
    gate.x = this.x;
    gate.y = this.y;

    this.onNewGate.emit(gate);

    gate.enterGateRunner.add(this);
    gate.leaveGateRunner.add(this);
    gate.grabGateRunner.add(this);

    return gate;
  }

  protected enterGate(gate: Gate) {
    this.enterGateRunner.emit(gate);
  }

  protected leaveGate(gate: Gate) {
    this.leaveGateRunner.emit(gate);
  }

  protected grabGate(gate: Gate, globalPosition: PIXI.Point) {
    this.generateNewGate();
    this.grabGateRunner.emit(gate, globalPosition);
  }
}
