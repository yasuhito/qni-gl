import { Colors, FULL_OPACITY, NO_OPACITY, WireColor } from "./colors";
import { Dropzone } from "./dropzone";
import { Graphics } from "pixi.js";
import { WireType } from "./types";
import { spacingInPx } from "./util";

type WireUpdateInfo = {
  inputWireType: WireType;
  outputWireType: WireType;
};

type ConnectionUpdateInfo = {
  connectTop: boolean;
  connectBottom: boolean;
};

type WireSegment = {
  wireType: WireType;
  startX: number;
  endX: number;
};

type ConnectionPosition = {
  startY: number;
  endY: number;
};

/**
 * Responsible for rendering the visual components of a Dropzone,
 * including the body, wires, and connections.
 */
export class DropzoneRenderer {
  private static readonly WIRE_WIDTH = spacingInPx(0.5);
  private static readonly CONNECTION_WIDTH = spacingInPx(1);
  private static readonly NARROW_WIDTH_OPERATIONS = [
    "Write0Gate",
    "Write1Gate",
    "MeasurementGate",
  ];
  private static readonly HALF_RATIO = 0.5;
  private static readonly NARROW_RATIO = 0.25;

  private dropzone: Dropzone;
  private body!: Graphics;
  private wire!: Graphics;
  private topConnection!: Graphics;
  private bottomConnection!: Graphics;
  private pastedWire!: Graphics;
  private pastedTopConnection!: Graphics;
  private pastedBottomConnection!: Graphics;
  private connectTop = false;
  private connectBottom = false;

  private get totalSize(): number {
    return this.dropzone.totalSize;
  }

  private get isNarrowWidthOperation(): boolean {
    const operation = this.dropzone.operation;
    return (
      operation !== null &&
      DropzoneRenderer.NARROW_WIDTH_OPERATIONS.includes(operation.operationType)
    );
  }

  private get wireEndRatio(): number {
    return this.isNarrowWidthOperation
      ? DropzoneRenderer.NARROW_RATIO
      : DropzoneRenderer.HALF_RATIO;
  }

  constructor(dropzone: Dropzone) {
    this.dropzone = dropzone;
    this.initializeGraphics();
    this.addChildrenToDropzone();
    this.initBody();
    this.initConnections();
  }

  private initializeGraphics(): void {
    this.body = new Graphics({ alpha: FULL_OPACITY });
    this.wire = new Graphics();
    this.topConnection = new Graphics();
    this.bottomConnection = new Graphics();
    this.pastedWire = new Graphics();
    this.pastedTopConnection = new Graphics();
    this.pastedBottomConnection = new Graphics();
  }

  private addChildrenToDropzone(): void {
    this.dropzone.addChild(
      this.body,
      this.wire,
      this.topConnection,
      this.bottomConnection,
      this.pastedWire,
      this.pastedTopConnection,
      this.pastedBottomConnection
    );
  }

  /**
   * Updates the input and output wires of the dropzone.
   */
  updateWires({ inputWireType, outputWireType }: WireUpdateInfo): void {
    this.wire.clear();
    this.pastedWire.clear();

    this.updateInputWire(inputWireType);
    this.updateOutputWire(outputWireType);
  }

  /**
   * Updates the visibility of top and bottom connections.
   */
  updateConnections({ connectTop, connectBottom }: ConnectionUpdateInfo): void {
    this.connectTop = connectTop;
    this.connectBottom = connectBottom;
    this.topConnection.alpha = connectTop ? NO_OPACITY : FULL_OPACITY;
    this.bottomConnection.alpha = connectBottom ? NO_OPACITY : FULL_OPACITY;
  }

  setPastedEmphasisAlpha(alpha: number): void {
    this.pastedWire.alpha = alpha;
    this.pastedTopConnection.alpha = this.connectTop ? alpha : 0;
    this.pastedBottomConnection.alpha = this.connectBottom ? alpha : 0;
  }

  private initBody(): void {
    this.body
      .clear()
      .rect(0, 0, this.dropzone.totalSize, this.dropzone.totalSize)
      .fill(0x000000);
  }

  private updateInputWire(wireType: WireType): void {
    const wire = { wireType, startX: 0, endX: this.inputWireEndX() };

    this.drawWire(wire);
    this.drawPastedWire(wire);
  }

  private updateOutputWire(wireType: WireType): void {
    const wire = {
      wireType,
      startX: this.outputWireStartX(),
      endX: this.totalSize,
    };

    this.drawWire(wire);
    this.drawPastedWire(wire);
  }

  private inputWireEndX(): number {
    return this.totalSize * this.wireEndRatio;
  }

  private outputWireStartX(): number {
    return this.totalSize * (1 - this.wireEndRatio);
  }

  private initConnections(): void {
    const halfSize = this.totalSize * 0.5;
    this.drawConnection(this.topConnection, { startY: 0, endY: halfSize });
    this.drawConnection(this.bottomConnection, {
      startY: halfSize,
      endY: this.totalSize,
    });
    this.drawConnection(this.pastedTopConnection, {
      startY: 0,
      endY: halfSize,
    }, 0xffffff);
    this.drawConnection(this.pastedBottomConnection, {
      startY: halfSize,
      endY: this.totalSize,
    }, 0xffffff);
    this.setPastedEmphasisAlpha(0);
  }

  private drawConnection(
    graphics: Graphics,
    { startY, endY }: ConnectionPosition,
    color: string | number = Colors["bg-brand"]
  ): void {
    const width = DropzoneRenderer.CONNECTION_WIDTH;
    const x = this.totalSize * 0.5 - width / 2;

    graphics
      .clear()
      .rect(x, startY, width, endY - startY)
      .fill(color);
  }

  private drawPastedWire({ startX, endX }: WireSegment): void {
    this.drawWireSegment(this.pastedWire, startX, endX, 0xffffff);
  }

  private drawWire({ wireType, startX, endX }: WireSegment): void {
    this.drawWireSegment(this.wire, startX, endX, this.wireColor(wireType));
  }

  private drawWireSegment(
    graphics: Graphics,
    startX: number,
    endX: number,
    color: string | number
  ): void {
    graphics
      .rect(
        startX,
        this.totalSize * 0.5 - DropzoneRenderer.WIRE_WIDTH / 2,
        endX - startX,
        DropzoneRenderer.WIRE_WIDTH
      )
      .fill(color);
  }

  private wireColor(wireType: WireType): WireColor {
    return Colors[wireType === WireType.Quantum ? "text" : "text-inverse"];
  }
}
