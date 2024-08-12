import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { FrameDivider } from "../../src/frame-divider";
import { Application, FederatedPointerEvent } from "pixi.js";

describe("FrameDivider", () => {
  let app: Application;
  let frameDivider: FrameDivider;

  beforeEach(() => {
    // テスト用のPIXI.Applicationのモックを作成
    app = {
      screen: { width: 800, height: 600 },
      stage: {
        on: vi.fn(),
        cursor: "default",
      },
    } as unknown as Application;

    // FrameDividerのインスタンスを初期化
    frameDivider = FrameDivider.initialize(app, 300);
  });

  afterEach(() => {
    vi.clearAllMocks();
    FrameDivider["instance"] = null;
  });

  it("should initialize singleton instance", () => {
    expect(FrameDivider.getInstance()).toBe(frameDivider);
  });

  it("should throw error when getInstance is called before initialization", () => {
    FrameDivider["instance"] = null;
    expect(() => FrameDivider.getInstance()).toThrow(
      "FrameDivider is not initialized"
    );
  });

  it("should set initial position", () => {
    expect(frameDivider.y).toBe(300);
  });

  it("should update width correctly", () => {
    const clearSpy = vi.spyOn(frameDivider, "clear");
    const rectSpy = vi.spyOn(frameDivider, "rect");
    const fillSpy = vi.spyOn(frameDivider, "fill");

    frameDivider.updateWidth();

    expect(clearSpy).toHaveBeenCalled();
    expect(rectSpy).toHaveBeenCalledWith(0, 0, 800, 2);
    expect(fillSpy).toHaveBeenCalled();
  });

  it("should start dragging on pointerdown", () => {
    const event = { global: { y: 350 } } as FederatedPointerEvent;

    frameDivider["startDragging"](event);

    expect(frameDivider["isDragging"]).toBe(true);
    expect(frameDivider["dragStartY"]).toBe(50);
    expect(app.stage.cursor).toBe("ns-resize");
  });

  it("should end dragging on pointerup", () => {
    frameDivider["_isDragging"] = true;
    frameDivider["endDragging"]();

    expect(frameDivider["isDragging"]).toBe(false);
    expect(app.stage.cursor).toBe("default");
  });

  it("should move divider on pointermove when dragging", () => {
    frameDivider["_isDragging"] = true;
    frameDivider["dragStartY"] = 50;

    const event = { global: { y: 400 } } as FederatedPointerEvent;
    frameDivider["move"](event);

    expect(frameDivider.y).toBe(350);
  });

  it("should not move divider on pointermove when not dragging", () => {
    frameDivider["_isDragging"] = false;

    const initialY = frameDivider.y;
    const event = { global: { y: 400 } } as FederatedPointerEvent;
    frameDivider["move"](event);

    expect(frameDivider.y).toBe(initialY);
  });

  it("should clamp position within bounds", () => {
    expect(frameDivider["clampPosition"](-50)).toBe(0);
    expect(frameDivider["clampPosition"](700)).toBe(598);
    expect(frameDivider["clampPosition"](300)).toBe(300);
  });
});
