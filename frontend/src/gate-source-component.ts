import { Colors } from "./colors";
import { Container, Graphics, Point } from "pixi.js";
import { GateComponent } from "./gate-component";
import { need } from "./util";
import { Spacing } from "./spacing";

/**
 * @noInheritDoc
 */
export class GateSourceComponent extends Container {
  static borderColor = Colors["border-inverse"];
  static borderWidth = 2;

  private gateClass: typeof GateComponent;
  private border: Graphics;

  constructor(gateClass: typeof GateComponent) {
    super();

    this.gateClass = gateClass;
    this.border = new Graphics();

    this.addBorder();
    this.validateBounds();
  }

  private addBorder() {
    this.border
      .roundRect(
        this.borderWidth / 2,
        this.borderWidth / 2,
        this.borderSize,
        this.borderSize,
        this.cornerRadius
      )
      .stroke({
        color: GateSourceComponent.borderColor,
        width: this.borderWidth,
        alignment: 1,
      });

    this.addChild(this.border);
  }

  private get borderSize() {
    return GateComponent.sizeInPx.base - GateSourceComponent.borderWidth;
  }

  private get borderWidth() {
    return GateSourceComponent.borderWidth;
  }

  private get cornerRadius() {
    return this.gateClass.name === "XGate"
      ? Spacing.cornerRadius.full
      : this.gateClass.cornerRadius;
  }

  protected validateBounds(): void {
    const bounds = this.getLocalBounds();
    this.validateBoundsSize(bounds);
    this.validateBoundsPosition(bounds);
  }

  private validateBoundsSize(bounds: { width: number; height: number }) {
    const expectedSize = GateComponent.sizeInPx.base;
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
    const gate = new this.gateClass();
    this.addChild(gate);

    gate.on("mouseLeave", this.emitMouseLeaveGateEvent, this);
    gate.on("grab", this.grabGate, this);
    gate.on("discarded", this.discardGate, this);
    gate.on("snap", this.removeGateEventListeners, this);

    this.emit("newGate", gate);

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

  private grabGate(gate: GateComponent, globalPosition: Point) {
    this.generateNewGate();
    this.emit("grabGate", gate, globalPosition);
  }

  private discardGate(gate: GateComponent) {
    this.removeChild(gate);
    this.emit("gateDiscarded", gate);
  }
}
