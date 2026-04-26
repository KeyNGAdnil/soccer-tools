import { useState } from 'react';
import './App.css';
import { AppPageShell } from './app/AppPageShell';
import { HomeView } from './app/HomeView';
import type { ToolId } from './tools/registry';
import {
  SharedAttendeeView,
  ShareLinkInvalid,
  TifoDotMatrixPlannerTool,
  computeSeatData,
  readShareFromSearch,
  type SharePayloadV1,
} from './tools/tifo-dot-matrix-planner';

type AppView = 'home' | 'tool';

const App = () => {
  const [sharePayload] = useState<SharePayloadV1 | null>(() =>
    readShareFromSearch(),
  );
  const [view, setView] = useState<AppView>('home');
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);

  if (sharePayload) {
    const seatData = computeSeatData(
      sharePayload.corners,
      sharePayload.slogan,
      sharePayload.letterSpacing,
    );
    if (!seatData) {
      return <ShareLinkInvalid />;
    }
    return <SharedAttendeeView sharePayload={sharePayload} />;
  }

  const openTool = (id: ToolId) => {
    setActiveTool(id);
    setView('tool');
  };

  return (
    <AppPageShell>
      {view === 'home' ? (
        <HomeView
          onOpenTool={(id) => {
            if (id === 'tifo-dot-matrix-planner') openTool(id);
          }}
        />
      ) : activeTool === 'tifo-dot-matrix-planner' ? (
        <TifoDotMatrixPlannerTool
          onExit={() => {
            setView('home');
            setActiveTool(null);
          }}
        />
      ) : null}
    </AppPageShell>
  );
};

export default App;
