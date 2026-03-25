#!/usr/bin/env ruby
require 'json'
require 'cgi'

# ======================================
# Quantum Circuit SVG Renderer (qdraw)
# ======================================
#
# 量子回路をJSON入力からSVGで図示します。
# ゲートごとに配置・選択状態・貼り付け状態を強調表示します。
#
# --- 使い方(コマンド例) ---
#   ruby qdraw.rb '{"cols":[["H",1],["•","X"]]}' --output circuit.svg
#   ruby qdraw.rb '%7B"cols"%3A%5B%5B"H"%5D%5D%7D' --output encoded.svg
#   ruby qdraw.rb 'http://localhost:5173/#circuit={"cols":[["H","H"],["H","H"],["H",1]]}' --output from_url.svg
#   ruby qdraw.rb --select 0,0 --paste 1,1 'https://qniapp.net/%7B%22cols%22%3A%5B%5B%22H%22%2C%22H%22%5D%2C%5B%22H%22%2C%22H%22%5D%5D%7D' --output out.svg
#
# --- 入力仕様 ---
#   cols: 回路ステップごとのゲート配列
#     例: [["H"], ["•", "X"]]
#   --select: 選択ゲート座標（例: "1,0" → 1ステップ0番キュービット）
#   --paste : 貼り付けゲート座標
#   --output: 出力ファイル名（SVG）
#
# --- 対応入力 ---
#   1. 生JSON
#   2. URLエンコード済みJSON
#   3. #circuit=... を含むURL
#   4. circuit=... だけ渡された場合
#   5. URLのパス末尾がURLエンコードJSONの場合
#
# --- 出力 ---
#   SVGファイル（命名規則に基づく自動付与）
#
# --- 外観 ---
#   ・通常ゲートは青枠(#0369A1)、塗りは水色(#0EA5E9)
#   ・選択ゲートは青緑枠(#5EEAD4)
#   ・貼り付けゲートは紫(#6B15A8)の点線枠
#   ・塗りはすべて共通(#0EA5E9)
#   ・文字は白(#FFFFFF)
#   ・量子ビット線はグレー(#E4E4E7)
#   ・全ゲートは角丸矩形
#   ・描画範囲は最低でも 5ステップ × 2量子ビット を確保する
#
# --- Iゲートの扱い ---
#   ・1 は Iゲート扱い
#   ・Iゲートは配置情報としては存在するが、図には描画しない
#
# =======================================

# =========================
# 最低描画サイズ
# =========================
MIN_STEP_COUNT  = 5
MIN_QUBIT_COUNT = 2

# =========================
# レイアウト設定
# =========================
STEP_WIDTH              = 80
QUBIT_HEIGHT            = 60
GATE_SIZE               = 36
CANVAS_MARGIN           = 20

# gate text
GATE_FONT_SIZE          = 24
GATE_TEXT_Y_OFFSET      = 2
GATE_FONT_FAMILY        = "Arial, sans-serif"

# gate rect
GATE_CORNER_RADIUS      = 6
GATE_STROKE_WIDTH       = 2

# wire
WIRE_STROKE_WIDTH       = 2

# paste border dash
PASTE_DASH_LENGTH       = 4
PASTE_GAP_LENGTH        = 3
PASTE_STROKE_DASHARRAY  = "#{PASTE_DASH_LENGTH},#{PASTE_GAP_LENGTH}"

# background
BACKGROUND_FILL         = "white"

# svg text align
TEXT_ANCHOR             = "middle"
DOMINANT_BASELINE       = "middle"

# =========================
# 色設定
# =========================
WIRE_COLOR    = "#E4E4E7"
NORMAL_STROKE = "#0369A1"
NORMAL_FILL   = "#0EA5E9"
SELECT_STROKE = "#5EEAD4"
PASTE_STROKE  = "#6B15A8"
TEXT_COLOR    = "#FFFFFF"

SELECT_FILL = NORMAL_FILL
PASTE_FILL  = NORMAL_FILL

# =========================
# CLI解析
# =========================
select_position = nil
paste_position  = nil
out_svg         = nil
json_text       = nil

