import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex';

const ResultsPanel = ({ results, config }) => {
  const { theme } = useTheme();
  
  // Theme-based styling
  const backgroundColor = theme === 'dark' ? '#1e293b' : '#ffffff';
  const borderColor = theme === 'dark' ? '#334155' : '#e2e8f0';
  const cardBg = theme === 'dark' ? '#334155' : '#f8fafc';

  // Calculate theoretical values
  const rho = config.arrivalRate / (config.numServers * config.serviceRate);
  const L = rho / (1 - rho); // Expected number in system (M/M/1)
  const Lq = Math.pow(rho, 2) / (1 - rho); // Expected number in queue
  const W = 1 / (config.serviceRate - config.arrivalRate); // Expected time in system
  const Wq = rho / (config.serviceRate - config.arrivalRate); // Expected time in queue

  // Format number with specified decimal places
  const format = (num, decimals = 4) => Number(num).toFixed(decimals);

  return (
    <div
      className="rounded-lg border p-4 space-y-6"
      style={{ 
        backgroundColor,
        borderColor
      }}
    >
      <h2 className="text-xl font-semibold">Simulation Results</h2>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          className="p-4 rounded-lg"
          style={{ backgroundColor: cardBg }}
        >
          <h3 className="text-sm font-medium opacity-70">Average Queue Length</h3>
          <div className="mt-2 space-y-1">
            <p className="text-2xl font-semibold">{format(results.averageQueueLength)}</p>
            <p className="text-sm opacity-70">
              Theoretical: {format(Lq)}
            </p>
          </div>
        </div>

        <div 
          className="p-4 rounded-lg"
          style={{ backgroundColor: cardBg }}
        >
          <h3 className="text-sm font-medium opacity-70">System Utilization</h3>
          <div className="mt-2 space-y-1">
            <p className="text-2xl font-semibold">{format(results.utilization * 100)}%</p>
            <p className="text-sm opacity-70">
              Theoretical: {format(rho * 100)}%
            </p>
          </div>
        </div>

        <div 
          className="p-4 rounded-lg"
          style={{ backgroundColor: cardBg }}
        >
          <h3 className="text-sm font-medium opacity-70">Average Waiting Time</h3>
          <div className="mt-2 space-y-1">
            <p className="text-2xl font-semibold">{format(results.averageWaitingTime)}</p>
            <p className="text-sm opacity-70">
              Theoretical: {format(Wq)}
            </p>
          </div>
        </div>

        <div 
          className="p-4 rounded-lg"
          style={{ backgroundColor: cardBg }}
        >
          <h3 className="text-sm font-medium opacity-70">Average Sojourn Time</h3>
          <div className="mt-2 space-y-1">
            <p className="text-2xl font-semibold">{format(results.averageSojournTime)}</p>
            <p className="text-sm opacity-70">
              Theoretical: {format(W)}
            </p>
          </div>
        </div>
      </div>

      {/* Validation Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Validation</h3>

        {/* Little's Law */}
        <div 
          className="p-4 rounded-lg"
          style={{ backgroundColor: cardBg }}
        >
          <h4 className="text-md font-medium mb-2">Little's Law</h4>
          <div className="space-y-2">
            <p className="text-sm">
              <Latex>{'$L = \\lambda W$'}</Latex> states that the average number of customers in the system (L) equals the arrival rate (λ) multiplied by the average time a customer spends in the system (W).
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm opacity-70">Observed L</p>
                <p className="text-lg font-semibold">{format(results.averageSystemLength)}</p>
              </div>
              <div>
                <p className="text-sm opacity-70">Expected L (λW)</p>
                <p className="text-lg font-semibold">{format(config.arrivalRate * results.averageSojournTime)}</p>
              </div>
            </div>
            <p className="text-sm mt-2">
              Error: {format(Math.abs(results.averageSystemLength - config.arrivalRate * results.averageSojournTime) / results.averageSystemLength * 100)}%
            </p>
          </div>
        </div>

        {/* Confidence Intervals */}
        <div 
          className="p-4 rounded-lg"
          style={{ backgroundColor: cardBg }}
        >
          <h4 className="text-md font-medium mb-2">95% Confidence Intervals</h4>
          <div className="space-y-4">
            <div>
              <p className="text-sm opacity-70">Mean Sojourn Time</p>
              <p className="text-lg font-semibold">
                {format(results.averageSojournTime)} ± {format(results.sojournTimeCI)}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-70">Mean Queue Length</p>
              <p className="text-lg font-semibold">
                {format(results.averageQueueLength)} ± {format(results.queueLengthCI)}
              </p>
            </div>
          </div>
        </div>

        {/* Stability Analysis */}
        <div 
          className="p-4 rounded-lg"
          style={{ backgroundColor: cardBg }}
        >
          <h4 className="text-md font-medium mb-2">System Stability</h4>
          <div className="space-y-2">
            <p className="text-sm">
              For a stable system, the utilization factor ρ = λ/(cμ) must be less than 1.
            </p>
            <p className="text-lg font-semibold">
              ρ = {format(rho)}
            </p>
            <p className={`text-sm ${rho < 1 ? 'text-green-500' : 'text-red-500'}`}>
              {rho < 1 
                ? 'The system is stable and will reach a steady state.'
                : 'The system is unstable and queue length will grow indefinitely.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel; 