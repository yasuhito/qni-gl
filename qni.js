// Pixiアプリケーション生成
const app = new PIXI.Application({
  width: 800,                 // スクリーン(ビュー)横幅
  height: 800,                // スクリーン(ビュー)縦幅
  backgroundColor: 0x1099bb,  // 背景色 16進 0xRRGGBB
  autoDensity: true,
})

// console.log(app.screen.width)
// console.log(app.screen.height)

// HTMLの<main id="app"></main>の中に上で作ったPIXIアプリケーション(app)のビュー(canvas)を突っ込む
let el = document.getElementById('app');
el.appendChild(app.view);

// 画像を読み込み、テクスチャにする
const hadamardTexture = PIXI.Texture.from('./img/H.png');
// Scale mode for pixelation
hadamardTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

for (let i = 0; i < 10; i++) {
  createHGate(
    Math.floor(Math.random() * app.screen.width),
    Math.floor(Math.random() * app.screen.height),
  );
}

function createHGate(x, y) {
  // create our little hGate friend..
  const hGate = new PIXI.Sprite(hadamardTexture);

  // enable the hGate to be interactive... this will allow it to respond to mouse and touch events
  hGate.eventMode = 'static'
  // hGate.interactive = true;

  // this button mode will mean the hand cursor appears when you roll over the hGate with your mouse
  hGate.cursor = 'pointer';

  // center the hGate's anchor point
  hGate.anchor.set(0.5);

  // make it a bit bigger, so it's easier to grab
  hGate.scale.set(2);

  // setup events for mouse + touch using
  // the pointer events
  hGate.on('pointerdown', onDragStart, hGate);

  // move the sprite to its designated position
  hGate.x = x;
  hGate.y = y;

  // add it to the stage
  app.stage.addChild(hGate);
}

let dragTarget = null

app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;
app.stage.sortableChildren = true;
app.stage.on('pointerup', onDragEnd);
app.stage.on('pointerupoutside', onDragEnd);

function onDragMove(event) {
  if (dragTarget) {
    dragTarget.parent.toLocal(event.global, null, dragTarget.position);
  }
}

function onDragStart() {
  // the reason for this is because of multitouch
  // we want to track the movement of this particular touch
  dragTarget = this;
  dragTarget.zIndex = 10;
  dragTarget.tint = 0xffff00;
  app.stage.on('pointermove', onDragMove);
}

function onDragEnd() {
  if (dragTarget) {
    app.stage.off('pointermove', onDragMove);
    dragTarget.zIndex = 0;
    dragTarget.tint = 0xffffff;
    dragTarget = null;
  }
}
