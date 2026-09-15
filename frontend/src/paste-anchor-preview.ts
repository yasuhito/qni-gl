import { Circuit, CircuitCellPosition, CircuitClipboard } from "./circuit";
import { Colors } from "./colors";
import { Dropzone } from "./dropzone";
import { Spacing } from "./spacing";
import { Container, Graphics, Point } from "pixi.js";

/**
 * Ctrl+V の挿入アンカーを、ペースト位置マーカーと薄い範囲表示で示す。
 */
export class PasteAnchorPreview {
  private static readonly MARKER_BLINK_INTERVAL = 500;
  private static readonly MARKER_POSITION_RATIO = 0.65;
  private static readonly PREVIEW_ALPHA = 0.12;

  private readonly container = new Container();
  private blinkTimer: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly circuit: Circuit) {
    this.container.eventMode = "none";
    this.circuit.addChild(this.container);
  }

  sync(
    pasteAnchorCell: CircuitCellPosition | null,
    clipboard: CircuitClipboard | null
  ): void {
    this.clear();

    if (pasteAnchorCell === null) {
      return;
    }

    this.draw(pasteAnchorCell, clipboard);
  }

  clear(): void {
    if (this.blinkTimer !== null) {
      clearInterval(this.blinkTimer);
      this.blinkTimer = null;
    }

    this.container.removeChildren().forEach((child) => {
      child.destroy();
    });
  }

  private draw(
    pasteAnchorCell: CircuitCellPosition,
    clipboard: CircuitClipboard | null
  ): void {
    const insertStartCell = this.insertStartCellFor(pasteAnchorCell);
    const topLeft = this.cellTopLeft(insertStartCell, pasteAnchorCell);

    if (clipboard !== null) {
      const preview = this.createInsertionPreview(clipboard);
      preview.position.copyFrom(topLeft);
      this.container.addChild(preview);
    }

    const marker = this.createMarker(this.previewHeight(clipboard));
    marker.position.copyFrom(topLeft);
    this.container.addChild(marker);

    this.blinkTimer = setInterval(() => {
      marker.visible = !marker.visible;
    }, PasteAnchorPreview.MARKER_BLINK_INTERVAL);
  }

  private createInsertionPreview(clipboard: CircuitClipboard): Graphics {
    const preview = new Graphics()
      .roundRect(
        Dropzone.GATE_INSET_OFFSET,
        Dropzone.GATE_INSET_OFFSET,
        this.previewWidth(clipboard),
        this.previewHeight(clipboard),
        Spacing.cornerRadius.gate
      )
      .fill({
        color: Colors["border-component"],
        alpha: PasteAnchorPreview.PREVIEW_ALPHA,
      });
    preview.eventMode = "none";

    return preview;
  }

  private createMarker(height: number): Graphics {
    const width = Spacing.borderWidth.gate.base;
    const x =
      Dropzone.GATE_INSET_OFFSET * PasteAnchorPreview.MARKER_POSITION_RATIO;

    const marker = new Graphics()
      .roundRect(
        x - width / 2,
        Dropzone.GATE_INSET_OFFSET,
        width,
        height,
        width / 2
      )
      .fill(Colors["border-active"]);
    marker.eventMode = "none";

    return marker;
  }

  private insertStartCellFor(
    position: CircuitCellPosition
  ): CircuitCellPosition {
    return {
      stepIndex: position.stepIndex + 1,
      qubitIndex: position.qubitIndex,
    };
  }

  private previewWidth(clipboard: CircuitClipboard): number {
    return (
      Dropzone.sizeInPx +
      (clipboard.width - 1) * this.referenceDropzoneTotalSize()
    );
  }

  private previewHeight(clipboard: CircuitClipboard | null): number {
    const clipboardHeight = clipboard?.height ?? 1;

    return (
      Dropzone.sizeInPx +
      (clipboardHeight - 1) * this.referenceQubitPitch()
    );
  }

  private cellTopLeft(
    position: CircuitCellPosition,
    anchor: CircuitCellPosition
  ): Point {
    const existingDropzone = this.dropzoneAt(position);
    if (existingDropzone !== null) {
      return this.container.toLocal(existingDropzone.getGlobalPosition());
    }

    const anchorDropzone = this.dropzoneAt(anchor);
    if (anchorDropzone === null) {
      return new Point(0, 0);
    }

    const anchorPosition = anchorDropzone.getGlobalPosition();
    return this.container.toLocal(
      new Point(
        anchorPosition.x +
          (position.stepIndex - anchor.stepIndex) * anchorDropzone.totalSize,
        anchorPosition.y +
          (position.qubitIndex - anchor.qubitIndex) * this.referenceQubitPitch()
      )
    );
  }

  private dropzoneAt(position: CircuitCellPosition): Dropzone | null {
    const step = this.circuit.steps[position.stepIndex];
    if (step === undefined) {
      return null;
    }

    return step.dropzones[position.qubitIndex] ?? null;
  }

  private referenceDropzoneTotalSize(): number {
    return this.circuit.steps[0]?.dropzones[0]?.totalSize ?? Dropzone.sizeInPx;
  }

  private referenceQubitPitch(): number {
    const referenceDropzones = this.circuit.steps[0]?.dropzones;
    if (referenceDropzones !== undefined && referenceDropzones.length >= 2) {
      return (
        referenceDropzones[1].getGlobalPosition().y -
        referenceDropzones[0].getGlobalPosition().y
      );
    }

    return this.referenceDropzoneTotalSize();
  }
}
