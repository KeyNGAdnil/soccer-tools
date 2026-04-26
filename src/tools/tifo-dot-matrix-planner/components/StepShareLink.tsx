type StepShareLinkProps = {
  shareUrl: string;
  copyHint: string;
  onCopy: () => void;
  onBack: () => void;
};

export const StepShareLink = ({
  shareUrl,
  copyHint,
  onCopy,
  onBack,
}: StepShareLinkProps) => (
  <section className="space-y-4 rounded-[10px] border border-slate-200/90 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
    <h2 className="text-lg font-semibold">生成分享链接</h2>
    <p className="text-sm text-slate-500">
      参与者打开链接后，只需输入自己的座位
      X、Y，即可在点阵图中看到自己的位置（红色标记）。
    </p>
    {shareUrl ? (
      <>
        <input
          readOnly
          value={shareUrl}
          aria-label="分享链接"
          className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/25"
          onFocus={(e) => e.target.select()}
        />
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onCopy}
            className="cursor-pointer rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-2 text-white shadow-sm hover:border-emerald-700 hover:bg-emerald-700"
          >
            复制链接
          </button>
          <button
            type="button"
            onClick={onBack}
            className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-900"
          >
            返回上一步
          </button>
        </div>
        {copyHint ? (
          <p className="text-sm text-emerald-700">{copyHint}</p>
        ) : null}
      </>
    ) : (
      <p className="text-sm text-rose-700">
        无法生成链接，请从第一步重新完成规划。
      </p>
    )}
  </section>
);
