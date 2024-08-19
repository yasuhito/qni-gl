import { GateComponent } from "./gate-component";
import { JsonableMixin } from "./jsonable-mixin";
import { GateState, GateStyleOptions, SerializedGate } from "./types";
import { OutlinedGateMixin } from "./outlined-gate-mixin";
import { Colors } from "./colors";
import { Assets, Texture } from "pixi.js";
import { LabelableMixin } from "./labelable-mixin";

export class MeasurementGate extends OutlinedGateMixin(
  JsonableMixin(LabelableMixin(GateComponent))
) {
  static gateType = "MeasurementGate";
  static readonly iconPath = "./assets/Measurement.png";
  static readonly _icon0Path = "./assets/Measurement_value0.png";
  static readonly _icon1Path = "./assets/Measurement_value1.png";
  static _icon0: Texture;
  static _icon1: Texture;

  static serialize(targetBits: number[]): SerializedGate {
    return { type: "Measure", targets: targetBits };
  }

  _value: "" | 0 | 1 = "";

  get label(): string {
    return "M";
  }

  private get jsonLabel(): string {
    return "Measure";
  }

  set value(newValue) {
    this._value = newValue;

    if (newValue === 0) {
      this._sprite.texture = MeasurementGate._icon0;
    } else if (newValue === 1) {
      this._sprite.texture = MeasurementGate._icon1;
    }
  }

  get value(): "" | 0 | 1 {
    return this._value;
  }

  constructor() {
    super();

    this.loadExtraTextures();
  }

  private async loadExtraTextures() {
    MeasurementGate._icon0 = await Assets.load(MeasurementGate._icon0Path);
    MeasurementGate._icon1 = await Assets.load(MeasurementGate._icon1Path);
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
