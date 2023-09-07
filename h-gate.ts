import * as PIXI from "pixi.js";
import { App } from "./app";

export class HGate {
  static defaultTexture = PIXI.Texture.from("./assets/H.svg");
  static hoverTexture = PIXI.Texture.from("./assets/H_hover.svg");
  static grabbedTexture = PIXI.Texture.from("./assets/H_grabbed.svg");

  app: App;
  sprite: PIXI.Sprite;
  state = "default";

  get x(): number {
    return this.sprite.x;
  }

  get y(): number {
    return this.sprite.y;
  }

  constructor(x: number, y: number, app: App) {
    this.app = app;
    this.sprite = new PIXI.Sprite(HGate.defaultTexture);

    // enable the hGate to be interactive... this will allow it to respond to mouse and touch events
    this.sprite.eventMode = "static";

    // the hand cursor appears when you roll over the hGate with your mouse
    this.sprite.cursor = "pointer";

    // center the hGate's anchor point
    this.sprite.anchor.set(0.5);

    // setup events for mouse + touch using
    // the pointer events
    this.sprite
      .on("pointerover", this.onGateOver.bind(this), this.sprite)
      .on("pointerout", this.onGateOut.bind(this), this.sprite)
      .on("pointerdown", this.onDragStart.bind(this), this.sprite);

    // move the sprite to its designated position
    this.sprite.x = x;
    this.sprite.y = y;

    // add it to the stage
    this.app.pixiApp.stage.addChild(this.sprite);
  }

  default() {
    if (this.state !== "hover" && this.state !== "grabbed") {
      throw new Error(`Invalid state transition: state = ${this.state}`);
    }

    this.state = "default";
    this.sprite.texture = HGate.defaultTexture;
  }

  hover() {
    if (this.state !== "default") {
      throw new Error("Invalid state transition");
    }

    this.state = "hover";
    this.sprite.texture = HGate.hoverTexture;
  }

  changeTextureToGrabbedState() {
    this.state = "grabbed";
    this.sprite.texture = HGate.grabbedTexture;
  }

  private onGateOver(_event: PIXI.FederatedEvent) {
    if (this.state === "hover") {
      return;
    }

    this.app.enterGate(this);
  }

  private onGateOut() {
    // 現状では、つかんでいたゲートをリリースした時に状態が default に遷移する
    // この時ポインタはゲート上にあるので、ポインタがゲートから離れた時に onGateOut() が呼ばれる。
    // このため、この時には何もしないようにする。
    //
    // TODO: つかんだゲートをリリースした時、ゲートの状態を active にし、以下の処理をなくす
    if (this.state === "default") {
      return;
    }

    this.app.leaveGate(this);
  }

  private onDragStart() {
    this.app.onDragStart(this);
  }
}

// Scale mode for pixelation
HGate.defaultTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
HGate.hoverTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
HGate.grabbedTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
