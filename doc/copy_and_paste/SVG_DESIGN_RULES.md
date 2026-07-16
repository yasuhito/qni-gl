# コピー＆ペースト機能 SVG_DESIGN_RULES.md

## 1. ファイルの説明

### 1-1. このファイルの目的

このファイルは、コピー＆ペースト機能の見た目確認用である。

以下のSVG例を管理する。

- 選択枠
- ペースト後の強調表示
- 通常ゲート
- 制御ゲート
- ターゲットゲート
- SWAP
- 空セル選択
- 複数ゲート選択
- 押し出し後の表示

---

### 1-2. 注意事項

SVGは見た目確認用であり、アルゴリズム仕様の正本ではない。

実装ルール・ペースト処理・Undo/Redo仕様は `SPEC.md` を正とする。

SVG内の座標値は描画例であり、ペーストアルゴリズムの仕様値ではない。

SVG例は、`SPEC.md` に定義された動作仕様を視覚的に確認するために使用する。

SVG例からペースト処理、Undo/Redo仕様、接続構造判定、押し出し幅を推測してはならない。

---

### 1-3. 指定色

QniGPUは以下の色を用いる。

| 対象 | 色 |
|---|---|
| 通常ゲート枠 | `border-onbrand` / `tailwindColors.sky["700"]` |
| 通常ゲート塗り | `bg-brand` / `tailwindColors.sky["500"]` |
| 選択ゲート枠 | `border-active` / `tailwindColors.teal["300"]` |
| 空セル選択塗り | `rgba(113, 113, 122, 0.12)` |
| ペースト直後のゲート塗り | 白 `#FFFFFF` / 不透明度35% |
| ペースト直後のゲート枠 | 白 `#FFFFFF` / 不透明度35% |
| ペースト強調表示 | 通常色のゲートが先に表示され、50ms後にゲート全体へ半透明の白い表示が重なり、0.5秒間で滑らかに消える |
| 強調対象 | 新たに挿入されたステップ全体。ゲート、制御・SWAPの接続線、関連するワイヤを含む |
| ゲート文字 | `#FFFFFF` |
| 量子ビット線 | `#E4E4E7` |

---

### 1-4. SVG例の並び順

SVG例は以下の順に並べる。

1. 基本表示
2. 単一ゲートのコピー＆ペースト
3. 既存ゲートの押し出し
4. 既存CNOTの押し出し
5. 複数Hゲートのコピー＆ペースト
6. 制御ゲートの選択
7. 制御ゲートまたはターゲットゲートの一部選択
8. CNOT・S・CNOTセットのコピー＆ペースト
9. 別ゲートをペースト基準にする例
10. 空セルをペースト基準にする例
11. 複雑な例

---

# 2. デザインルールSVG
仕様変更により、ペースト直後のUI表現は変更された。
ただし、ペーストのルール自体は変更しない。

SVG_DESIGN_RULES.md に含まれる紫点線枠（#6B15A8）は、旧仕様におけるペースト直後の強調表示として扱う。
現在の仕様では、紫点線枠そのものは新UIとして実装対象にしない。
## 2-1. 基本表示

### 2-1-1. 空セル選択

選択枠のUI。空白セルを選択した状態。

<svg xmlns="http://www.w3.org/2000/svg" width="340" height="160">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="340" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="340" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="none" stroke="#5EEAD4" stroke-width="2" />
</svg>

---

### 2-1-2. 通常Hゲート

Hゲートを1ステップ目・1量子ビット目に配置した状態。

<svg xmlns="http://www.w3.org/2000/svg" width="340" height="160">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="340" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="340" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="50" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
</svg>

---

### 2-1-3. Hゲート選択

Hゲートを配置し、選択した状態。

<svg xmlns="http://www.w3.org/2000/svg" width="340" height="160">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="340" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="340" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="50" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
</svg>

---

## 2-2. 単一ゲートのコピー＆ペースト

### 2-2-1. Hゲートのコピー＆ペースト

Hゲートを配置後、Hゲートを選択し、`Ctrl+C` でコピー、`Ctrl+V` でペーストする状態。

複製されたゲートは紫の点線枠で強調される。

