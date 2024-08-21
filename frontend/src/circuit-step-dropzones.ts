import { Dropzone } from "./dropzone";
import { List } from "@pixi/ui";
import { OperationComponent } from "./operation-component";
import { Operation } from "./operation";

export class CircuitStepDropzones extends List {
  private static readonly PADDING = Dropzone.size;
  private static readonly MARGIN = Dropzone.size / 2;

  constructor() {
    super({
      type: "vertical",
      vertPadding: CircuitStepDropzones.PADDING,
    });
    this.eventMode = "static";
  }

  get all(): Dropzone[] {
    return this.children as Dropzone[];
  }

  filterByOperationType(gateType: typeof OperationComponent): Dropzone[] {
    return this.occupied.filter((each) => each.operation instanceof gateType);
  }

  findIndexOf(operation: Operation): number {
    return this.all.findIndex((dropzone) => dropzone.operation === operation);
  }

  get length(): number {
    return this.children.length;
  }

  get occupied(): Dropzone[] {
    return this.all.filter((each) => each.isOccupied());
  }

  at(index: number): Dropzone | undefined {
    if (index < 0 || index >= this.length) {
      return undefined;
    }

    return this.all[index];
  }

  fetch(index: number): Dropzone {
    const dropzone = this.at(index);
    if (!dropzone) {
      throw new Error(`Dropzone at index ${index} not found`);
    }

    return dropzone;
  }

  append(): Dropzone {
    const dropzone = new Dropzone();
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
      Dropzone.size * this.length +
      (this.length - 1) * CircuitStepDropzones.MARGIN +
      CircuitStepDropzones.PADDING * 2
    );
  }
}
