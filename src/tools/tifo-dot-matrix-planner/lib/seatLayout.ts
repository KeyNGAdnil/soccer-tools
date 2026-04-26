import type { CornerKey, Point, SeatData } from './types';
import { deriveGridFromSeatCorners, lerp } from './geometry';

export const computeSeatData = (
  corners: Record<CornerKey, Point>,
  slogan: string,
  letterSpacing: number,
): SeatData | null => {
  const trimmed = slogan.trim();
  if (!trimmed) return null;

  const seatRange = deriveGridFromSeatCorners(corners);
  const { rows, cols, minX, maxX, minY, maxY } = seatRange;
  const total = cols * rows;

  const dots: Point[] = [];
  for (let row = 0; row < rows; row += 1) {
    const v = rows === 1 ? 0 : row / (rows - 1);
    const left = lerp(corners.topLeft, corners.bottomLeft, v);
    const right = lerp(corners.topRight, corners.bottomRight, v);
    for (let col = 0; col < cols; col += 1) {
      const u = cols === 1 ? 0 : col / (cols - 1);
      dots.push(lerp(left, right, u));
    }
  }

  const allX = dots.map((d) => d.x);
  const allY = dots.map((d) => d.y);
  const geomMinX = Math.min(...allX);
  const geomMaxX = Math.max(...allX);
  const geomMinY = Math.min(...allY);
  const geomMaxY = Math.max(...allY);

  return {
    dots,
    cols,
    rows,
    total,
    minX: geomMinX,
    maxX: geomMaxX,
    minY: geomMinY,
    maxY: geomMaxY,
    logicalMinX: minX,
    logicalMaxX: maxX,
    logicalMinY: minY,
    logicalMaxY: maxY,
    slogan: trimmed,
    letterSpacing: Math.max(0, Math.min(200, letterSpacing)),
  };
};

/** 按与规划图相同的座位编号 (x,y)，找到最近的格点 */
export const findNearestSeatCell = (
  seatData: SeatData,
  sx: number,
  sy: number,
): { row: number; col: number } | null => {
  if (!Number.isFinite(sx) || !Number.isFinite(sy)) return null;
  const { dots, rows, cols } = seatData;
  let br = 0;
  let bc = 0;
  let bd = Infinity;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const p = dots[row * cols + col];
      const d = (p.x - sx) ** 2 + (p.y - sy) ** 2;
      if (d < bd) {
        bd = d;
        br = row;
        bc = col;
      }
    }
  }
  let minNeighbor = Infinity;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const p = dots[row * cols + col];
      const neighbors = [
        [row - 1, col],
        [row + 1, col],
        [row, col - 1],
        [row, col + 1],
      ] as const;
      for (const [nr, nc] of neighbors) {
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        const q = dots[nr * cols + nc];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d > 0 && d < minNeighbor) minNeighbor = d;
      }
    }
  }
  if (minNeighbor === Infinity) minNeighbor = 1;
  const maxOk = (minNeighbor * 0.45) ** 2;
  if (bd <= maxOk) return { row: br, col: bc };
  return null;
};