<svg xmlns="http://www.w3.org/2000/svg" width="340" height="160">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="340" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="340" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="50" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="92" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="110" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
</svg>

---

### 2-2-2. Hゲートの連続ペースト

連続でペーストした状態。

ペースト基準は、1ステップ目・1量子ビット目のHゲート。

新しく挿入されたのは、2ステップ目・1量子ビット目のHゲート。

既存のゲートは右方向にステップごと押し出される。

<svg xmlns="http://www.w3.org/2000/svg" width="340" height="160">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="340" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="340" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="50" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="92" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="110" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="152" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="170" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
</svg>

---

## 2-3. 既存ゲートの押し出し

### 2-3-1. 既存Xゲートがある場合

2ステップ目・1量子ビット目に既存のXゲートがある状態。

<svg xmlns="http://www.w3.org/2000/svg" width="340" height="160">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="340" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="340" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="50" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<circle cx="110" cy="50" r="18" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="110" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
</svg>

---

### 2-3-2. 既存Xゲートを押し出した状態

既存のXゲートをステップごと右へ押し出す。

<svg xmlns="http://www.w3.org/2000/svg" width="340" height="160">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="340" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="340" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="50" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="92" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="110" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<circle cx="170" cy="50" r="18" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="170" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
</svg>

---

## 2-4. 既存CNOTの押し出し

### 2-4-1. 既存CNOTゲートがある場合

既存のCNOTゲートがある場合のHゲートのペースト前の状態。

<svg xmlns="http://www.w3.org/2000/svg" width="340" height="160">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="340" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="340" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<line x1="110" y1="50" x2="110" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="50" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<circle cx="110" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="110" cy="110" r="18" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="110" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
</svg>

---

### 2-4-2. CNOTの構造を保持した押し出し

CNOTの構造を保持したまま押し出す。

ペーストはコピーされたゲートをステップごと挿入しているため、制御ゲートをはじめ既存の量子回路の構造を破壊しない。

<svg xmlns="http://www.w3.org/2000/svg" width="340" height="160">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="340" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="340" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<line x1="170" y1="50" x2="170" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="50" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="92" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="110" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<circle cx="170" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="170" cy="110" r="18" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="170" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
</svg>

## 2-5. 複数Hゲートのコピー＆ペースト

### 2-5-1. 2つのHゲートをコピー

複数のHゲートをコピーし、ペーストする例。

2つのHゲートを選択した状態。

<svg xmlns="http://www.w3.org/2000/svg" width="340" height="160">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="340" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="340" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="50" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="92" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="110" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
</svg>

---

### 2-5-2. 2つのHゲートをペースト

ペーストすると、コピーした分のステップ数・量子ゲートが複製される。

ペースト基準は、コピーした分の最も右のステップの1量子ビット目。

<svg xmlns="http://www.w3.org/2000/svg" width="340" height="160">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="340" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="340" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="50" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="92" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="110" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="152" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="170" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="212" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="230" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
</svg>

---

### 2-5-3. 連続ペースト 1回目

連続操作の例。

コピーした2つのHゲートを、さらに続けてペーストした状態。

<svg xmlns="http://www.w3.org/2000/svg" width="400" height="160">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="400" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="400" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="50" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="92" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="110" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="152" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="170" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="212" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="230" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="272" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="290" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="332" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="350" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
</svg>

---

### 2-5-4. 連続ペースト 2回目

さらに連続でペーストした状態。

<svg xmlns="http://www.w3.org/2000/svg" width="520" height="160">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="520" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="520" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="50" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="92" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="110" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="152" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="170" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="212" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="230" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="272" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="290" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="332" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="350" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="392" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="410" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="452" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="470" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
</svg>

---

## 2-6. 制御ゲートの選択

### 2-6-1. CNOTゲート選択

制御量子ビットを代表するCNOTゲートの選択の様子。

1回のクリックで、制御ゲートを構成するすべてのゲートが選択される。

<svg xmlns="http://www.w3.org/2000/svg" width="340" height="160">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="340" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="340" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<line x1="50" y1="50" x2="50" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="none" stroke="#5EEAD4" stroke-width="2" />
<circle cx="50" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="50" cy="110" r="18" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="50" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
</svg>

---

### 2-6-2. 制御Hゲート選択

