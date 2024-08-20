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
  OPERATION_LEFT: "operation-source.operation-left",
} as const;

export const OPERATION_EVENTS = {
  GRABBED: "operation.grabbed",
  SNAPPED: "operation.snapped",
  DISCARDED: "operation.discarded",
  MOUSE_LEFT: "operation.mouse-left",
} as const;
