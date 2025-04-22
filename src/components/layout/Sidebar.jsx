import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Switch } from '@headlessui/react';
import { PlayIcon, StopIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';

const ConfigInput = ({ label, value, onChange, type = 'number', min, max, step }) => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        min={min}
        max={max}
        step={step}
        className={classNames(
          "block w-full rounded-md border-0 py-1.5 text-sm shadow-sm ring-1 ring-inset focus:ring-2",
          {
            'bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600': theme === 'light',
            'bg-gray-800 text-white ring-gray-700 focus:ring-indigo-500': theme === 'dark'
          }
        )}
      />
    </div>
  );
};

const Sidebar = ({ 
  config, 
  onConfigChange, 
  isSimulating,
  onStartSimulation,
  onStopSimulation
}) => {
  const { theme } = useTheme();
  
  // Theme-based styling
  const backgroundColor = theme === 'dark' ? '#1e293b' : '#ffffff';
  const borderColor = theme === 'dark' ? '#334155' : '#e2e8f0';

  const handleConfigChange = (key, value) => {
    onConfigChange({
      ...config,
      [key]: value
    });
  };

  const handleDistributionChange = (type, value) => {
    onConfigChange({
      ...config,
      distribution: {
        ...config.distribution,
        [type]: value
      }
    });
  };
  
  return (
      <div 
      className="h-full rounded-lg border p-4 space-y-6"
        style={{
          backgroundColor,
        borderColor
      }}
    >
      <h2 className="text-xl font-semibold">Configuration</h2>

      {/* Queue Type Selection */}
      <div className="space-y-1">
        <label className="block text-sm font-medium">Queue Type</label>
        <select
          value={config.queueType}
          onChange={(e) => handleConfigChange('queueType', e.target.value)}
          className={classNames(
            "block w-full rounded-md border-0 py-1.5 text-sm shadow-sm ring-1 ring-inset focus:ring-2",
            {
              'bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600': theme === 'light',
              'bg-gray-800 text-white ring-gray-700 focus:ring-indigo-500': theme === 'dark'
            }
          )}
        >
          <option value="M/M/1">M/M/1</option>
          <option value="M/M/c">M/M/c</option>
          <option value="M/G/1">M/G/1</option>
          <option value="G/G/1">G/G/1</option>
          <option value="Network">Network of Queues</option>
        </select>
      </div>

      {/* Arrival Rate */}
      <ConfigInput
        label="Arrival Rate (λ)"
        value={config.arrivalRate}
        onChange={(value) => handleConfigChange('arrivalRate', value)}
        min={0.1}
        max={10}
        step={0.1}
      />

      {/* Service Rate */}
      <ConfigInput
        label="Service Rate (μ)"
        value={config.serviceRate}
        onChange={(value) => handleConfigChange('serviceRate', value)}
        min={0.1}
        max={10}
        step={0.1}
      />

      {/* Number of Servers */}
      {config.queueType === 'M/M/c' && (
        <ConfigInput
          label="Number of Servers"
          value={config.numServers}
          onChange={(value) => handleConfigChange('numServers', value)}
          min={1}
          max={10}
          step={1}
        />
      )}

      {/* Buffer Size */}
      <div className="space-y-1">
        <label className="block text-sm font-medium">Buffer Size</label>
        <select
          value={config.bufferSize === Infinity ? 'infinity' : config.bufferSize}
          onChange={(e) => handleConfigChange('bufferSize', e.target.value === 'infinity' ? Infinity : Number(e.target.value))}
          className={classNames(
            "block w-full rounded-md border-0 py-1.5 text-sm shadow-sm ring-1 ring-inset focus:ring-2",
            {
              'bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600': theme === 'light',
              'bg-gray-800 text-white ring-gray-700 focus:ring-indigo-500': theme === 'dark'
            }
          )}
            >
          <option value="infinity">Infinite</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>

      {/* Distribution Selection */}
      {(config.queueType === 'M/G/1' || config.queueType === 'G/G/1') && (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium">Arrival Distribution</label>
            <select
              value={config.distribution.arrival}
              onChange={(e) => handleDistributionChange('arrival', e.target.value)}
              className={classNames(
                "block w-full rounded-md border-0 py-1.5 text-sm shadow-sm ring-1 ring-inset focus:ring-2",
                {
                  'bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600': theme === 'light',
                  'bg-gray-800 text-white ring-gray-700 focus:ring-indigo-500': theme === 'dark'
                }
              )}
            >
              <option value="exponential">Exponential</option>
              <option value="erlang">Erlang</option>
              <option value="uniform">Uniform</option>
              <option value="deterministic">Deterministic</option>
              <option value="hyperexponential">Hyperexponential</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Service Distribution</label>
            <select
              value={config.distribution.service}
              onChange={(e) => handleDistributionChange('service', e.target.value)}
              className={classNames(
                "block w-full rounded-md border-0 py-1.5 text-sm shadow-sm ring-1 ring-inset focus:ring-2",
                {
                  'bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600': theme === 'light',
                  'bg-gray-800 text-white ring-gray-700 focus:ring-indigo-500': theme === 'dark'
                }
              )}
            >
              <option value="exponential">Exponential</option>
              <option value="erlang">Erlang</option>
              <option value="uniform">Uniform</option>
              <option value="deterministic">Deterministic</option>
              <option value="hyperexponential">Hyperexponential</option>
            </select>
          </div>
        </div>
      )}

      {/* Simulation Time */}
      <ConfigInput
        label="Simulation Time"
        value={config.timeLimit}
        onChange={(value) => handleConfigChange('timeLimit', value)}
        min={10}
        max={1000}
        step={10}
      />

      {/* Warmup Period */}
      <ConfigInput
        label="Warmup Period"
        value={config.warmupPeriod}
        onChange={(value) => handleConfigChange('warmupPeriod', value)}
        min={0}
        max={100}
        step={1}
      />

      {/* Control Buttons */}
      <div className="pt-4">
        <button
          onClick={isSimulating ? onStopSimulation : onStartSimulation}
          className={classNames(
            "w-full flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-sm",
            {
              'bg-indigo-600 text-white hover:bg-indigo-500': !isSimulating,
              'bg-red-600 text-white hover:bg-red-500': isSimulating
            }
          )}
        >
          {isSimulating ? (
            <>
              <StopIcon className="h-5 w-5" />
              Stop Simulation
            </>
          ) : (
            <>
              <PlayIcon className="h-5 w-5" />
              Start Simulation
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
