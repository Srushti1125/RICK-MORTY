import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useAppData } from './AppDataContext';

// Define theme types
export type ThemeMode = 'relaxed' | 'productive';

// Define theme interface
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    card: string;
    text: string;
    secondaryText: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    disabled: string;
    relaxed: string;
    productive: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  gradients: {
    background: string[];
    card: string[];
  };
  animation: {
    duration: number;
    easing: string;
  };
}

// Define relaxed and productive themes
const relaxedTheme: Theme = {
  colors: {
    primary: '#A3D8F4',      // pastel blue
    secondary: '#D6CDEA',    // pastel lavender
    background: '#F6F5FB',   // very soft pastel background
    card: '#FFFFFF',
    text: '#3B3B58',
    secondaryText: '#8888AA',
    border: '#E0E0F0',
    error: '#F28B82',
    success: '#81C995',
    warning: '#FFD966',
    disabled: '#DADDE9',
    relaxed: '#A3D8F4',
    productive: '#FEC89A',
  },
  fonts: {
    heading: 'Nunito-Bold',
    body: 'Nunito-Regular',
  },
  gradients: {
    background: ['#F6F5FB', '#98d8ef'], // soft pastel gradient
    card: ['#FFFFFF', '#F1F5F9'],
  },
  animation: {
    duration: 300,
    easing: 'ease',
  },
};

const productiveTheme: Theme = {
  colors: {
    primary: '#FF9F1C',      // bright orange
    secondary: '#FFBF69',    // light orange
    background: '#FFF3E2',   // soft orange-white
    card: '#FFE5B4',
    text: '#3B302A',
    secondaryText: '#7A6955',
    border: '#FFDCB6',
    error: '#EF476F',
    success: '#06D6A0',
    warning: '#FFD166',
    disabled: '#F0D3B8',
    relaxed: '#A3D8F4',
    productive: '#FF9F1C',
  },
  fonts: {
    heading: 'Montserrat-Bold',
    body: 'Montserrat-Regular',
  },
  gradients: {
    background: ['#FFF3E2', '#EC5228'], // warm orange gradient
    card: ['#FFEBD2', '#FFDAB9'],
  },
  animation: {
    duration: 200,
    easing: 'ease',
  },
};


// Create context
interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create provider
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { updateLastMode } = useAppData();
  const [themeMode, setThemeMode] = useState<ThemeMode>('relaxed');
  const [theme, setTheme] = useState<Theme>(relaxedTheme);
  
  // Update theme when mode changes
  useEffect(() => {
    setTheme(themeMode === 'relaxed' ? relaxedTheme : productiveTheme);
    updateLastMode(themeMode);
  }, [themeMode]);
  
  const toggleThemeMode = () => {
    setThemeMode(prevMode => (prevMode === 'relaxed' ? 'productive' : 'relaxed'));
  };
  
  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode, toggleThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Create hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}