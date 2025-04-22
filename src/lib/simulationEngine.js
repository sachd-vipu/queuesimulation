/**
 * Queue Simulation Engine
 * JavaScript implementation of the QNetSim Python code
 * Supports arbitrary queue networks, multiple distribution types,
 * and real-time visualization updates
 */

// Event class for simulation events
class Event {
  constructor(time, eventType, jobId, nodeId, sourceStackId = 0) {
    this.time = time;
    this.eventType = eventType; // 'arrival' or 'departure'
    this.jobId = jobId;
    this.nodeId = nodeId;
    this.nextEvent = null;
    this.prevEvent = null;
    this.sourceStackId = sourceStackId;
  }
}

// EventStack class for managing simulation events
class EventStack {
  constructor(stackId = 1) {
    this.head = null;
    this.tail = null;
    this.currentTime = 0.0;
    this.stackId = stackId;
    this.stateHistory = [];
  }

  isEmpty() {
    return this.head === null;
  }

  insertEvent(event) {
    if (this.head === null) {
      this.head = this.tail = event;
      return;
    }

    let current = this.head;
    while (current && current.time <= event.time) {
      current = current.nextEvent;
    }

    if (current === null) {
      // Insert at the end
      this.tail.nextEvent = event;
      event.prevEvent = this.tail;
      this.tail = event;
    } else if (current.prevEvent === null) {
      // Insert at the beginning
      event.nextEvent = this.head;
      this.head.prevEvent = event;
      this.head = event;
    } else {
      // Insert in the middle
      const prevNode = current.prevEvent;
      prevNode.nextEvent = event;
      event.prevEvent = prevNode;
      event.nextEvent = current;
      current.prevEvent = event;
    }
  }

  popEvent() {
    if (this.head === null) {
      return null;
    }

    const event = this.head;
    this.head = event.nextEvent;

    if (this.head) {
      this.head.prevEvent = null;
    } else {
      this.tail = null;
    }

    return event;
  }

  // Methods for handling partitions and rollback
  saveState(state) {
    this.stateHistory.push([this.currentTime, JSON.parse(JSON.stringify(state))]);
  }

  rollback(rollbackTime) {
    // Revert to the last saved state before rollback_time
    for (let i = this.stateHistory.length - 1; i >= 0; i--) {
      const [time, state] = this.stateHistory[i];
      if (time <= rollbackTime) {
        this.currentTime = time;
        this.stateHistory = this.stateHistory.slice(0, i + 1);
        this.removeFutureEvents(rollbackTime);
        return state;
      }
    }

    // If no saved state is found, reset to initial state
    this.currentTime = 0.0;
    this.stateHistory = [];
    this.removeFutureEvents(rollbackTime);
    return null;
  }

  removeFutureEvents(timeLimit) {
    // Remove events scheduled after time_limit
    let current = this.head;
    while (current && current.time <= timeLimit) {
      current = current.nextEvent;
    }

    if (current) {
      if (current.prevEvent) {
        current.prevEvent.nextEvent = null;
      } else {
        this.head = null;
      }
      this.tail = current.prevEvent;
    }
  }
}

// Queue class for representing a queue in the network
class Queue {
  constructor(nodeId, serviceDistribution, serviceParams) {
    this.nodeId = nodeId;
    this.queue = [];
    this.serviceDistribution = serviceDistribution;
    this.serviceParams = serviceParams;
    this.busy = false;
    this.lastBusyTime = null;
    this.totalServiceTime = 0.0;
    this.jobsServed = 0;
    this.waitTimes = [];
    this.serviceTimes = [];
  }
}

// Partition class for handling network partitioning
class Partition {
  constructor(partitionId, nodes) {
    this.partitionId = partitionId;
    this.nodes = nodes;
    this.eventStack = new EventStack();
    this.localTime = 0.0;
    this.stateHistory = [];
  }

  saveState() {
    const state = {
      localTime: this.localTime,
      nodes: JSON.parse(JSON.stringify(this.nodes))
    };
    this.stateHistory.push(state);
  }

  rollback(toTime) {
    while (this.stateHistory.length > 0 && this.stateHistory[this.stateHistory.length - 1].localTime > toTime) {
      this.stateHistory.pop();
    }

    if (this.stateHistory.length > 0) {
      const lastState = this.stateHistory[this.stateHistory.length - 1];
      this.localTime = lastState.localTime;
      this.nodes = JSON.parse(JSON.stringify(lastState.nodes));
    }

    this.eventStack = new EventStack(); // Clear the event stack after rollback
  }
}

