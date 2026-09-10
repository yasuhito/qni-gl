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

export const DROPZONE_EVENTS = {
  SELECTED: "dropzone.selected",
} as const;

export const FRAME_DIVIDER_EVENTS = {
  DRAG_STARTED: "frame-divider.drag-started",
} as const;

export const CIRCUIT_FRAME_EVENTS = {
  BACKGROUND_CLICKED: "circuit-frame.background-clicked",
  RECTANGLE_SELECTION_STARTED: "circuit-frame.rectangle-selection-started",
  RECTANGLE_SELECTION_UPDATED: "circuit-frame.rectangle-selection-updated",
  RECTANGLE_SELECTION_FINISHED: "circuit-frame.rectangle-selection-finished",
} as const;
