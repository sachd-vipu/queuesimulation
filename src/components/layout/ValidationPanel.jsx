import React, { useEffect, useState } from 'react';
import { calculateLittleL } from '../../lib/simulationEngine';

/**
 * ValidationPanel component displays validation results using Little's Law
 * and Jackson's Theorem
 * 
 * @param {Object} props
 * @param {Object} props.simulationResults - Results from simulation
 * @param {Object} props.externalArrivalRates - External arrival rates
 * @param {Number} props.confidenceLevel - Confidence level
 * @param {String} props.theme - Current theme (light/dark)
 */
const ValidationPanel = ({ 
  simulationResults, 
  externalArrivalRates, 
  confidenceLevel = 0.95, 
  theme 
}) => {
  const [littleResults, setLittleResults] = useState(null);
  
  useEffect(() => {
    if (!simulationResults || !externalArrivalRates) return;

    // Calculate Little's Law validation
    const littleL = calculateLittleL(
      simulationResults,
      externalArrivalRates,
      simulationResults.meanSojournTime,
      confidenceLevel
    );
    
    setLittleResults(littleL);
  }, [simulationResults, externalArrivalRates, confidenceLevel]);

  // Theme-based styling
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  const backgroundColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
  const borderColor = theme === 'dark' ? '#444444' : '#e5e7eb';
  const cardBg = theme === 'dark' ? '#2d2d2d' : '#f9fafb';

  // Helper function to determine status color
  const getStatusColor = (error) => {
    if (error < 5) return theme === 'dark' ? '#4ade80' : '#22c55e'; // Green
    if (error < 15) return theme === 'dark' ? '#facc15' : '#eab308'; // Yellow
    return theme === 'dark' ? '#f87171' : '#ef4444'; // Red
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
        Validation Results
      </h3>
      
      {!littleResults ? (
        <div className="text-center py-8">
          <p>Run a simulation to see validation results</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: cardBg,
              borderColor
            }}
          >
            <h4 className="text-lg font-medium mb-2">Little's Law Validation</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm opacity-70">Little's L (λW)</p>
                <p className="text-xl font-semibold">{littleResults.littleL.toFixed(4)}</p>
              </div>
              <div>
                <p className="text-sm opacity-70">Simulated Average Jobs in System</p>
                <p className="text-xl font-semibold">{littleResults.simulatedAverage.toFixed(4)}</p>
              </div>
              <div>
                <p className="text-sm opacity-70">Ratio (Little's L / Simulated)</p>
                <p className="text-xl font-semibold">{littleResults.ratio.toFixed(4)}</p>
              </div>
              <div>
                <p className="text-sm opacity-70">Error Percentage</p>
                <p 
                  className="text-xl font-semibold"
                  style={{ color: getStatusColor(littleResults.percentageError) }}
                >
                  {littleResults.percentageError.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm">
                <span className="font-medium">Interpretation:</span> {' '}
                {littleResults.percentageError < 5 
                  ? "The simulation closely matches Little's Law, indicating a valid model."
                  : littleResults.percentageError < 15
                    ? "The simulation shows moderate agreement with Little's Law."
                    : "The simulation shows significant deviation from Little's Law, suggesting potential issues with the model or parameters."
                }
              </p>
            </div>
          </div>
          
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: cardBg,
              borderColor
            }}
          >
            <h4 className="text-lg font-medium mb-2">Confidence Interval</h4>
            <p className="text-xl font-semibold">
              {simulationResults.meanSojournTime.toFixed(4)} ± {simulationResults.confidenceInterval.toFixed(4)}
            </p>
            <p className="text-sm mt-2">
              Mean sojourn time with {confidenceLevel * 100}% confidence interval
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationPanel;
