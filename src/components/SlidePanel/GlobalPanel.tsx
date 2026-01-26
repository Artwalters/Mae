'use client';

import { useEffect, useRef } from 'react';
import { usePanel } from '@/context/PanelContext';
import SlidePanel from './SlidePanel';
import MeetMaartenPanel from './panels/MeetMaartenPanel';
import MeetMerelPanel from './panels/MeetMerelPanel';
import StartNuPanel from './panels/StartNuPanel';

export default function GlobalPanel() {
  const { activePanel, closePanel } = usePanel();
  const lastPanelRef = useRef<string | null>(null);

  // Only update lastPanel when a new panel opens
  useEffect(() => {
    if (activePanel !== null) {
      lastPanelRef.current = activePanel;
    }
  }, [activePanel]);

  // Use activePanel if open, otherwise use last panel for exit animation
  const panelToRender = activePanel ?? lastPanelRef.current;

  const renderPanelContent = () => {
    switch (panelToRender) {
      case 'meet-maarten':
        return <MeetMaartenPanel />;
      case 'meet-merel':
        return <MeetMerelPanel />;
      case 'start-nu':
        return <StartNuPanel />;
      default:
        return null;
    }
  };

  return (
    <SlidePanel isOpen={activePanel !== null} onClose={closePanel}>
      {renderPanelContent()}
    </SlidePanel>
  );
}
