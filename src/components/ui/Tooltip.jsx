import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Tooltip component for displaying help information
 * @param {Object} props
 * @param {React.ReactNode} props.children - The element to attach the tooltip to
 * @param {string} props.content - The tooltip content
 * @param {string} props.position - The tooltip position ('top', 'bottom', 'left', 'right')
 */
const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();

  // Theme-based styling
  const backgroundColor = theme === 'dark' ? '#2d2d2d' : '#ffffff';
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  const borderColor = theme === 'dark' ? '#444444' : '#e5e7eb';
  const shadowColor = theme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)';

  // Position-based styling
  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px',
        };
      case 'bottom':
        return {
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '8px',
        };
      case 'left':
        return {
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: '8px',
        };
      case 'right':
        return {
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '8px',
        };
      default:
        return {};
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className="absolute z-50 px-3 py-2 text-sm rounded-lg whitespace-nowrap"
          style={{
            backgroundColor,
            color: textColor,
            border: `1px solid ${borderColor}`,
            boxShadow: `0 4px 6px ${shadowColor}`,
            ...getPositionStyles(),
          }}
        >
          {content}
          <div
            className="absolute w-2 h-2 transform rotate-45"
            style={{
              backgroundColor,
              border: `1px solid ${borderColor}`,
              ...(position === 'top' && {
                bottom: '-5px',
                left: '50%',
                transform: 'translateX(-50%) rotate(45deg)',
                borderTop: 'none',
                borderLeft: 'none',
              }),
              ...(position === 'bottom' && {
                top: '-5px',
                left: '50%',
                transform: 'translateX(-50%) rotate(45deg)',
                borderBottom: 'none',
                borderRight: 'none',
              }),
              ...(position === 'left' && {
                right: '-5px',
                top: '50%',
                transform: 'translateY(-50%) rotate(45deg)',
                borderTop: 'none',
                borderRight: 'none',
              }),
              ...(position === 'right' && {
                left: '-5px',
                top: '50%',
                transform: 'translateY(-50%) rotate(45deg)',
                borderBottom: 'none',
                borderLeft: 'none',
              }),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip; 