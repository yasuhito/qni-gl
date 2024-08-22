import { describe, it, expect, vi, beforeEach } from "vitest";
import { CircuitStepMarkerManager } from "../../src/circuit-step-marker-manager";
import { CircuitStep } from "../../src";

describe("CircuitStepMarkerManager", () => {
  let mockSteps: unknown[];

  beforeEach(() => {
    mockSteps = [
      {
        width: 100,
        height: 50,
        isActive: vi.fn(),
        isHovered: vi.fn(),
      },
      {
        width: 100,
        height: 50,
        isActive: vi.fn(),
        isHovered: vi.fn(),
      },
    ];
  });

  it("should throw an error when initialized with empty steps array", () => {
    expect(() => new CircuitStepMarkerManager({ steps: [] })).toThrow(
      "Steps array is empty"
    );
  });

  it("should position markers correctly", () => {
    const manager = new CircuitStepMarkerManager({
      steps: mockSteps as CircuitStep[],
    });
    const markers = manager["markers"];

    console.dir(`markers.length = ${markers.length}`);
    console.dir(markers[0].x);

    expect(markers[0].position.x).toBe(98); // 100 - markerWidth/2
    expect(markers[1].position.x).toBe(198); // 200 - markerWidth/2
  });
});
