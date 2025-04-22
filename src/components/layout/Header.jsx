import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../theme/ThemeToggle';

/**
 * Header component for the application
 * 
 * @param {Object} props
 * @param {String} props.title - Application title
 */
const Header = ({ title = 'Tandem Queue Simulation' }) => {
  const { theme } = useTheme();
  
  // Theme-based styling
  const backgroundColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
  const borderColor = theme === 'dark' ? '#444444' : '#e5e7eb';
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  
  return (
    <header 
      className="sticky top-0 z-10 w-full py-4 px-6 flex items-center justify-between shadow-md"
      style={{
        backgroundColor,
        borderBottom: `1px solid ${borderColor}`,
        color: textColor
      }}
    >
      <div className="flex items-center">
        <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
      </div>
      
      {/*
      <div className="flex items-center space-x-4">
        <ThemeToggle />
      </div>
      */}

    </header>
  );
};

export default Header;
