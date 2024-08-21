import { Container, Graphics } from "pixi.js";
import { Colors, WireColor } from "./colors";
import { WireType } from "./types";

export class DropzoneRenderer {
  private static readonly wireWidth = 2;
  private static readonly connectionWidth = 4;

  private size: number;
  private wire: Graphics;
  private topConnection: Graphics;
  private bottomConnection: Graphics;

  constructor(container: Container, size: number) {
    this.size = size;
    this.wire = new Graphics();
    this.topConnection = new Graphics();
    this.bottomConnection = new Graphics();

    container.addChild(this.wire);
    container.addChild(this.topConnection);
    container.addChild(this.bottomConnection);

    this.updateWires();
    this.initConnections();
  }

  updateWires(
    inputWireType: WireType = WireType.Classical,
    outputWireType: WireType = WireType.Classical,
    isIconGate: boolean = false
  ) {
    this.wire.clear();

    this.drawWireSegment(
      0,
      isIconGate ? this.size / 4 : this.size * 0.75,
      inputWireType
    );
    this.drawWireSegment(
      isIconGate ? (this.size * 5) / 4 : this.size * 0.75,
      this.size * 1.5,
      outputWireType
    );
  }

  updateConnections(connectTop: boolean, connectBottom: boolean) {
    this.topConnection.alpha = connectTop ? 1 : 0;
    this.bottomConnection.alpha = connectBottom ? 1 : 0;
  }

  private initConnections() {
    this.drawConnection(this.topConnection, this.size * -0.25, this.size * 0.5);
    this.drawConnection(
      this.bottomConnection,
      this.size * 0.5,
      this.size * 1.25
    );
  }

  private drawConnection(graphics: Graphics, startY: number, endY: number) {
    const width = DropzoneRenderer.connectionWidth;
    const x = this.size * 0.75 - width / 2;

    graphics
      .clear()
      .rect(x, startY, width, endY - startY)
      .fill(Colors["bg-brand"]);
  }

  private drawWireSegment(startX: number, endX: number, wireType: WireType) {
    this.wire
      .rect(
        startX,
        this.size / 2 - DropzoneRenderer.wireWidth / 2,
        endX - startX,
        DropzoneRenderer.wireWidth
      )
      .fill(this.wireColor(wireType));
  }

  private wireColor(wireType: WireType): WireColor {
    return wireType === WireType.Quantum
      ? Colors["text"]
      : Colors["text-inverse"];
  }
}
