import * as PIXI from "pixi.js";

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

// Create H gate texture
const hadamardTexture = PIXI.Texture.from("./assets/H.svg");
hadamardTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST; // Scale mode for pixelation

// Create H gate (hover state) texture
const hadamardHoverTexture = PIXI.Texture.from("./assets/H_hover.svg");
hadamardHoverTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

// Create H gate (grab state) texture
const hadamardGrabTexture = PIXI.Texture.from("./assets/H_grab.svg");
hadamardGrabTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

createWorld();

// ドロップゾーンの定義
const dropzoneWidth = 32;
const dropzoneHeight = 32;
const dropzoneX = app.screen.width / 2;
const dropzoneY = app.screen.height / 2;
const snapRatio = 0.5

// デバッグ用にドロップゾーンを表示する
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

  // move the sprite to its designated position
  hGate.x = x;
  hGate.y = y;

  // add it to the stage
  app.stage.addChild(hGate);
}

function onGateOver() {
  if (dragTarget === null) {
    this.texture = hadamardHoverTexture;
  }
}

function onGateOut() {
  if (dragTarget === null) {
    this.texture = hadamardTexture;
  }
}

let dragTarget: PIXI.Sprite | null = null;

app.stage.eventMode = "static";
app.stage.hitArea = app.screen;
app.stage.sortableChildren = true;
app.stage.on("pointerup", onDragEnd);
app.stage.on("pointerupoutside", onDragEnd);

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

function onDragEnd() {
  if (dragTarget) {
    app.stage.off("pointermove", onDragMove);
    dragTarget.zIndex = 0;
    dragTarget.texture = hadamardTexture;
    dragTarget.tint = 0xffffff;
    dragTarget = null;
  }
}

// import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))
