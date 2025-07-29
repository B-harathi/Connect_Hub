import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { getStoredTheme, setStoredTheme, applyTheme, getSystemTheme } from '../utils/helpers';

// Theme context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getStoredTheme());
  const [systemTheme, setSystemTheme] = useState(getSystemTheme());

  // Initialize theme on mount
  useEffect(() => {
    try {
      const storedTheme = getStoredTheme();
      setTheme(storedTheme);
      
      const appliedTheme = storedTheme === 'system' ? getSystemTheme() : storedTheme;
      applyTheme(appliedTheme);
    } catch (error) {
      console.error('Error initializing theme:', error);
      // Fallback to light theme
      setTheme('light');
      applyTheme('light');
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);
      
      // If current theme is 'system', apply the new system theme
      if (theme === 'system') {
        applyTheme(newSystemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  // Change theme function
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    setStoredTheme(newTheme);
    
    const appliedTheme = newTheme === 'system' ? systemTheme : newTheme;
    applyTheme(appliedTheme);
  };

  // Computed values using useMemo
  const currentTheme = useMemo(() => {
    return theme === 'system' ? systemTheme : theme;
  }, [theme, systemTheme]);

  const isDarkMode = useMemo(() => {
    return currentTheme === 'dark';
  }, [currentTheme]);

  const value = {
    theme,
    systemTheme,
    currentTheme,
    isDarkMode,
    changeTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default ThemeContext; 