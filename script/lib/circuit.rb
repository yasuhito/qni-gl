module QDraw
  class Circuit
    attr_reader :cols

    def initialize(cols)
      raise ArgumentError, 'JSON must include "cols"' unless cols.is_a?(Array)

      @cols = cols
    end

    def step_count_in_data
      cols.size
    end

    def qubit_count_in_data
      cols.map { |col| col.is_a?(Array) ? col.size : 0 }.max || 0
    end

    def step_count
      [step_count_in_data, QDraw::Constants::MIN_STEP_COUNT].max
    end

    def qubit_count
      [qubit_count_in_data, QDraw::Constants::MIN_QUBIT_COUNT].max
    end

    def column(step_index)
      cols[step_index]
    end

    def each_column
      cols.each_with_index do |col, step_index|
        yield col, step_index
      end
    end

    def each_cell
      cols.each_with_index do |col, step_index|
        next unless col.is_a?(Array)

        col.each_with_index do |gate, qubit_index|
          yield gate, step_index, qubit_index
        end
      end
    end

    def validate!
      # 入力時点で対応外ゲートを弾いておく。
      # ここで落としておくと、描画ループ側を複雑にしなくて済む。
      each_cell do |gate, step_index, qubit_index|
        next if QDraw::Gate.supported?(gate)

        raise ArgumentError, "Unsupported gate at step #{step_index}, qubit #{qubit_index}: #{gate.inspect}"
      end
    end
  end
end