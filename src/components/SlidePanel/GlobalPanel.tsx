'use client';

import { usePanel } from '@/context/PanelContext';
import SlidePanel from './SlidePanel';
import MeetMaartenPanel from './panels/MeetMaartenPanel';
import StartNuPanel from './panels/StartNuPanel';

export default function GlobalPanel() {
  const { activePanel, closePanel } = usePanel();

  const renderPanelContent = () => {
    switch (activePanel) {
      case 'meet-maarten':
        return <MeetMaartenPanel />;
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
