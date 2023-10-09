import * as PIXI from "pixi.js";
import { Dropzone } from "./dropzone";
import { Gate } from "./gate";
import { Container } from "pixi.js";
import { List } from "@pixi/ui";

export class CircuitStep extends Container {
  qubitCount: number; // 量子ビットの数
  view: Container;
  _dropzones: List;

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

  get dropzones(): Dropzone[] {
    return this._dropzones.children as Dropzone[];
  }

  // x, y はステップの右上の座標 (モバイルの場合)
  constructor(qubitCount: number) {
    super();

    this.qubitCount = qubitCount;
    this.view = new PIXI.Container();
    this.addChild(this.view);

    this._dropzones = new List({
      type: "vertical",
      elementsMargin: 16,
    });
    this.view.addChild(this._dropzones);

    for (let i = 0; i < this.qubitCount; i++) {
      const dropzone = new Dropzone();
      this._dropzones.addChild(dropzone);
    }
  }

  get width(): number {
    return Gate.size * 1.5;
  }

  get height(): number {
    return (
      Gate.size * this._dropzones.children.length +
      this._dropzones.children.length * 16
    );
  }

  toJSON() {
    return {
      dropzones: this.dropzones,
    };
  }
}
