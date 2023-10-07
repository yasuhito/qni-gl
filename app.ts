import * as PIXI from "pixi.js";
import { Gate } from "./gate";
import { HGate } from "./h-gate";
import { XGate } from "./x-gate";
import { YGate } from "./y-gate";
import { ZGate } from "./z-gate";
import { RnotGate } from "./rnot-gate";
import { SGate } from "./s-gate";
import { TGate } from "./t-gate";
import { TDaggerGate } from "./t-dagger-gate";
import { SDaggerGate } from "./s-dagger-gate";
import { PhaseGate } from "./phase-gate";
import { RxGate } from "./rx-gate";
import { RyGate } from "./ry-gate";
import { RzGate } from "./rz-gate";
import { SwapGate } from "./swap-gate";
import { ControlGate } from "./control-gate";
import { AntiControlGate } from "./anti-control-gate";
import { Write0Gate } from "./write0-gate";
import { Write1Gate } from "./write1-gate";
import { MeasurementGate } from "./measurement-gate";
import { BlochSphere } from "./bloch-sphere";
import { QFTGate } from "./qft-gate";
import { QFTDaggerGate } from "./qft-dagger-gate";
import { OldGatePalette } from "./old-gate-palette";
import { Circuit } from "./circuit";
import { CircuitStep } from "./circuit-step";
import { Logger } from "./logger";
import { ScrollBox } from "@pixi/ui";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";
import * as tailwindColors from "tailwindcss/colors";
import { GateSource } from "./gate-source";
import { GatePalette } from "./gate-palette";

export class App {
  static elementId = "app";
  private static _instance: App;

  element: HTMLElement;
  activeGate: Gate | null = null;
  grabbedGate: Gate | null = null;
  pixiApp: PIXI.Application<HTMLCanvasElement>;
  oldGatePalette: OldGatePalette;
  circuit: Circuit;
  circuitSteps: CircuitStep[] = [];
  logger: Logger;
  nameMap = new Map();

  public static get instance(): App {
    if (!this._instance) {
      this._instance = new App(this.elementId);
    }

    // 自身が持つインスタンスを返す
    return this._instance;
  }

