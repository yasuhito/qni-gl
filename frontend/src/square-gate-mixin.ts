import { Colors } from "./colors";
import { Constructor } from "./constructor";
import { GateComponent } from "./gate-component";
import { GateShapeConfig, GateState, GateStyleOptions } from "./types";
import { Spacing } from "./spacing";
import { need } from "./util";

export declare class SquareGate {
  applyIdleStyle(): void;
  applyHoverStyle(): void;
  applyGrabbedStyle(): void;
  applyActiveStyle(): void;
}

export function SquareGateMixin<TBase extends Constructor<GateComponent>>(
  Base: TBase
): Constructor<SquareGate> & TBase {
  class SquareGateMixinClass extends Base {
    private static readonly SHAPE_CONFIG: GateShapeConfig = {
      cornerRadius: Spacing.cornerRadius.gate,
      strokeAlignment: 1,
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
        SquareGateMixinClass.SHAPE_CONFIG;

      this._shape
        .clear()
        .roundRect(
          this.borderWidth / 2,
          this.borderWidth / 2,
          this.borderSize,
          this.borderSize,
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
      const bounds = this.getLocalBounds();

      this.validateBoundsSize(bounds);
      this.validateBoundsPosition(bounds);
    }

    private get borderSize() {
      return this.sizeInPx - this.borderWidth;
    }

    private get borderWidth() {
      return Spacing.borderWidth.gate[this.size];
    }

    private validateBoundsSize(bounds: { width: number; height: number }) {
      const expectedSize = this.sizeInPx;
      need(
        bounds.width === expectedSize && bounds.height === expectedSize,
        `Size is incorrect: ${bounds.width}x${bounds.height}, expected: ${expectedSize}x${expectedSize}`
      );
    }

    private validateBoundsPosition(bounds: { x: number; y: number }) {
      need(
        bounds.x === 0 && bounds.y === 0,
        `Position is incorrect: (${bounds.x}, ${bounds.y}), expected: (0, 0)`
      );
    }
  }

  return SquareGateMixinClass as Constructor<SquareGate> & TBase;
}
