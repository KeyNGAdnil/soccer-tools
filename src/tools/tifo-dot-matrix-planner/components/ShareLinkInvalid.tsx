import { AppPageShell } from '../../../app/AppPageShell';

export const ShareLinkInvalid = () => (
  <AppPageShell>
    <p className="rounded-lg border border-rose-200 bg-rose-50/60 px-3 py-2 text-sm text-rose-800">
      分享链接无效或已损坏。
    </p>
    <button
      type="button"
      onClick={() => {
        window.location.href = window.location.pathname;
      }}
      className="mt-4 cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-900"
    >
      进入工具箱
    </button>
  </AppPageShell>
);
