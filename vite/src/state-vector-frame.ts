import * as PIXI from "pixi.js";
import { Colors } from "./colors";
import {
  STATE_VECTOR_EVENTS,
  StateVectorComponent,
} from "./state-vector-component";

export class StateVectorFrame extends PIXI.Container {
  private static instance: StateVectorFrame | null = null;

  readonly app: PIXI.Application;
  readonly background: PIXI.Graphics;
  stateVector: StateVectorComponent;

  /**
   * インスタンスを取得するメソッド
   * @param app - PIXI アプリケーションインスタンス
   * @param height - 初期のフレームの高さ
   */
  static getInstance(app: PIXI.Application, height: number): StateVectorFrame {
    if (this.instance === null) {
      this.instance = new StateVectorFrame(app, height);
    }
    return this.instance;
  }

  private constructor(app: PIXI.Application, height: number) {
    super();

    this.app = app;
    this.background = new PIXI.Graphics();
    this.stateVector = new StateVectorComponent(1);

    this.initBackground(height);
    this.initStateVector();

    this.addChildAt(this.background, 0); // 背景を一番下のレイヤーに追加
    this.addChild(this.stateVector);

    this.updateStateVectorPosition();
  }

  update(y: number, height: number) {
    this.background.clear();

    this.background.beginFill(Colors["bg-component"]);
    this.background.drawRect(0, 0, this.app.screen.width, height);
    this.background.endFill();

    this.y = y;

    this.updateStateVectorPosition();
  }

  private updateStateVectorPosition() {
    this.stateVector.x =
      (this.app.screen.width - this.stateVector.bodyWidth) / 2;
    this.stateVector.y = (this.height - this.stateVector.bodyHeight) / 2;
  }

  private initBackground(height: number) {
    this.background.beginFill(Colors["bg-component"]);
    this.background.drawRect(0, 0, this.app.screen.width, height);
    this.background.endFill();
  }

  private initStateVector() {
    // ここで this.runSimulator() で状態ベクトルを |00> に初期化すると
    // シミュレータ呼び出しで遅くなるので、決め打ちで初期化しておく
    if (this.stateVector.qubitCircles.length !== 2) {
      throw new Error("qubitCircles.length !== 2");
    }

    this.stateVector.qubitCircles[0].probability = 100;
    this.stateVector.qubitCircles[0].phase = 0;
    this.stateVector.qubitCircles[1].probability = 0;

    this.stateVector.on(STATE_VECTOR_EVENTS.CHANGE, () => {
      this.updateStateVectorPosition();
    });
  }
}
