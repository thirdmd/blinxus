import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FullscreenContextType {
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
  isExploreScrollMode: boolean;
  setIsExploreScrollMode: (scrollMode: boolean) => void;
}

const FullscreenContext = createContext<FullscreenContextType | undefined>(undefined);

export const useFullscreen = () => {
  const context = useContext(FullscreenContext);
  if (context === undefined) {
    throw new Error('useFullscreen must be used within a FullscreenProvider');
  }
  return context;
};

interface FullscreenProviderProps {
  children: ReactNode;
}

export const FullscreenProvider: React.FC<FullscreenProviderProps> = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExploreScrollMode, setIsExploreScrollMode] = useState(true); // Default to scroll mode

  const value: FullscreenContextType = {
    isFullscreen,
    setIsFullscreen,
    isExploreScrollMode,
    setIsExploreScrollMode,
  };

  return (
    <FullscreenContext.Provider value={value}>
      {children}
    </FullscreenContext.Provider>
  );
}; 