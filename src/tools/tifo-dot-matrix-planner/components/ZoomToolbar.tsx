type ZoomToolbarProps = {
  zoom: number;
  onAdjust: (delta: number) => void;
  onReset: () => void;
};

export const ZoomToolbar = ({ zoom, onAdjust, onReset }: ZoomToolbarProps) => (
  <div className="flex flex-wrap items-center gap-2">
    <span className="text-sm text-slate-500">缩放</span>
    <button
      type="button"
      onClick={() => onAdjust(-0.25)}
      className="rounded border border-slate-300 px-2 py-1 text-sm text-slate-600 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-900"
    >
      −
    </button>
    <span className="min-w-[4rem] text-center text-sm tabular-nums">
      {Math.round(zoom * 100)}%
    </span>
    <button
      type="button"
      onClick={() => onAdjust(0.25)}
      className="rounded border border-slate-300 px-2 py-1 text-sm text-slate-600 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-900"
    >
      +
    </button>
    <button
      type="button"
      onClick={onReset}
      className="rounded border border-slate-300 px-2 py-1 text-sm text-slate-600 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-900"
    >
      重置
    </button>
  </div>
);
