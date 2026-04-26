import type { CornerForm, CornerKey, Point } from './types';

export const lerp = (a: Point, b: Point, t: number): Point => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

export const parseCorners = (form: CornerForm): Record<CornerKey, Point> => ({
  topLeft: { x: Number(form.topLeft_x), y: Number(form.topLeft_y) },
  topRight: { x: Number(form.topRight_x), y: Number(form.topRight_y) },
  bottomLeft: { x: Number(form.bottomLeft_x), y: Number(form.bottomLeft_y) },
  bottomRight: { x: Number(form.bottomRight_x), y: Number(form.bottomRight_y) },
});

/**
 * 1-based 座位坐标：列数 = maxX−minX+1，行数 = maxY−minY+1（含两端座位编号）。
 * 绘图时第 0 行贴「上沿」四角连线，最后一行贴「下沿」。
 */
export const deriveGridFromSeatCorners = (
  corners: Record<CornerKey, Point>,
) => {
  const xs = [
    corners.topLeft.x,
    corners.topRight.x,
    corners.bottomLeft.x,
    corners.bottomRight.x,
  ];
  const ys = [
    corners.topLeft.y,
    corners.topRight.y,
    corners.bottomLeft.y,
    corners.bottomRight.y,
  ];
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const cols = Math.max(1, Math.round(maxX - minX) + 1);
  const rows = Math.max(1, Math.round(maxY - minY) + 1);
  return { rows, cols, minX, maxX, minY, maxY };
};
