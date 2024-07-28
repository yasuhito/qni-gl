import { describe, it, expect, beforeEach } from "vitest";
import { StateVectorFrame } from "../../src/state-vector-frame";

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

  // it("should handle scroll events", () => {
  //   const frame = StateVectorFrame.getInstance(100, 100, 5);
  //   const scrollEvent = new WheelEvent("wheel", { deltaY: 10, deltaX: 5 });

  //   // スクロールイベントをエミュレート
  //   frame.emit("wheel", scrollEvent);

  //   // スクロール後の状態を検証
  //   // 注意: 実際の動作はStateVectorComponentの実装に依存します
  //   // ここでは、スクロールイベントがエラーなく処理されることのみを確認しています
  //   expect(() => frame.emit("wheel", scrollEvent)).not.toThrow();
  // });
});
