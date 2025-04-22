import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context for theme
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

/**
 * ThemeProvider component for managing theme state
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('queueSimTheme');
    return savedTheme || 'light';
  });

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('queueSimTheme', newTheme);
  };

  // Apply theme to document body
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    document.body.style.backgroundColor = theme === 'dark' ? '#121212' : '#f8f9fa';
    document.body.style.color = theme === 'dark' ? '#ffffff' : '#000000';
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook for using theme context
 * 
 * @returns {Object} Theme context with theme state and toggle function
 */
export const useTheme = () => useContext(ThemeContext);
