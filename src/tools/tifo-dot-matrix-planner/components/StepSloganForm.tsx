type StepSloganFormProps = {
  slogan: string;
  sloganLetterSpacing: string;
  onSloganChange: (v: string) => void;
  onLetterSpacingChange: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export const StepSloganForm = ({
  slogan,
  sloganLetterSpacing,
  onSloganChange,
  onLetterSpacingChange,
  onBack,
  onNext,
}: StepSloganFormProps) => (
  <section className="rounded-[10px] border border-slate-200/90 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
    <textarea
      value={slogan}
      onChange={(e) => onSloganChange(e.target.value)}
      placeholder="重庆雄起"
      aria-label="文案"
      className="min-h-28 w-full rounded-md border border-slate-200 bg-white px-3 py-2 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/25"
    />
    <label className="mt-3 flex max-w-md flex-col gap-2 text-sm">
      <div className="flex items-center justify-between gap-3">
        <span>座位间距</span>
        <span className="tabular-nums text-slate-500">
          {Math.min(200, Math.max(0, Number(sloganLetterSpacing) || 0))}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={200}
        step={1}
        value={Math.min(200, Math.max(0, Number(sloganLetterSpacing) || 0))}
        onChange={(e) => onLetterSpacingChange(e.target.value)}
        aria-label="座位间距"
        aria-valuemin={0}
        aria-valuemax={200}
        aria-valuenow={Math.min(
          200,
          Math.max(0, Number(sloganLetterSpacing) || 0),
        )}
        className="w-full cursor-grab accent-emerald-600 active:cursor-grabbing"
      />
    </label>
    <div className="mt-4 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onBack}
        className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-900"
      >
        返回上一步
      </button>
      <button
        type="button"
        onClick={onNext}
        className="cursor-pointer rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-2 text-white shadow-sm hover:border-emerald-700 hover:bg-emerald-700"
      >
        确认并生成点阵图
      </button>
    </div>
  </section>
);
