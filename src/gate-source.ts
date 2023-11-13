import * as PIXI from "pixi.js";
import * as tailwindColors from "tailwindcss/colors";
import { BlochSphere } from "./bloch-sphere";
import { Container } from "pixi.js";
import { Gate } from "./gate";
import { PhaseGate } from "./phase-gate";
import { Runner } from "@pixi/runner";
import { Signal } from "typed-signals";
import { SignalGate, SignalGateWithPosition } from "./gate";
import { XGate } from "./x-gate";

/**
 * @noInheritDoc
 */
export class GateSource extends Container {
  static size = Gate.size;
  static borderColor = tailwindColors.zinc["300"];

  gateClass: typeof Gate;

  // Container, that holds all inner elements.
  view: Container;
  protected border: PIXI.Graphics;

  /** ゲートをクリックした時に発生するシグナル */
  onGrabGate: SignalGateWithPosition;
  /** 新しいゲートを生成した時に発生するシグナル */
  onNewGate: SignalGate;
  /** ゲートからマウスポインタが離れた時に発生するシグナル */
  onMouseLeaveGate: SignalGate;

  enterGateRunner: Runner;

  constructor(gateClass: typeof Gate) {
    super();

    this.onNewGate = new Signal();
    this.onGrabGate = new Signal();
    this.onMouseLeaveGate = new Signal();

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
    this.border.lineStyle(2, GateSource.borderColor, 1, 0);
    this.border.drawRoundedRect(this.x, this.y, 32, 32, radius);

    this.enterGateRunner = new Runner("enterGate");
  }

  generateNewGate(): Gate {
    const gate = new this.gateClass();
    gate.x = this.x;
    gate.y = this.y;

    this.onNewGate.emit(gate);

    gate.onMouseLeave.connect((gate) => {
      this.onMouseLeaveGate.emit(gate);
    });

    gate.onGrab.connect((gate, globalPosition) => {
      this.grabGate(gate, globalPosition);
    });

    return gate;
  }

  protected enterGate(gate: Gate) {
    this.enterGateRunner.emit(gate);
  }

  protected grabGate(gate: Gate, globalPosition: PIXI.Point) {
    this.generateNewGate();
    this.onGrabGate.emit(gate, globalPosition);
  }
}
