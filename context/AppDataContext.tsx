import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { ThemeMode } from './ThemeContext';
import uuid from '@/utils/uuid';
import { getCurrentDate, getDaysInStreak } from '@/utils/dateUtils';
import storage from '@/utils/storage';

// Types
export interface Habit {
  id: string;
  name: string;
  mode: ThemeMode | 'both';
}

export interface AppData {
  habits: Habit[];
  progress: {
    [date: string]: string[]; // date -> habitIds[]
  };
  lastMode?: ThemeMode;
  currentStreak: number;
}

// Initial app data
const initialAppData: AppData = {
  habits: [],
  progress: {},
  currentStreak: 0,
};

// Context
interface AppDataContextType {
  appData: AppData;
  initializeAppData: () => void;
  addHabit: (habit: Omit<Habit, 'id'>) => void;
  completeHabit: (habitId: string) => void;
  resetAllData: () => void;
  updateLastMode: (mode: ThemeMode) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

// Provider
export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [appData, setAppData] = useState<AppData>(initialAppData);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Load data from storage
  const loadAppData = () => {
    try {
      const storedData = storage.getString('appData');
      if (storedData) {
        const parsedData = JSON.parse(storedData) as AppData;
        
        // Update current streak
        const streak = getDaysInStreak(parsedData.progress);
        parsedData.currentStreak = streak;
        
        setAppData(parsedData);
      } else {
        // Add some default habits for new users
        const defaultHabits: Habit[] = [
          { id: uuid(), name: 'Drink water', mode: 'both' },
          { id: uuid(), name: 'Meditate for 5 minutes', mode: 'relaxed' },
          { id: uuid(), name: 'Intense workout', mode: 'productive' },
        ];
        
        const newData = {
          ...initialAppData,
          habits: defaultHabits,
        };
        
        setAppData(newData);
        storage.set('appData', JSON.stringify(newData));
      }
    } catch (error) {
      console.error('Error loading app data:', error);
    }
  };
  
  const initializeAppData = () => {
    if (!isInitialized) {
      loadAppData();
      setIsInitialized(true);
    }
  };
  
  // Save data to storage
  const saveAppData = (data: AppData) => {
    try {
      storage.set('appData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving app data:', error);
    }
  };
  
  // Add a new habit
  const addHabit = (habit: Omit<Habit, 'id'>) => {
    const newHabit: Habit = {
      ...habit,
      id: uuid(),
    };
    
    const updatedData = {
      ...appData,
      habits: [...appData.habits, newHabit],
    };
    
    setAppData(updatedData);
    saveAppData(updatedData);
  };
  
  // Complete a habit
  const completeHabit = (habitId: string) => {
    const today = getCurrentDate();
    const todayProgress = appData.progress[today] || [];
    
    // Check if already completed
    if (todayProgress.includes(habitId)) {
      // Remove completion
      const updatedProgress = {
        ...appData.progress,
        [today]: todayProgress.filter(id => id !== habitId)
      };
      
      const updatedData = {
        ...appData,
        progress: updatedProgress,
      };
      
      // Recalculate streak
      const streak = getDaysInStreak(updatedProgress);
      updatedData.currentStreak = streak;
      
      setAppData(updatedData);
      saveAppData(updatedData);
    } else {
      // Add completion
      const updatedProgress = {
        ...appData.progress,
        [today]: [...todayProgress, habitId]
      };
      
      const updatedData = {
        ...appData,
        progress: updatedProgress,
      };
      
      // Recalculate streak
      const streak = getDaysInStreak(updatedProgress);
      updatedData.currentStreak = streak;
      
      setAppData(updatedData);
      saveAppData(updatedData);
    }
  };
  
  // Reset all data
  const resetAllData = () => {
    setAppData(initialAppData);
    saveAppData(initialAppData);
  };
  
  // Update last mode
  const updateLastMode = (mode: ThemeMode) => {
    const updatedData = {
      ...appData,
      lastMode: mode,
    };
    
    setAppData(updatedData);
    saveAppData(updatedData);
  };
  
  return (
    <AppDataContext.Provider value={{ 
      appData, 
      initializeAppData,
      addHabit, 
      completeHabit, 
      resetAllData,
      updateLastMode,
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

// Hook
export function useAppData() {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}