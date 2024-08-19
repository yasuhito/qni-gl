import { Colors } from "./colors";
import { Container, Graphics, Point } from "pixi.js";
import { GateComponent } from "./gate-component";
import { GateStyle } from "./gate-style-mixin";
import { need } from "./util";

export class GateSourceComponent extends Container {
  static borderColor = Colors["border-inverse"];

  private gateClass: typeof GateComponent;
  private border: Graphics;

  constructor(gateClass: typeof GateComponent) {
    super();

    this.gateClass = gateClass;
    this.border = new Graphics();
    this.addChild(this.border);
  }

  private drawBorder(gate: GateComponent & GateStyle) {
    const width = gate.borderWidth;
    const size = gate.sizeInPx - width;
    const cornerRadius = gate.cornerRadius;
    const color = GateSourceComponent.borderColor;
    const alignment = 1;

    this.border
      .roundRect(width / 2, width / 2, size, size, cornerRadius)
      .stroke({
        color,
        width,
        alignment,
      });
  }

  protected validateBounds(gate: GateComponent & GateStyle): void {
    const bounds = this.getLocalBounds();

    this.validateBoundsSize(bounds, gate);
    this.validateBoundsPosition(bounds);
  }

  private validateBoundsSize(
    bounds: { width: number; height: number },
    gate: GateComponent & GateStyle
  ) {
    const expectedSize = gate.sizeInPx;

    need(
      bounds.width === expectedSize && bounds.height === expectedSize,
      `Size is incorrect: ${bounds.width}x${bounds.height}, expected: ${expectedSize}x${expectedSize}`
    );
  }

  private validateBoundsPosition(bounds: { x: number; y: number }) {
    need(
      bounds.x === 0 && bounds.y === 0,
      `Position is incorrect: (${bounds.x}, ${bounds.y}), expected: (0, 0)`
    );
  }

  generateNewGate(): GateComponent {
    const gate = this.createGate();

    this.addChild(gate);
    this.setupGateEventListeners(gate);
    this.drawBorder(gate);
    this.validateBounds(gate);
    this.emitNewGateEvent(gate);

    return gate;
  }

  private createGate(): GateComponent & GateStyle {
    return new this.gateClass() as GateComponent & GateStyle;
  }

  private setupGateEventListeners(gate: GateComponent): void {
    gate.on("mouseLeave", this.emitMouseLeaveGateEvent, this);
    gate.on("grab", this.grabGate, this);
    gate.on("discarded", this.discardGate, this);
    gate.on("snap", this.removeGateEventListeners, this);
  }

  private removeGateEventListeners(gate: GateComponent) {
    gate.off("grab", this.grabGate, this);
    gate.off("mouseLeave", this.emitMouseLeaveGateEvent, this);
    gate.off("snap", this.removeGateEventListeners, this);
  }

  private emitNewGateEvent(gate: GateComponent): void {
    this.emit("newGate", gate);
  }

  private emitMouseLeaveGateEvent(gate: GateComponent) {
    this.emit("mouseLeaveGate", gate);
  }

  private grabGate(gate: GateComponent, globalPosition: Point) {
    this.generateNewGate();
    this.emit("grabGate", gate, globalPosition);
  }

  private discardGate(gate: GateComponent) {
    this.removeChild(gate);
    this.emit("gateDiscarded", gate);
  }
}
