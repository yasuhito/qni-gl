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
  readonly stateVector: StateVectorComponent;
  private maskGraphics: PIXI.Graphics; // マスク用のグラフィックを追加
  private scrollContainer: PIXI.Container; // スクロール用のコンテナを追加

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
    this.maskGraphics = new PIXI.Graphics(); // マスク用のグラフィックを初期化
    this.scrollContainer = new PIXI.Container(); // スクロール用のコンテナを初期化

    this.initBackground(height);
    this.initStateVector();

    this.scrollContainer.y = 0; // スクロールコンテナの初期位置を設定

    this.addChildAt(this.background, 0); // 背景を一番下のレイヤーに追加
    this.addChild(this.scrollContainer); // スクロール用コンテナを追加
    this.scrollContainer.addChild(this.stateVector); // 状態ベクトルをスクロールコンテナに追加
    this.addChild(this.maskGraphics); // マスク用グラフィックを追加
    this.scrollContainer.mask = this.maskGraphics; // マスクを設定

    // console.log(`this.scrollContainer.x = ${this.scrollContainer.x}`);
    // console.log(`this.scrollContainer.y = ${this.scrollContainer.y}`);
    // console.log(`this.scrollContainer.width = ${this.scrollContainer.width}`);
    // console.log(`this.scrollContainer.height = ${this.scrollContainer.height}`);

    // console.log(`this.stateVector.x = ${this.stateVector.x}`);
    // console.log(`this.stateVector.y = ${this.stateVector.y}`);
    // console.log(`this.stateVector.width = ${this.stateVector.width}`);
    // console.log(`this.stateVector.height = ${this.stateVector.height}`);

    // console.log(`this.maskGraphics.x = ${this.maskGraphics.x}`);
    // console.log(`this.maskGraphics.y = ${this.maskGraphics.y}`);
    // console.log(`this.maskGraphics.width = ${this.maskGraphics.width}`);
    // console.log(`this.maskGraphics.height = ${this.maskGraphics.height}`);

    this.initScrollEvents(); // スクロールイベントの初期化

    this.updateStateVectorPosition();
  }

  update(y: number, height: number) {
    this.background.clear();

    this.background.beginFill(Colors["bg-component"]);
    this.background.drawRect(0, 0, this.app.screen.width, height);
    this.background.endFill();

    this.y = y;

    this.updateStateVectorPosition();
    this.updateMask(height);
  }

  private updateStateVectorPosition() {
    // this.stateVector.x =
    //   (this.app.screen.width - this.stateVector.bodyWidth) / 2;
    // this.stateVector.y = (this.height - this.stateVector.bodyHeight) / 2;

    this.scrollContainer.x =
      (this.app.screen.width - this.stateVector.bodyWidth) / 2;
    this.scrollContainer.y = (this.height - this.stateVector.bodyHeight) / 2;
  }

  private initBackground(height: number) {
    this.background.beginFill(Colors["bg-component"]);
    this.background.drawRect(0, 0, this.app.screen.width, height);
    this.background.endFill();

    this.updateMask(height);
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

  /**
   * スクロールイベントの初期化
   */
  private initScrollEvents(): void {
    this.interactive = true;
    this.on("wheel", this.handleScroll, this);
  }

  /**
   * マスクの更新
   * @param height - 新しいマスクの高さ
   */
  private updateMask(height: number): void {
    this.maskGraphics.clear();
    this.maskGraphics.beginFill(0xffffff);
    this.maskGraphics.drawRect(0, 0, this.app.screen.width, height);
    this.maskGraphics.endFill();
  }

  /**
   * スクロール処理
   * @param event - ホイールイベント
   */
  private handleScroll(event: WheelEvent): void {
    // stateVector の高さがフレームの高さより小さい場合は縦スクロールを禁止
    if (this.stateVector.height > this.maskGraphics.height) {
      const deltaY = event.deltaY;
      this.scrollContainer.y -= deltaY;

      // 縦スクロール範囲の制限
      if (this.scrollContainer.y > 0) {
        this.scrollContainer.y = 0;
      }

      const maxScrollY =
        this.stateVector.height + // 状態ベクトルの高さを取得
        32 - // 固定の余白や追加の高さ
        this.maskGraphics.height;
      if (this.scrollContainer.y < -maxScrollY) {
        this.scrollContainer.y = -maxScrollY;
      }
    }

    // stateVector の幅がフレームの幅より小さい場合は横スクロールを禁止
    if (this.stateVector.width > this.maskGraphics.width) {
      const deltaX = event.deltaX;
      this.scrollContainer.x -= deltaX;

      // 横スクロール範囲の制限
      if (this.scrollContainer.x > 0) {
        this.scrollContainer.x = 0;
      }

      const maxScrollX =
        this.stateVector.width + // 状態ベクトルの幅を取得
        32 - // 固定の余白や追加の幅
        this.maskGraphics.width;
      if (this.scrollContainer.x < -maxScrollX) {
        this.scrollContainer.x = -maxScrollX;
      }
    }
  }
}
