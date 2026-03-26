module QDraw
  class Cli
    class << self
      # =========================
      # CLI解析
      # =========================
      def parse(argv)
        select_position = nil
        paste_position  = nil
        out_svg         = nil
        json_text       = nil

        args  = argv.dup
        arg_i = 0

        while arg_i < args.length
          case args[arg_i]
          when "--select"
            raise ArgumentError, "--select requires value like 1,0" if args[arg_i + 1].nil?
            select_position = parse_position(args[arg_i + 1])
            arg_i += 2

          when "--paste"
            raise ArgumentError, "--paste requires value like 1,0" if args[arg_i + 1].nil?
            paste_position = parse_position(args[arg_i + 1])
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
          select_position: select_position,
          paste_position:  paste_position,
          out_svg:         out_svg,
          json_text:       json_text
        }
      end

      private

      def parse_position(text)
        parts = text.to_s.split(",")
        raise ArgumentError, "position must be like step,qubit" unless parts.size == 2

        parts.map(&:to_i)
      end
    end
  end
end