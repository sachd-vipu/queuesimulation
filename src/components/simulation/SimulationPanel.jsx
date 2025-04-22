import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Helper function for random number generation
const generateRandomSample = (distribution, params) => {
  if (distribution === 'exponential') {
    const mean = params.mean;
    return -mean * Math.log(1 - Math.random());
  }
  return params.mean;
};

const SimulationPanel = ({ config, isSimulating, onResultsUpdate, onSimulationComplete }) => {
  const { theme } = useTheme();
  const [data, setData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [showCompletionBanner, setShowCompletionBanner] = useState(false);
  const simulationRef = useRef(null);
  const timeoutRef = useRef(null);

  // Modern dark theme colors
  const chartBg = 'rgba(6, 11, 40, 0.74)';
  const borderColor = 'rgba(255, 255, 255, 0.1)';
  const textColor = '#fff';
  const gridColor = 'rgba(255, 255, 255, 0.1)';
  const tooltipBg = 'rgba(11, 20, 55, 0.95)';

  useEffect(() => {
    // Reset states when simulation starts
    if (isSimulating) {
      setShowCompletionBanner(false);
      setData([]);
      setProgress(0);
    }
  }, [isSimulating]);

  useEffect(() => {
    if (isSimulating) {
      let currentTime = 0;
      const timeStep = 0.1;
      const maxTime = config.timeLimit;
      
      // Initialize simulation state with additional tracking
      const simState = {
        queue: [],
        busy: false,
        jobsServed: 0,
        totalWaitTime: 0,
        totalSojournTime: 0,
        lastEventTime: 0,
        inServiceJob: null,
        totalTimeIntegratedQueue: 0,
        lastQueueUpdate: 0,
        totalBusyTime: 0,
        lastBusyStateChange: 0
      };

      const runStep = () => {
        // Update busy time tracking
        if (simState.busy) {
          simState.totalBusyTime += currentTime - simState.lastBusyStateChange;
        }
        simState.lastBusyStateChange = currentTime;

        if (currentTime >= maxTime) {  // Changed from > to >= to prevent getting stuck
          // Update final time-integrated queue length
          simState.totalTimeIntegratedQueue += simState.queue.length * (currentTime - simState.lastQueueUpdate);
          
          const finalStats = data.reduce((acc, point) => {
            return {
              totalQueueLength: acc.totalQueueLength + point.queueLength,
              totalUtilization: acc.totalUtilization + point.utilization,
              count: acc.count + 1
            };
          }, { totalQueueLength: 0, totalUtilization: 0, count: 0 });

          // Calculate Little's Law metrics
          const avgSojournTime = simState.jobsServed > 0 ? simState.totalSojournTime / simState.jobsServed : 0;
          const observedL = simState.totalTimeIntegratedQueue / currentTime;
          const throughputRate = simState.jobsServed / currentTime;
          const expectedL = throughputRate * avgSojournTime;
          const littleError = observedL > 0 ? Math.abs((expectedL - observedL) / observedL) * 100 : 0;

          // Calculate actual utilization based on total busy time
          const actualUtilization = (simState.totalBusyTime / currentTime) * 100;
          
          onResultsUpdate({
            averageQueueLength: finalStats.totalQueueLength / finalStats.count,
            utilization: actualUtilization,  // Now in percentage
            averageWaitingTime: simState.jobsServed > 0 ? simState.totalWaitTime / simState.jobsServed : 0,
            averageSojournTime: avgSojournTime,
            throughput: throughputRate,
            observedL: observedL,
            expectedL: expectedL,
            littleError: littleError,
            queueLengthCI: 0,
            sojournTimeCI: 0
          });

          // Show completion banner and reset simulation state
          setShowCompletionBanner(true);
          if (onSimulationComplete) {
            onSimulationComplete();
          }
          return;
        }

        // Update time-integrated queue length
        simState.totalTimeIntegratedQueue += simState.queue.length * (currentTime - simState.lastQueueUpdate);
        simState.lastQueueUpdate = currentTime;

        // Process arrivals
        const arrivalTime = generateRandomSample('exponential', { mean: 1/config.arrivalRate });
        if (Math.random() < (timeStep / arrivalTime)) {
          simState.queue.push({
            arrivalTime: currentTime,
            serviceStartTime: null
          });
        }

        // Process service completions if server is busy
        if (simState.busy && simState.inServiceJob) {
          const serviceTime = generateRandomSample('exponential', { mean: 1/config.serviceRate });
          if (currentTime - simState.lastEventTime >= serviceTime) {
            // Complete current job
            const completedJob = simState.inServiceJob;
            const sojournTime = currentTime - completedJob.arrivalTime;
            const waitTime = completedJob.serviceStartTime - completedJob.arrivalTime;
            
            simState.totalSojournTime += sojournTime;
            simState.totalWaitTime += waitTime;
            simState.jobsServed++;
            
            // Start next job if queue not empty
            if (simState.queue.length > 0) {
              simState.inServiceJob = simState.queue.shift();
              simState.inServiceJob.serviceStartTime = currentTime;
            } else {
              simState.busy = false;
              simState.inServiceJob = null;
            }
            simState.lastEventTime = currentTime;
          }
        } else if (simState.queue.length > 0 && !simState.busy) {
          // Start serving if server is idle and queue is not empty
          simState.busy = true;
          simState.inServiceJob = simState.queue.shift();
          simState.inServiceJob.serviceStartTime = currentTime;
          simState.lastEventTime = currentTime;
        }

        // Create new data point
        const newDataPoint = {
          time: Number(currentTime.toFixed(1)),
          queueLength: simState.queue.length,
          utilization: (simState.totalBusyTime / currentTime) * 100,  // Now in percentage
          throughput: simState.jobsServed / Math.max(currentTime, 0.001),
          waitingTime: simState.jobsServed > 0 ? simState.totalWaitTime / simState.jobsServed : 0,
          sojournTime: simState.jobsServed > 0 ? simState.totalSojournTime / simState.jobsServed : 0
        };

        setData(prevData => [...prevData, newDataPoint]);
        setProgress((currentTime / maxTime) * 100);

        currentTime += timeStep;
        timeoutRef.current = setTimeout(runStep, 50);
      };

      // Start simulation
      runStep();

      // Cleanup
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setData([]);
        setProgress(0);
      };
    }
  }, [isSimulating, config]);

  return (
    <div className="dashboard-card p-6 space-y-6 relative">
      {/* Completion Banner */}
      {showCompletionBanner && (
        <div className="absolute top-0 left-0 right-0 bg-green-500 text-white py-2 px-4 rounded-t-lg text-center font-medium animate-fade-in">
          Simulation Complete
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Simulation Progress</h2>
        <span className="text-sm font-medium text-blue-400">{progress.toFixed(1)}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-900 rounded-full h-2 mb-8">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ 
            width: `${progress}%`,
            animation: 'progress 0.5s ease'
          }}
        />
      </div>

      {/* Charts without grid lines */}
      <div className="chart-grid grid-cols-1 lg:grid-cols-2">
        {/* Queue Length Chart */}
        <div className="dashboard-card">
          <h3 className="text-lg font-medium mb-4 text-white px-4 pt-4">Queue Length Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis 
                  dataKey="time" 
                  stroke={textColor}
                  label={{ value: 'Time', position: 'insideBottom', offset: -5, fill: textColor }}
                  ticks={Array.from({length: Math.ceil(config.timeLimit/10) + 1}, (_, i) => i * 10)}
                  domain={[0, config.timeLimit]}
                />
                <YAxis 
                  stroke={textColor}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: tooltipBg,
                    borderColor: borderColor,
                    color: textColor,
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: textColor }}
                />
                <Line 
                  type="monotone" 
                  dataKey="queueLength" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Utilization Chart */}
        <div className="dashboard-card">
          <h3 className="text-lg font-medium mb-4 text-white px-4 pt-4">Server Utilization (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis 
                  dataKey="time" 
                  stroke={textColor}
                  label={{ value: 'Time', position: 'insideBottom', offset: -5, fill: textColor }}
                  ticks={Array.from({length: Math.ceil(config.timeLimit/10) + 1}, (_, i) => i * 10)}
                  domain={[0, config.timeLimit]}
                />
                <YAxis 
                  stroke={textColor}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: tooltipBg,
                    borderColor: borderColor,
                    color: textColor,
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: textColor }}
                />
                <Line 
                  type="monotone" 
                  dataKey="utilization" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Throughput Chart */}
        <div className="dashboard-card">
          <h3 className="text-lg font-medium mb-4 text-white px-4 pt-4">System Throughput</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis 
                  dataKey="time" 
                  stroke={textColor}
                  label={{ value: 'Time', position: 'insideBottom', offset: -5, fill: textColor }}
                  ticks={Array.from({length: Math.ceil(config.timeLimit/10) + 1}, (_, i) => i * 10)}
                  domain={[0, config.timeLimit]}
                />
                <YAxis 
                  stroke={textColor}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: tooltipBg,
                    borderColor: borderColor,
                    color: textColor,
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: textColor }}
                />
                <Line 
                  type="monotone" 
                  dataKey="throughput" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waiting Time Chart */}
        <div className="dashboard-card">
          <h3 className="text-lg font-medium mb-4 text-white px-4 pt-4">Average Waiting Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis 
                  dataKey="time" 
                  stroke={textColor}
                  label={{ value: 'Time', position: 'insideBottom', offset: -5, fill: textColor }}
                  ticks={Array.from({length: Math.ceil(config.timeLimit/10) + 1}, (_, i) => i * 10)}
                  domain={[0, config.timeLimit]}
                />
                <YAxis 
                  stroke={textColor}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: tooltipBg,
                    borderColor: borderColor,
                    color: textColor,
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: textColor }}
                />
                <Line 
                  type="monotone" 
                  dataKey="waitingTime" 
                  stroke="#EC4899" 
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationPanel; 