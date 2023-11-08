import * as tailwindColors from "tailwindcss/colors";

export const Colors = {
  bg: {
    brand: {
      grabbed: tailwindColors.purple["500"],
    }
  },
  border: {
    gate: {
      hover: tailwindColors.purple["500"],
      grabbed: tailwindColors.purple["600"],
      active: tailwindColors.teal["300"]
    }
  },
  icon: {
    gate: {
      default: tailwindColors.white,
      secondary: tailwindColors.sky["500"]
    }
  }
}