制御Hゲートの例。

<svg xmlns="http://www.w3.org/2000/svg" width="340" height="160">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="340" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="340" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<line x1="50" y1="50" x2="50" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="none" stroke="#5EEAD4" stroke-width="2" />
<circle cx="50" cy="50" r="7" fill="#0EA5E9"/>
<rect x="32" y="92" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="50" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
</svg>

---

### 2-6-3. CCNOTゲート選択

CCNOTゲートの例。

<svg xmlns="http://www.w3.org/2000/svg" width="340" height="220">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="340" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="340" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="170" x2="340" y2="170" stroke="#E4E4E7" stroke-width="2"/>
<line x1="50" y1="50" x2="50" y2="170" stroke="#0EA5E9" stroke-width="3"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="none" stroke="#5EEAD4" stroke-width="2" />
<circle cx="50" cy="50" r="7" fill="#0EA5E9"/>
<rect x="32" y="92" width="36" height="36" rx="6" fill="none" stroke="#5EEAD4" stroke-width="2" />
<circle cx="50" cy="110" r="7" fill="#0EA5E9"/>
<circle cx="50" cy="170" r="18" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="50" y="172" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
</svg>

---

### 2-6-4. SWAPゲート選択

SWAPも制御ゲートと同様に、構成要素を選択枠で示す。

<svg xmlns="http://www.w3.org/2000/svg" width="340" height="160">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="340" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="340" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<line x1="50" y1="50" x2="50" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="none" stroke="#5EEAD4" stroke-width="2" />
<line x1="40" y1="40" x2="60" y2="60" stroke="#0EA5E9" stroke-width="3" stroke-linecap="round"/>
<line x1="40" y1="60" x2="60" y2="40" stroke="#0EA5E9" stroke-width="3" stroke-linecap="round"/>
<rect x="32" y="92" width="36" height="36" rx="6" fill="none" stroke="#5EEAD4" stroke-width="2" />
<line x1="40" y1="100" x2="60" y2="120" stroke="#0EA5E9" stroke-width="3" stroke-linecap="round"/>
<line x1="40" y1="120" x2="60" y2="100" stroke="#0EA5E9" stroke-width="3" stroke-linecap="round"/>
</svg>

---

## 2-7. 制御ゲートの一部選択

### 2-7-1. 制御点を選択

ダブルクリックで、制御ゲートを構成する単一量子ビットが選択・コピー可能。

この例では、CNOTの制御点側を選択している。

<svg xmlns="http://www.w3.org/2000/svg" width="340" height="160">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="340" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="340" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<line x1="50" y1="50" x2="50" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="none" stroke="#5EEAD4" stroke-width="2" />
<circle cx="50" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="50" cy="110" r="18" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="50" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
</svg>

---

### 2-7-2. ターゲット側を選択

この例では、CNOTのターゲット側を選択している。

<svg xmlns="http://www.w3.org/2000/svg" width="340" height="160">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="340" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="340" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<line x1="50" y1="50" x2="50" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<circle cx="50" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="50" cy="110" r="18" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="50" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
</svg>

## 2-8. CNOT・S・CNOTセットのコピー＆ペースト

### 2-8-1. CNOT・S・CNOTセットをコピー

複数選択からのコピー＆ペーストの例。

CNOT・S・CNOTから構成されるゲートセットをコピーする。

構造がコピーされる。

<svg xmlns="http://www.w3.org/2000/svg" width="340" height="160">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="340" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="340" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<line x1="50" y1="50" x2="50" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<line x1="170" y1="50" x2="170" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="none" stroke="#5EEAD4" stroke-width="2" />
<circle cx="50" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="50" cy="110" r="18" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="50" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<rect x="92" y="92" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="110" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">S</text>
<rect x="152" y="32" width="36" height="36" rx="6" fill="none" stroke="#5EEAD4" stroke-width="2" />
<circle cx="170" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="170" cy="110" r="18" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="170" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
</svg>

---

### 2-8-2. CNOT・S・CNOTセットをペースト

コピーされた構造が複製される。

ペースト基準は、コピーした量子ゲートのセットの最も右のステップの1量子ビット目。

複数ゲートのペーストの場合、ペーストされる側の最も左のステップの1量子ビット目が、ペースト基準の右に位置するよう複製される。

