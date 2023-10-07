import defaultTheme from "tailwindcss/defaultTheme";

export const spacingInPx = function (value: number): number {
  const remValue = parseFloat(defaultTheme.spacing[value]);
  const pxValue = remValue * 16; // 1rem = 16px

  return parseInt(pxValue.toFixed(0));
};
