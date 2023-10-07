import * as PIXI from "pixi.js";
import * as tailwindColors from "tailwindcss/colors";
import { Container } from "pixi.js";
import { Gate } from "./gate";
import { GateSource } from "./gate-source";
import { List } from "@pixi/ui";
import { Signal } from 'typed-signals';
import { spacingInPx } from "./util";

export class GatePalette extends Container {
  static horizontalPadding = spacingInPx(6);
  static verticalPadding = spacingInPx(4);
  static gapBetweenGates = spacingInPx(2);
  static borderColor = tailwindColors.zinc["400"];
  static backgroundColor = tailwindColors.white;
  static cornerRadius = spacingInPx(3);

  protected graphics: PIXI.Graphics;
  protected gateClasses: (typeof Gate)[][] = [];
  protected list: List;

  // Event that is fired when the button is down.
  onNewGate: Signal<(gate: Gate) => void>;

  constructor() {
    super();

    this.onNewGate = new Signal();

    this.graphics = new PIXI.Graphics();
    this.addChild(this.graphics);

    // this.newGateRunner = new Runner("newGate");
    // this.enterGateRunner = new Runner("enterGate");
    // this.leaveGateRunner = new Runner("leaveGate");
    // this.grabGateRunner = new Runner("grabGate");

    this.list = new List({
      type: "horizontal",
      elementsMargin: 8,
    });
    this.graphics.addChild(this.list);

    this.draw();
  }

  addGate(gateClass: typeof Gate): Gate {
    const gateSource = new GateSource(gateClass);
    this.list.addChild(gateSource);

    gateSource.onNewGate.connect((newGate) =>
      this.onNewGate.emit(newGate)
    );

    const gate = gateSource.generateNewGate();

    // if (this.gateClasses[row] === undefined) {
    //   this.gateClasses[row] = [];
    // }
    // this.gateClasses[row].push(gateClass);
    // const x =
    //   this.x +
    //   GatePalette.horizontalPadding +
    //   (this.gateClasses[row].length - 1) *
    //     (Gate.size + GatePalette.gapBetweenGates);
    // const y =
    //   this.y +
    //   GatePalette.verticalPadding +
    //   (row - 1) * (Gate.size + GatePalette.gapBetweenGates);
    // const gateSource = new GateSource(gateClass);
    // gateSource.x = x;
    // gateSource.y = y;
    // this.graphics.addChild(gateSource.graphics);

    // gateSource.newGateRunner.add(this);
    // gateSource.enterGateRunner.add(this);
    // gateSource.leaveGateRunner.add(this);
    // gateSource.grabGateRunner.add(this);
    // const gate = gateSource.generateNewGate();

    this.draw();

    return gate;
  }

  draw(): void {
    this.graphics.clear();

    this.graphics.lineStyle(1, GatePalette.borderColor, 1, 0);
    this.graphics.beginFill(GatePalette.backgroundColor);
    this.graphics.drawRoundedRect(
      this.x,
      this.y,
      this.list.width,
      this.list.height,
      GatePalette.cornerRadius
    );
    this.graphics.endFill();

    // console.log(
    //   `scrollBox.width = ${this.scrollBox.width}, scrollBox.height = ${this.scrollBox.height}`
    // );

    // console.dir(
    //   `x = ${this.x}, y = ${this.y}, width = ${this.width}, height = ${this.height}`
    // );

    // // TODO: dropshadow の定義を別ファイルに移動
    // this.graphics.filters = [
    //   new DropShadowFilter({ offset: { x: 0, y: 4 }, blur: 3, alpha: 0.07 }),
    //   new DropShadowFilter({ offset: { x: 0, y: 2 }, blur: 2, alpha: 0.06 }),
    // ];
  }
}
