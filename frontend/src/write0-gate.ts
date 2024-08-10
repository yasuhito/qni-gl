import * as PIXI from "pixi.js";
import { WriteGate } from "./write-gate";
import { SerializedGate } from "./types";

/**
 * @noInheritDoc
 */
export class Write0Gate extends WriteGate {
  static gateType = "Write0Gate";
  static readonly iconPath = "./assets/Write0.png";

  static iconIdleDropzone = PIXI.Texture.from(
    "./assets/Write0_idle_dropzone.svg"
  );
  static iconHover = PIXI.Texture.from("./assets/Write0_hover.svg");
  static iconHoverDropzone = PIXI.Texture.from(
    "./assets/Write0_hover_dropzone.svg"
  );
  static iconGrabbed = PIXI.Texture.from("./assets/Write0_grabbed.svg");
  static iconGrabbedDropzone = PIXI.Texture.from(
    "./assets/Write0_grabbed_dropzone.svg"
  );
  static iconActive = PIXI.Texture.from("./assets/Write0_active.svg");

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "|0>", targets: targetBits };
  }

  toCircuitJSON() {
    return '"|0>"';
  }

  gateChar() {
    return "0";
  }
}
