import { describe, it, expect, beforeEach } from "vitest";
import { CircuitFrame } from "../../src/circuit-frame";
import { FederatedWheelEvent } from "pixi.js";

describe("CircuitFrame", () => {
  beforeEach(() => {
    CircuitFrame["instance"] = null;
  });

  it("scrolls horizontally when the circuit is wider than the frame", () => {
    const frame = CircuitFrame.initialize(100, 300);
    const scrollContainer = frame["scrollContainer"];

    frame.emit("wheel", wheelEvent({ deltaX: 50 }));

    expect(scrollContainer.x).toBeLessThan(0);
  });

  it("uses shift wheel as horizontal scroll", () => {
    const frame = CircuitFrame.initialize(100, 300);
    const scrollContainer = frame["scrollContainer"];

    frame.emit("wheel", wheelEvent({ deltaY: 50, shiftKey: true }));

    expect(scrollContainer.x).toBeLessThan(0);
    expect(scrollContainer.y).toBe(0);
  });

  it("does not scroll horizontally past the circuit edge", () => {
    const frame = CircuitFrame.initialize(100, 300);
    const scrollContainer = frame["scrollContainer"];

    frame.emit("wheel", wheelEvent({ deltaX: 10000 }));

    expect(scrollContainer.x).toBe(-frame["maxScrollX"]());
  });
});

function wheelEvent({
  deltaX = 0,
  deltaY = 0,
  shiftKey = false,
}: Partial<FederatedWheelEvent>): FederatedWheelEvent {
  return {
    deltaX,
    deltaY,
    shiftKey,
  } as FederatedWheelEvent;
}
