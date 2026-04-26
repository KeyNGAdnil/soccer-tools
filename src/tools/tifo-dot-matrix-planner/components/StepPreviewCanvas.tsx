import type { RefObject } from 'react';
import { ZoomToolbar } from './ZoomToolbar';

type StepPreviewCanvasProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  zoom: number;
  onAdjustZoom: (delta: number) => void;
  onResetZoom: () => void;
  onBack: () => void;
  onShareStep: () => void;
};

export const StepPreviewCanvas = ({
  canvasRef,
  zoom,
  onAdjustZoom,
  onResetZoom,
  onBack,
  onShareStep,
}: StepPreviewCanvasProps) => (
  <section className="space-y-4 rounded-[10px] border border-slate-200/90 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
    <ZoomToolbar zoom={zoom} onAdjust={onAdjustZoom} onReset={onResetZoom} />
    <div className="max-h-[min(85vh,900px)] overflow-auto rounded-md border border-slate-200/90 bg-slate-100/70 p-2">
      <canvas ref={canvasRef} className="block cursor-default touch-none" />
    </div>
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onBack}
        className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-900"
      >
        返回上一步
      </button>
      <button
        type="button"
        onClick={onShareStep}
        className="cursor-pointer rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-2 text-white shadow-sm hover:border-emerald-700 hover:bg-emerald-700"
      >
        下一步：生成分享链接
      </button>
    </div>
  </section>
);
