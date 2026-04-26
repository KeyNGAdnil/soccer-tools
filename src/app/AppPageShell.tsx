import type { ReactNode } from 'react';

const shellClass =
  'min-h-screen w-full bg-gradient-to-b from-slate-50 via-white to-teal-50/70 text-slate-800 antialiased';

const contentClass =
  'mx-auto w-[calc(100%-24px)] max-w-[1100px] py-8 md:w-[calc(100%-32px)] md:py-12';

type AppPageShellProps = {
  children: ReactNode;
};

/**
 * 外层铺满视口宽度铺渐变，内层限制内容宽度，避免两侧露出 body 白底。
 */
export const AppPageShell = ({ children }: AppPageShellProps) => (
  <div className={shellClass}>
    <main className={contentClass}>{children}</main>
  </div>
);
