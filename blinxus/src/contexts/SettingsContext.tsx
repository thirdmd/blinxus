import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextType {
  isImmersiveFeedEnabled: boolean;
  setImmersiveFeedEnabled: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  isImmersiveFeedEnabled: true, // Default to new experience
  setImmersiveFeedEnabled: () => {},
});

export const useSettings = () => useContext(SettingsContext);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [isImmersiveFeedEnabled, setImmersiveFeedEnabled] = useState(true);

  return (
    <SettingsContext.Provider
      value={{
        isImmersiveFeedEnabled,
        setImmersiveFeedEnabled,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext; 