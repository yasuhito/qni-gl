import * as PIXI from "pixi.js";
import { App } from "./app";

export class HGate {
  static defaultTexture = PIXI.Texture.from("./assets/H.svg");
  static hoverTexture = PIXI.Texture.from("./assets/H_hover.svg");
  static grabTexture = PIXI.Texture.from("./assets/H_grabbed.svg");

  app: App;
  sprite: PIXI.Sprite;

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

  changeTextureToDefault() {
    this.sprite.texture = HGate.defaultTexture;
  }

  changeTextureToHoverState() {
    this.sprite.texture = HGate.hoverTexture;
  }

  changeTextureToGrabbedState() {
    this.sprite.texture = HGate.grabTexture;
  }

  private onGateOver(_event: PIXI.FederatedEvent) {
    this.app.onGateOver(this);
  }

  private onGateOut() {
    this.app.onGateOut(this);
  }

  private onDragStart() {
    this.app.onDragStart(this);
  }
}

// Scale mode for pixelation
HGate.defaultTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
HGate.hoverTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
HGate.grabTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