  constructor(elementId: string) {
    const el = document.getElementById(elementId);
    if (el === null) {
      throw new Error("Could not find #app");
    }
    this.element = el;

    // view, stage などをまとめた application を作成
    this.pixiApp = new PIXI.Application<HTMLCanvasElement>({
      width: 800,
      height: 600,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: tailwindColors.zinc["50"],
      preserveDrawingBuffer: true,
    });

    window.addEventListener("resize", this.resize.bind(this), false);
    this.resize();

    el.appendChild(this.pixiApp.view);

    // stage: 画面に表示するオブジェクトたちの入れ物
    this.pixiApp.stage.eventMode = "static";
    this.pixiApp.stage.hitArea = this.pixiApp.screen;
    this.pixiApp.stage.sortableChildren = true;
    this.pixiApp.stage
      .on("pointerup", this.releaseGate.bind(this)) // マウスでクリックを離した、タッチパネルでタッチを離した
      .on("pointerupoutside", this.releaseGate.bind(this)) // 描画オブジェクトの外側でクリック、タッチを離した
      .on("pointerdown", this.maybeDeactivateGate.bind(this));

    this.oldGatePalette = new OldGatePalette(150, 32);
    // this.pixiApp.stage.addChild(this.oldGatePalette.graphics);

    // this.oldGatePalette.newGateRunner.add(this);
    // this.oldGatePalette.enterGateRunner.add(this);
    // this.oldGatePalette.leaveGateRunner.add(this);
    // this.oldGatePalette.grabGateRunner.add(this);

    const gatePalette = new GatePalette();
    gatePalette.onNewGate.connect((newGate) => {
      newGate.zIndex = 20
      this.pixiApp.stage.addChild(newGate);
    })

    this.pixiApp.stage.addChild(gatePalette.addGate(HGate));
    this.pixiApp.stage.addChild(gatePalette.addGate(XGate));
    this.pixiApp.stage.addChild(gatePalette.addGate(YGate));
    this.pixiApp.stage.addChild(gatePalette.addGate(ZGate));
    this.pixiApp.stage.addChild(gatePalette.addGate(RnotGate));
    this.pixiApp.stage.addChild(gatePalette.addGate(SGate));
    this.pixiApp.stage.addChild(gatePalette.addGate(SDaggerGate));
    this.pixiApp.stage.addChild(gatePalette.addGate(TGate));
    this.pixiApp.stage.addChild(gatePalette.addGate(TDaggerGate));
    this.pixiApp.stage.addChild(gatePalette.addGate(PhaseGate));
    this.pixiApp.stage.addChild(gatePalette.addGate(RxGate));
    this.pixiApp.stage.addChild(gatePalette.addGate(RyGate));
    this.pixiApp.stage.addChild(gatePalette.addGate(RzGate));

    this.pixiApp.stage.addChild(gatePalette.addGate(SwapGate));
    this.pixiApp.stage.addChild(gatePalette.addGate(ControlGate));
    this.pixiApp.stage.addChild(gatePalette.addGate(AntiControlGate));
    this.pixiApp.stage.addChild(gatePalette.addGate(Write0Gate));
    this.pixiApp.stage.addChild(gatePalette.addGate(Write1Gate));
    this.pixiApp.stage.addChild(gatePalette.addGate(MeasurementGate));
    this.pixiApp.stage.addChild(gatePalette.addGate(BlochSphere));
    this.pixiApp.stage.addChild(gatePalette.addGate(QFTGate));
    this.pixiApp.stage.addChild(gatePalette.addGate(QFTDaggerGate));

    this.pixiApp.stage.addChild(gatePalette);

    const gatePaletteRow1 = new ScrollBox({
      width: 32 * 13 + 8 * 13,
      height: 32,
      elementsMargin: 8,
      items: [
        new GateSource(HGate),
        new GateSource(XGate),
        new GateSource(YGate),
        new GateSource(ZGate),
        new GateSource(RnotGate),
        new GateSource(SGate),
        new GateSource(SDaggerGate),
        new GateSource(TGate),
        new GateSource(TDaggerGate),
        new GateSource(PhaseGate),
        new GateSource(RxGate),
        new GateSource(RyGate),
        new GateSource(RzGate),
      ],
    });

    (gatePaletteRow1.items[0] as GateSource).generateNewGate();

    const gatePaletteRow2 = new ScrollBox({
      width: 32 * 9 + 8 * 9,
      height: 32,
      elementsMargin: 8,
      items: [
        new GateSource(SwapGate),
        new GateSource(ControlGate),
        new GateSource(AntiControlGate),
        new GateSource(Write0Gate),
        new GateSource(Write1Gate),
        new GateSource(MeasurementGate),
        new GateSource(BlochSphere),
        new GateSource(QFTGate),
        new GateSource(QFTDaggerGate),
      ],
    });
    const gatePaletteRows = new ScrollBox({
      background: tailwindColors.white,
      width: 512 + 46,
      height: 72 + 30,
      elementsMargin: 8,
      horPadding: 24,
      vertPadding: 16,
      radius: 12,
      items: [gatePaletteRow1, gatePaletteRow2],
    });
    // this.pixiApp.stage.addChild(gatePaletteRows);

    const gatePaletteBorder = new PIXI.Graphics();
    gatePaletteBorder.lineStyle(1, tailwindColors.zinc["400"], 1, 0);
    gatePaletteBorder.drawRoundedRect(0, 0, 512 + 48, 72 + 32, 12);
    gatePaletteBorder.addChild(gatePaletteRows);
    gatePaletteRows.x = 1;
    gatePaletteRows.y = 1;
    this.pixiApp.stage.addChild(gatePaletteBorder);

    gatePaletteBorder.filters = [
      new DropShadowFilter({ offset: { x: 0, y: 4 }, blur: 3, alpha: 0.07 }),
      new DropShadowFilter({ offset: { x: 0, y: 2 }, blur: 2, alpha: 0.06 }),
    ];

    // gatePaletteBorder.zIndex = 10;
    gatePaletteBorder.x = 150;
    gatePaletteBorder.y = 180; //32 + 104 + 16;

    this.circuit = new Circuit(
      10,
      5,
      this.oldGatePalette.x + this.oldGatePalette.width,
      200
    );
    this.pixiApp.stage.addChild(this.circuit.graphics);
    this.element.dataset.app = JSON.stringify(this);

    this.logger = new Logger(this.pixiApp);
    this.nameMap.set(this.pixiApp.stage, "stage");
  }

