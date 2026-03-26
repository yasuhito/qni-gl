module QDraw
  class Renderer
    include QDraw::Constants

    def initialize(circuit:, select_position: nil, paste_position: nil)
      @circuit = circuit
      @select_position = select_position
      @paste_position = paste_position
    end

    # =========================
    # SVG生成
    # =========================
    def render
      svg = SvgBuilder.new

      svg.add %(<svg xmlns="http://www.w3.org/2000/svg" width="#{svg_width}" height="#{svg_height}">)

      # ---- 背景
      svg.add %(<rect x="0" y="0" width="100%" height="100%" fill="#{BACKGROUND_FILL}"/>)

      # ---- ワイヤ
      add_wire_svgs(svg)

      # ---- ペアゲート接続線
      add_pair_wire_svgs(svg)

      # ---- ゲート描画
      add_gate_svgs(svg)

      # ---- 接続範囲の選択枠
      # 単一セル選択ではなく、接続線でつながれた複数量子ビットゲート全体を囲う
      add_selection_frame_svg(svg)

      svg.add %(</svg>)
      svg.to_s
    end

    private

    attr_reader :circuit, :select_position, :paste_position

    def svg_width
      CANVAS_MARGIN * 2 + circuit.step_count * STEP_WIDTH
    end

    def svg_height
      CANVAS_MARGIN * 2 + circuit.qubit_count * QUBIT_HEIGHT
    end

    def add_wire_svgs(svg)
      circuit.qubit_count.times do |qubit_index|
        wire_y = CANVAS_MARGIN + qubit_index * QUBIT_HEIGHT + QUBIT_HEIGHT / 2
        svg.add %(<line x1="0" y1="#{wire_y}" x2="#{svg_width}" y2="#{wire_y}" stroke="#{WIRE_COLOR}" stroke-width="#{WIRE_STROKE_WIDTH}"/>)
      end
    end

    def add_pair_wire_svgs(svg)
      circuit.each_column do |col, step_index|
        next unless col.is_a?(Array)

        analysis = QDraw::Selection.analyze_column(col)

        control_indices = analysis[:controls]
        x_indices       = analysis[:xs]
        swap_indices    = analysis[:swaps]

        # 同じステップに • と X があれば、CNOT系として縦線を引く
        if control_indices.any? && x_indices.any?
          pair_indices = (control_indices + x_indices).sort
          wire_x  = step_center_x(step_index)
          wire_y1 = qubit_center_y(pair_indices.first)
          wire_y2 = qubit_center_y(pair_indices.last)

          svg.add %(<line x1="#{wire_x}" y1="#{wire_y1}" x2="#{wire_x}" y2="#{wire_y2}" stroke="#{NORMAL_FILL}" stroke-width="#{PAIR_WIRE_STROKE_WIDTH}"/>)
        end

        # SWAP は × が2つあるステップだけ縦線を引く
        if swap_indices.size == 2
          wire_x  = step_center_x(step_index)
          wire_y1 = qubit_center_y(swap_indices.first)
          wire_y2 = qubit_center_y(swap_indices.last)

          svg.add %(<line x1="#{wire_x}" y1="#{wire_y1}" x2="#{wire_x}" y2="#{wire_y2}" stroke="#{NORMAL_FILL}" stroke-width="#{PAIR_WIRE_STROKE_WIDTH}"/>)
        end
      end
    end

    def add_gate_svgs(svg)
      circuit.each_column do |col, step_index|
        next unless col.is_a?(Array)

        col.each_with_index do |gate, qubit_index|
          next unless QDraw::Gate.drawable?(gate)

          gate = QDraw::Gate.normalize(gate)

          rect = gate_rect(step_index, qubit_index)

          # 接続線つきゲートの選択中は、個別セルの枠色変更ではなく
          # 上で描いた接続範囲全体の選択枠で見せる
          pair_range_for_this_step =
            if select_position && step_index == select_position[0]
              QDraw::Selection.pair_selection_range(col, select_position[1])
            else
              nil
            end

          state =
            if [step_index, qubit_index] == paste_position
              :paste
            elsif [step_index, qubit_index] == select_position && pair_range_for_this_step.nil?
              :selected
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

          # • / × / X は見た目が特殊なので分岐する
          if QDraw::Gate.control?(gate)
            svg.add %(<circle cx="#{rect[:cx]}" cy="#{rect[:cy]}" r="#{CONTROL_RADIUS}"
              fill="#{fill_color}"#{dash_attr}/>)

          elsif QDraw::Gate.swap?(gate)
            svg.add %(<line x1="#{rect[:cx] - SWAP_SIZE}" y1="#{rect[:cy] - SWAP_SIZE}" x2="#{rect[:cx] + SWAP_SIZE}" y2="#{rect[:cy] + SWAP_SIZE}"
              stroke="#{fill_color}" stroke-width="#{SWAP_STROKE_WIDTH}" stroke-linecap="round"#{dash_attr}/>)
            svg.add %(<line x1="#{rect[:cx] - SWAP_SIZE}" y1="#{rect[:cy] + SWAP_SIZE}" x2="#{rect[:cx] + SWAP_SIZE}" y2="#{rect[:cy] - SWAP_SIZE}"
              stroke="#{fill_color}" stroke-width="#{SWAP_STROKE_WIDTH}" stroke-linecap="round"#{dash_attr}/>)

          elsif QDraw::Gate.circle_x?(gate)
            svg.add %(<circle cx="#{rect[:cx]}" cy="#{rect[:cy]}" r="#{GATE_SIZE / 2}"
              fill="#{fill_color}" stroke="#{border_color}" stroke-width="#{GATE_STROKE_WIDTH}"#{dash_attr}/>)

            svg.add %(<text x="#{rect[:cx]}" y="#{rect[:cy] + GATE_TEXT_Y_OFFSET}"
              font-size="#{GATE_FONT_SIZE}"
              text-anchor="#{TEXT_ANCHOR}"
              dominant-baseline="#{DOMINANT_BASELINE}"
              font-family="#{GATE_FONT_FAMILY}"
              fill="#{TEXT_COLOR}">#{QDraw::Gate.label(gate)}</text>)

          else
            svg.add %(<rect x="#{rect[:x]}" y="#{rect[:y]}" width="#{GATE_SIZE}" height="#{GATE_SIZE}" rx="#{GATE_CORNER_RADIUS}"
              fill="#{fill_color}" stroke="#{border_color}" stroke-width="#{GATE_STROKE_WIDTH}"#{dash_attr}/>)

            svg.add %(<text x="#{rect[:x] + GATE_SIZE / 2}" y="#{rect[:y] + GATE_SIZE / 2 + GATE_TEXT_Y_OFFSET}"
              font-size="#{GATE_FONT_SIZE}"
              text-anchor="#{TEXT_ANCHOR}"
              dominant-baseline="#{DOMINANT_BASELINE}"
              font-family="#{GATE_FONT_FAMILY}"
              fill="#{TEXT_COLOR}">#{QDraw::Gate.label(gate)}</text>)
          end
        end
      end
    end

    def add_selection_frame_svg(svg)
      return unless select_position

      selected_step_index, selected_qubit_index = select_position
      selected_col = circuit.column(selected_step_index)

      pair_range = QDraw::Selection.pair_selection_range(selected_col, selected_qubit_index)

      return unless pair_range

      min_qubit_index, max_qubit_index = pair_range

      frame_x = CANVAS_MARGIN + selected_step_index * STEP_WIDTH + STEP_WIDTH / 2 - GATE_SIZE / 2
      frame_y = CANVAS_MARGIN + min_qubit_index * QUBIT_HEIGHT + QUBIT_HEIGHT / 2 - GATE_SIZE / 2
      frame_width = GATE_SIZE
      frame_height =
        ((max_qubit_index - min_qubit_index) * QUBIT_HEIGHT) + GATE_SIZE

      svg.add %(<rect x="#{frame_x}" y="#{frame_y}" width="#{frame_width}" height="#{frame_height}" rx="#{GATE_CORNER_RADIUS}"
        fill="none" stroke="#{SELECT_STROKE}" stroke-width="#{GATE_STROKE_WIDTH}"/>)
    end

    def gate_rect(step_index, qubit_index)
      gate_x = CANVAS_MARGIN + step_index * STEP_WIDTH + STEP_WIDTH / 2 - GATE_SIZE / 2
      gate_y = CANVAS_MARGIN + qubit_index * QUBIT_HEIGHT + QUBIT_HEIGHT / 2 - GATE_SIZE / 2

      {
        x: gate_x,
        y: gate_y,
        cx: gate_x + GATE_SIZE / 2,
        cy: gate_y + GATE_SIZE / 2
      }
    end

    def step_center_x(step_index)
      CANVAS_MARGIN + step_index * STEP_WIDTH + STEP_WIDTH / 2
    end

    def qubit_center_y(qubit_index)
      CANVAS_MARGIN + qubit_index * QUBIT_HEIGHT + QUBIT_HEIGHT / 2
    end
  end
end