args  = ARGV.dup
arg_i = 0

while arg_i < args.length
  case args[arg_i]
  when "--select"
    raise ArgumentError, "--select requires value like 1,0" if args[arg_i + 1].nil?
    select_position = args[arg_i + 1].split(',').map(&:to_i)
    arg_i += 2

  when "--paste"
    raise ArgumentError, "--paste requires value like 1,0" if args[arg_i + 1].nil?
    paste_position = args[arg_i + 1].split(',').map(&:to_i)
    arg_i += 2

  when "--output"
    raise ArgumentError, "--output requires filename" if args[arg_i + 1].nil?
    out_svg = args[arg_i + 1]
    arg_i += 2

  else
    json_text = args[arg_i]
    arg_i += 1
  end
end

raise ArgumentError, "JSON input is required" if json_text.nil?

# --------------------------------------
# extract_json_text(input_text)
# 役割:
#   入力文字列から回路JSON文字列を取り出す
# --------------------------------------
def extract_json_text(input_text)
  text = input_text.to_s.strip

  # 1. 生JSON
  return text if text.start_with?("{")

  # 2. URLエンコード済みJSON
  decoded_text = CGI.unescape(text)
  return decoded_text if decoded_text.start_with?("{")

  # 3. #circuit=... を含むURL
  if text.include?("#circuit=")
    circuit_text = text.split("#circuit=", 2)[1]
    decoded_circuit_text = CGI.unescape(circuit_text)
    return decoded_circuit_text if decoded_circuit_text.start_with?("{")
  end

  # 4. circuit=... だけ渡された場合
  if text.start_with?("circuit=")
    circuit_text = text.sub(/\Acircuit=/, "")
    decoded_circuit_text = CGI.unescape(circuit_text)
    return decoded_circuit_text if decoded_circuit_text.start_with?("{")
  end

  # 5. URLのパス末尾がURLエンコードJSONの場合
  if text =~ /\Ahttps?:\/\//
    path_part = text.split(/[?#]/, 2).first
    last_segment = path_part.split("/").reject(&:empty?).last
    if last_segment
      decoded_last_segment = CGI.unescape(last_segment)
      return decoded_last_segment if decoded_last_segment.start_with?("{")
    end
  end

  raise ArgumentError,
        "Input must be raw JSON, URL-encoded JSON, URL containing #circuit=..., circuit=..., or URL whose last path segment is encoded JSON"
end

# --------------------------------------
# identity_gate?(gate)
# 役割:
#   Iゲート扱いかどうかを返す
#   仕様:
#   - 1 は Iゲート
#   - "I" も Iゲートとして扱う
# --------------------------------------
def identity_gate?(gate)
  gate == 1 || gate == "1" || gate == "I"
end

# --------------------------------------
# drawable_gate?(gate)
# 役割:
#   描画対象のゲートかどうかを返す
# --------------------------------------
def drawable_gate?(gate)
  return false if gate.nil?
  return false if identity_gate?(gate)

  true
end

# --------------------------------------
# gate_label(gate)
# 役割:
#   ゲート表示文字を返す
# --------------------------------------
def gate_label(gate)
  return "√X" if gate == "X^½"
  gate.to_s
end

json_text = extract_json_text(json_text)

data = JSON.parse(json_text)
cols = data["cols"]

raise ArgumentError, 'JSON must include "cols"' unless cols.is_a?(Array)

step_count_in_data  = cols.size
qubit_count_in_data = cols.map { |col| col.is_a?(Array) ? col.size : 0 }.max || 0

step_count  = [step_count_in_data, MIN_STEP_COUNT].max
qubit_count = [qubit_count_in_data, MIN_QUBIT_COUNT].max

# =========================
# SVG生成
# =========================
svg_width  = CANVAS_MARGIN * 2 + step_count * STEP_WIDTH
svg_height = CANVAS_MARGIN * 2 + qubit_count * QUBIT_HEIGHT

svg = []
svg << %(<svg xmlns="http://www.w3.org/2000/svg" width="#{svg_width}" height="#{svg_height}">)

# ---- 背景
svg << %(<rect x="0" y="0" width="100%" height="100%" fill="#{BACKGROUND_FILL}"/>)

# ---- ワイヤ
qubit_count.times do |qubit_index|
  wire_y = CANVAS_MARGIN + qubit_index * QUBIT_HEIGHT + QUBIT_HEIGHT / 2
  svg << %(<line x1="0" y1="#{wire_y}" x2="#{svg_width}" y2="#{wire_y}" stroke="#{WIRE_COLOR}" stroke-width="#{WIRE_STROKE_WIDTH}"/>)
end

# ---- ゲート描画
cols.each_with_index do |col, step_index|
  next unless col.is_a?(Array)

  col.each_with_index do |gate, qubit_index|
    next unless drawable_gate?(gate)

    gate_x = CANVAS_MARGIN + step_index * STEP_WIDTH + STEP_WIDTH / 2 - GATE_SIZE / 2
    gate_y = CANVAS_MARGIN + qubit_index * QUBIT_HEIGHT + QUBIT_HEIGHT / 2 - GATE_SIZE / 2

    state =
      if [step_index, qubit_index] == select_position
        :selected
      elsif [step_index, qubit_index] == paste_position
        :paste
      else
        :normal
      end

    border_color = NORMAL_STROKE
    fill_color   = NORMAL_FILL
    border_dash  = nil

    case state
    when :selected
      border_color = SELECT_STROKE
      fill_color   = SELECT_FILL
    when :paste
      border_color = PASTE_STROKE
      fill_color   = PASTE_FILL
      border_dash  = PASTE_STROKE_DASHARRAY
    end

    dash_attr = border_dash ? %( stroke-dasharray="#{border_dash}") : ""

    svg << %(<rect x="#{gate_x}" y="#{gate_y}" width="#{GATE_SIZE}" height="#{GATE_SIZE}" rx="#{GATE_CORNER_RADIUS}"
      fill="#{fill_color}" stroke="#{border_color}" stroke-width="#{GATE_STROKE_WIDTH}"#{dash_attr}/>)

    svg << %(<text x="#{gate_x + GATE_SIZE / 2}" y="#{gate_y + GATE_SIZE / 2 + GATE_TEXT_Y_OFFSET}"
      font-size="#{GATE_FONT_SIZE}"
      text-anchor="#{TEXT_ANCHOR}"
      dominant-baseline="#{DOMINANT_BASELINE}"
      font-family="#{GATE_FONT_FAMILY}"
      fill="#{TEXT_COLOR}">#{gate_label(gate)}</text>)
  end
end

svg << %(</svg>)

# =========================
# ファイル名生成
# =========================

# --------------------------------------
# make_svg_name(cols, select_position=nil, paste_position=nil)
# 役割:
#   回路内容と状態からSVGファイル名を作る
#   Iゲート(1 / "1" / "I")は名前に含めない
# --------------------------------------
def make_svg_name(cols, select_position = nil, paste_position = nil)
  names = []

  cols.each do |col|
    next unless col.is_a?(Array)

    col.each do |gate|
      next unless drawable_gate?(gate)

      name = gate.to_s
      if name == "•"
        name = col.include?("X") ? "CNOT" : "Dot"
      end

      names << name
    end
  end

  prefix = ""
  prefix << "Select-" if select_position
  prefix << "Paste-" if paste_position && paste_position != select_position

  body = names.empty? ? "empty" : names.join('-')
  "#{prefix}#{body}.svg"
end

# --------------------------------------
# next_svg_name(base_name)
# 役割:
#   既存ファイルと重複しない名前を返す
# --------------------------------------
def next_svg_name(base_name)
  return base_name unless File.exist?(base_name)

  ext  = File.extname(base_name)
  stem = File.basename(base_name, ext)
  num  = 1

  loop do
    new_name = "#{stem}_#{num}#{ext}"
    return new_name unless File.exist?(new_name)
    num += 1
  end
end

# =========================
# SVGファイル書き出し
# =========================
svg_name = out_svg || make_svg_name(cols, select_position, paste_position)
svg_name = next_svg_name(svg_name)

File.write(svg_name, svg.join("\n"))

puts "generated: #{svg_name}"