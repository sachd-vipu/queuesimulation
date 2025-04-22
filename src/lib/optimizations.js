/**
 * Optimization improvements for the simulation engine
 */

// Optimize event insertion in EventStack
// by using a binary search to find the insertion point
export function optimizedInsertEvent(eventStack, event) {
  if (eventStack.head === null) {
    eventStack.head = eventStack.tail = event;
    return;
  }

  let events = [];
  let current = eventStack.head;
  while (current) {
    events.push(current);
    current = current.nextEvent;
  }

  let left = 0;
  let right = events.length - 1;
  let insertIndex = events.length;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (events[mid].time <= event.time) {
      left = mid + 1;
    } else {
      insertIndex = mid;
      right = mid - 1;
    }
  }

  // Insert at the found position
  if (insertIndex === events.length) {
    eventStack.tail.nextEvent = event;
    event.prevEvent = eventStack.tail;
    eventStack.tail = event;
  } else if (insertIndex === 0) {
    event.nextEvent = eventStack.head;
    eventStack.head.prevEvent = event;
    eventStack.head = event;
  } else {
    const prevNode = events[insertIndex - 1];
    const nextNode = events[insertIndex];
    prevNode.nextEvent = event;
    event.prevEvent = prevNode;
    event.nextEvent = nextNode;
    nextNode.prevEvent = event;
  }
}

// Optimize batch means calculation
// This optimization reduces memory usage by processing batches incrementally
export function optimizedCalculateBatchMeans(data, batchSize, confidenceLevel = 0.95) {
  const numBatches = Math.floor(data.length / batchSize);
  const batchMeans = new Array(numBatches);
  const batchConfIntervals = new Array(numBatches);
  const batchNumbers = new Array(numBatches);

  for (let i = 0; i < numBatches; i++) {
    // Calculate batch mean
    let sum = 0;
    for (let j = 0; j < batchSize; j++) {
      sum += data[i * batchSize + j];
    }
    const batchMean = sum / batchSize;
    batchMeans[i] = batchMean;

    // Calculate standard deviation for this batch
    let sumSquaredDiff = 0;
    for (let j = 0; j < batchSize; j++) {
      sumSquaredDiff += Math.pow(data[i * batchSize + j] - batchMean, 2);
    }
    const stdDev = Math.sqrt(sumSquaredDiff / batchSize);
    
    // Calculate confidence interval
    const zCritical = findZCritical(confidenceLevel);
    batchConfIntervals[i] = zCritical * stdDev / Math.sqrt(batchSize);
    batchNumbers[i] = i + 1;
  }

  return {
    batchMeans,
    batchConfIntervals,
    batchNumbers
  };
}

// Helper function to find z-critical value
function findZCritical(confidenceLevel) {
  const alpha = 1 - confidenceLevel;
  // Approximation of the inverse of the standard normal CDF
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  
  const x = Math.sqrt(-2 * Math.log(alpha / 2));
  const t = 1 / (1 + p * x);
  const erf = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return x * (erf);
}

// Optimize memory usage in simulation
export function optimizeMemoryUsage(simulationResults) {
  // Limit the number of data points stored for visualization
  const maxDataPoints = 1000;
  
  // For each node, sample the queue lengths and times if they exceed maxDataPoints
  Object.keys(simulationResults.nodeStats).forEach(nodeId => {
    const stats = simulationResults.nodeStats[nodeId];
    
    if (stats.queueLengths.length > maxDataPoints) {
      const step = Math.floor(stats.queueLengths.length / maxDataPoints);
      
      const sampledQueueLengths = [];
      const sampledTimes = [];
      
      for (let i = 0; i < stats.queueLengths.length; i += step) {
        sampledQueueLengths.push(stats.queueLengths[i]);
        sampledTimes.push(stats.times[i]);
      }
      
      stats.queueLengths = sampledQueueLengths;
      stats.times = sampledTimes;
    }
  });
  
  // Limit the number of sojourn times stored
  if (simulationResults.sojournTimes.length > maxDataPoints) {
    const step = Math.floor(simulationResults.sojournTimes.length / maxDataPoints);
    const sampledSojournTimes = [];
    
    for (let i = 0; i < simulationResults.sojournTimes.length; i += step) {
      sampledSojournTimes.push(simulationResults.sojournTimes[i]);
    }
    
    simulationResults.sojournTimes = sampledSojournTimes;
  }
  
  return simulationResults;
}

// Optimize real-time updates
export function optimizeRealTimeUpdates(currentTime, lastUpdateTime, updateInterval, stats, updateCallback) {
  // Only update if enough time has passed since the last update
  if (currentTime - lastUpdateTime >= updateInterval) {
    // Create a minimal stats object with only the data needed for visualization
    const minimalStats = {
      time: currentTime,
      nodeStats: {},
      simulationProgress: Math.min(100, (currentTime / stats.simulationTime) * 100)
    };
    
    // Only include the latest data point for each node
    Object.keys(stats.nodeStats).forEach(nodeId => {
      const nodeStats = stats.nodeStats[nodeId];
      const lastIndex = nodeStats.queueLengths.length - 1;
      
      minimalStats.nodeStats[nodeId] = {
        queueLengths: lastIndex >= 0 ? [nodeStats.queueLengths[lastIndex]] : [],
        times: lastIndex >= 0 ? [nodeStats.times[lastIndex]] : []
      };
    });
    
    // Call the update callback with the minimal stats
    updateCallback(minimalStats);
    
    return currentTime; // Return the current time as the new lastUpdateTime
  }
  
  return lastUpdateTime; // No update, return the unchanged lastUpdateTime
}
