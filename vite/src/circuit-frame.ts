import * as PIXI from "pixi.js";
import { Colors } from "./colors";

export class CircuitFrame extends PIXI.Container {
  readonly app: PIXI.Application;
  readonly background: PIXI.Graphics;

  constructor(app: PIXI.Application, height: number) {
    super();

    this.app = app;
    this.background = new PIXI.Graphics();

    this.initBackground(height);
  }

  resize(height: number) {
    this.background.clear();

    this.background.beginFill(Colors["bg"]);
    this.background.drawRect(0, 0, this.app.screen.width, height);
    this.background.endFill();
  }

  private initBackground(height: number) {
    this.background.beginFill(Colors["bg"]);
    this.background.drawRect(0, 0, this.app.screen.width, height);
    this.background.endFill();
    this.addChildAt(this.background, 0); // 背景を一番下のレイヤーに追加
  }
}
