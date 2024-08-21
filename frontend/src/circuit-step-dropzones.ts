import { DropzoneComponent } from "./dropzone-component";
import { List } from "@pixi/ui";
import { OperationComponent } from "./operation-component";
import { Operation } from "./operation";

export class CircuitStepDropzones extends List {
  private static readonly PADDING = DropzoneComponent.size;
  private static readonly MARGIN = DropzoneComponent.size / 2;

  constructor() {
    super({
      type: "vertical",
      elementsMargin: CircuitStepDropzones.MARGIN,
      vertPadding: CircuitStepDropzones.PADDING,
    });
    this.eventMode = "static";
  }

  get all(): DropzoneComponent[] {
    return this.children as DropzoneComponent[];
  }

  filterByOperationType(
    gateType: typeof OperationComponent
  ): DropzoneComponent[] {
    return this.occupied.filter((each) => each.operation instanceof gateType);
  }

  findIndexOf(operation: Operation): number {
    return this.all.findIndex((dropzone) => dropzone.operation === operation);
  }

  get length(): number {
    return this.children.length;
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
    this.addChild(dropzone);
    return dropzone;
  }

  removeLast(): void {
    const dropzone = this.fetch(this.length - 1);
    this.removeChildAt(this.length - 1);
    dropzone.destroy();
  }

  get height(): number {
    return (
      DropzoneComponent.size * this.length +
      (this.length - 1) * CircuitStepDropzones.MARGIN +
      CircuitStepDropzones.PADDING * 2
    );
  }
}