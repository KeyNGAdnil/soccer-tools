import type { SeatData } from './types';
import { CANVAS_PAD, SEAT_GAP_BASE, SEAT_RADIUS_BASE } from './constants';

export const drawTifoSeatCanvas = (
  canvas: HTMLCanvasElement,
  seatData: SeatData,
  zoom: number,
  guestPinnedSeat: { row: number; col: number } | null,
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const z = Math.max(0.01, zoom);
  // 点阵与文案始终在固定逻辑坐标系中布局；缩放只放大/缩小整幅画面，避免缩放改变“哪些座位在字下”
  const r = SEAT_RADIUS_BASE;
  const pitch = 2 * SEAT_RADIUS_BASE + SEAT_GAP_BASE;
  const { rows, cols } = seatData;

  const logicalW = CANVAS_PAD * 2 + 2 * r + Math.max(0, cols - 1) * pitch;
  const logicalH = CANVAS_PAD * 2 + 2 * r + Math.max(0, rows - 1) * pitch;
  const dpr = window.devicePixelRatio || 1;

  const styleW = logicalW * z;
  const styleH = logicalH * z;
  canvas.width = Math.floor(styleW * dpr);
  canvas.height = Math.floor(styleH * dpr);
  canvas.style.width = `${styleW}px`;
  canvas.style.height = `${styleH}px`;
  ctx.setTransform(dpr * z, 0, 0, dpr * z, 0, 0);

  ctx.clearRect(0, 0, logicalW, logicalH);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, logicalW, logicalH);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const cx = CANVAS_PAD + r + col * pitch;
      const cy = CANVAS_PAD + r + row * pitch;
      const isMySeat =
        guestPinnedSeat !== null &&
        guestPinnedSeat.row === row &&
        guestPinnedSeat.col === col;

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = isMySeat ? '#dc2626' : '#94a3b8';
      ctx.fill();
    }
  }

  const text = seatData.slogan.trim();
  if (text) {
    const gridW = 2 * r + Math.max(0, cols - 1) * pitch;
    const gridH = 2 * r + Math.max(0, rows - 1) * pitch;
    const inset = Math.min(6, Math.min(gridW, gridH) * 0.03);
    const maxTextW = Math.max(4, gridW - inset * 2);
    const maxTextH = Math.max(4, gridH - inset * 2);
    const textCx = CANVAS_PAD + gridW / 2;
    const textCy = CANVAS_PAD + gridH / 2;

    const rawSpacing = Math.max(0, Math.min(200, seatData.letterSpacing));
    const glyphs = [...text];
    const minFont = 8;

    const inkAscent = (m: TextMetrics, fs: number) => {
      const a = m.actualBoundingBoxAscent;
      if (typeof a === 'number' && a > 0) return a;
      const fa = m.fontBoundingBoxAscent;
      if (typeof fa === 'number' && fa > 0) return fa;
      return fs * 0.88;
    };
    const inkDescent = (m: TextMetrics, fs: number) => {
      const d = m.actualBoundingBoxDescent;
      if (typeof d === 'number' && d > 0) return d;
      const fd = m.fontBoundingBoxDescent;
      if (typeof fd === 'number' && fd > 0) return fd;
      return fs * 0.12;
    };
    const inkHeight = (m: TextMetrics, fs: number) =>
      inkAscent(m, fs) + inkDescent(m, fs);

    const layoutLine = (fs: number) => {
      ctx.font = `700 ${fs}px "Microsoft YaHei", "PingFang SC", sans-serif`;
      ctx.letterSpacing = '0px';
      const widths = glyphs.map((g) => ctx.measureText(g).width);
      const sumChars = widths.reduce((a, b) => a + b, 0);
      const gaps = Math.max(0, glyphs.length - 1);
      const maxGap = gaps > 0 ? Math.max(0, maxTextW - sumChars) / gaps : 0;
      const sp = Math.min(rawSpacing, maxGap);
      const totalW = sumChars + sp * gaps;
      const ref = ctx.measureText(glyphs[0] ?? text);
      const h = inkHeight(ref, fs);
      return { widths, sp, totalW, h, ref };
    };

    let fontSize = Math.min(
      Math.floor(maxTextH / 1.22),
      Math.floor(maxTextW / Math.max(1, glyphs.length * 0.48)),
      240,
    );
    fontSize = Math.max(minFont, fontSize);

    let layout = layoutLine(fontSize);
    while (
      fontSize > minFont &&
      (layout.totalW > maxTextW || layout.h > maxTextH)
    ) {
      fontSize -= 1;
      layout = layoutLine(fontSize);
    }

    const { widths, sp, totalW } = layout;
    const ref = layout.ref;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    const ascent = inkAscent(ref, fontSize);
    const descent = inkDescent(ref, fontSize);
    let baselineY = textCy + (ascent - descent) / 2;
    const gridTop = CANVAS_PAD;
    const gridBottom = CANVAS_PAD + gridH;
    const edgeMargin = Math.max(inset, 2);
    let topInk = baselineY - ascent;
    let bottomInk = baselineY + descent;
    if (topInk < gridTop + edgeMargin) {
      baselineY = gridTop + edgeMargin + ascent;
    }
    bottomInk = baselineY + descent;
    if (bottomInk > gridBottom - edgeMargin) {
      baselineY = gridBottom - edgeMargin - descent;
    }

    const gridLeft = CANVAS_PAD;
    const gridRight = CANVAS_PAD + gridW;
    let x = textCx - totalW / 2;
    x = Math.max(
      gridLeft + edgeMargin,
      Math.min(x, gridRight - edgeMargin - totalW),
    );

    ctx.fillStyle = 'rgba(5, 150, 105, 0.4)';
    for (let i = 0; i < glyphs.length; i += 1) {
      ctx.fillText(glyphs[i], x, baselineY);
      x += widths[i] + (i < glyphs.length - 1 ? sp : 0);
    }
  }
};
