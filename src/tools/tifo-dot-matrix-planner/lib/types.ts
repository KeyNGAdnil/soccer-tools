export type Point = { x: number; y: number };

export type CornerKey = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export type SeatData = {
  dots: Point[];
  cols: number;
  rows: number;
  total: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  /** 与四角输入一致的座位编号范围（用于分享页提示） */
  logicalMinX: number;
  logicalMaxX: number;
  logicalMinY: number;
  logicalMaxY: number;
  slogan: string;
  letterSpacing: number;
};

export type SharePayloadV1 = {
  v: 1;
  corners: Record<CornerKey, Point>;
  slogan: string;
  letterSpacing: number;
};

export type CornerForm = Record<`${CornerKey}_${'x' | 'y'}`, string>;

export type PlannerStep = 1 | 2 | 3 | 4;
