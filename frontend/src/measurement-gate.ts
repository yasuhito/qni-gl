import { OperationComponent } from "./operation-component";
import { JsonableMixin } from "./jsonable-mixin";
import { GateState, GateStyleOptions } from "./types";
import { OutlinedGateMixin } from "./outlined-gate-mixin";
import { Colors } from "./colors";
import { Assets, Texture } from "pixi.js";
import { LabelableMixin } from "./labelable-mixin";
import { SerializeableMixin } from "./serializeable-mixin";

export class MeasurementGate extends OutlinedGateMixin(
  SerializeableMixin(JsonableMixin(LabelableMixin(OperationComponent)))
) {
  static readonly _icon0Path = "/assets/measurement-gate0.png";
  static readonly _icon1Path = "/assets/measurement-gate1.png";
  static _icon0: Texture;
  static _icon1: Texture;

  _value: "" | 0 | 1 = "";

  get label(): string {
    return "M";
  }

  get jsonLabel(): string {
    return "Measure";
  }

  set value(newValue) {
    this._value = newValue;

    if (newValue === 0) {
      this.sprite.texture = MeasurementGate._icon0;
    } else if (newValue === 1) {
      this.sprite.texture = MeasurementGate._icon1;
    }
  }

  get value(): "" | 0 | 1 {
    return this._value;
  }

  async createSprites() {
    const sprites = await super.createSprites(this.operationType);

    MeasurementGate._icon0 = await Assets.load(MeasurementGate._icon0Path);
    MeasurementGate._icon1 = await Assets.load(MeasurementGate._icon1Path);

    return sprites;
  }

  // Override the styleMap from OutlinedGateMixin
  protected readonly styleMap: Record<GateState, GateStyleOptions> = {
    idle: {
      cursor: "default",
      fillColor: "transparent",
      borderColor: Colors["border-hover"],
      borderAlpha: 0,
    },
    hover: {
      cursor: "grab",
      fillColor: "transparent",
      borderColor: Colors["border-hover"],
      borderAlpha: 1,
    },
    grabbed: {
      cursor: "grabbing",
      iconInverse: true,
      fillColor: Colors["bg-active"],
      borderColor: Colors["border-pressed"],
      borderAlpha: 1,
    },
    active: {
      cursor: "grab",
      fillColor: "transparent",
      borderColor: Colors["border-active"],
      borderAlpha: 1,
    },
  };
}
