import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

/**
 * ComparisonPanel component displays comparison between current and previous simulation runs
 * 
 * @param {Object} props
 * @param {Object} props.currentResults - Current simulation results
 * @param {Array} props.previousResults - Array of previous simulation results (max 2)
 * @param {String} props.theme - Current theme (light/dark)
 */
const ComparisonPanel = ({ currentResults, previousResults = [], theme }) => {
  const [queueLengthData, setQueueLengthData] = useState([]);
  const [sojournTimeData, setSojournTimeData] = useState([]);
  const [utilizationData, setUtilizationData] = useState([]);
  
  // Colors for different simulation runs
  const runColors = ['#8884d8', '#82ca9d', '#ffc658'];
  
  useEffect(() => {
    if (!currentResults) return;
    
    // Prepare all results for comparison
    const allResults = [currentResults, ...previousResults].slice(0, 3);
    
    // Process queue length data
    const processQueueLengthData = () => {
      // Find all node IDs across all results
      const allNodeIds = new Set();
      allResults.forEach(result => {
        if (result && result.nodeStats) {
          Object.keys(result.nodeStats).forEach(nodeId => allNodeIds.add(nodeId));
        }
      });
      
      // Calculate average queue length for each node in each run
      const data = [];
      allNodeIds.forEach(nodeId => {
        const entry = { name: `Node ${nodeId}` };
        
        allResults.forEach((result, index) => {
          if (result && result.nodeStats && result.nodeStats[nodeId]) {
            const queueLengths = result.nodeStats[nodeId].queueLengths;
            const avg = queueLengths.length > 0 
              ? queueLengths.reduce((sum, len) => sum + len, 0) / queueLengths.length 
              : 0;
            entry[`run${index}`] = avg;
          } else {
            entry[`run${index}`] = 0;
          }
        });
        
        data.push(entry);
      });
      
      return data;
    };
    
    // Process sojourn time data
    const processSojournTimeData = () => {
      return allResults.map((result, index) => ({
        name: `Run ${index}`,
        value: result ? result.meanSojournTime : 0,
        error: result ? result.confidenceInterval : 0
      }));
    };
    
    // Process utilization data
    const processUtilizationData = () => {
      // Find all node IDs across all results
      const allNodeIds = new Set();
      allResults.forEach(result => {
        if (result && result.utilizations) {
          Object.keys(result.utilizations).forEach(nodeId => allNodeIds.add(nodeId));
        }
      });
      
      // Create utilization data for each node
      const data = [];
      allNodeIds.forEach(nodeId => {
        const entry = { name: `Node ${nodeId}` };
        
        allResults.forEach((result, index) => {
          if (result && result.utilizations && result.utilizations[nodeId] !== undefined) {
            entry[`run${index}`] = result.utilizations[nodeId];
          } else {
            entry[`run${index}`] = 0;
          }
        });
        
        data.push(entry);
      });
      
      return data;
    };
    
    setQueueLengthData(processQueueLengthData());
    setSojournTimeData(processSojournTimeData());
    setUtilizationData(processUtilizationData());
  }, [currentResults, previousResults]);

  // Theme-based styling
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  const gridColor = theme === 'dark' ? '#444444' : '#cccccc';
  const backgroundColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
  const cardBg = theme === 'dark' ? '#2d2d2d' : '#f9fafb';
  const borderColor = theme === 'dark' ? '#444444' : '#e5e7eb';

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
        Simulation Results Comparison
      </h3>
      
      {!currentResults ? (
        <div className="text-center py-8">
          <p>Run a simulation to see comparison results</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Sojourn Time Comparison */}
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: cardBg,
              borderColor
            }}
          >
            <h4 className="text-lg font-medium mb-4">Mean Sojourn Time Comparison</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sojournTimeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" stroke={textColor} />
                  <YAxis stroke={textColor} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: backgroundColor, 
                      borderColor: gridColor,
                      color: textColor
                    }}
                    formatter={(value) => [`${value.toFixed(4)}`, 'Value']}
                  />
                  <Legend wrapperStyle={{ color: textColor }} />
                  <Bar dataKey="value" name="Mean Sojourn Time" fill={runColors[0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Queue Length Comparison */}
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: cardBg,
              borderColor
            }}
          >
            <h4 className="text-lg font-medium mb-4">Average Queue Length Comparison</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={queueLengthData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" stroke={textColor} />
                  <YAxis stroke={textColor} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: backgroundColor, 
                      borderColor: gridColor,
                      color: textColor
                    }}
                    formatter={(value, name) => [`${value.toFixed(2)}`, name.replace('run', 'Run ')]}
                  />
                  <Legend 
                    wrapperStyle={{ color: textColor }}
                    formatter={(value) => value.replace('run', 'Run ')}
                  />
                  {[0, 1, 2].map((index) => (
                    previousResults.length >= index || index === 0 ? (
                      <Bar 
                        key={`run${index}`}
                        dataKey={`run${index}`} 
                        name={`Run ${index}`} 
                        fill={runColors[index]} 
                      />
                    ) : null
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Utilization Comparison */}
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: cardBg,
              borderColor
            }}
          >
            <h4 className="text-lg font-medium mb-4">Utilization Comparison</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={utilizationData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" stroke={textColor} />
                  <YAxis 
                    stroke={textColor} 
                    domain={[0, 1]}
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: backgroundColor, 
                      borderColor: gridColor,
                      color: textColor
                    }}
                    formatter={(value, name) => [
                      `${(value * 100).toFixed(2)}%`, 
                      name.replace('run', 'Run ')
                    ]}
                  />
                  <Legend 
                    wrapperStyle={{ color: textColor }}
                    formatter={(value) => value.replace('run', 'Run ')}
                  />
                  {[0, 1, 2].map((index) => (
                    previousResults.length >= index || index === 0 ? (
                      <Bar 
                        key={`run${index}`}
                        dataKey={`run${index}`} 
                        name={`Run ${index}`} 
                        fill={runColors[index]} 
                      />
                    ) : null
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonPanel;
