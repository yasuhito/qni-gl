import * as PIXI from "pixi.js";
import { CircularGateMixin } from "./circular-gate-mixin";
import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";

/**
 * @noInheritDoc
 */
export class XGate extends JsonableMixin(CircularGateMixin(GateComponent)) {
  static gateType = "XGate";
  static icon = PIXI.Texture.from("./assets/X.svg", {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio,
    },
  });

  private _controls: number[] = [];

  get controls() {
    return this._controls;
  }

  set controls(value: number[]) {
    this._controls = value.sort();
  }

  toCircuitJSON() {
    return '"X"';
  }
}
