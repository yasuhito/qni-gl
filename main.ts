import * as PIXI from "pixi.js";

const nameMap = new Map();

// view, stage などをまとめた application を作成
const app = new PIXI.Application<HTMLCanvasElement>({
  width: 800,
  height: 800,
  backgroundColor: 0x1099bb,
  autoDensity: true,
});

// Add PIXI application (app) view (canvas) to #app
const el = document.getElementById("app");
if (el === null) {
  throw new Error("Could not find #app");
}
el.appendChild(app.view);

// const title = app.stage.addChild(
//   new PIXI.Text(
//     `Move your mouse slowly over the boxes to
//   see the order of pointerenter, pointerleave,
//   pointerover, pointerout events on each target!`,
//     {
//       fontSize: 16,
//     }
//   )
// );
// title.x = 2;
// title.zIndex = 20;

const logs: string[] = [];
const logText = app.stage.addChild(
  new PIXI.Text("", {
    fontSize: 14,
  })
);

// logText.y = 80;
logText.x = 2;
logText.zIndex = 20;

nameMap.set(app.stage, "stage");

function onEvent(e: PIXI.FederatedPointerEvent) {
  const type = e.type;
  let targetName: string | undefined;
  if (e.target) {
    targetName = nameMap.get(e.target);
  }
  const currentTargetName = nameMap.get(e.currentTarget);

  // Add event to top of logs
  logs.push(
    `${currentTargetName} received ${type} event (target is ${targetName})`
  );

  if (
    currentTargetName === "stage" ||
    type === "pointerenter" ||
    type === "pointerleave"
  ) {
    logs.push("-----------------------------------------", "");
  }

  // Prevent logs from growing too long
  if (logs.length > 30) {
    while (logs.length > 30) {
      logs.shift();
    }
  }

  // Update logText
  logText.text = logs.join("\n");
}

// Create H gate texture
const hadamardTexture = PIXI.Texture.from("./assets/H.svg");
hadamardTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST; // Scale mode for pixelation

// Create H gate (hover state) texture
const hadamardHoverTexture = PIXI.Texture.from("./assets/H_hover.svg");
hadamardHoverTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

// Create H gate (grab state) texture
const hadamardGrabTexture = PIXI.Texture.from("./assets/H_grabbed.svg");
hadamardGrabTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

createWorld();

// Dropzone definitions
const dropzoneWidth = 32;
const dropzoneHeight = 32;
const dropzoneX = app.screen.width / 2;
const dropzoneY = app.screen.height / 2;
const snapRatio = 0.5;

// for debugging
const graphics = new PIXI.Graphics();
graphics.lineStyle(2, 0x1111ff, 1, 0);
graphics.beginFill(0xffffff, 0);
graphics.drawRect(
  dropzoneX - dropzoneWidth / 2,
  dropzoneY - dropzoneHeight / 2,
  dropzoneWidth,
  dropzoneHeight
);
graphics.endFill();

app.stage.addChild(graphics);

function createWorld() {
  for (let i = 0; i < 100; i++) {
    createHGate(
      Math.floor(Math.random() * app.screen.width),
      Math.floor(Math.random() * app.screen.height)
    );
  }
}

function rectIntersect(
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  x2: number,
  y2: number,
  w2: number,
  h2: number
) {
  // Check x and y for overlap
  if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
    return false;
  }
  return true;
}

function createHGate(x: number, y: number) {
  const hGate = new PIXI.Sprite(hadamardTexture);

  // enable the hGate to be interactive... this will allow it to respond to mouse and touch events
  hGate.eventMode = "static";

  // the hand cursor appears when you roll over the hGate with your mouse
  hGate.cursor = "pointer";

  // center the hGate's anchor point
  hGate.anchor.set(0.5);

  // make it a bit bigger, so it's easier to grab
  // hGate.scale.set(3);

  // setup events for mouse + touch using
  // the pointer events
  hGate
    .on("pointerdown", onDragStart, hGate)
    .on("pointerover", onGateOver, hGate)
    .on("pointerout", onGateOut, hGate);

  nameMap.set(hGate, "hGate");
  // hGate.name = "hGate";
  hGate.addEventListener("pointerdown", onEvent);
  hGate.addEventListener("pointerover", onEvent);
  hGate.addEventListener("pointerout", onEvent);

  // move the sprite to its designated position
  hGate.x = x;
  hGate.y = y;

  // add it to the stage
  app.stage.addChild(hGate);
}

function onDragStart() {
  // the reason for this is because of multitouch
  // we want to track the movement of this particular touch
  dragTarget = this;
  if (dragTarget === null) {
    throw new Error("dragTarget is null");
  }

  dragTarget.zIndex = 10;
  dragTarget.texture = hadamardGrabTexture;
  app.stage.on("pointermove", onDragMove);
}

function onGateOver() {
  if (dragTarget === null) {
    this.texture = hadamardHoverTexture;
    app.stage.cursor = "pointer";
  }
}

function onGateOut() {
  if (dragTarget === null) {
    this.texture = hadamardTexture;
    app.stage.cursor = "default";
  }
}

let dragTarget: PIXI.Sprite | null = null;

// stage: 画面に表示するオブジェクトたちの入れ物
app.stage.eventMode = "static";
app.stage.hitArea = app.screen;
app.stage.sortableChildren = true;
app.stage.on("pointerup", onDragEnd); // マウスでクリックを離した、タッチパネルでタッチを離した
app.stage.on("pointerupoutside", onDragEnd); // 描画オブジェクトの外側でクリック、タッチを離した

function onDragEnd() {
  if (dragTarget) {
    app.stage.off("pointermove", onDragMove);
    dragTarget.zIndex = 0;
    dragTarget.texture = hadamardTexture;
    dragTarget.tint = 0xffffff;
    dragTarget = null;
  }
}

function onDragMove(event: PIXI.FederatedPointerEvent) {
  if (dragTarget) {
    // event.global is the global position of the mouse/touch
    dragTarget.parent.toLocal(event.global, undefined, dragTarget.position);

    if (
      rectIntersect(
        dragTarget.x - dragTarget.width / 2,
        dragTarget.y - dragTarget.height / 2,
        dragTarget.width,
        dragTarget.height,
        dropzoneX - (dropzoneWidth * snapRatio) / 2,
        dropzoneY - (dropzoneHeight * snapRatio) / 2,
        dropzoneWidth * snapRatio,
        dropzoneHeight * snapRatio
      )
    ) {
      dragTarget.tint = 0x00ffff;
      dragTarget.position.set(dropzoneX, dropzoneY);
    } else {
      dragTarget.tint = 0xffffff;
    }
  }
}

[app.stage].forEach((object) => {
  // object.addEventListener("pointerenter", onEvent);
  // object.addEventListener("pointerleave", onEvent);
  // object.addEventListener("pointerover", onEvent);
  // object.addEventListener("pointerout", onEvent);
  object.addEventListener("pointerup", onEvent);
  object.addEventListener("pointerupoutside", onEvent);
});