<svg xmlns="http://www.w3.org/2000/svg" width="400" height="160">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="400" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="400" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<line x1="50" y1="50" x2="50" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<line x1="170" y1="50" x2="170" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<line x1="230" y1="50" x2="230" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<line x1="350" y1="50" x2="350" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="none" stroke="#5EEAD4" stroke-width="2" />
<circle cx="50" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="50" cy="110" r="18" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="50" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<rect x="92" y="92" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="110" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">S</text>
<rect x="152" y="32" width="36" height="36" rx="6" fill="none" stroke="#5EEAD4" stroke-width="2" />
<circle cx="170" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="170" cy="110" r="18" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="170" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<rect x="212" y="32" width="36" height="36" rx="6" fill="none" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<circle cx="230" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="230" cy="110" r="18" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="230" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<rect x="272" y="92" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="290" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">S</text>
<rect x="332" y="32" width="36" height="36" rx="6" fill="none" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<circle cx="350" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="350" cy="110" r="18" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="350" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
</svg>

---

### 2-8-3. CNOT・S・CNOTセットの連続ペースト

連続操作も同様に、コピーした分のステップ数・ゲート構造が挿入される。

既存のゲートは、コピーした分のステップ数分押し出される。

<svg xmlns="http://www.w3.org/2000/svg" width="580" height="160">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="580" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="580" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<line x1="50" y1="50" x2="50" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<line x1="170" y1="50" x2="170" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<line x1="230" y1="50" x2="230" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<line x1="350" y1="50" x2="350" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<line x1="410" y1="50" x2="410" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<line x1="530" y1="50" x2="530" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="none" stroke="#5EEAD4" stroke-width="2" />
<circle cx="50" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="50" cy="110" r="18" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="50" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<rect x="92" y="92" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="110" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">S</text>
<rect x="152" y="32" width="36" height="36" rx="6" fill="none" stroke="#5EEAD4" stroke-width="2" />
<circle cx="170" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="170" cy="110" r="18" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="170" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<rect x="212" y="32" width="36" height="36" rx="6" fill="none" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<circle cx="230" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="230" cy="110" r="18" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="230" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<rect x="272" y="92" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="290" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">S</text>
<rect x="332" y="32" width="36" height="36" rx="6" fill="none" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<circle cx="350" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="350" cy="110" r="18" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="350" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<circle cx="410" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="410" cy="110" r="18" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="410" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<rect x="452" y="92" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="470" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">S</text>
<circle cx="530" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="530" cy="110" r="18" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="530" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
</svg>

---

## 2-9. 別ゲートをペースト基準にする例

### 2-9-1. CNOT・S・CNOTセットをコピー

CNOT・S・CNOTのゲートセットを複数選択しコピーした状態。

<svg xmlns="http://www.w3.org/2000/svg" width="340" height="160">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="340" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="340" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<line x1="50" y1="50" x2="50" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<line x1="170" y1="50" x2="170" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="none" stroke="#5EEAD4" stroke-width="2" />
<circle cx="50" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="50" cy="110" r="18" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="50" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<rect x="92" y="92" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="110" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">S</text>
<rect x="152" y="32" width="36" height="36" rx="6" fill="none" stroke="#5EEAD4" stroke-width="2" />
<circle cx="170" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="170" cy="110" r="18" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="170" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
</svg>

---

### 2-9-2. 真ん中のSゲートをペースト基準にする

CNOT・S・CNOTのゲートセットを複数選択しコピーした後、真ん中のSゲートを選択しペースト基準にした状態。

<svg xmlns="http://www.w3.org/2000/svg" width="340" height="160">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="340" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="340" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<line x1="50" y1="50" x2="50" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<line x1="170" y1="50" x2="170" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<circle cx="50" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="50" cy="110" r="18" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="50" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<rect x="92" y="92" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="110" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">S</text>
<circle cx="170" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="170" cy="110" r="18" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="170" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
</svg>

---

### 2-9-3. Sゲート基準でのペースト結果

コピーされた分のステップと量子ゲートが、構造を保ってSゲートを基準に挿入される。

