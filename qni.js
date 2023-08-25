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
