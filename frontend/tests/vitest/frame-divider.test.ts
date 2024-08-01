import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as PIXI from "pixi.js";
import { FrameDivider } from "../../src/frame-divider";

describe("FrameDivider", () => {
  let app: PIXI.Application;
  let frameDivider: FrameDivider;

  beforeEach(() => {
    // テスト用のPIXI.Applicationのモックを作成
    app = {
      screen: { width: 800, height: 600 },
      stage: {
        on: vi.fn(),
        cursor: "default",
      },
    } as unknown as PIXI.Application;

    // FrameDividerのインスタンスを初期化
    frameDivider = FrameDivider.initialize(app, 300);
  });

  afterEach(() => {
    // vi.clearAllMocks();
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
    const drawRectSpy = vi.spyOn(frameDivider, "drawRect");

    frameDivider.updateWidth();

    expect(drawRectSpy).toHaveBeenCalledWith(0, 0, 800, 2);
  });

  it("should start dragging on pointerdown", () => {
    const event = { global: { y: 350 } } as PIXI.FederatedPointerEvent;

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

    const event = { global: { y: 400 } } as PIXI.FederatedPointerEvent;
    frameDivider["move"](event);

    expect(frameDivider.y).toBe(350);
  });

  it("should not move divider on pointermove when not dragging", () => {
    frameDivider["_isDragging"] = false;

    const initialY = frameDivider.y;
    const event = { global: { y: 400 } } as PIXI.FederatedPointerEvent;
    frameDivider["move"](event);

    expect(frameDivider.y).toBe(initialY);
  });

  it("should clamp position within bounds", () => {
    expect(frameDivider["clampPosition"](-50)).toBe(0);
    expect(frameDivider["clampPosition"](700)).toBe(598);
    expect(frameDivider["clampPosition"](300)).toBe(300);
  });
});
