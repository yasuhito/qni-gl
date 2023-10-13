import * as defaultTheme from "tailwindcss/defaultTheme";

export const spacingInPx = function (value: number): number {
  const remValue = parseFloat(defaultTheme.spacing[value]);
  const pxValue = remValue * 16; // 1rem = 16px

  return parseInt(pxValue.toFixed(0));
};

/**
 * 2つの矩形が重なっているかどうかを返す。
 *
 * @param x1
 * @param y1
 * @param w1
 * @param h1
 * @param x2
 * @param y2
 * @param w2
 * @param h2
 * @returns
 */
export function rectIntersect(
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  x2: number,
  y2: number,
  w2: number,
  h2: number
) {
  if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
    return false;
  }
  return true;
}
