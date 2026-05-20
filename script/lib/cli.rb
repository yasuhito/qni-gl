module QDraw
  class Cli
    class << self
      # =========================
      # CLI解析
      # =========================
      def parse(argv)
        select_positions = nil
        paste_positions  = nil
        out_svg         = nil
        json_text       = nil

        args  = argv.dup
        arg_i = 0

        while arg_i < args.length
          case args[arg_i]
          when "--select"
            raise ArgumentError, "--select requires value like 1,0" if args[arg_i + 1].nil?
            select_positions = parse_positions(args[arg_i + 1])
            arg_i += 2

          when "--paste"
            raise ArgumentError, "--paste requires value like 1,0" if args[arg_i + 1].nil?
            paste_positions = parse_positions(args[arg_i + 1])
            arg_i += 2

          when "--step-bar"
            raise ArgumentError, "--step-bar requires step index like 1" if args[arg_i + 1].nil?
            step_bar_index = Integer(args[arg_i + 1])
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

        {
          select_positions: select_positions,
          paste_positions:  paste_positions,
          step_bar_index:  step_bar_index,
          out_svg:         out_svg,
          json_text:       json_text
        }
      end

      private

      def parse_positions(text)
        text.split(";").map do |pair|
          parts = pair.split(",")
      
          raise ArgumentError,
                "position must be like step,qubit" unless parts.size == 2
      
          parts.map(&:to_i)
        end
      end
    end
  end
end