// Distribution generator functions
const Distributions = {
  exponential: (params) => {
    const mean = params.mean;
    const u = Math.random();
    return -mean * Math.log(1 - u);
  },

  poisson: (params) => {
    const lambda = params.lambda;
    let L = Math.exp(-lambda);
    let p = 1.0;
    let k = 0;

    do {
      k++;
      p *= Math.random();
    } while (p > L);

    return k - 1;
  },

  erlang: (params) => {
    const k = params.k;
    const theta = params.theta;
    let sum = 0;

    for (let i = 0; i < k; i++) {
      sum += -theta * Math.log(1 - Math.random());
    }

    return sum;
  },

  hyperexponential: (params) => {
    const p = params.p;
    const means = params.means;
    
    // Choose a mean based on probability
    let cumulativeProb = 0;
    const u = Math.random();
    let chosenMean;
    
    for (let i = 0; i < p.length; i++) {
      cumulativeProb += p[i];
      if (u <= cumulativeProb) {
        chosenMean = means[i];
        break;
      }
    }
    
    return -chosenMean * Math.log(1 - Math.random());
  },

  hypoexponential: (params) => {
    const lambdas = params.lambdas;
    let sum = 0;

    for (const lambda of lambdas) {
      sum += -1 / lambda * Math.log(1 - Math.random());
    }

    return sum;
  },

  coxian: (params) => {
    const lambdas = params.lambdas;
    const probs = params.probs;
    let sample = 0;

    for (let i = 0; i < lambdas.length; i++) {
      const uPhase = Math.random();
      const t = -1 / lambdas[i] * Math.log(1 - uPhase);
      sample += t;

      const uExit = Math.random();
      if (uExit <= probs[i]) {
        break;
      }
    }

    return sample;
  },

  deterministic: (params) => {
    return params.value;
  },

  uniform: (params) => {
    return params.low + Math.random() * (params.high - params.low);
  },

  weibull: (params) => {
    const shape = params.shape;
    const scale = params.scale;
    const u = Math.random();
    return scale * Math.pow(-Math.log(1 - u), 1 / shape);
  },

  lognormal: (params) => {
    const mu = params.mu;
    const sigma = params.sigma;
    
    // Box-Muller transform to generate normal random variable
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    
    // Transform to lognormal
    return Math.exp(mu + sigma * z);
  },

  gamma: (params) => {
    const shape = params.shape;
    const scale = params.scale;
    
    // Marsaglia and Tsang method for gamma
    if (shape < 1) {
      const d = shape + 1.0 - 1.0/3.0;
      const c = 1.0 / Math.sqrt(9.0 * d);
      let x, v;
      do {
        do {
          const u1 = Math.random();
          const u2 = Math.random();
          
          const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
          v = Math.pow(1.0 + c * z, 3);
        } while (v <= 0);
        
        const u3 = Math.random();
        x = d * v;
        
      } while (u3 > 1.0 - 0.0331 * Math.pow(z, 4) && 
               Math.log(u3) > 0.5 * Math.pow(z, 2) + d * (1.0 - v + Math.log(v)));
      
      return scale * x * Math.pow(Math.random(), 1.0/shape);
    } else {
      // For shape >= 1
      const d = shape - 1.0/3.0;
      const c = 1.0 / Math.sqrt(9.0 * d);
      let x, v;
      do {
        let z;
        do {
          const u1 = Math.random();
          const u2 = Math.random();
          z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
          v = Math.pow(1.0 + c * z, 3);
        } while (v <= 0);
        
        const u3 = Math.random();
        x = d * v;
        
      } while (Math.log(u3) > 0.5 * Math.pow(z, 2) + d * (1.0 - v + Math.log(v)));
      
      return scale * x;
    }
  },

  beta: (params) => {
    const alpha = params.alpha;
    const beta = params.beta;
    const scale = params.scale;
    
    // Generate gamma random variables
    const x = Distributions.gamma({shape: alpha, scale: 1});
    const y = Distributions.gamma({shape: beta, scale: 1});
    
    // Beta is x / (x + y)
    return scale * (x / (x + y));
  },

  pareto: (params) => {
    const alpha = params.alpha;
    const xm = params.xm;
    const u = Math.random();
    return xm * Math.pow(1 - u, -1/alpha);
  }
};

// Generate random sample from a distribution
function generateRandomSample(distributionType, params) {
  if (Distributions[distributionType]) {
    return Distributions[distributionType](params);
  } else {
    throw new Error(`Distribution type not supported: ${distributionType}`);
  }
}

// Calculate z-critical value for confidence intervals
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

