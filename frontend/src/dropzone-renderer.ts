import { Container, Graphics } from "pixi.js";
import { Colors, WireColor } from "./colors";
import { WireType } from "./types";

export class DropzoneRenderer {
  private static readonly wireWidth = 2;

  private wire: Graphics;
  private connection: Graphics;

  constructor(container: Container) {
    this.wire = new Graphics();
    this.connection = new Graphics();

    container.addChild(this.wire);
    container.addChild(this.connection);
  }

  drawWires(
    inputWireType: WireType,
    outputWireType: WireType,
    size: number,
    isIconGate: boolean
  ) {
    this.wire.clear();

    this.drawWireSegment(
      0,
      isIconGate ? size / 4 : size * 0.75,
      this.getWireColor(inputWireType),
      inputWireType,
      size
    );
    this.drawWireSegment(
      isIconGate ? (size * 5) / 4 : size * 0.75,
      size * 1.5,
      this.getWireColor(outputWireType),
      outputWireType,
      size
    );
  }

  drawConnections(connectTop: boolean, connectBottom: boolean, size: number) {
    this.connection.clear();

    if (connectTop) {
      this.drawConnection(size * -0.25, size * 0.5, size);
    }
    if (connectBottom) {
      this.drawConnection(size * 0.5, size * 1.25, size);
    }
  }

  private drawWireSegment(
    startX: number,
    endX: number,
    color: WireColor,
    wireType: WireType,
    size: number
  ) {
    this.wire
      .rect(
        startX,
        size / 2 - DropzoneRenderer.wireWidth / 2,
        endX - startX,
        DropzoneRenderer.wireWidth
      )
      .fill(color);

    if (wireType === WireType.Quantum) {
      // Add quantum wire specific rendering if needed
    }
  }

  private drawConnection(startY: number, endY: number, size: number) {
    this.connection
      .moveTo(size * 0.75, startY)
      .lineTo(size * 0.75, endY)
      .stroke({ color: Colors["bg-brand"], width: 4 });
  }

  private getWireColor(wireType: WireType): WireColor {
    return wireType === WireType.Quantum
      ? Colors["text"]
      : Colors["text-inverse"];
  }
}
