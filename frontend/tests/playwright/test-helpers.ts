import { fail } from "assert";
import { Page } from "playwright/test";
import { GateComponent } from "../../src";
import { Container, Point } from "pixi.js";

export async function appData(page: Page) {
  const appEl = page.locator("#app");
  const dataApp = await appEl.getAttribute("data-app");

  if (dataApp === null) {
    fail("data-app is null");
  }

  return JSON.parse(dataApp);
}

export function centerPosition(gate: GateComponent) {
  return new Point(gate.x + gate.width / 2, gate.y + gate.height / 2);
}

interface CircuitInfo {
  gatePalette: {
    hGate: { x: number; y: number };
    xGate: { x: number; y: number };
    yGate: { x: number; y: number };
    zGate: { x: number; y: number };
    rnotGate: { x: number; y: number };
  };
  steps: { x: number; y: number }[][];
}

export async function getCircuitInfo(page: Page): Promise<CircuitInfo> {
  // アプリケーションの初期化を待つ
  await page.waitForFunction(() => window.pixiApp !== undefined);

  return await page.evaluate(async () => {
    const getInfo = (): CircuitInfo => {
      const { circuitFrame, gatePalette } = window.pixiApp ?? {};
      const { circuit } = circuitFrame ?? {};
      const {
        HGate: hGate,
        XGate: xGate,
        YGate: yGate,
        ZGate: zGate,
        RnotGate: rnotGate,
      } = gatePalette?.gates ?? {};

      if (
        !circuit ||
        !gatePalette ||
        !hGate ||
        !xGate ||
        !yGate ||
        !zGate ||
        !rnotGate
      ) {
        throw new Error("Required components are not initialized");
      }

      const getBounds = (component: Container) => {
        const bounds = component.getBounds();
        return {
          x: bounds.x + bounds.width / 2,
          y: bounds.y + bounds.height / 2,
        };
      };

      return {
        gatePalette: {
          hGate: getBounds(hGate),
          xGate: getBounds(xGate),
          yGate: getBounds(yGate),
          zGate: getBounds(zGate),
          rnotGate: getBounds(rnotGate),
        },
        steps: circuit.steps.map((step) =>
          step.dropzones.map((dropzone) => getBounds(dropzone))
        ),
      };
    };

    // 複数回試行する
    for (let i = 0; i < 5; i++) {
      try {
        const info = getInfo();
        if (info.gatePalette.hGate.x !== 0 || info.gatePalette.hGate.y !== 0) {
          return info;
        }
      } catch (error) {
        console.error("Error getting circuit info:", error);
      }
      // 少し待ってから再試行
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    throw new Error("Failed to get valid circuit info after multiple attempts");
  });
}

export async function dragAndDrop(
  page: Page,
  source: { x: number; y: number },
  target: { x: number; y: number }
) {
  // ソース位置に移動
  await page.mouse.move(source.x, source.y);

  // マウスボタンを押下
  await page.mouse.down();

  // ターゲット位置まで複数のステップで移動
  await page.mouse.move(target.x, target.y);

  // マウスボタンを離す
  await page.mouse.up();

  await page.waitForSelector('#app[data-state="idle"]', {
    state: "attached",
    timeout: 5000,
  });
}