// Main simulation function
export function simulateQueueNetwork(
  nodes,
  routingMatrix,
  externalArrivalRates,
  arrivalDistributions,
  arrivalParams,
  totalJobs = 1000,
  warmupPeriod = 0.0,
  simulationPeriod = 100.0,
  timeInterval = 1,
  seed = null,
  confidenceLevel = 0.95,
  updateCallback = null
) {
  // Initialize random seed if provided
  if (seed !== null) {
    // JavaScript doesn't have a built-in way to set random seed
    // In a real implementation, we would use a seeded random number generator
    console.log(`Using seed: ${seed}`);
  }

  const eventStack = new EventStack();
  let time = 0.0;
  let jobIdCounter = 0;

  // Initialize statistics
  const nodeStats = {};
  Object.keys(nodes).forEach(nodeId => {
    nodeStats[nodeId] = {
      arrivals: 0,
      departures: 0,
      queueLengths: [],
      times: []
    };
  });

  const jobTimes = {};
  let processedJobs = 0;
  const totalSojournTimes = [];
  const jobStartTimes = {};
  const jobEndTimes = {};

  // Schedule first job arrival
  Object.entries(externalArrivalRates).forEach(([nodeId, rate]) => {
    if (rate > 0) {
      const interArrivalTime = generateRandomSample(
        arrivalDistributions[nodeId],
        arrivalParams[nodeId]
      );
      const arrivalTime = time + interArrivalTime;
      const event = new Event(arrivalTime, 'arrival', jobIdCounter, parseInt(nodeId));
      eventStack.insertEvent(event);
      jobIdCounter++;
    }
  });

  const totalSimulationTime = simulationPeriod + warmupPeriod;
  let lastUpdateTime = 0;
  const updateInterval = 0.01; // 10ms updates as requested by user

  // Run simulation
  while (time < totalSimulationTime) {
    const event = eventStack.popEvent();
    if (event === null) {
      break;
    }

    time = event.time;
    if (time > totalSimulationTime) {
      break;
    }

    const nodeId = event.nodeId;
    const node = nodes[nodeId];
    const stats = nodeStats[nodeId];

    if (event.eventType === 'arrival') {
      const jobId = event.jobId;
      
      if (!jobTimes[jobId]) {
        jobTimes[jobId] = {
          arrivalTimes: {},
          departureTimes: {}
        };
      }

      jobTimes[jobId].arrivalTimes[nodeId] = time;
      node.queue.push(jobId);
      stats.arrivals++;
      jobStartTimes[jobId] = time;

      // If idle, start service
      if (!node.busy) {
        node.busy = true;

        // Start tracking busy time
        if (time >= warmupPeriod) {
          node.lastBusyTime = time;
        } else {
          node.lastBusyTime = warmupPeriod;
        }

        // Schedule departure
        const serviceTime = generateRandomSample(
          node.serviceDistribution,
          node.serviceParams
        );
        const departureTime = time + serviceTime;
        const departureEvent = new Event(
          departureTime,
          'departure',
          jobId,
          nodeId
        );
        eventStack.insertEvent(departureEvent);
        node.serviceTimes.push(serviceTime);
      }

      // Schedule next external arrival
      if (nodeId in externalArrivalRates) {
        const rate = externalArrivalRates[nodeId];
        if (rate > 0) {
          const interArrivalTime = generateRandomSample(
            arrivalDistributions[nodeId],
            arrivalParams[nodeId]
          );
          const nextArrivalTime = time + interArrivalTime;
          const newEvent = new Event(
            nextArrivalTime,
            'arrival',
            jobIdCounter,
            nodeId
          );
          eventStack.insertEvent(newEvent);
          jobIdCounter++;
        }
      }
    } else if (event.eventType === 'departure') {
      const jobId = event.jobId;
      node.queue.shift(); // Remove the first job (equivalent to popleft in Python)
      stats.departures++;
      jobTimes[jobId].departureTimes[nodeId] = time;

      // Route to next node / exit
      const routingProbs = routingMatrix[nodeId] || {};
      if (Object.keys(routingProbs).length > 0) {
        const nextNodeIds = Object.keys(routingProbs);
        const nextProbs = Object.values(routingProbs);
        
        // Choose next node based on routing probabilities
        const rand = Math.random();
        let cumulativeProb = 0;
        let nextNodeId;
        
        for (let i = 0; i < nextNodeIds.length; i++) {
          cumulativeProb += nextProbs[i];
          if (rand <= cumulativeProb) {
            nextNodeId = parseInt(nextNodeIds[i]);
            break;
          }
        }
        
        const nextEvent = new Event(time, 'arrival', jobId, nextNodeId);
        eventStack.insertEvent(nextEvent);
      } else {
        // Exit the system
        processedJobs++;
        jobEndTimes[jobId] = time;
        const firstArrival = Math.min(...Object.values(jobTimes[jobId].arrivalTimes));
        const sojournTime = time - firstArrival;
        totalSojournTimes.push(sojournTime);
      }

      // Start service for next job
      if (node.queue.length > 0) {
        const nextJobId = node.queue[0];
        const serviceTime = generateRandomSample(
          node.serviceDistribution,
          node.serviceParams
        );
        const departureTime = time + serviceTime;
        const departureEvent = new Event(
          departureTime,
          'departure',
          nextJobId,
          nodeId
        );
        eventStack.insertEvent(departureEvent);
        node.serviceTimes.push(serviceTime);
      } else {
        node.busy = false;
        if (node.lastBusyTime !== null) {
          node.totalServiceTime += time - node.lastBusyTime;
          node.lastBusyTime = null;
        }
      }
    }

    // Collect statistics if past warmup period
    if (time >= warmupPeriod) {
      Object.entries(nodes).forEach(([id, node]) => {
        nodeStats[id].queueLengths.push(node.queue.length);
        nodeStats[id].times.push(time);
      });
    }

    // Call update callback for real-time visualization
    if (updateCallback && time - lastUpdateTime >= updateInterval) {
      const currentStats = {
        time,
        nodeStats: JSON.parse(JSON.stringify(nodeStats)),
        processedJobs,
        totalSojournTimes: [...totalSojournTimes],
        simulationProgress: Math.min(100, (time / totalSimulationTime) * 100)
      };
      
      updateCallback(currentStats);
      lastUpdateTime = time;
    }
  }

  // Calculate performance metrics
  const overallMeanSojournTime = totalSojournTimes.length > 0
    ? totalSojournTimes.reduce((sum, time) => sum + time, 0) / totalSojournTimes.length
    : 0;

  return {
    nodeStats,
    overallMeanSojournTime,
    processedJobs,
    totalSojournTimes,
    jobTimes,
    jobStartTimes,
    jobEndTimes
  };
}

