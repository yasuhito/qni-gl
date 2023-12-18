import * as PIXI from "pixi.js";
import * as tailwindColors from "tailwindcss/colors";
import { BlochSphere } from "./bloch-sphere";
import { Container } from "pixi.js";
import { GateComponent } from "./gate-component";
import { PhaseGate } from "./phase-gate";
import { Runner } from "@pixi/runner";
import { XGate } from "./x-gate";

/**
 * @noInheritDoc
 */
export class GateSourceComponent extends Container {
  static size = GateComponent.size;
  static borderColor = tailwindColors.zinc["300"];

  gateClass: typeof GateComponent;

  // Container, that holds all inner elements.
  view: Container;
  protected border: PIXI.Graphics;

  enterGateRunner: Runner;

  constructor(gateClass: typeof GateComponent) {
    super();

    this.gateClass = gateClass;
    this.view = new Container();
    this.addChild(this.view);

    this.border = new PIXI.Graphics();
    this.border.width = GateSourceComponent.size;
    this.border.height = GateSourceComponent.size;
    this.view.addChild(this.border);

    let radius = 4;
    if (
      this.gateClass === XGate ||
      this.gateClass === PhaseGate ||
      this.gateClass === BlochSphere
    ) {
      radius = 9999;
    }
    this.border.lineStyle(2, GateSourceComponent.borderColor, 1, 0);
    this.border.drawRoundedRect(this.x, this.y, 32, 32, radius);

    this.enterGateRunner = new Runner("enterGate");
  }

  generateNewGate(): GateComponent {
    const gate = new this.gateClass();
    gate.x = this.x;
    gate.y = this.y;

    this.emit("newGate", gate);

    gate.on("mouseLeave", (gate) => {
      this.emit("mouseLeaveGate", gate);
    });
    gate.on("grab", (gate, globalPosition) => {
      this.grabGate(gate, globalPosition);
    });
    gate.on("dropped", (gate) => {
      this.emit("gateDropped", gate);
    });

    return gate;
  }

  protected enterGate(gate: GateComponent) {
    this.enterGateRunner.emit(gate);
  }

  protected grabGate(gate: GateComponent, globalPosition: PIXI.Point) {
    this.generateNewGate();
    this.emit("grabGate", gate, globalPosition);
  }
}
