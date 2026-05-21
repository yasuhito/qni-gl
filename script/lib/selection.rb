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

    def empty_analysis
      {
        controls: [],
        xs: [],
        swaps: []
      }
    end
  end
end