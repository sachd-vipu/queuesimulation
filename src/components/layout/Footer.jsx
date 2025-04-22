import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Footer component for the application
 * 
 * @param {Object} props
 */
const Footer = () => {
  const { theme } = useTheme();
  
  const backgroundColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
  const borderColor = theme === 'dark' ? '#444444' : '#e5e7eb';
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  const linkColor = theme === 'dark' ? '#3b82f6' : '#2563eb';
  
  return (
    <footer 
      className="w-full py-4 px-6 text-center text-sm"
      style={{
        backgroundColor,
        borderTop: `1px solid ${borderColor}`,
        color: textColor
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div>
          <p>Tandem Queue Simulation © {new Date().getFullYear()}</p>
        </div>
        <div className="mt-2 md:mt-0">
          <p>
            Created from project based on CSE 517 Performance Evaluation
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
