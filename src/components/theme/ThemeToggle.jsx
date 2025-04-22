import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * ThemeToggle component for switching between light and dark themes
 */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  // Theme-based styling
  const backgroundColor = theme === 'dark' ? '#2d2d2d' : '#f9fafb';
  const borderColor = theme === 'dark' ? '#444444' : '#e5e7eb';
  const toggleColor = theme === 'dark' ? '#3b82f6' : '#3b82f6';
  const togglePosition = theme === 'dark' ? '22px' : '2px';
  
  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      style={{
        backgroundColor,
        borderColor,
        border: '1px solid',
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className="inline-block w-4 h-4 transform rounded-full transition-transform duration-200"
        style={{
          backgroundColor: toggleColor,
          transform: `translateX(${togglePosition})`,
        }}
      />
      <span className="absolute inset-0 flex items-center justify-between px-1.5">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`${theme === 'dark' ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`${theme === 'light' ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </span>
    </button>
  );
};

export default ThemeToggle;
