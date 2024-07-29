import * as PIXI from "pixi.js";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { QubitCircle } from "../../src/qubit-circle";
import { StateVectorComponent, STATE_VECTOR_EVENTS } from "../../src";

describe("StateVectorComponent", () => {
  let stateVector: StateVectorComponent;
  const mockScrollRect = new PIXI.Rectangle(0, 0, 1000, 1000);

  beforeEach(() => {
    stateVector = new StateVectorComponent(1, 12, mockScrollRect);
  });

  it("should initialize with correct default values", () => {
    expect(stateVector.qubitCount).toBe(1);
    expect(stateVector.qubitCircleCount).toBe(2);
    expect(stateVector.visibleQubitCircleIndices).toEqual([0, 1]);
  });

  it("should update qubit count correctly", () => {
    stateVector.qubitCount = 3;
    expect(stateVector.qubitCount).toBe(3);
    expect(stateVector.qubitCircleCount).toBe(8);
  });

  it("should throw an error when setting qubit count above maxQubitCount", () => {
    expect(() => {
      stateVector.qubitCount = 13;
    }).toThrow();
  });

  it("should emit CHANGE event when qubit count changes", () => {
    const mockEmit = vi.spyOn(stateVector, "emit");
    stateVector.qubitCount = 2;
    expect(mockEmit).toHaveBeenCalledWith(
      STATE_VECTOR_EVENTS.QUBIT_COUNT_CHANGED,
      2
    );
  });

  it("should adjust scroll correctly", () => {
    const newScrollRect = new PIXI.Rectangle(500, 500, 1500, 1500);
    const mockEmit = vi.spyOn(stateVector, "emit");
    stateVector.updateVisibleQubitCircles(newScrollRect);
    expect(mockEmit).toHaveBeenCalledWith(
      STATE_VECTOR_EVENTS.VISIBLE_QUBIT_CIRCLES_CHANGED,
      expect.any(Array)
    );
  });

  it("should get QubitCircle at correct index", () => {
    const result = stateVector.qubitCircleAt(0);
    expect(result).not.toBeUndefined();
    expect(result).toBeInstanceOf(QubitCircle);
  });

  it("should update visible amplitudes when scrolling", () => {
    stateVector.qubitCount = 4; // 16個のQubitCircleを作成
    const newScrollRect = new PIXI.Rectangle(100, 100, 100, 100);
    stateVector.updateVisibleQubitCircles(newScrollRect);
    expect(stateVector.visibleQubitCircleIndices.length).toBeLessThan(16);
  });
});
