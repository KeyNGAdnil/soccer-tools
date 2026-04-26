import { useCallback, useEffect, useRef } from 'react';
import type { SeatData } from '../lib/types';
import { drawTifoSeatCanvas } from '../lib/drawSeatCanvas';
import { ZOOM_MAX, ZOOM_MIN } from '../lib/constants';

type PinnedSeat = { row: number; col: number } | null;

export function useSeatCanvas(
  seatData: SeatData | null,
  active: boolean,
  zoom: number,
  guestPinnedSeat: PinnedSeat,
  onWheelZoom: (delta: number) => void,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const redraw = useCallback(() => {
    const el = canvasRef.current;
    if (!el || !active || !seatData) return;
    drawTifoSeatCanvas(el, seatData, zoom, guestPinnedSeat);
  }, [active, seatData, zoom, guestPinnedSeat]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el || !active || !seatData) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.12 : 0.12;
      onWheelZoom(delta);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [active, seatData, onWheelZoom]);

  return canvasRef;
}

export function clampZoom(z: number): number {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
}
