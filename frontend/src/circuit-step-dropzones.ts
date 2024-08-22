import { Dropzone } from "./dropzone";
import { List } from "@pixi/ui";
import { OperationComponent } from "./operation-component";
import { Operation } from "./operation";

export class CircuitStepDropzones extends List {
  get size(): number {
    return this.children.length;
  }

  get all(): Dropzone[] {
    return this.children as Dropzone[];
  }

  get occupied(): Dropzone[] {
    return this.all.filter((each) => each.isOccupied());
  }

  constructor({ padding }: { padding: number }) {
    super({
      type: "vertical",
      vertPadding: padding,
    });

    this.eventMode = "static";
  }

  at(index: number): Dropzone | undefined {
    if (index < 0 || index >= this.size) {
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

  filterByOperationType(gateType: typeof OperationComponent): Dropzone[] {
    return this.occupied.filter((each) => each.operation instanceof gateType);
  }

  findIndexOf(operation: Operation): number {
    return this.all.findIndex((dropzone) => dropzone.operation === operation);
  }

  append(): Dropzone {
    const dropzone = new Dropzone();
    this.addChild(dropzone);
    return dropzone;
  }

  removeLast(): void {
    const dropzone = this.fetch(this.size - 1);
    this.removeChildAt(this.size - 1);
    dropzone.destroy();
  }
}
