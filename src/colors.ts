import * as tailwindColors from "tailwindcss/colors";

// Type (required): "bg" | "text" | "icon" | "border"
// Color Role (optional): "brand" | "component" | "inverse" | "on*"
// Prominence (optional): "strong" | "secondary" | "tertiary"
// Interaction (optional): "hover" | "grabbed" | "active"

type BgColorKey =
  | "bg"
  | "bg.brand"
  | "bg.brand.hover"
  | "bg.brand.grabbed"
  | "bg.brand.active";

type TextColorKey = "text.strong" | "text.strong.inverse";

type BorderColorKey =
  | "border.brand"
  | "border.brand.hover"
  | "border.brand.grabbed"
  | "border.brand.active"
  | "border.component"
  | "border.component.strong"
  | "border.component.strong.disabled"
  | "border.inverse";

type IconColorKey = "icon.brand" | "icon.onbrand";

type ColorKey = BgColorKey | TextColorKey | BorderColorKey | IconColorKey;

type Colors = {
  [key in ColorKey]: string;
};

export const Colors: Colors = {
  bg: tailwindColors.white,
  "bg.brand": tailwindColors.sky["500"],
  "bg.brand.hover": tailwindColors.sky["600"],
  "bg.brand.grabbed": tailwindColors.purple["500"],
  "bg.brand.active": tailwindColors.sky["500"],
  "text.strong": tailwindColors.zinc["900"],
  "text.strong.inverse": tailwindColors.zinc["200"],
  "border.brand": tailwindColors.sky["700"],
  "border.brand.hover": tailwindColors.purple["500"],
  "border.brand.grabbed": tailwindColors.purple["600"],
  "border.brand.active": tailwindColors.teal["300"],
  "border.component": tailwindColors.zinc["400"],
  "border.component.strong": tailwindColors.zinc["500"],
  "border.component.strong.disabled": tailwindColors.zinc["200"],
  "border.inverse": tailwindColors.zinc["300"],
  "icon.brand": tailwindColors.sky["500"],
  "icon.onbrand": tailwindColors.white,
};

export type WireColor =
  | typeof Colors["border.component.strong.disabled"]
  | typeof Colors["text.strong"];

export const FULL_OPACITY = 1;
