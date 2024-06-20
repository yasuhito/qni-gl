import * as tailwindColors from "tailwindcss/colors";

// Type (required): "bg" | "text" | "icon" | "border"
// Color Role (optional): "brand" | "component" | "inverse" | "on*"
// Prominence (optional): "strong" | "secondary" | "tertiary"
// Interaction (optional): "hover" | "grabbed" | "active"

type BgColorKey =
  | "bg"
  | "bg-component"
  | "bg-brand"
  | "bg-brand-hover"
  | "bg-active";

type TextColorKey = "text" | "text-inverse";

type BorderColorKey =
  | "border-onbrand"
  | "border-hover"
  | "border-pressed"
  | "border-active"
  | "border-component"
  | "border-component-strong"
  | "border-component-strong-disabled"
  | "border-inverse";

type IconColorKey = "icon-brand" | "icon-onbrand";

type ColorKey = BgColorKey | TextColorKey | BorderColorKey | IconColorKey;

type Colors = {
  [key in ColorKey]: string;
};

export const Colors: Colors = {
  bg: tailwindColors.zinc["50"],
  "bg-component": tailwindColors.white,
  "bg-brand": tailwindColors.sky["500"],
  "bg-brand-hover": tailwindColors.sky["600"],
  "bg-active": tailwindColors.purple["500"],
  text: tailwindColors.zinc["900"],
  "text-inverse": tailwindColors.zinc["200"],
  "border-onbrand": tailwindColors.sky["700"],
  "border-hover": tailwindColors.purple["500"],
  "border-pressed": tailwindColors.purple["600"],
  "border-active": tailwindColors.teal["300"],
  "border-component": tailwindColors.zinc["400"],
  "border-component-strong": tailwindColors.zinc["500"],
  "border-component-strong-disabled": tailwindColors.zinc["200"],
  "border-inverse": tailwindColors.zinc["300"],
  "icon-brand": tailwindColors.sky["500"],
  "icon-onbrand": tailwindColors.white,
};

export type WireColor =
  | typeof Colors["border-component-strong-disabled"]
  | typeof Colors["text"];

export const FULL_OPACITY = 1;
