module QDraw
  class FileNamer
    class << self
      # =========================
      # SVGファイル名生成
      # =========================
      #
      # Iゲート:
      #   1 / "1" / "I"
      # はファイル名に含めない
      #
      # 例:
      #   Select-CNOT.svg
      #   Paste-H-H.svg
      #
      def make_svg_name(
        cols,
        select_positions = nil,
        paste_positions = nil
      )
        gate_names = []

        cols.each do |col|
          next unless col.is_a?(Array)

          normalized_col =
            col.map { |gate| QDraw::Gate.normalize(gate) }

          normalized_col.each do |gate|
            next unless QDraw::Gate.drawable?(gate)

            gate_name =
              convert_gate_name_for_file_name(
                gate,
                normalized_col
              )

            gate_names << gate_name
          end
        end

        prefix = build_prefix(
          select_positions,
          paste_positions
        )

        body =
          if gate_names.empty?
            "empty"
          else
            gate_names.join("-")
          end

        "#{prefix}#{body}.svg"
      end

      # =========================
      # 重複回避ファイル名
      # =========================
      #
      # sample.svg
      # sample_1.svg
      # sample_2.svg
      #
      def next_svg_name(base_name)
        return base_name unless File.exist?(base_name)

        dir  = File.dirname(base_name)
        ext  = File.extname(base_name)
        stem = File.basename(base_name, ext)

        suffix_number = 1

        loop do
          new_name =
            File.join(
              dir,
              "#{stem}_#{suffix_number}#{ext}"
            )

          return new_name unless File.exist?(new_name)

          suffix_number += 1
        end
      end

      private

      # =========================
      # 接頭辞生成
      # =========================
      def build_prefix(select_positions, paste_positions)
        prefix = ""

        prefix << "Select-" if select_positions

        if paste_positions &&
           paste_positions != select_positions
          prefix << "Paste-"
        end

        prefix
      end

      # =========================
      # ファイル名用ゲート名変換
      # =========================
      def convert_gate_name_for_file_name(gate, normalized_col)
        case gate
        when "•"
          normalized_col.include?("X") ? "CNOT" : "Dot"

        when "×"
          "SWAP"

        else
          gate.to_s
        end
      end
    end
  end
end