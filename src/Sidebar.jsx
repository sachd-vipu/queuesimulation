import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Sidebar component for the application
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {Boolean} props.isOpen - Whether sidebar is open on mobile
 * @param {Function} props.onClose - Callback when sidebar is closed
 */
const Sidebar = ({ children, isOpen = true, onClose }) => {
  const { theme } = useTheme();
  
  // Theme-based styling
  const backgroundColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
  const borderColor = theme === 'dark' ? '#444444' : '#e5e7eb';
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  
  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full w-80 z-30 transform transition-transform duration-300 md:relative md:translate-x-0 md:z-0 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor,
          borderRight: `1px solid ${borderColor}`,
          color: textColor
        }}
      >
        <div className="p-4 h-full">
          {/* Close button (mobile only) */}
          <button 
            className="md:hidden absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          {/* Sidebar content */}
          <div className="mt-8 md:mt-0">
            {children}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
