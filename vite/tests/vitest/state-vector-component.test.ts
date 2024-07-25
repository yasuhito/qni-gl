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
    expect(stateVector.visibleAmplitudes).toEqual([0, 1]);
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
    expect(mockEmit).toHaveBeenCalledWith(STATE_VECTOR_EVENTS.CHANGE, 2);
  });

  it("should adjust scroll correctly", () => {
    const newScrollRect = new PIXI.Rectangle(500, 500, 1500, 1500);
    const mockEmit = vi.spyOn(stateVector, "emit");
    stateVector.adjustScroll(newScrollRect);
    expect(mockEmit).toHaveBeenCalledWith(
      STATE_VECTOR_EVENTS.AMPLITUDES_VISIBLE,
      expect.any(Array)
    );
  });

  it("should get QubitCircle at correct index", () => {
    const result = stateVector.getQubitCircleAt(0);
    expect(result).not.toBeUndefined();
    expect(result).toBeInstanceOf(QubitCircle);
  });

  it("should update visible amplitudes when scrolling", () => {
    stateVector.qubitCount = 4; // 16個のQubitCircleを作成
    const newScrollRect = new PIXI.Rectangle(100, 100, 100, 100);
    stateVector.adjustScroll(newScrollRect);
    expect(stateVector.visibleAmplitudes.length).toBeLessThan(16);
  });

  it("should update QubitCircle size when qubit count changes", () => {
    stateVector.qubitCount = 2;
    expect(stateVector["qubitCircleSize"]).toBe("xl");
    stateVector.qubitCount = 8;
    expect(stateVector["qubitCircleSize"]).toBe("sm");
  });
});
