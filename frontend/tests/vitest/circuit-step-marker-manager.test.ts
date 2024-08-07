import { describe, it, expect, vi, beforeEach } from "vitest";
import { CircuitStepMarkerManager } from "../../src/circuit-step-marker-manager";
import { CircuitStepComponent } from "../../src";

describe("CircuitStepMarkerManager", () => {
  let mockSteps: unknown[];

  beforeEach(() => {
    mockSteps = [
      {
        dropzonesWidth: 100,
        dropzonesHeight: 50,
        isActive: vi.fn(),
        isHovered: vi.fn(),
      },
      {
        dropzonesWidth: 100,
        dropzonesHeight: 50,
        isActive: vi.fn(),
        isHovered: vi.fn(),
      },
    ];
  });

  it("should throw an error when initialized with empty steps array", () => {
    expect(() => new CircuitStepMarkerManager([])).toThrow(
      "Steps array is empty"
    );
  });

  it("should position markers correctly", () => {
    const manager = new CircuitStepMarkerManager(
      mockSteps as CircuitStepComponent[]
    );
    const markers = manager["markers"];

    expect(markers[0].position.x).toBe(98); // 100 - markerWidth/2
    expect(markers[1].position.x).toBe(198); // 200 - markerWidth/2
  });
});
