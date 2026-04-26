import type { CornerForm, CornerKey } from './types';

/** 画布上座位视觉：半径、圆心距中的间隙（逻辑像素；整图缩放不改变点与文案的相对关系） */
export const SEAT_RADIUS_BASE = 3.5;
export const SEAT_GAP_BASE = 4;
export const CANVAS_PAD = 16;
export const ZOOM_MIN = 0.15;
export const ZOOM_MAX = 6;

/**
 * 默认：宽 100（X 1～100）× 高 20（Y 1～20），共 2000 座。
 */
export const DEFAULT_CORNER_FORM: CornerForm = {
  topLeft_x: '1',
  topLeft_y: '1',
  topRight_x: '100',
  topRight_y: '1',
  bottomLeft_x: '1',
  bottomLeft_y: '20',
  bottomRight_x: '100',
  bottomRight_y: '20',
};

export const DEFAULT_SLOGAN = '重庆雄起';

export const cornerInputRows: Array<{
  corner: CornerKey;
  label: string;
  xKey: keyof CornerForm;
  yKey: keyof CornerForm;
}> = [
  { corner: 'topLeft', label: '左上角', xKey: 'topLeft_x', yKey: 'topLeft_y' },
  {
    corner: 'topRight',
    label: '右上角',
    xKey: 'topRight_x',
    yKey: 'topRight_y',
  },
  {
    corner: 'bottomLeft',
    label: '左下角',
    xKey: 'bottomLeft_x',
    yKey: 'bottomLeft_y',
  },
  {
    corner: 'bottomRight',
    label: '右下角',
    xKey: 'bottomRight_x',
    yKey: 'bottomRight_y',
  },
];
