import { DropzoneComponent } from "./dropzone-component";
import { List } from "@pixi/ui";
import { GateComponent } from "./gate-component";
import { Operation } from "./operation";

export class CircuitStepDropzones {
  private static readonly PADDING = DropzoneComponent.size;
  private static readonly MARGIN = DropzoneComponent.size / 2;
  private _dropzones: List;

  constructor() {
    this._dropzones = new List({
      type: "vertical",
      elementsMargin: CircuitStepDropzones.MARGIN,
      vertPadding: CircuitStepDropzones.PADDING,
    });
    this._dropzones.eventMode = "static";
  }

  get container(): List {
    return this._dropzones;
  }

  get all(): DropzoneComponent[] {
    return this._dropzones.children as DropzoneComponent[];
  }

  filterByOperationType(gateType: typeof GateComponent): DropzoneComponent[] {
    return this.occupied.filter((each) => each.operation instanceof gateType);
  }

  findIndexOf(operation: Operation): number {
    return this.all.findIndex((dropzone) => dropzone.operation === operation);
  }

  get length(): number {
    return this._dropzones.children.length;
  }

  get occupied(): DropzoneComponent[] {
    return this.all.filter((each) => each.isOccupied());
  }

  at(index: number): DropzoneComponent | undefined {
    if (index < 0 || index >= this.length) {
      return undefined;
    }

    return this.all[index];
  }

  fetch(index: number): DropzoneComponent {
    const dropzone = this.at(index);
    if (!dropzone) {
      throw new Error(`Dropzone at index ${index} not found`);
    }

    return dropzone;
  }

  append(): DropzoneComponent {
    const dropzone = new DropzoneComponent();
    this._dropzones.addChild(dropzone);
    return dropzone;
  }

  removeLast(): void {
    const dropzone = this.fetch(this.length - 1);
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
      CircuitStepDropzones.PADDING * 2
    );
  }
}
