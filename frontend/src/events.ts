export const DROPZONE_EVENTS = {
  GATE_SNAPPED: "dropzone.gate-snapped",
  GATE_GRABBED: "dropzone.gate-grabbed",
} as const;

export const CIRCUIT_STEP_EVENTS = {
  ACTIVATED: "circuit-step.activated",
  HOVERED: "circuit-step.hovered",
  GATE_SNAPPED: "circuit-step.gate-snapped",
  GATE_GRABBED: "circuit-step.gate-grabbed",
} as const;

export const OPERATION_SOURCE_EVENTS = {
  OPERATION_CREATED: "operation-source.operation-created",
  OPERATION_GRABBED: "operation-source.operation-grabbed",
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
  OPERATION_GRABBED: "operation-palette.operation-grabbed",
  OPERATION_MOUSE_LEFT: "operation-palette.operation-mouse-left",
  OPERATION_DISCARDED: "operation-palette.operation-discarded",
} as const;

export const CIRCUIT_FRAME_EVENTS = {
  PALETTE_OPERATION_GRABBED: "circuit-frame.palette-operation-grabbed",
  CIRCUIT_OPERATION_GRABBED: "circuit-frame.circuit-operation-grabbed",
  PALETTE_OPERATION_MOUSE_LEFT: "circuit-frame.palette-operation-mouse-left",
  PALETTE_OPERATION_DISCARDED: "circuit-frame.palette-operation-discarded",
  CIRCUIT_STEP_ACTIVATED: "circuit-frame.circuit-step-activated",
} as const;
