import { Colors } from "./colors";
import { Constructor } from "./constructor";
import { GateComponent } from "./gate-component";
import { Spacing } from "./spacing";
import { GateShapeConfig } from "./types";
import { need } from "./util";

export declare class GateStyle {
  applyIdleStyle(): void;
  applyHoverStyle(): void;
  applyGrabbedStyle(): void;
  applyActiveStyle(): void;
}

export interface GateStyleConstructor {
  SHAPE_CONFIG: GateShapeConfig;
}

type GateStyleOptions = {
  cursor: string;
  fillColor: string;
  borderColor: string;
};

type GateState = "idle" | "hover" | "grabbed" | "active";

export function GateStyleMixin<TBase extends Constructor<GateComponent>>(
  Base: TBase
): Constructor<GateStyle> & TBase & GateStyleConstructor {
  return class GateStyleMixinClass extends Base {
    protected readonly styleMap: Record<GateState, GateStyleOptions> = {
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

    static SHAPE_CONFIG: GateShapeConfig = {
      cornerRadius: 0,
      strokeAlignment: 0,
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

    protected applyStyleForState(state: GateState): void {
      this.applyStyle(this.styleMap[state]);
    }

    protected applyStyle(options: GateStyleOptions): void {
      this.setCursor(options.cursor);
      this.drawShape(options.fillColor, options.borderColor);
      this.validateBounds();
    }

    protected setCursor(cursor: string): void {
      this._shape.cursor = cursor;
    }

    protected drawShape(fillColor: string, borderColor: string): void {
      const constructor = this.constructor as typeof GateStyleMixinClass;
      const { cornerRadius, strokeAlignment } = constructor.SHAPE_CONFIG;

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

    protected get borderSize(): number {
      return this.sizeInPx - this.borderWidth;
    }

    protected get borderWidth(): number {
      return Spacing.borderWidth.gate[this.size];
    }

    protected validateBounds(): void {
      const bounds = this.getLocalBounds();
      this.validateBoundsSize(bounds);
      this.validateBoundsPosition(bounds);
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
  };
}
