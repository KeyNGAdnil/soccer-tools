import type { CornerForm } from '../lib/types';
import { cornerInputRows } from '../lib/constants';
import { CornerRightAngleIcon } from './CornerRightAngleIcon';

type StepCornersFormProps = {
  cornerForm: CornerForm;
  onChange: (next: CornerForm) => void;
  onBack: () => void;
  onNext: () => void;
};

export const StepCornersForm = ({
  cornerForm,
  onChange,
  onBack,
  onNext,
}: StepCornersFormProps) => (
  <section className="rounded-[10px] border border-slate-200/90 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
    <div className="flex flex-col gap-4">
      {cornerInputRows.map((row) => (
        <div
          key={row.corner}
          className="flex flex-wrap items-end gap-3 sm:flex-nowrap sm:items-center"
        >
          <div className="flex w-full shrink-0 items-center gap-2.5 self-center sm:w-[7.5rem]">
            <CornerRightAngleIcon corner={row.corner} />
            <span className="text-sm font-medium leading-tight">
              {row.label}
            </span>
          </div>
          <label className="flex min-w-[6.5rem] flex-1 flex-col gap-1 text-sm">
            <span className="text-slate-500">X</span>
            <input
              value={cornerForm[row.xKey]}
              onChange={(e) =>
                onChange({ ...cornerForm, [row.xKey]: e.target.value })
              }
              type="number"
              aria-label={`${row.label} X`}
              className="rounded-md border border-slate-200 bg-white px-2 py-2 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/25"
            />
          </label>
          <label className="flex min-w-[6.5rem] flex-1 flex-col gap-1 text-sm">
            <span className="text-slate-500">Y</span>
            <input
              value={cornerForm[row.yKey]}
              onChange={(e) =>
                onChange({ ...cornerForm, [row.yKey]: e.target.value })
              }
              type="number"
              aria-label={`${row.label} Y`}
              className="rounded-md border border-slate-200 bg-white px-2 py-2 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/25"
            />
          </label>
        </div>
      ))}
    </div>
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
        确认并进入下一步
      </button>
    </div>
  </section>
);
