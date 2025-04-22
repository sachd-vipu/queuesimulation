import React, { createContext, useContext } from 'react';

// Create context for theme
const ThemeContext = createContext();

/**
 * ThemeProvider component for managing theme state
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const ThemeProvider = ({ children }) => {
  // Always use dark theme
  const theme = 'dark';

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook for using theme context
 * 
 * @returns {Object} Theme context with theme state
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
