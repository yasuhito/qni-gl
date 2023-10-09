import * as PIXI from "pixi.js";
import { Dropzone } from "./src/dropzone";
import { Gate } from "./src/gate";
import { Container } from "pixi.js";
import { List } from "@pixi/ui";

export class CircuitStep extends Container {
  qubitCount: number; // 量子ビットの数
  view: Container;
  dropzones: Dropzone[] = [];
  protected list: List;

  static get height(): number {
    return Dropzone.size + this.paddingY * 2;
  }

  static get gapBetweenGates(): number {
    return Dropzone.size / 2;
  }

  static get paddingX(): number {
    return Dropzone.size;
  }

  static get paddingY(): number {
    return Dropzone.size / 4;
  }

  // x, y はステップの右上の座標 (モバイルの場合)
  constructor(qubitCount: number) {
    super();

    this.qubitCount = qubitCount;
    this.view = new PIXI.Container();
    this.addChild(this.view);

    this.list = new List({
      type: "vertical",
      elementsMargin: 16,
    });
    this.view.addChild(this.list);

    for (let i = 0; i < this.qubitCount; i++) {
      const dropzone = new Dropzone();
      this.list.addChild(dropzone);
    }

    // this.view.lineStyle(1, 0xeeeeee, 1, 0);
    // this.view.drawRect(this.x - this.width, this.y, this.width, this.height);
  }

  get width(): number {
    return Gate.size * 1.5;
  }

  get height(): number {
    return (
      Gate.size * this.list.children.length + this.list.children.length * 16
    );
    // const klass = this.constructor as typeof CircuitStep;
    // return klass.height;
  }

  toJSON() {
    return {
      dropzones: this.dropzones,
    };
  }
}
