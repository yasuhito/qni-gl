/** =======================================================================================
 * 1.3 Pixiアプリケーションを生成する
 */

// Pixiアプリケーション生成
let app = new PIXI.Application({
  width: 800,                 // スクリーン(ビュー)横幅
  height: 800,                // スクリーン(ビュー)縦幅
  backgroundColor: 0x1099bb,  // 背景色 16進 0xRRGGBB
  autoDensity: true,
});

// HTMLの<main id="app"></main>の中に上で作ったPIXIアプリケーション(app)のビュー(canvas)を突っ込む
let el = document.getElementById('app');
el.appendChild(app.view);



/** =======================================================================================
 * 1.4 スプライトや図形を表示する
 */

/**
 * スプライト(PIXI.Sprite)
 */
// 画像を読み込み、テクスチャにする
let hadamardTexture = PIXI.Texture.from('./img/H.png');

// 読み込んだテクスチャから、スプライトを生成する
let hadamardSprite = new PIXI.Sprite(hadamardTexture);
// Hの基準点を設定(%) 0.5はそれぞれの中心 位置・回転の基準になる
hadamardSprite.anchor.x = 0.5;
hadamardSprite.anchor.y = 0.5;
// Hの位置決め
hadamardSprite.x = app.screen.width / 2;        // ビューの幅 / 2 = x中央
hadamardSprite.y = app.screen.height / 2;       // ビューの高さ / 2 = y中央
// 表示領域に追加する
app.stage.addChild(hadamardSprite);


// 読み込んだテクスチャから、スプライトを生成する
let hadamardSprite2 = new PIXI.Sprite(hadamardTexture);
// Hの基準点を設定(%) 0.5はそれぞれの中心 位置・回転の基準になる
hadamardSprite2.anchor.x = 0.5;
hadamardSprite2.anchor.y = 0.5;
// Hの位置決め
hadamardSprite2.x = app.screen.width / 3;        // ビューの幅 / 2 = x中央
hadamardSprite2.y = app.screen.height / 3;       // ビューの高さ / 2 = y中央
// 表示領域に追加する
app.stage.addChild(hadamardSprite2);


// // 別のぶたを作る
// let butaSprite2 = new PIXI.Sprite(butaTexture); // テクスチャは同じものを使いまわせる
// // 基準点を設定 set()を使うとx,y同時に設定できる
// butaSprite2.anchor.set(0.5);
// // 大きさを変えてみる
// butaSprite2.scale.x = 1.5;
// butaSprite2.scale.y = 1.5;
// // 半透明にしてみる
// butaSprite2.alpha = 0.9;
// // 回転してみる
// butaSprite2.rotation = Math.PI / 3;          // (ラジアンで指定)
// // butaSprite2.angle = 60;                        // (度数で指定)
// // 色味を変えてみる
// butaSprite2.tint = 0xffff00;                // (基準は0xffffff)

// butaSprite2.x = app.screen.width / 2 + 150;
// butaSprite2.y = app.screen.height / 2;
// app.stage.addChild(butaSprite2);



/** =======================================================================================
 * 1.6 オブジェクトがクリックされたときになんかする
 */

// 中央のHのインタラクション(イベント)を有効化
hadamardSprite.eventMode = 'static';

// Hにマウスが重なった時、表示をポインターにする
hadamardSprite.cursor = 'pointer';


// 中央のHのインタラクション(イベント)を有効化
hadamardSprite2.eventMode = 'static';

// Hにマウスが重なった時、表示をポインターにする
hadamardSprite2.cursor = 'pointer';


// 中央のHスプライトにクリックイベントのリスナーを設定する
// オブジェクト.on('イベントの種類', イベントハンドラ) で設定する
// hadamardSprite.on('pointertap', showAlert);

// イベントハンドラの定義
// function showAlert(e) {
//     console.log(e);
//     alert('Hがクリック(タップ)されました');
// }

// リスナーを解除する(on()の逆)
// hadamardSprite.off('pointertap',showAlert);


/** =======================================================================================
 * 1.8 オブジェクトの前後関係(描画順序)を変更する
 */

// zIndexによる自動ソートを有効化(どんなコンテナでも設定可能)
app.stage.sortableChildren = true;

// でかいぶたを最前面に描画(どのオブジェクトもzIndexの初期値は0)
hadamardSprite.zIndex = 10;

// でかいぶたを最背面に描画
// butaSprite2.zIndex = -1;


/** =======================================================================================
 * 1.7 オブジェクトをドラッグして動かす
 */

// Hスプライトにイベントリスナーを設定する
// .on()をつなげて連続で設定することができる
hadamardSprite.on('pointerdown', onGatePointerDown)    // ぶたの上でマウスがクリック(orタップ)されたとき
              .on('pointerup', onGatePointerUp);      // ぶたの上でマウスクリックが外れたとき

hadamardSprite2.on('pointerdown', onGatePointerDown)    // ぶたの上でマウスがクリック(orタップ)されたとき
               .on('pointerup', onGatePointerUp);      // ぶたの上でマウスクリックが外れたとき


// ぶたの上でマウスがクリック(orタップ)されたときの処理定義
function onGatePointerDown() {
  this.on('pointermove', moveGate);    // ドラッグイベントリスナーを設定
  this.zIndex = 10;

  // 分かる人向けTIPS:
  // ドラッグ処理が重かったり、Hが他のオブジェクトの下に入ったりするとpointerupを拾えず、
  // ドラッグイベントのリスナーが解除されない場合がある。
  // こうなるとマウスをクリックした状態でなくても、Hにマウスが重なるとぶたが追従してくる。
  // これはwindowにマウスクリック解除時のリスナーを設定することで解除できる...かも
  // window.addEventListener('pointerup', onGatePointerUp);
}

// ぶたをドラッグ中の処理定義
function moveGate(e) {
  // PIXI.interaction.InteractionData.getLoalPosition(オブジェクト)
  // イベント発火地点(=ドラッグ中のマウス位置)がapp.stageのどこの位置にあるかを取得
  let position = e.data.getLocalPosition(app.stage);

  // 位置変更
  this.x = position.x;
  this.y = position.y;
}

// ぶたの上でマウスクリックが外れたときの処理定義
function onGatePointerUp() {
  this.off('pointermove', moveGate); // ドラッグイベントリスナーを解除
  this.zIndex = 0;
}


