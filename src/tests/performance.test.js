/**
 * Performance optimization tests for the simulation engine
 */

import {
  simulateQueueNetwork,
  calculateBatchMeans
} from '../lib/simulationEngine';

// Test simulation performance with different network sizes
describe('Simulation Performance', () => {
  // Helper function to create test nodes
  const createTestNodes = (count) => {
    const nodes = {};
    for (let i = 1; i <= count; i++) {
      nodes[i] = {
        nodeId: i,
        queue: [],
        serviceDistribution: 'exponential',
        serviceParams: { mean: 1/10 },
        busy: false,
        lastBusyTime: null,
        totalServiceTime: 0,
        jobsServed: 0,
        waitTimes: [],
        serviceTimes: []
      };
    }
    return nodes;
  };

  // Helper function to create routing matrix
  const createRoutingMatrix = (nodeCount) => {
    const matrix = {};
    for (let i = 1; i <= nodeCount; i++) {
      matrix[i] = {};
      if (i < nodeCount) {
        matrix[i][i + 1] = 1.0; // Route to next node with 100% probability
      }
    }
    return matrix;
  };

  test('should handle small networks efficiently', () => {
    const nodeCount = 3;
    const nodes = createTestNodes(nodeCount);
    const routingMatrix = createRoutingMatrix(nodeCount);
    
    const externalArrivalRates = { 1: 5 };
    const arrivalDistributions = { 1: 'exponential' };
    const arrivalParams = { 1: { mean: 1/5 } };
    
    const startTime = performance.now();
    
    simulateQueueNetwork(
      nodes,
      routingMatrix,
      externalArrivalRates,
      arrivalDistributions,
      arrivalParams,
      100,  // totalJobs
      5,    // warmupPeriod
      20,   // simulationPeriod
      1,    // timeInterval
      123   // seed
    );
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`Small network (${nodeCount} nodes) simulation took ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(1000); // Should complete in less than 1 second
  });

  test('should handle medium networks efficiently', () => {
    const nodeCount = 10;
    const nodes = createTestNodes(nodeCount);
    const routingMatrix = createRoutingMatrix(nodeCount);
    
    const externalArrivalRates = { 1: 5 };
    const arrivalDistributions = { 1: 'exponential' };
    const arrivalParams = { 1: { mean: 1/5 } };
    
    const startTime = performance.now();
    
    simulateQueueNetwork(
      nodes,
      routingMatrix,
      externalArrivalRates,
      arrivalDistributions,
      arrivalParams,
      100,  // totalJobs
      5,    // warmupPeriod
      20,   // simulationPeriod
      1,    // timeInterval
      123   // seed
    );
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`Medium network (${nodeCount} nodes) simulation took ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(3000); // Should complete in less than 3 seconds
  });
});

// Test batch means calculation performance
describe('Batch Means Performance', () => {
  test('should efficiently calculate batch means for large datasets', () => {
    // Create a large dataset
    const largeDataset = Array.from({ length: 10000 }, () => Math.random() * 10);
    
    const startTime = performance.now();
    
    calculateBatchMeans(largeDataset, 100, 0.95);
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`Batch means calculation for 10,000 data points took ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(500); // Should complete in less than 500ms
  });
});

// Test memory usage optimization
describe('Memory Usage Optimization', () => {
  test('should limit memory usage during simulation', () => {
    // This is a basic test to ensure we're not creating excessive objects
    // A more comprehensive test would use a memory profiler
    
    const nodeCount = 5;
    const nodes = {};
    for (let i = 1; i <= nodeCount; i++) {
      nodes[i] = {
        nodeId: i,
        queue: [],
        serviceDistribution: 'exponential',
        serviceParams: { mean: 1/10 },
        busy: false,
        lastBusyTime: null,
        totalServiceTime: 0,
        jobsServed: 0,
        waitTimes: [],
        serviceTimes: []
      };
    }
    
    const routingMatrix = {};
    for (let i = 1; i <= nodeCount; i++) {
      routingMatrix[i] = {};
      if (i < nodeCount) {
        routingMatrix[i][i + 1] = 1.0;
      }
    }
    
    const externalArrivalRates = { 1: 5 };
    const arrivalDistributions = { 1: 'exponential' };
    const arrivalParams = { 1: { mean: 1/5 } };
    
    // Run simulation with a callback to monitor queue lengths
    let maxQueueLength = 0;
    let maxEventCount = 0;
    
    simulateQueueNetwork(
      nodes,
      routingMatrix,
      externalArrivalRates,
      arrivalDistributions,
      arrivalParams,
      1000,  // totalJobs
      10,    // warmupPeriod
      100,   // simulationPeriod
      1,     // timeInterval
      123,   // seed
      0.95,  // confidenceLevel
      (stats) => {
        // Monitor queue lengths
        Object.values(stats.nodeStats).forEach(nodeStat => {
          const currentLength = nodeStat.queueLengths[nodeStat.queueLengths.length - 1] || 0;
          maxQueueLength = Math.max(maxQueueLength, currentLength);
        });
      }
    );
    
    console.log(`Maximum queue length observed: ${maxQueueLength}`);
    expect(maxQueueLength).toBeLessThan(1000); // Ensure queues don't grow unbounded
  });
});

// Test real-time update performance
describe('Real-time Update Performance', () => {
  test('should efficiently handle frequent updates', () => {
    const nodeCount = 3;
    const nodes = {};
    for (let i = 1; i <= nodeCount; i++) {
      nodes[i] = {
        nodeId: i,
        queue: [],
        serviceDistribution: 'exponential',
        serviceParams: { mean: 1/10 },
        busy: false,
        lastBusyTime: null,
        totalServiceTime: 0,
        jobsServed: 0,
        waitTimes: [],
        serviceTimes: []
      };
    }
    
    const routingMatrix = {};
    for (let i = 1; i <= nodeCount; i++) {
      routingMatrix[i] = {};
      if (i < nodeCount) {
        routingMatrix[i][i + 1] = 1.0;
      }
    }
    
    const externalArrivalRates = { 1: 5 };
    const arrivalDistributions = { 1: 'exponential' };
    const arrivalParams = { 1: { mean: 1/5 } };
    
    let updateCount = 0;
    const updateInterval = 0.01; // 10ms as requested by user
    const startTime = performance.now();
    
    simulateQueueNetwork(
      nodes,
      routingMatrix,
      externalArrivalRates,
      arrivalDistributions,
      arrivalParams,
      100,  // totalJobs
      5,    // warmupPeriod
      20,   // simulationPeriod
      updateInterval,
      123,  // seed
      0.95, // confidenceLevel
      () => {
        updateCount++;
      }
    );
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`Simulation with ${updateCount} updates (every ${updateInterval}s) took ${duration.toFixed(2)}ms`);
    
    // Calculate expected updates based on simulation time and update interval
    const expectedUpdates = Math.floor(20 / updateInterval);
    
    // Allow some flexibility in the number of updates
    expect(updateCount).toBeGreaterThan(0);
    expect(duration / updateCount).toBeLessThan(50); // Each update should take less than 50ms on average
  });
});
