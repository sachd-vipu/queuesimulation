import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * MainContent component for the application
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
const MainContent = ({ children }) => {
  const { theme } = useTheme();
  
  // Theme-based styling
  const backgroundColor = theme === 'dark' ? '#121212' : '#f8f9fa';
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  
  return (
    <main 
      className="flex-1 p-4 md:p-6 overflow-y-auto"
      style={{
        backgroundColor,
        color: textColor
      }}
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  );
};

export default MainContent;
