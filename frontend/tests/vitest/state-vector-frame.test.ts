import { describe, it, expect, beforeEach, vi } from "vitest";
import { StateVectorFrame } from "../../src/state-vector-frame";
import { FederatedWheelEvent } from "pixi.js";

describe("StateVectorFrame", () => {
  beforeEach(() => {
    StateVectorFrame["instance"] = null;
  });

  it("should create a singleton instance", () => {
    const instance1 = StateVectorFrame.getInstance(100, 100, 5);
    const instance2 = StateVectorFrame.getInstance(100, 100, 5);

    expect(instance1).toBe(instance2);
  });

  it("should reposition and resize correctly", () => {
    const frame = StateVectorFrame.getInstance(100, 100, 5);

    frame.repositionAndResize(50, 200, 150);

    expect(frame.y).toBe(50);
    expect(frame.width).toBe(200);
    expect(frame.height).toBe(150);
  });

  it("should handle scroll events", () => {
    const frame = StateVectorFrame.getInstance(100, 100, 5);
    const scrollEvent: FederatedWheelEvent = new WheelEvent("wheel", {
      deltaY: 10,
      deltaX: 5,
    }) as FederatedWheelEvent;
    const adjustScrollSpy = vi.spyOn(frame.stateVector, "adjustScroll");

    frame.emit("wheel", scrollEvent);

    expect(adjustScrollSpy).toHaveBeenCalled();
  });
});
