import { TOOLS } from '../tools/registry';

type HomeViewProps = {
  onOpenTool: (id: (typeof TOOLS)[number]['id']) => void;
};

export const HomeView = ({ onOpenTool }: HomeViewProps) => (
  <>
    <header className="mb-7">
      <h1 className="m-0 text-[clamp(1.8rem,3.6vw,3rem)] leading-[1.15] font-semibold">
        工具箱
      </h1>
    </header>
    <section className="grid grid-cols-1 gap-4" aria-label="工具列表">
      {TOOLS.map((tool) => (
        <article
          key={tool.id}
          className="rounded-[10px] border border-slate-200/90 bg-white/90 p-5 shadow-sm backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="m-0 text-lg font-semibold">{tool.name}</h2>
            <span className="rounded-full border border-teal-200/80 bg-teal-50/80 px-2.5 py-1 text-xs text-teal-900">
              {tool.status}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOpenTool(tool.id)}
            className="mt-4 cursor-pointer rounded-[10px] border border-emerald-600 bg-emerald-600 px-3.5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:border-emerald-700 hover:bg-emerald-700"
          >
            使用工具
          </button>
        </article>
      ))}
    </section>
  </>
);
