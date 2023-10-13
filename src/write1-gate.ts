import * as PIXI from "pixi.js";
import { WriteGate } from "./write-gate";

export class Write1Gate extends WriteGate {
  static gateType = "Write1Gate";
  static icon = PIXI.Texture.from("./assets/Write1.svg");
  static iconIdleDropzone = PIXI.Texture.from(
    "./assets/Write1_idle_dropzone.svg"
  );
  static iconHover = PIXI.Texture.from("./assets/Write1_hover.svg");
  static iconHoverDropzone = PIXI.Texture.from(
    "./assets/Write1_hover_dropzone.svg"
  );
  static iconGrabbed = PIXI.Texture.from("./assets/Write1_grabbed.svg");
  static iconGrabbedDropzone = PIXI.Texture.from(
    "./assets/Write1_grabbed_dropzone.svg"
  );
  static iconActive = PIXI.Texture.from("./assets/Write1_active.svg");
}
