module QDraw
  module Selection
    module_function

    # --------------------------------------
    # analyze_column(col)
    # 役割:
    #   1ステップ分の列を解析し、
    #   control / X / SWAP の位置を返す
    #   pair系の接続判定を複数箇所で使い回すための共通処理
    # --------------------------------------
    def analyze_column(col)
      return empty_analysis unless col.is_a?(Array)

      normalized_col = col.map { |gate| QDraw::Gate.normalize(gate) }

      control_indices = []
      x_indices       = []
      swap_indices    = []

      normalized_col.each_with_index do |gate, qubit_index|
        next unless QDraw::Gate.drawable?(gate)

        control_indices << qubit_index if gate == "•"
        x_indices << qubit_index if gate == "X"
        swap_indices << qubit_index if gate == "×"
      end

      {
        controls: control_indices,
        xs: x_indices,
        swaps: swap_indices
      }
    end

    # --------------------------------------
    # pair_selection_range(col, selected_qubit_index)
    # 役割:
    #   選択されたセルが接続線つきゲートの一部なら、
    #   その接続範囲全体の qubit index 範囲を返す
    # --------------------------------------
    def pair_selection_range(col, selected_qubit_index)
      return nil unless col.is_a?(Array)

      analysis = analyze_column(col)

      control_indices = analysis[:controls]
      x_indices       = analysis[:xs]
      swap_indices    = analysis[:swaps]

      # CNOT系:
      # 同じステップに • と X があり、
      # 選択位置がそのどちらかを含むなら接続全体を囲う
      if control_indices.any? && x_indices.any?
        pair_indices = (control_indices + x_indices).sort
        if pair_indices.include?(selected_qubit_index)
          return [pair_indices.first, pair_indices.last]
        end
      end

      # SWAP系:
      # × がちょうど2つあり、
      # 選択位置がその片方なら接続全体を囲う
      if swap_indices.size == 2
        if swap_indices.include?(selected_qubit_index)
          return [swap_indices.first, swap_indices.last]
        end
      end

      nil
    end

    def empty_analysis
      {
        controls: [],
        xs: [],
        swaps: []
      }
    end
  end
end