<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="400" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="400" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="170" x2="400" y2="170" stroke="#E4E4E7" stroke-width="2"/>
<line x1="50" y1="50" x2="50" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<line x1="170" y1="110" x2="170" y2="170" stroke="#0EA5E9" stroke-width="3"/>
<line x1="290" y1="110" x2="290" y2="170" stroke="#0EA5E9" stroke-width="3"/>
<line x1="350" y1="50" x2="350" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<circle cx="50" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="50" cy="110" r="18" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="50" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<rect x="92" y="92" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="110" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">S</text>
<rect x="152" y="92" width="36" height="36" rx="6" fill="none" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<circle cx="170" cy="110" r="7" fill="#0EA5E9"/>
<circle cx="170" cy="170" r="18" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="170" y="172" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<rect x="212" y="152" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="230" y="172" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">S</text>
<rect x="272" y="92" width="36" height="36" rx="6" fill="none" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<circle cx="290" cy="110" r="7" fill="#0EA5E9"/>
<circle cx="290" cy="170" r="18" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="290" y="172" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<circle cx="350" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="350" cy="110" r="18" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="350" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
</svg>

---

## 2-10. 空セルをペースト基準にする例

### 2-10-1. CNOT・S・CNOTセットをコピー

CNOT・S・CNOTのゲートセットを複数選択しコピーした状態。

<svg xmlns="http://www.w3.org/2000/svg" width="340" height="220">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="340" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="340" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="170" x2="340" y2="170" stroke="#E4E4E7" stroke-width="2"/>
<line x1="50" y1="50" x2="50" y2="170" stroke="#0EA5E9" stroke-width="3"/>
<line x1="170" y1="50" x2="170" y2="170" stroke="#0EA5E9" stroke-width="3"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="none" stroke="#5EEAD4" stroke-width="2" />
<circle cx="50" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="50" cy="170" r="18" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="50" y="172" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<rect x="92" y="152" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="110" y="172" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">S</text>
<rect x="152" y="32" width="36" height="36" rx="6" fill="none" stroke="#5EEAD4" stroke-width="2" />
<circle cx="170" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="170" cy="170" r="18" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="170" y="172" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
</svg>

---

### 2-10-2. 制御線上の空セルを選択

CNOT・S・CNOTのゲートセットを複数選択しコピーした後、2つめのCNOTの間の空白を選択した状態。

制御線が描画されていても、ゲートはないので空白セルとして扱う。

<svg xmlns="http://www.w3.org/2000/svg" width="340" height="220">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="340" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="340" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="170" x2="340" y2="170" stroke="#E4E4E7" stroke-width="2"/>
<line x1="50" y1="50" x2="50" y2="170" stroke="#0EA5E9" stroke-width="3"/>
<line x1="170" y1="50" x2="170" y2="170" stroke="#0EA5E9" stroke-width="3"/>
<circle cx="50" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="50" cy="170" r="18" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="50" y="172" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<rect x="92" y="152" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="110" y="172" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">S</text>
<circle cx="170" cy="50" r="7" fill="#0EA5E9"/>
<rect x="152" y="92" width="36" height="36" rx="6" fill="none" stroke="#5EEAD4" stroke-width="2" />
<circle cx="170" cy="170" r="18" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="170" y="172" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
</svg>

---

### 2-10-3. 空セル基準でのペースト結果

制御線が描画されていても、ゲートはないので空白だが、選択しペースト基準として利用可能。

<svg xmlns="http://www.w3.org/2000/svg" width="400" height="280">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="400" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="400" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="170" x2="400" y2="170" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="230" x2="400" y2="230" stroke="#E4E4E7" stroke-width="2"/>
<line x1="50" y1="50" x2="50" y2="170" stroke="#0EA5E9" stroke-width="3"/>
<line x1="170" y1="50" x2="170" y2="170" stroke="#0EA5E9" stroke-width="3"/>
<line x1="230" y1="110" x2="230" y2="230" stroke="#0EA5E9" stroke-width="3"/>
<line x1="350" y1="110" x2="350" y2="230" stroke="#0EA5E9" stroke-width="3"/>
<circle cx="50" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="50" cy="170" r="18" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="50" y="172" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<rect x="92" y="152" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="110" y="172" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">S</text>
<circle cx="170" cy="50" r="7" fill="#0EA5E9"/>
<rect x="152" y="92" width="36" height="36" rx="6" fill="none" stroke="#5EEAD4" stroke-width="2" />
<circle cx="170" cy="170" r="18" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="170" y="172" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<rect x="212" y="92" width="36" height="36" rx="6" fill="none" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<circle cx="230" cy="110" r="7" fill="#0EA5E9"/>
<circle cx="230" cy="230" r="18" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="230" y="232" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<rect x="272" y="212" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="290" y="232" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">S</text>
<rect x="332" y="92" width="36" height="36" rx="6" fill="none" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<circle cx="350" cy="110" r="7" fill="#0EA5E9"/>
<circle cx="350" cy="230" r="18" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="350" y="232" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
</svg>

