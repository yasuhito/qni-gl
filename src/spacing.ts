import { spacingInPx } from "./util";

export const Spacing = {
  width: {
    phaseHand: spacingInPx(0.5),
  },
  size: {
    qubitCircle: spacingInPx(16),
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
