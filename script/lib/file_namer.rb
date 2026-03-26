module QDraw
  class FileNamer
    class << self
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
            next unless QDraw::Gate.drawable?(gate)

            name = QDraw::Gate.normalize(gate).to_s
            if name == "•"
              name = col.map { |g| QDraw::Gate.normalize(g) }.include?("X") ? "CNOT" : "Dot"
            elsif name == "×"
              name = "SWAP"
            end

            names << name
          end
        end

        prefix = ""
        prefix << "Select-" if select_position
        prefix << "Paste-" if paste_position && paste_position != select_position

        body = names.empty? ? "empty" : names.join("-")
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
    end
  end
end