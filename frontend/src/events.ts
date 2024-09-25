export const CIRCUIT_STEP_EVENTS = {
  ACTIVATED: "circuit-step.activated",
  HOVERED: "circuit-step.hovered",
} as const;

export const OPERATION_EVENTS = {
  GRABBED: "operation.grabbed",
  SNAPPED: "operation.snapped",
  DISCARDED: "operation.discarded",
  MOUSE_LEFT: "operation.mouse-left",
} as const;

export const CIRCUIT_FRAME_EVENTS = {
  CIRCUIT_STEP_ACTIVATED: "circuit-frame.circuit-step-activated",
} as const;

export const FRAME_DIVIDER_EVENTS = {
  DRAG_STARTED: "frame-divider.drag-started",
} as const;

export const CIRCUIT_EVENTS = {
  CIRCUIT_STEP_ACTIVATED: "circuit.circuit-step-activated",
};
