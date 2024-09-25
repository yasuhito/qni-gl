export const DROPZONE_EVENTS = {
  OPERATION_SNAPPED: "dropzone.operation-snapped",
  OPERATION_GRABBED: "dropzone.operation-grabbed",
} as const;

export const CIRCUIT_STEP_EVENTS = {
  ACTIVATED: "circuit-step.activated",
  HOVERED: "circuit-step.hovered",
  OPERATION_SNAPPED: "circuit-step.operation-snapped",
  OPERATION_GRABBED: "circuit-step.operation-grabbed",
} as const;

export const OPERATION_SOURCE_EVENTS = {
  OPERATION_CREATED: "operation-source.operation-created",
  OPERATION_DISCARDED: "operation-source.operation-discarded",
  OPERATION_MOUSE_LEFT: "operation-source.operation-mouse-left",
} as const;

export const OPERATION_EVENTS = {
  GRABBED: "operation.grabbed",
  SNAPPED: "operation.snapped",
  DISCARDED: "operation.discarded",
  MOUSE_LEFT: "operation.mouse-left",
} as const;

export const OPERATION_PALETTE_EVENTS = {
  OPERATION_CREATED: "operation-palette.operation-created",
} as const;

export const CIRCUIT_FRAME_EVENTS = {
  PALETTE_OPERATION_DISCARDED: "circuit-frame.palette-operation-discarded",
  CIRCUIT_OPERATION_GRABBED: "circuit-frame.circuit-operation-grabbed",
  CIRCUIT_STEP_ACTIVATED: "circuit-frame.circuit-step-activated",
} as const;

export const FRAME_DIVIDER_EVENTS = {
  DRAG_STARTED: "frame-divider.drag-started",
} as const;

export const CIRCUIT_EVENTS = {
  OPERATION_GRABBED: "circuit.operation-grabbed",
  CIRCUIT_STEP_ACTIVATED: "circuit.circuit-step-activated",
};
