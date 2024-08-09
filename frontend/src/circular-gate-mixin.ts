import { Colors } from "./colors";
import { Constructor } from "./constructor";
import { GateComponent } from "./gate-component";
import { GateShapeConfig, GateState, GateStyleOptions } from "./types";
import { Spacing } from "./spacing";
import { need } from "./util";

export declare class CircularGate {
  applyIdleStyle(): void;
  applyHoverStyle(): void;
  applyGrabbedStyle(): void;
  applyActiveStyle(): void;
}

export function CircularGateMixin<TBase extends Constructor<GateComponent>>(
  Base: TBase
): Constructor<CircularGate> & TBase {
  class CircularGateMixinClass extends Base {
    private static readonly SHAPE_CONFIG: GateShapeConfig = {
      cornerRadius: Spacing.cornerRadius.full,
      strokeAlignment: 0.5,
    };

    private readonly styleMap: Record<GateState, GateStyleOptions> = {
      idle: {
        cursor: "default",
        fillColor: Colors["bg-brand"],
        borderColor: Colors["border-onbrand"],
      },
      hover: {
        cursor: "grab",
        fillColor: Colors["bg-brand-hover"],
        borderColor: Colors["border-hover"],
      },
      grabbed: {
        cursor: "grabbing",
        fillColor: Colors["bg-active"],
        borderColor: Colors["border-pressed"],
      },
      active: {
        cursor: "grab",
        fillColor: Colors["bg-brand"],
        borderColor: Colors["border-active"],
      },
    };

    applyIdleStyle(): void {
      this.applyStyleForState("idle");
    }

    applyHoverStyle(): void {
      this.applyStyleForState("hover");
    }

    applyGrabbedStyle(): void {
      this.applyStyleForState("grabbed");
    }

    applyActiveStyle(): void {
      this.applyStyleForState("active");
    }

    private applyStyleForState(state: GateState): void {
      this.applyStyle(this.styleMap[state]);
    }

    private applyStyle(options: GateStyleOptions): void {
      this.setCursor(options.cursor);
      this.drawShape(options.fillColor, options.borderColor);
      this.validateBounds();
    }

    private setCursor(cursor: string): void {
      this._shape.cursor = cursor;
    }

    private drawShape(fillColor: string, borderColor: string): void {
      const { cornerRadius, strokeAlignment } =
        CircularGateMixinClass.SHAPE_CONFIG;

      this._shape
        .clear()
        .roundRect(
          this.borderWidth / 2,
          this.borderWidth / 2,
          this.adjustedSize,
          this.adjustedSize,
          cornerRadius
        )
        .fill(fillColor)
        .stroke({
          color: borderColor,
          width: this.borderWidth,
          alignment: strokeAlignment,
        });
    }

    private validateBounds(): void {
      this.validateSize();
    }

    private get adjustedSize(): number {
      return this.sizeInPx - this.borderWidth;
    }

    private get borderWidth(): number {
      return Spacing.borderWidth.gate[this.size];
    }

    private validateSize(): void {
      need(
        this.width === this.sizeInPx,
        `Width is incorrect: ${this.width}, expected: ${this.sizeInPx}`
      );
      need(
        this.height === this.sizeInPx,
        `Height is incorrect: ${this.height}, expected: ${this.sizeInPx}`
      );
    }
  }

  return CircularGateMixinClass as Constructor<CircularGate> & TBase;
}
