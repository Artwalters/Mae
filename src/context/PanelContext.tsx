'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type PanelType = 'meet-maarten' | 'start-nu' | null;

interface PanelContextType {
  activePanel: PanelType;
  openPanel: (panel: PanelType) => void;
  closePanel: () => void;
  progress: number;
  setProgress: (p: number) => void;
  onBack: (() => void) | null;
  setOnBack: (cb: (() => void) | null) => void;
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export function PanelProvider({ children }: { children: ReactNode }) {
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [progress, setProgress] = useState(0);
  const [onBack, setOnBack] = useState<(() => void) | null>(null);

  const openPanel = (panel: PanelType) => {
    setActivePanel(panel);
  };

  const closePanel = () => {
    setActivePanel(null);
    setProgress(0);
    setOnBack(null);
  };

  return (
    <PanelContext.Provider value={{ activePanel, openPanel, closePanel, progress, setProgress, onBack, setOnBack }}>
      {children}
    </PanelContext.Provider>
  );
}

export function usePanel() {
  const context = useContext(PanelContext);
  if (context === undefined) {
    throw new Error('usePanel must be used within a PanelProvider');
  }
  return context;
}
