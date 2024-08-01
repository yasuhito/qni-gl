import { DropzoneComponent } from "./dropzone-component";
import { List } from "@pixi/ui";
import { GateComponent } from "./gate-component";

export class CircuitStepDropzones {
  private static readonly PADDING_Y = DropzoneComponent.size;
  private static readonly MARGIN = DropzoneComponent.size / 2;

  private _dropzones: List;

  constructor() {
    this._dropzones = new List({
      type: "vertical",
      elementsMargin: CircuitStepDropzones.MARGIN,
      vertPadding: CircuitStepDropzones.PADDING_Y,
    });
    this._dropzones.eventMode = "static";
  }

  get container() {
    return this._dropzones;
  }

  get all(): DropzoneComponent[] {
    return this._dropzones.children as DropzoneComponent[];
  }

  filterByOperationType(gateType: typeof GateComponent): DropzoneComponent[] {
    return this.occupied.filter((each) => each.operation instanceof gateType);
  }

  get length() {
    return this._dropzones.children.length;
  }

  get occupied() {
    return this.all.filter((each) => each.isOccupied());
  }

  at(index: number) {
    return this.all[index];
  }

  append() {
    const dropzone = new DropzoneComponent();
    this._dropzones.addChild(dropzone);
    return dropzone;
  }

  deleteLast() {
    const dropzone = this.at(this.length - 1);
    this._dropzones.removeChildAt(this.length - 1);
    dropzone.destroy();
  }

  get width(): number {
    return this._dropzones.width;
  }

  get height(): number {
    return (
      DropzoneComponent.size * this.length +
      (this.length - 1) * CircuitStepDropzones.MARGIN +
      CircuitStepDropzones.PADDING_Y * 2
    );
  }
}