/**
 * Validates the queue network using Jackson's Theorem
 * @param {Object} simulationResults - Results from simulation
 * @param {Object} serviceRates - Service rates for each node
 * @param {Object} externalArrivalRates - External arrival rates
 * @param {Object} routingProbabilities - Routing probabilities between nodes
 * @returns {Object} Validation results
 */
export const validateJacksonsTheorem = (
  simulationResults,
  serviceRates,
  externalArrivalRates,
  routingProbabilities
) => {
  // Calculate theoretical utilization for each node
  const theoreticalUtilization = {};
  const simulatedUtilization = {};
  const errors = {};

  // Calculate total arrival rate at each node using Jackson's equations
  const totalArrivalRates = {};
  
  // Initialize with external arrivals
  Object.keys(externalArrivalRates).forEach(node => {
    totalArrivalRates[node] = externalArrivalRates[node] || 0;
  });

  // Solve Jackson's equations iteratively
  let maxDiff = Infinity;
  const tolerance = 0.0001;
  const maxIterations = 100;
  let iterations = 0;

  while (maxDiff > tolerance && iterations < maxIterations) {
    maxDiff = 0;
    const newRates = { ...totalArrivalRates };

    Object.keys(routingProbabilities).forEach(fromNode => {
      Object.entries(routingProbabilities[fromNode]).forEach(([toNode, prob]) => {
        newRates[toNode] = (newRates[toNode] || 0) + totalArrivalRates[fromNode] * prob;
      });
    });

    // Calculate maximum difference
    Object.keys(newRates).forEach(node => {
      const diff = Math.abs((newRates[node] || 0) - (totalArrivalRates[node] || 0));
      maxDiff = Math.max(maxDiff, diff);
    });

    Object.assign(totalArrivalRates, newRates);
    iterations++;
  }

  // Calculate theoretical and simulated utilization
  Object.keys(serviceRates).forEach(node => {
    const lambda = totalArrivalRates[node] || 0;
    const mu = serviceRates[node];
    
    theoreticalUtilization[node] = lambda / mu;
    simulatedUtilization[node] = simulationResults.nodeUtilization[node] || 0;
    
    // Calculate percentage error
    errors[node] = Math.abs(
      ((theoreticalUtilization[node] - simulatedUtilization[node]) / theoreticalUtilization[node]) * 100
    );
  });

  // Calculate overall validation metrics
  const averageError = Object.values(errors).reduce((a, b) => a + b, 0) / Object.keys(errors).length;
  const maxError = Math.max(...Object.values(errors));

  return {
    theoreticalUtilization,
    simulatedUtilization,
    errors,
    averageError,
    maxError,
    isValid: averageError < 5, // Consider valid if average error is less than 5%
    iterations
  };
};