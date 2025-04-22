import React, { useEffect, useState } from 'react';
import { calculateLittleL, validateJacksonsTheorem } from '../../lib/simulationEngine';
import Tooltip from './components/ui/Tooltip';

/**
 * ValidationPanel component displays validation results using Little's Law
 * and Jackson's Theorem
 * 
 * @param {Object} props
 * @param {Object} props.simulationResults - Results from simulation
 * @param {Object} props.externalArrivalRates - External arrival rates
 * @param {Object} props.serviceRates - Service rates for each node
 * @param {Object} props.routingProbabilities - Routing probabilities
 * @param {Number} props.confidenceLevel - Confidence level
 * @param {String} props.theme - Current theme (light/dark)
 */
const ValidationPanel = ({ 
  simulationResults, 
  externalArrivalRates,
  serviceRates,
  routingProbabilities,
  confidenceLevel = 0.95, 
  theme 
}) => {
  const [littleResults, setLittleResults] = useState(null);
  const [jacksonResults, setJacksonResults] = useState(null);
  
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

    // Calculate Jackson's Theorem validation
    const jackson = validateJacksonsTheorem(
      simulationResults,
      serviceRates,
      externalArrivalRates,
      routingProbabilities
    );

    setJacksonResults(jackson);
  }, [simulationResults, externalArrivalRates, serviceRates, routingProbabilities, confidenceLevel]);

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
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-semibold">
          Validation Results
        </h3>
        <Tooltip 
          content="Validation results using Little's Law and Jackson's Theorem to verify simulation accuracy"
          position="right"
        >
          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </button>
        </Tooltip>
      </div>
      
      {!littleResults || !jacksonResults ? (
        <div className="text-center py-8">
          <p>Run a simulation to see validation results</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Little's Law Validation Section */}
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: cardBg,
              borderColor
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-lg font-medium">Little's Law Validation</h4>
              <Tooltip 
                content="Little's Law states that L = λW, where L is the average number of customers in the system, λ is the arrival rate, and W is the average time a customer spends in the system"
                position="right"
              >
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </button>
              </Tooltip>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Tooltip content="The theoretical value of L = λW">
                <div>
                  <p className="text-sm opacity-70">Little's L (λW)</p>
                  <p className="text-xl font-semibold">{littleResults.littleL.toFixed(4)}</p>
                </div>
              </Tooltip>
              <Tooltip content="The average number of jobs observed in the system during simulation">
                <div>
                  <p className="text-sm opacity-70">Simulated Average Jobs in System</p>
                  <p className="text-xl font-semibold">{littleResults.simulatedAverage.toFixed(4)}</p>
                </div>
              </Tooltip>
              <Tooltip content="The ratio between theoretical and simulated values. Should be close to 1 for a valid model">
                <div>
                  <p className="text-sm opacity-70">Ratio (Little's L / Simulated)</p>
                  <p className="text-xl font-semibold">{littleResults.ratio.toFixed(4)}</p>
                </div>
              </Tooltip>
              <Tooltip content="Percentage difference between theoretical and simulated values">
                <div>
                  <p className="text-sm opacity-70">Error Percentage</p>
                  <p 
                    className="text-xl font-semibold"
                    style={{ color: getStatusColor(littleResults.percentageError) }}
                  >
                    {littleResults.percentageError.toFixed(2)}%
                  </p>
                </div>
              </Tooltip>
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

          {/* Jackson's Theorem Validation Section */}
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: cardBg,
              borderColor
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-lg font-medium">Jackson's Theorem Validation</h4>
              <Tooltip 
                content="Jackson's Theorem states that in an open network of queues with Poisson arrivals and exponential service times, each node behaves as an independent M/M/c queue"
                position="right"
              >
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </button>
              </Tooltip>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Tooltip content="Average error across all nodes in the network">
                  <div>
                    <p className="text-sm opacity-70">Average Error</p>
                    <p 
                      className="text-xl font-semibold"
                      style={{ color: getStatusColor(jacksonResults.averageError) }}
                    >
                      {jacksonResults.averageError.toFixed(2)}%
                    </p>
                  </div>
                </Tooltip>
                <Tooltip content="Maximum error observed across all nodes">
                  <div>
                    <p className="text-sm opacity-70">Maximum Error</p>
                    <p 
                      className="text-xl font-semibold"
                      style={{ color: getStatusColor(jacksonResults.maxError) }}
                    >
                      {jacksonResults.maxError.toFixed(2)}%
                    </p>
                  </div>
                </Tooltip>
              </div>

              <div className="mt-4">
                <h5 className="text-md font-medium mb-2">Node-wise Validation</h5>
                <div className="space-y-2">
                  {Object.keys(jacksonResults.theoreticalUtilization).map(node => (
                    <div 
                      key={node}
                      className="p-2 rounded border"
                      style={{ borderColor }}
                    >
                      <p className="font-medium">Node {node}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <Tooltip content="Theoretical utilization based on Jackson's Theorem">
                          <div>
                            <p className="opacity-70">Theoretical Utilization</p>
                            <p>{jacksonResults.theoreticalUtilization[node].toFixed(4)}</p>
                          </div>
                        </Tooltip>
                        <Tooltip content="Actual utilization observed during simulation">
                          <div>
                            <p className="opacity-70">Simulated Utilization</p>
                            <p>{jacksonResults.simulatedUtilization[node].toFixed(4)}</p>
                          </div>
                        </Tooltip>
                        <Tooltip content="Percentage difference between theoretical and simulated utilization">
                          <div>
                            <p className="opacity-70">Error</p>
                            <p style={{ color: getStatusColor(jacksonResults.errors[node]) }}>
                              {jacksonResults.errors[node].toFixed(2)}%
                            </p>
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm">
                  <span className="font-medium">Interpretation:</span> {' '}
                  {jacksonResults.isValid
                    ? "The simulation closely matches Jackson's Theorem predictions, indicating a valid open queueing network."
                    : "The simulation shows deviation from Jackson's Theorem predictions. This may indicate non-exponential service times or other model assumptions not being met."
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: cardBg,
              borderColor
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-lg font-medium">Confidence Interval</h4>
              <Tooltip 
                content="The range within which the true mean sojourn time is expected to fall with the specified confidence level"
                position="right"
              >
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </button>
              </Tooltip>
            </div>
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
