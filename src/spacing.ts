import { spacingInPx } from "./util";

export const Spacing = {
  width: {
    qubitCircle: {
      phaseHand: {
        xl: spacingInPx(0.5),
        lg: spacingInPx(0.5),
        base: spacingInPx(0.5),
        sm: spacingInPx(0.25),
        xs: spacingInPx(0.25),
      },
    },
  },
  size: {
    qubitCircle: {
      xl: spacingInPx(16),
      lg: spacingInPx(12),
      base: spacingInPx(8),
      sm: spacingInPx(6),
      xs: spacingInPx(4),
    },
  },
  borderWidth: {
    // gate: spacingInPx(0.5),
    gate: {
      xl: spacingInPx(0.5),
      lg: spacingInPx(0.5),
      base: spacingInPx(0.5),
      sm: spacingInPx(0.25),
      xs: spacingInPx(0.25),
    },
    qubitCircle: {
      xl: spacingInPx(0.5),
      lg: spacingInPx(0.5),
      base: spacingInPx(0.5),
      sm: spacingInPx(0.25),
      xs: spacingInPx(0.25),
    },
  },
  cornerRadius: {
    gate: spacingInPx(1),
    stateVector: spacingInPx(4),
    full: 9999,
  },
};
