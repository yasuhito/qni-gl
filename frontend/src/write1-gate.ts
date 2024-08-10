import * as PIXI from "pixi.js";
import { WriteGate } from "./write-gate";
import { SerializedGate } from "./types";

/**
 * @noInheritDoc
 */
export class Write1Gate extends WriteGate {
  static gateType = "Write1Gate";
  static readonly iconPath = "./assets/Write1.png";

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

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "|1>", targets: targetBits };
  }

  toCircuitJSON() {
    return '"|1>"';
  }
}
