import React, { createContext, useContext, useEffect, useState } from 'react';
import { ProgressService } from '../services/ProgressService';

const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(null);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);

  useEffect(() => {
    const initialize = async () => {
      await ProgressService.initializeUser();
      const data = await ProgressService.getProgress();
      const levels = await AsyncStorage.getItem(UNLOCKED_LEVELS_KEY);
      setProgress(data);
      setUnlockedLevels(levels ? JSON.parse(levels) : [1]);
    };
    initialize();
  }, []);

  const value = {
    progress,
    unlockedLevels,
    unlockLevel: async (level) => {
      await ProgressService.unlockLevel(level);
      setUnlockedLevels(prev => [...prev, level]);
    }
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);