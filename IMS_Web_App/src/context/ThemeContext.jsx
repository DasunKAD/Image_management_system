import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme] = useState('light'); // Can be extended for dark mode

  const value = {
    theme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
