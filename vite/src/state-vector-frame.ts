import * as PIXI from "pixi.js";
import { Colors } from "./colors";

export class StateVectorFrame extends PIXI.Container {
  readonly app: PIXI.Application;
  readonly background: PIXI.Graphics;

  constructor(app: PIXI.Application, height: number) {
    super();

    this.app = app;
    this.background = new PIXI.Graphics();

    this.initBackground(height);
  }

  update(y: number, height: number) {
    this.background.clear();

    this.background.beginFill(Colors["bg-component"]);
    this.background.drawRect(0, 0, this.app.screen.width, height);
    this.background.endFill();

    this.y = y;
  }

  private initBackground(height: number) {
    this.background.beginFill(Colors["bg-component"]);
    this.background.drawRect(0, 0, this.app.screen.width, height);
    this.background.endFill();
    this.addChildAt(this.background, 0); // 背景を一番下のレイヤーに追加
  }
}
