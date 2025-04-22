import React, { useState, useEffect } from 'react';

/**
 * DistributionConfigPanel component for configuring arrival and service distributions
 * 
 * @param {Object} props
 * @param {Object} props.arrivalDistributions - Current arrival distributions
 * @param {Object} props.arrivalParams - Current arrival parameters
 * @param {Object} props.serviceDistributions - Current service distributions
 * @param {Object} props.serviceParams - Current service parameters
 * @param {Function} props.onArrivalDistributionsChange - Callback when arrival distributions change
 * @param {Function} props.onArrivalParamsChange - Callback when arrival parameters change
 * @param {Function} props.onServiceDistributionsChange - Callback when service distributions change
 * @param {Function} props.onServiceParamsChange - Callback when service parameters change
 * @param {Array} props.nodeIds - Array of node IDs
 * @param {String} props.theme - Current theme (light/dark)
 */
const DistributionConfigPanel = ({ 
  arrivalDistributions = {}, 
  arrivalParams = {},
  serviceDistributions = {},
  serviceParams = {},
  onArrivalDistributionsChange,
  onArrivalParamsChange,
  onServiceDistributionsChange,
  onServiceParamsChange,
  nodeIds = [],
  theme 
}) => {
  const distributionTypes = [
    { value: 'exponential', label: 'Exponential' },
    { value: 'poisson', label: 'Poisson' },
    { value: 'erlang', label: 'Erlang' },
    { value: 'hyperexponential', label: 'Hyperexponential' },
    { value: 'hypoexponential', label: 'Hypoexponential' },
    { value: 'coxian', label: 'Coxian' },
    { value: 'deterministic', label: 'Deterministic' },
    { value: 'uniform', label: 'Uniform' },
    { value: 'weibull', label: 'Weibull' },
    { value: 'lognormal', label: 'Lognormal' },
    { value: 'gamma', label: 'Gamma' },
    { value: 'beta', label: 'Beta' },
    { value: 'pareto', label: 'Pareto' }
  ];
  
  // Theme-based styling
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  const backgroundColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
  const borderColor = theme === 'dark' ? '#444444' : '#e5e7eb';
  const cardBg = theme === 'dark' ? '#2d2d2d' : '#f9fafb';
  const inputBg = theme === 'dark' ? '#374151' : '#f9fafb';
  
  // Handle arrival distribution change
  const handleArrivalDistributionChange = (nodeId, distribution) => {
    const updatedDistributions = { ...arrivalDistributions };
    updatedDistributions[nodeId] = distribution;
    onArrivalDistributionsChange(updatedDistributions);
    
    // Initialize default parameters for the selected distribution
    const updatedParams = { ...arrivalParams };
    updatedParams[nodeId] = getDefaultParams(distribution);
    onArrivalParamsChange(updatedParams);
  };
  
  // Handle service distribution change
  const handleServiceDistributionChange = (nodeId, distribution) => {
    const updatedDistributions = { ...serviceDistributions };
    updatedDistributions[nodeId] = distribution;
    onServiceDistributionsChange(updatedDistributions);
    
    // Initialize default parameters for the selected distribution
    const updatedParams = { ...serviceParams };
    updatedParams[nodeId] = getDefaultParams(distribution);
    onServiceParamsChange(updatedParams);
  };
  
  // Handle arrival parameter change
  const handleArrivalParamChange = (nodeId, paramName, value) => {
    const updatedParams = { ...arrivalParams };
    if (!updatedParams[nodeId]) {
      updatedParams[nodeId] = {};
    }
    updatedParams[nodeId][paramName] = parseFloat(value);
    onArrivalParamsChange(updatedParams);
  };
  
  // Handle service parameter change
  const handleServiceParamChange = (nodeId, paramName, value) => {
    const updatedParams = { ...serviceParams };
    if (!updatedParams[nodeId]) {
      updatedParams[nodeId] = {};
    }
    updatedParams[nodeId][paramName] = parseFloat(value);
    onServiceParamsChange(updatedParams);
  };
  
  // Get default parameters for a distribution
  const getDefaultParams = (distribution) => {
    switch (distribution) {
      case 'exponential':
        return { mean: 1.0 };
      case 'poisson':
        return { lambda: 1.0 };
      case 'erlang':
        return { k: 2, theta: 1.0 };
      case 'hyperexponential':
        return { p: [0.5, 0.5], means: [0.5, 2.0] };
      case 'hypoexponential':
        return { lambdas: [1.0, 2.0] };
      case 'coxian':
        return { lambdas: [1.0, 2.0], probs: [0.5, 1.0] };
      case 'deterministic':
        return { value: 1.0 };
      case 'uniform':
        return { low: 0.5, high: 1.5 };
      case 'weibull':
        return { shape: 1.5, scale: 1.0 };
      case 'lognormal':
        return { mu: 0.0, sigma: 0.5 };
      case 'gamma':
        return { shape: 2.0, scale: 0.5 };
      case 'beta':
        return { alpha: 2.0, beta: 2.0, scale: 1.0 };
      case 'pareto':
        return { alpha: 3.0, xm: 1.0 };
      default:
        return { mean: 1.0 };
    }
  };
  
  // Get parameter inputs based on distribution type
  const getParameterInputs = (distribution, params, onChange) => {
    if (!distribution) return null;
    
    switch (distribution) {
      case 'exponential':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <label className="w-24">Mean:</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={params?.mean || 1.0}
                onChange={(e) => onChange('mean', e.target.value)}
                className="flex-1 px-2 py-1 rounded border"
                style={{
                  backgroundColor: inputBg,
                  borderColor,
                  color: textColor
                }}
              />
            </div>
          </div>
        );
      
      case 'poisson':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <label className="w-24">Lambda:</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={params?.lambda || 1.0}
                onChange={(e) => onChange('lambda', e.target.value)}
                className="flex-1 px-2 py-1 rounded border"
                style={{
                  backgroundColor: inputBg,
                  borderColor,
                  color: textColor
                }}
              />
            </div>
          </div>
        );
      
      case 'erlang':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <label className="w-24">k (shape):</label>
              <input
                type="number"
                min="1"
                step="1"
                value={params?.k || 2}
                onChange={(e) => onChange('k', e.target.value)}
                className="flex-1 px-2 py-1 rounded border"
                style={{
                  backgroundColor: inputBg,
                  borderColor,
                  color: textColor
                }}
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="w-24">Theta:</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={params?.theta || 1.0}
                onChange={(e) => onChange('theta', e.target.value)}
                className="flex-1 px-2 py-1 rounded border"
                style={{
                  backgroundColor: inputBg,
                  borderColor,
                  color: textColor
                }}
              />
            </div>
          </div>
        );
      
      case 'deterministic':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <label className="w-24">Value:</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={params?.value || 1.0}
                onChange={(e) => onChange('value', e.target.value)}
                className="flex-1 px-2 py-1 rounded border"
                style={{
                  backgroundColor: inputBg,
                  borderColor,
                  color: textColor
                }}
              />
            </div>
          </div>
        );
      
      case 'uniform':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <label className="w-24">Low:</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={params?.low || 0.5}
                onChange={(e) => onChange('low', e.target.value)}
                className="flex-1 px-2 py-1 rounded border"
                style={{
                  backgroundColor: inputBg,
                  borderColor,
                  color: textColor
                }}
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="w-24">High:</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={params?.high || 1.5}
                onChange={(e) => onChange('high', e.target.value)}
                className="flex-1 px-2 py-1 rounded border"
                style={{
                  backgroundColor: inputBg,
                  borderColor,
                  color: textColor
                }}
              />
            </div>
          </div>
        );
      
      case 'weibull':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <label className="w-24">Shape:</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={params?.shape || 1.5}
                onChange={(e) => onChange('shape', e.target.value)}
                className="flex-1 px-2 py-1 rounded border"
                style={{
                  backgroundColor: inputBg,
                  borderColor,
                  color: textColor
                }}
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="w-24">Scale:</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={params?.scale || 1.0}
                onChange={(e) => onChange('scale', e.target.value)}
                className="flex-1 px-2 py-1 rounded border"
                style={{
                  backgroundColor: inputBg,
                  borderColor,
                  color: textColor
                }}
              />
            </div>
          </div>
        );
      
      case 'lognormal':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <label className="w-24">Mu:</label>
              <input
                type="number"
                step="0.1"
                value={params?.mu || 0.0}
                onChange={(e) => onChange('mu', e.target.value)}
                className="flex-1 px-2 py-1 rounded border"
                style={{
                  backgroundColor: inputBg,
                  borderColor,
                  color: textColor
                }}
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="w-24">Sigma:</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={params?.sigma || 0.5}
                onChange={(e) => onChange('sigma', e.target.value)}
                className="flex-1 px-2 py-1 rounded border"
                style={{
                  backgroundColor: inputBg,
                  borderColor,
                  color: textColor
                }}
              />
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-sm italic">
            Select a distribution type to configure parameters
          </div>
        );
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
        Distribution Configuration
      </h3>
      
      <div className="space-y-6">
        {/* Arrival Distributions */}
        <div 
          className="p-4 rounded-lg border"
          style={{ 
            backgroundColor: cardBg,
            borderColor
          }}
        >
          <h4 className="text-lg font-medium mb-2">Arrival Distributions</h4>
          <p className="text-sm mb-4 opacity-70">
            Configure the inter-arrival time distributions for external arrivals
          </p>
          
          <div className="space-y-6">
            {nodeIds.map(nodeId => (
              <div key={`arrival-${nodeId}`} className="border-t pt-4 first:border-t-0 first:pt-0">
                <h5 className="font-medium mb-2">Node {nodeId}</h5>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <label className="w-24">Distribution:</label>
                    <select
                      value={arrivalDistributions[nodeId] || ''}
                      onChange={(e) => handleArrivalDistributionChange(nodeId, e.target.value)}
                      className="flex-1 px-2 py-1 rounded border"
                      style={{
                        backgroundColor: inputBg,
                        borderColor,
                        color: textColor
                      }}
                    >
                      <option value="">Select Distribution</option>
                      {distributionTypes.map(dist => (
                        <option key={dist.value} value={dist.value}>
                          {dist.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {arrivalDistributions[nodeId] && (
                    <div className="ml-6">
                      {getParameterInputs(
                        arrivalDistributions[nodeId],
                        arrivalParams[nodeId],
                        (paramName, value) => handleArrivalParamChange(nodeId, paramName, value)
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Service Distributions */}
        <div 
          className="p-4 rounded-lg border"
          style={{ 
            backgroundColor: cardBg,
            borderColor
          }}
        >
          <h4 className="text-lg font-medium mb-2">Service Distributions</h4>
          <p className="text-sm mb-4 opacity-70">
            Configure the service time distributions for each node
          </p>
          
          <div className="space-y-6">
            {nodeIds.map(nodeId => (
              <div key={`service-${nodeId}`} className="border-t pt-4 first:border-t-0 first:pt-0">
                <h5 className="font-medium mb-2">Node {nodeId}</h5>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <label className="w-24">Distribution:</label>
                    <select
                      value={serviceDistributions[nodeId] || ''}
                      onChange={(e) => handleServiceDistributionChange(nodeId, e.target.value)}
                      className="flex-1 px-2 py-1 rounded border"
                      style={{
                        backgroundColor: inputBg,
                        borderColor,
                        color: textColor
                      }}
                    >
                      <option value="">Select Distribution</option>
                      {distributionTypes.map(dist => (
                        <option key={dist.value} value={dist.value}>
                          {dist.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {serviceDistributions[nodeId] && (
                    <div className="ml-6">
                      {getParameterInputs(
                        serviceDistributions[nodeId],
                        serviceParams[nodeId],
                        (paramName, value) => handleServiceParamChange(nodeId, paramName, value)
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionConfigPanel;

