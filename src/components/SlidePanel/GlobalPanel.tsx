'use client';

import { useEffect, useRef, useState } from 'react';
import { usePanel } from '@/context/PanelContext';
import SlidePanel from './SlidePanel';
import MeetMaartenPanel from './panels/MeetMaartenPanel';
import MeetMerelPanel from './panels/MeetMerelPanel';
import StartNuPanel from './panels/StartNuPanel';
import styles from './GlobalPanel.module.css';

export default function GlobalPanel() {
  const { activePanel, panelVariant, openPanel, closePanel, onBack, panelStep } = usePanel();
  const lastPanelRef = useRef<string | null>(null);
  const navBarRef = useRef<HTMLDivElement>(null);
  const [panelPhase, setPanelPhase] = useState(1);

  // Only update lastPanel when a new panel opens
  useEffect(() => {
    if (activePanel !== null) {
      lastPanelRef.current = activePanel;
    }
  }, [activePanel]);

  // Reset phase when panel changes
  useEffect(() => {
    setPanelPhase(1);
  }, [activePanel]);

  // Observe data-panel-phase attribute changes from SlidePanel
  const panelElRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    // Find the panel element (parent of navBar)
    const panelEl = navBarRef.current?.closest('[data-panel-phase]') as HTMLElement | null;
    panelElRef.current = panelEl;
    if (!panelEl) return;

    const observer = new MutationObserver(() => {
      const phase = parseInt(panelEl.getAttribute('data-panel-phase') || '1', 10);
      setPanelPhase(phase);
    });
    observer.observe(panelEl, { attributes: true, attributeFilter: ['data-panel-phase'] });
    return () => observer.disconnect();
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

  const isMeetPanel = panelToRender === 'meet-maarten' || panelToRender === 'meet-merel';
  const isStartNu = panelToRender === 'start-nu';
  const showStartTraject = isMeetPanel && panelPhase === 2;
  const isMerel = panelToRender === 'meet-merel' || (isStartNu && (panelVariant === 'leefstijl' || lastPanelRef.current === 'meet-merel'));
  const meetName = isMerel ? 'Meet Merel' : 'Meet Maarten';
  const meetPanel = isMerel ? 'meet-merel' : 'meet-maarten';
  const startVariant = isMerel ? 'leefstijl' : 'fysio';

  const navBar = (
    <div ref={navBarRef} className={styles.navBar}>
      <button
        className={`${styles.navTab} ${isMeetPanel ? styles.navTabActive : ''} ${isMeetPanel ? styles.navTabMaarten : ''}`}
        onClick={() => openPanel(meetPanel as 'meet-maarten' | 'meet-merel')}
      >
        <span>{meetName}</span>
        <span className={styles.navTabNumber}>[{isMeetPanel ? panelStep : '00'}]</span>
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
        className={`${styles.navTab} ${isStartNu ? styles.navTabActive : ''} ${isMeetPanel ? styles.navTabStartNu : ''}`}
        onClick={() => openPanel('start-nu', startVariant as 'fysio' | 'leefstijl')}
      >
        <span>{showStartTraject ? 'Start Traject' : 'Start Nu'}</span>
        <span className={styles.navTabNumber}>[{isStartNu ? panelStep : '00'}]</span>
      </button>
    </div>
  );

  return (
    <SlidePanel isOpen={activePanel !== null} onClose={closePanel} header={navBar} dark>
      {renderPanelContent()}
    </SlidePanel>
  );
}
