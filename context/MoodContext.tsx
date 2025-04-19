import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { growthTheme, actionTheme } from '@/constants/Themes';

type MoodType = 'growth' | 'action';

interface MoodContextType {
  currentMood: MoodType;
  theme: typeof growthTheme | typeof actionTheme;
  toggleMood: () => void;
  setMood: (mood: MoodType) => void;
}

export const MoodContext = createContext<MoodContextType>({
  currentMood: 'growth',
  theme: growthTheme,
  toggleMood: () => {},
  setMood: () => {},
});

interface MoodProviderProps {
  children: React.ReactNode;
}

export const MoodProvider = ({ children }: MoodProviderProps) => {
  const [currentMood, setCurrentMood] = useState<MoodType>('growth');
  const [theme, setTheme] = useState(growthTheme);

  useEffect(() => {
    // Load saved mood from storage
    const loadMood = async () => {
      try {
        const savedMood = await AsyncStorage.getItem('currentMood');
        if (savedMood) {
          setMood(savedMood as MoodType);
        }
      } catch (error) {
        console.error('Failed to load mood:', error);
      }
    };

    loadMood();
  }, []);

  const setMood = (mood: MoodType) => {
    setCurrentMood(mood);
    setTheme(mood === 'growth' ? growthTheme : actionTheme);
    
    // Save mood to storage
    AsyncStorage.setItem('currentMood', mood).catch(error => {
      console.error('Failed to save mood:', error);
    });
  };

  const toggleMood = () => {
    const newMood = currentMood === 'growth' ? 'action' : 'growth';
    setMood(newMood);
  };

  return (
    <MoodContext.Provider value={{ currentMood, theme, toggleMood, setMood }}>
      {children}
    </MoodContext.Provider>
  );
};