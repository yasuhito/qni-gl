import * as PIXI from "pixi.js";
import { ColorsOld } from "./colors";
import { Container } from "pixi.js";
import { GateComponent } from "./gate-component";
import { spacingInPx } from "./util";

/**
 * @noInheritDoc
 */
export class GateSourceComponent extends Container {
  static size = spacingInPx(8);
  static borderColor = ColorsOld.border.gateSource.default;

  private gateClass: typeof GateComponent;
  private border: PIXI.Graphics;

  constructor(gateClass: typeof GateComponent) {
    super();

    this.gateClass = gateClass;

    this.border = new PIXI.Graphics();
    this.border.width = GateSourceComponent.size;
    this.border.height = GateSourceComponent.size;
    this.addChild(this.border);

    this.border.lineStyle(2, GateSourceComponent.borderColor, 1, 0);
    this.border.drawRoundedRect(
      this.x,
      this.y,
      GateSourceComponent.size,
      GateSourceComponent.size,
      this.gateClass.radius
    );
  }

  generateNewGate(): GateComponent {
    const gate = new this.gateClass();
    this.addChild(gate);

    this.emit("newGate", gate);

    gate.on("mouseLeave", this.emitMouseLeaveGateEvent, this);
    gate.on("grab", this.grabGate, this);
    gate.on("discarded", this.discardGate, this);
    gate.on("snap", this.removeGateEventListeners, this);

    return gate;
  }

  private removeGateEventListeners(gate: GateComponent) {
    gate.off("grab", this.grabGate, this);
    gate.off("mouseLeave", this.emitMouseLeaveGateEvent, this);
    gate.off("snap", this.removeGateEventListeners, this);
  }

  private emitMouseLeaveGateEvent(gate: GateComponent) {
    this.emit("mouseLeaveGate", gate);
  }

  private grabGate(gate: GateComponent, globalPosition: PIXI.Point) {
    this.generateNewGate();
    this.emit("grabGate", gate, globalPosition);
  }

  private discardGate(gate: GateComponent) {
    this.removeChild(gate);
    this.emit("gateDiscarded", gate);
  }
}
