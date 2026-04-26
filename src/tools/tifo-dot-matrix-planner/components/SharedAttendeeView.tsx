import { useCallback, useMemo, useState } from 'react';
import { AppPageShell } from '../../../app/AppPageShell';
import type { SharePayloadV1 } from '../lib/types';
import { computeSeatData, findNearestSeatCell } from '../lib/seatLayout';
import { clampZoom, useSeatCanvas } from '../hooks/useSeatCanvas';
import { ZoomToolbar } from './ZoomToolbar';

type SharedAttendeeViewProps = {
  sharePayload: SharePayloadV1;
};

export const SharedAttendeeView = ({
  sharePayload,
}: SharedAttendeeViewProps) => {
  const [zoom, setZoom] = useState(1);
  const [guestSeatX, setGuestSeatX] = useState('');
  const [guestSeatY, setGuestSeatY] = useState('');
  const [guestPinnedSeat, setGuestPinnedSeat] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [guestError, setGuestError] = useState('');

  const seatData = useMemo(
    () =>
      computeSeatData(
        sharePayload.corners,
        sharePayload.slogan,
        sharePayload.letterSpacing,
      ),
    [sharePayload],
  );

  const onWheelZoom = useCallback((delta: number) => {
    setZoom((z) => clampZoom(z + delta));
  }, []);

  const canvasRef = useSeatCanvas(
    seatData,
    Boolean(seatData),
    zoom,
    guestPinnedSeat,
    onWheelZoom,
  );

  const adjustZoom = useCallback((delta: number) => {
    setZoom((z) => clampZoom(z + delta));
  }, []);

  const applyGuestSeat = useCallback(() => {
    if (!seatData) return;
    const sx = Number(guestSeatX);
    const sy = Number(guestSeatY);
    if (!Number.isFinite(sx) || !Number.isFinite(sy)) {
      setGuestError('请输入有效的座位 X、Y 数字。');
      setGuestPinnedSeat(null);
      return;
    }
    const cell = findNearestSeatCell(seatData, sx, sy);
    if (!cell) {
      setGuestError('该坐标不在本场点阵范围内，请核对 X、Y。');
      setGuestPinnedSeat(null);
      return;
    }
    setGuestError('');
    setGuestPinnedSeat(cell);
  }, [seatData, guestSeatX, guestSeatY]);

  if (!seatData) {
    return null;
  }

  return (
    <AppPageShell>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">查看我的座位</h1>
          <p className="mt-1 text-sm text-slate-500">
            输入与规划时一致的座位编号（X、Y），红色圆点为你的位置。
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            window.location.href = window.location.pathname;
          }}
          className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-900"
        >
          制作自己的规划图
        </button>
      </header>

      {guestError ? (
        <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50/60 px-3 py-2 text-sm text-rose-800">
          {guestError}
        </p>
      ) : null}

      <section className="space-y-4 rounded-[10px] border border-slate-200/90 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
        <p className="text-sm text-slate-500">
          本场编号范围：X {seatData.logicalMinX}～{seatData.logicalMaxX}，Y{' '}
          {seatData.logicalMinY}～{seatData.logicalMaxY}
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex min-w-[6.5rem] flex-1 flex-col gap-1 text-sm">
            <span className="text-slate-500">座位 X</span>
            <input
              value={guestSeatX}
              onChange={(e) => setGuestSeatX(e.target.value)}
              type="number"
              aria-label="座位 X"
              className="rounded-md border border-slate-200 bg-white px-2 py-2 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/25"
            />
          </label>
          <label className="flex min-w-[6.5rem] flex-1 flex-col gap-1 text-sm">
            <span className="text-slate-500">座位 Y</span>
            <input
              value={guestSeatY}
              onChange={(e) => setGuestSeatY(e.target.value)}
              type="number"
              aria-label="座位 Y"
              className="rounded-md border border-slate-200 bg-white px-2 py-2 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/25"
            />
          </label>
          <button
            type="button"
            onClick={applyGuestSeat}
            className="cursor-pointer rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-2 text-white shadow-sm hover:border-emerald-700 hover:bg-emerald-700"
          >
            在图中显示
          </button>
        </div>

        <ZoomToolbar
          zoom={zoom}
          onAdjust={adjustZoom}
          onReset={() => setZoom(1)}
        />
        <div className="max-h-[min(85vh,900px)] overflow-auto overscroll-contain rounded-md border border-slate-200/90 bg-slate-100/70 p-2 [-webkit-overflow-scrolling:touch]">
          <canvas
            ref={canvasRef}
            className="block max-w-none cursor-default touch-pan-x touch-pan-y"
          />
        </div>
      </section>
    </AppPageShell>
  );
};
