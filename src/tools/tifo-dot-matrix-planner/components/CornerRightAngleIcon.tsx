import type { ReactElement } from 'react';
import type { CornerKey } from '../lib/types';

/** 示意矩形区域在该角的直角朝向，减少与相邻角混淆 */
export const CornerRightAngleIcon = ({ corner }: { corner: CornerKey }) => {
  const stroke = {
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 2.25,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const paths: Record<CornerKey, ReactElement> = {
    topLeft: <path d="M 6.5 6.5 V 17.5 M 6.5 6.5 H 17.5" {...stroke} />,
    topRight: <path d="M 17.5 6.5 V 17.5 M 17.5 6.5 H 6.5" {...stroke} />,
    bottomLeft: <path d="M 6.5 17.5 V 6.5 M 6.5 17.5 H 17.5" {...stroke} />,
    bottomRight: <path d="M 17.5 17.5 V 6.5 M 17.5 17.5 H 6.5" {...stroke} />,
  };
  return (
    <svg
      className="h-8 w-8 shrink-0 text-emerald-800"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="1.5"
        className="fill-teal-50 stroke-teal-200/90"
        strokeWidth="1"
      />
      {paths[corner]}
    </svg>
  );
};
