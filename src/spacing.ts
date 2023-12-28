import { spacingInPx } from "./util";

export const Spacing = {
  width: {
    phaseHand: spacingInPx(0.5),
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
    gate: spacingInPx(0.5),
  },
  cornerRadius: {
    gate: spacingInPx(1),
    stateVector: spacingInPx(4),
    full: 9999,
  },
};
