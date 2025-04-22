import React, { useState } from 'react';

/**
 * SimulationControlPanel component for controlling simulation execution
 * 
 * @param {Object} props
 * @param {Boolean} props.isRunning - Whether simulation is currently running
 * @param {Function} props.onStart - Callback when simulation starts
 * @param {Function} props.onPause - Callback when simulation pauses
 * @param {Function} props.onReset - Callback when simulation resets
 * @param {Number} props.simulationPeriod - Total simulation period
 * @param {Function} props.onSimulationPeriodChange - Callback when simulation period changes
 * @param {Number} props.warmupPeriod - Warmup period
 * @param {Function} props.onWarmupPeriodChange - Callback when warmup period changes
 * @param {Number} props.confidenceLevel - Confidence level for intervals
 * @param {Function} props.onConfidenceLevelChange - Callback when confidence level changes
 * @param {Number} props.simulationSpeed - Simulation speed multiplier
 * @param {Function} props.onSimulationSpeedChange - Callback when simulation speed changes
 * @param {Number} props.simulationProgress - Current simulation progress (0-100)
 * @param {String} props.theme - Current theme (light/dark)
 */
const SimulationControlPanel = ({ 
  isRunning = false,
  onStart,
  onPause,
  onReset,
  simulationPeriod = 100,
  onSimulationPeriodChange,
  warmupPeriod = 10,
  onWarmupPeriodChange,
  confidenceLevel = 0.95,
  onConfidenceLevelChange,
  simulationSpeed = 1,
  onSimulationSpeedChange,
  simulationProgress = 0,
  theme 
}) => {
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  const backgroundColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
  const borderColor = theme === 'dark' ? '#444444' : '#e5e7eb';
  const cardBg = theme === 'dark' ? '#2d2d2d' : '#f9fafb';
  const inputBg = theme === 'dark' ? '#374151' : '#f9fafb';
  const progressBg = theme === 'dark' ? '#4b5563' : '#e5e7eb';
  const progressFill = theme === 'dark' ? '#3b82f6' : '#3b82f6';
  
  const buttonStyles = {
    start: {
      backgroundColor: '#10b981', // Green
      color: '#ffffff',
      opacity: isRunning ? 0.5 : 1,
      cursor: isRunning ? 'not-allowed' : 'pointer'
    },
    pause: {
      backgroundColor: '#f59e0b', // Amber
      color: '#ffffff',
      opacity: !isRunning ? 0.5 : 1,
      cursor: !isRunning ? 'not-allowed' : 'pointer'
    },
    reset: {
      backgroundColor: '#ef4444', // Red
      color: '#ffffff'
    }
  };
  
  return (
    <div 
      className="w-full p-4 rounded-lg border"
      style={{ 
        backgroundColor, 
        color: textColor,
        borderColor
      }}
    >
      <h3 className="text-xl font-semibold mb-4">
        Simulation Controls
      </h3>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>Simulation Progress</span>
          <span>{simulationProgress.toFixed(1)}%</span>
        </div>
        <div 
          className="w-full h-4 rounded-full overflow-hidden"
          style={{ backgroundColor: progressBg }}
        >
          <div 
            className="h-full transition-all duration-300 ease-in-out"
            style={{ 
              width: `${simulationProgress}%`,
              backgroundColor: progressFill
            }}
          />
        </div>
      </div>
      
      {/* Control Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={onStart}
          disabled={isRunning}
          className="flex-1 py-2 px-4 rounded-md font-medium"
          style={buttonStyles.start}
        >
          Start
        </button>
        <button
          onClick={onPause}
          disabled={!isRunning}
          className="flex-1 py-2 px-4 rounded-md font-medium"
          style={buttonStyles.pause}
        >
          Pause
        </button>
        <button
          onClick={onReset}
          className="flex-1 py-2 px-4 rounded-md font-medium"
          style={buttonStyles.reset}
        >
          Reset
        </button>
      </div>
      
      {/* Simulation Parameters */}
      <div 
        className="p-4 rounded-lg border space-y-4"
        style={{ 
          backgroundColor: cardBg,
          borderColor
        }}
      >
        <h4 className="text-lg font-medium">Simulation Parameters</h4>
        
        {/* Simulation Period */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <label htmlFor="simulation-period">Simulation Period</label>
            <span>{simulationPeriod} seconds</span>
          </div>
          <input
            id="simulation-period"
            type="range"
            min="10"
            max="1000"
            step="10"
            value={simulationPeriod}
            onChange={(e) => onSimulationPeriodChange(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs opacity-70">
            <span>10s</span>
            <span>1000s</span>
          </div>
        </div>
        
        {/* Warmup Period */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <label htmlFor="warmup-period">Warmup Period</label>
            <span>{warmupPeriod} seconds</span>
          </div>
          <input
            id="warmup-period"
            type="range"
            min="0"
            max={Math.max(100, simulationPeriod / 2)}
            step="5"
            value={warmupPeriod}
            onChange={(e) => onWarmupPeriodChange(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs opacity-70">
            <span>0s</span>
            <span>{Math.max(100, simulationPeriod / 2)}s</span>
          </div>
        </div>
        
        {/* Confidence Level */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <label htmlFor="confidence-level">Confidence Level</label>
            <span>{(confidenceLevel * 100).toFixed(0)}%</span>
          </div>
          <input
            id="confidence-level"
            type="range"
            min="0.8"
            max="0.99"
            step="0.01"
            value={confidenceLevel}
            onChange={(e) => onConfidenceLevelChange(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs opacity-70">
            <span>80%</span>
            <span>99%</span>
          </div>
        </div>
        
        {/* Simulation Speed */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <label htmlFor="simulation-speed">Simulation Speed</label>
            <span>{simulationSpeed}x</span>
          </div>
          <input
            id="simulation-speed"
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={simulationSpeed}
            onChange={(e) => onSimulationSpeedChange(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs opacity-70">
            <span>0.1x</span>
            <span>10x</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm opacity-70">
        <p>Notes:</p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>Warmup period data is collected but not used in statistics</li>
          <li>Higher confidence levels require more samples for accurate results</li>
          <li>Simulation updates every 10ms as requested</li>
        </ul>
      </div>
    </div>
  );
};

export default SimulationControlPanel;