  get screenWidth(): number {
    return this.pixiApp.screen.width;
  }

  get screenHeight(): number {
    return this.pixiApp.screen.height;
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.pixiApp.renderer.resize(width, height);
  }

  newGate(gate: Gate) {
    this.pixiApp.stage.addChild(gate);
    this.element.dataset.app = JSON.stringify(this);
  }

  enterGate(gate: Gate) {
    gate.mouseEnter();
  }

  leaveGate(gate: Gate) {
    gate.mouseLeave();
    this.pixiApp.stage.cursor = "default";
  }

  grabGate(gate: Gate, globalPosition: PIXI.Point) {
    if (this.activeGate !== null && this.activeGate !== gate) {
      this.activeGate.deactivate();
    }

    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.activeGate = gate;
    this.grabbedGate = gate;

    // this.dropzones についてループを回す
    // その中で、dropzone が snappable かどうかを判定する
    let dropzone;

    for (const circuitStep of this.circuit.circuitSteps) {
      for (const each of circuitStep.dropzones) {
        if (
          each.isSnappable(
            globalPosition.x,
            globalPosition.y,
            gate.width,
            gate.height
          )
        ) {
          dropzone = each;
          this.grabbedGate.click(globalPosition, each);
        }
      }
    }

    gate.dropzone = dropzone;
    if (!gate.dropzone) {
      this.grabbedGate.click(globalPosition, null);
    }

    this.pixiApp.stage.cursor = "grabbing";

    this.pixiApp.stage.on("pointermove", this.maybeMoveGate.bind(this));
  }

  toJSON() {
    return {
      gatePalette: this.oldGatePalette,
      circuit: this.circuit || "",
    };
  }

  private maybeMoveGate(event: PIXI.FederatedPointerEvent) {
    if (this.grabbedGate === null) {
      return;
    }

    this.moveGate(this.grabbedGate, event.global);
  }

  // globalPosition is the global position of the mouse/touch
  private moveGate(gate: Gate, globalPosition: PIXI.Point) {
    let snapDropzone;

    for (const circuitStep of this.circuit.circuitSteps) {
      for (const each of circuitStep.dropzones) {
        if (
          each.isSnappable(
            globalPosition.x,
            globalPosition.y,
            gate.width,
            gate.height
          )
        ) {
          snapDropzone = each;
          gate.snapToDropzone(each, globalPosition);
        }
      }
    }

    if (
      snapDropzone &&
      (gate.dropzone === null || gate.dropzone !== snapDropzone)
    ) {
      gate.snap(snapDropzone);
    }

    if (gate.dropzone && !snapDropzone) {
      gate.unsnap();
    }

    gate.dropzone = snapDropzone;
    if (!gate.dropzone) {
      gate.move(globalPosition);
    }
  }

  private releaseGate() {
    if (this.grabbedGate === null) {
      return;
    }

    this.pixiApp.stage.cursor = "grab";
    this.pixiApp.stage.off("pointermove", this.maybeMoveGate);
    this.grabbedGate.mouseUp();
    this.grabbedGate = null;
  }

  private maybeDeactivateGate(event: PIXI.FederatedPointerEvent) {
    if (event.target === this.pixiApp.stage) {
      this.activeGate?.deactivate();
    }
  }
}
