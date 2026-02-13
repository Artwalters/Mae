'use client';

import { useEffect, useRef } from 'react';
import { usePanel } from '@/context/PanelContext';
import SlidePanel from './SlidePanel';
import MeetMaartenPanel from './panels/MeetMaartenPanel';
import MeetMerelPanel from './panels/MeetMerelPanel';
import StartNuPanel from './panels/StartNuPanel';
import styles from './GlobalPanel.module.css';

export default function GlobalPanel() {
  const { activePanel, openPanel, closePanel, onBack } = usePanel();
  const lastPanelRef = useRef<string | null>(null);
  const navBarRef = useRef<HTMLDivElement>(null);

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

  const isMeetMaarten = panelToRender === 'meet-maarten';
  const isStartNu = panelToRender === 'start-nu';

  const navBar = (
    <div ref={navBarRef} className={styles.navBar}>
      <button
        className={`${styles.navTab} ${isMeetMaarten ? styles.navTabActive : ''}`}
        onClick={() => openPanel('meet-maarten')}
      >
        <span>Meet Maarten</span>
        <span className={styles.navTabNumber}>[01]</span>
      </button>
      {onBack && (
        <button className={`${styles.backButton} ${isStartNu ? styles.backButtonActive : ''}`} onClick={onBack}>
          <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeMiterlimit="10" style={{ transform: 'scaleX(-1)' }}>
            <path d="M14 19L21 12L14 5" />
            <path d="M21 12H2" />
          </svg>
        </button>
      )}
      <button
        className={`${styles.navTab} ${isStartNu ? styles.navTabActive : ''}`}
        onClick={() => openPanel('start-nu')}
      >
        <span>Start Nu</span>
        <span className={styles.navTabNumber}>[02]</span>
      </button>
    </div>
  );

  return (
    <SlidePanel isOpen={activePanel !== null} onClose={closePanel} header={navBar}>
      {renderPanelContent()}
    </SlidePanel>
  );
}
