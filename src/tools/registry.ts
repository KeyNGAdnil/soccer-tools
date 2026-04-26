export type ToolId = 'tifo-dot-matrix-planner';

export type ToolListItem = {
  id: ToolId;
  name: string;
  status: '开发中';
};

export const TOOLS: ToolListItem[] = [
  {
    id: 'tifo-dot-matrix-planner',
    name: 'tifo点阵规划图',
    status: '开发中',
  },
];
