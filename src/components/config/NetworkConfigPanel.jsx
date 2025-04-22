import React, { useState } from 'react';

/**
 * NetworkConfigPanel component for configuring queue network topology
 * 
 * @param {Object} props
 * @param {Object} props.routingMatrix - Current routing matrix
 * @param {Function} props.onRoutingMatrixChange - Callback when routing matrix changes
 * @param {Boolean} props.parallelQueues - Whether parallel queues are enabled
 * @param {Function} props.onParallelQueuesChange - Callback when parallel queues setting changes
 * @param {String} props.theme - Current theme (light/dark)
 */
const NetworkConfigPanel = ({ 
  routingMatrix, 
  onRoutingMatrixChange, 
  parallelQueues = false,
  onParallelQueuesChange,
  theme 
}) => {
  const [nodeCount, setNodeCount] = useState(Object.keys(routingMatrix).length || 2);
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [newNodeConnections, setNewNodeConnections] = useState({});
  
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  const backgroundColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
  const borderColor = theme === 'dark' ? '#444444' : '#e5e7eb';
  const cardBg = theme === 'dark' ? '#2d2d2d' : '#f9fafb';
  const buttonBg = theme === 'dark' ? '#3b82f6' : '#3b82f6';
  const buttonText = '#ffffff';
  const inputBg = theme === 'dark' ? '#374151' : '#f9fafb';
  

  const handleAddNode = () => {
    const newNodeId = Math.max(...Object.keys(routingMatrix).map(Number)) + 1;
    const updatedMatrix = { ...routingMatrix };
    updatedMatrix[newNodeId] = {};
    
    Object.keys(newNodeConnections).forEach(targetNodeId => {
      const probability = parseFloat(newNodeConnections[targetNodeId]);
      if (!isNaN(probability) && probability > 0 && probability <= 1) {
        updatedMatrix[newNodeId][targetNodeId] = probability;
      }
    });
    
    onRoutingMatrixChange(updatedMatrix);
    setNodeCount(nodeCount + 1);
    setShowAddNodeModal(false);
    setNewNodeConnections({});
  };
  
  // Handle removing a node
  const handleRemoveNode = (nodeId) => {
    const updatedMatrix = { ...routingMatrix };
    delete updatedMatrix[nodeId];
    
    // Remove connections to this node from other nodes
    Object.keys(updatedMatrix).forEach(sourceNodeId => {
      if (updatedMatrix[sourceNodeId][nodeId]) {
        delete updatedMatrix[sourceNodeId][nodeId];
      }
    });
    
    onRoutingMatrixChange(updatedMatrix);
    setNodeCount(nodeCount - 1);
  };
  
  // Handle updating routing probability
  const handleRoutingChange = (sourceNodeId, targetNodeId, probability) => {
    const updatedMatrix = { ...routingMatrix };
    
    if (!updatedMatrix[sourceNodeId]) {
      updatedMatrix[sourceNodeId] = {};
    }
    
    if (probability === 0 || probability === '') {
      delete updatedMatrix[sourceNodeId][targetNodeId];
    } else {
      updatedMatrix[sourceNodeId][targetNodeId] = parseFloat(probability);
    }
    
    onRoutingMatrixChange(updatedMatrix);
  };
  
  // Handle parallel queues toggle
  const handleParallelQueuesToggle = () => {
    onParallelQueuesChange(!parallelQueues);
  };
  
  // Calculate total outgoing probability for a node
  const calculateTotalProbability = (nodeId) => {
    if (!routingMatrix[nodeId]) return 0;
    
    return Object.values(routingMatrix[nodeId]).reduce((sum, prob) => sum + prob, 0);
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
        Network Configuration
      </h3>
      
      <div className="mb-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={parallelQueues} 
            onChange={handleParallelQueuesToggle}
            className="w-4 h-4"
          />
          <span>Enable Parallel Queues</span>
        </label>
        <p className="text-sm mt-1 opacity-70">
          When enabled, the system will use separate event stacks for different partitions
        </p>
      </div>
      
      <div 
        className="p-4 rounded-lg border mb-4"
        style={{ 
          backgroundColor: cardBg,
          borderColor
        }}
      >
        <h4 className="text-lg font-medium mb-2">Routing Matrix</h4>
        <p className="text-sm mb-4 opacity-70">
          Define the probability of routing from source nodes (rows) to target nodes (columns)
        </p>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Source / Target</th>
                {Object.keys(routingMatrix).sort((a, b) => parseInt(a) - parseInt(b)).map(nodeId => (
                  <th key={nodeId} className="px-4 py-2 text-center">Node {nodeId}</th>
                ))}
                <th className="px-4 py-2 text-center">Total</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(routingMatrix).sort((a, b) => parseInt(a) - parseInt(b)).map(sourceNodeId => {
                const totalProb = calculateTotalProbability(sourceNodeId);
                const isExit = totalProb === 0;
                
                return (
                  <tr key={sourceNodeId}>
                    <td className="px-4 py-2 font-medium">Node {sourceNodeId}</td>
                    {Object.keys(routingMatrix).sort((a, b) => parseInt(a) - parseInt(b)).map(targetNodeId => (
                      <td key={targetNodeId} className="px-4 py-2 text-center">
                        {sourceNodeId !== targetNodeId ? (
                          <input
                            type="number"
                            min="0"
                            max="1"
                            step="0.1"
                            value={routingMatrix[sourceNodeId][targetNodeId] || ''}
                            onChange={(e) => handleRoutingChange(
                              sourceNodeId, 
                              targetNodeId, 
                              e.target.value
                            )}
                            className="w-16 px-2 py-1 rounded border text-center"
                            style={{
                              backgroundColor: inputBg,
                              borderColor,
                              color: textColor
                            }}
                          />
                        ) : (
                          <span className="opacity-50">-</span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-2 text-center">
                      <span 
                        className={`font-medium ${
                          totalProb === 1 
                            ? 'text-green-500' 
                            : totalProb > 0 
                              ? 'text-yellow-500' 
                              : 'text-blue-500'
                        }`}
                      >
                        {totalProb.toFixed(1)}
                        {isExit && ' (Exit)'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleRemoveNode(sourceNodeId)}
                        className="px-2 py-1 rounded bg-red-500 text-white text-sm"
                        disabled={Object.keys(routingMatrix).length <= 2}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4">
          <button
            onClick={() => setShowAddNodeModal(true)}
            className="px-4 py-2 rounded"
            style={{
              backgroundColor: buttonBg,
              color: buttonText
            }}
          >
            Add Node
          </button>
        </div>
        
        {/* Add Node Modal */}
        {showAddNodeModal && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div 
              className="p-6 rounded-lg shadow-lg max-w-md w-full"
              style={{ 
                backgroundColor,
                color: textColor
              }}
            >
              <h3 className="text-xl font-semibold mb-4">Add New Node</h3>
              <p className="mb-4">Configure connections for the new node:</p>
              
              <div className="space-y-4 mb-6">
                {Object.keys(routingMatrix).sort((a, b) => parseInt(a) - parseInt(b)).map(nodeId => (
                  <div key={nodeId} className="flex items-center space-x-4">
                    <label className="w-32">To Node {nodeId}:</label>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={newNodeConnections[nodeId] || ''}
                      onChange={(e) => setNewNodeConnections({
                        ...newNodeConnections,
                        [nodeId]: e.target.value
                      })}
                      className="flex-1 px-3 py-2 rounded border"
                      style={{
                        backgroundColor: inputBg,
                        borderColor,
                        color: textColor
                      }}
                      placeholder="Probability"
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowAddNodeModal(false);
                    setNewNodeConnections({});
                  }}
                  className="px-4 py-2 rounded border"
                  style={{
                    borderColor,
                    color: textColor
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNode}
                  className="px-4 py-2 rounded"
                  style={{
                    backgroundColor: buttonBg,
                    color: buttonText
                  }}
                >
                  Add Node
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="text-sm opacity-70">
        <p>Notes:</p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>A node with total probability of 0 is considered an exit node</li>
          <li>For valid routing, total probability should be 1 or 0 (exit)</li>
          <li>The first node is typically the entry point for external arrivals</li>
        </ul>
      </div>
    </div>
  );
};

export default NetworkConfigPanel;