---

## 2-11. 複雑な例

### 2-11-1. 複雑なコピー元

複雑な例。

複数の通常ゲート、制御ゲート、選択ゲートを含むコピー元。

<svg xmlns="http://www.w3.org/2000/svg" width="340" height="220">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="340" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="340" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="170" x2="340" y2="170" stroke="#E4E4E7" stroke-width="2"/>
<line x1="110" y1="50" x2="110" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<line x1="170" y1="110" x2="170" y2="170" stroke="#0EA5E9" stroke-width="3"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="50" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="32" y="92" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="50" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="32" y="152" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="50" y="172" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<circle cx="110" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="110" cy="110" r="18" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="110" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<rect x="152" y="92" width="36" height="36" rx="6" fill="none" stroke="#5EEAD4" stroke-width="2" />
<circle cx="170" cy="110" r="7" fill="#0EA5E9"/>
<circle cx="170" cy="170" r="18" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="170" y="172" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<rect x="212" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="230" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">T</text>
<rect x="212" y="92" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="230" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">T</text>
<rect x="212" y="152" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="230" y="172" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">T</text>
</svg>

---

### 2-11-2. 複雑な例のペースト結果

コピーされたゲート群が、構造を保ったままペーストされる。

ペーストされたゲートは紫の点線枠で強調される。

<svg xmlns="http://www.w3.org/2000/svg" width="520" height="220">
<rect x="0" y="0" width="100%" height="100%" fill="white"/>
<line x1="0" y1="50" x2="520" y2="50" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="110" x2="520" y2="110" stroke="#E4E4E7" stroke-width="2"/>
<line x1="0" y1="170" x2="520" y2="170" stroke="#E4E4E7" stroke-width="2"/>
<line x1="110" y1="50" x2="110" y2="110" stroke="#0EA5E9" stroke-width="3"/>
<line x1="170" y1="110" x2="170" y2="170" stroke="#0EA5E9" stroke-width="3"/>
<line x1="410" y1="110" x2="410" y2="170" stroke="#0EA5E9" stroke-width="3"/>
<rect x="32" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="50" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="32" y="92" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="50" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<rect x="32" y="152" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="50" y="172" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<circle cx="110" cy="50" r="7" fill="#0EA5E9"/>
<circle cx="110" cy="110" r="18" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="110" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<rect x="152" y="92" width="36" height="36" rx="6" fill="none" stroke="#5EEAD4" stroke-width="2" />
<circle cx="170" cy="110" r="7" fill="#0EA5E9"/>
<circle cx="170" cy="170" r="18" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="170" y="172" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<rect x="212" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="230" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">T</text>
<rect x="212" y="92" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#0369A1" stroke-width="2" />
<text x="230" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">T</text>
<rect x="212" y="152" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#5EEAD4" stroke-width="2" />
<text x="230" y="172" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">T</text>
<rect x="272" y="32" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="290" y="52" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">H</text>
<circle cx="350" cy="110" r="18" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="350" y="112" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<rect x="392" y="92" width="36" height="36" rx="6" fill="none" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<circle cx="410" cy="110" r="7" fill="#0EA5E9"/>
<circle cx="410" cy="170" r="18" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="410" y="172" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">＋</text>
<rect x="452" y="152" width="36" height="36" rx="6" fill="#0EA5E9" stroke="#6B15A8" stroke-width="2" stroke-dasharray="4,3"/>
<text x="470" y="172" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" fill="#FFFFFF">T</text>
</svg>
