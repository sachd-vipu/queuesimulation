/**
 * Tests for the simulation engine
 */

import {
  Event,
  EventStack,
  Queue,
  Distributions,
  generateRandomSample,
  simulateQueueNetwork,
  calculateLittleL,
  validateWithJackson
} from '../lib/simulationEngine';

// Test Event class
describe('Event', () => {
  test('should create an event with correct properties', () => {
    const event = new Event(10.5, 'arrival', 1, 2);
    expect(event.time).toBe(10.5);
    expect(event.eventType).toBe('arrival');
    expect(event.jobId).toBe(1);
    expect(event.nodeId).toBe(2);
    expect(event.nextEvent).toBeNull();
    expect(event.prevEvent).toBeNull();
    expect(event.sourceStackId).toBe(0);
  });
});

// Test EventStack class
describe('EventStack', () => {
  let eventStack;

  beforeEach(() => {
    eventStack = new EventStack();
  });

  test('should initialize as empty', () => {
    expect(eventStack.isEmpty()).toBe(true);
    expect(eventStack.head).toBeNull();
    expect(eventStack.tail).toBeNull();
  });

  test('should insert and pop events in correct order', () => {
    const event1 = new Event(10, 'arrival', 1, 1);
    const event2 = new Event(5, 'arrival', 2, 1);
    const event3 = new Event(15, 'departure', 3, 2);

    eventStack.insertEvent(event1);
    eventStack.insertEvent(event2);
    eventStack.insertEvent(event3);

    // Events should be popped in time order (event2, event1, event3)
    const popped1 = eventStack.popEvent();
    expect(popped1.time).toBe(5);
    expect(popped1.jobId).toBe(2);

    const popped2 = eventStack.popEvent();
    expect(popped2.time).toBe(10);
    expect(popped2.jobId).toBe(1);

    const popped3 = eventStack.popEvent();
    expect(popped3.time).toBe(15);
    expect(popped3.jobId).toBe(3);

    expect(eventStack.isEmpty()).toBe(true);
  });
});

// Test Queue class
describe('Queue', () => {
  test('should initialize with correct properties', () => {
    const queue = new Queue(1, 'exponential', { mean: 1.0 });
    expect(queue.nodeId).toBe(1);
    expect(queue.queue).toEqual([]);
    expect(queue.serviceDistribution).toBe('exponential');
    expect(queue.serviceParams).toEqual({ mean: 1.0 });
    expect(queue.busy).toBe(false);
  });
});

// Test distribution generators
describe('Distributions', () => {
  test('exponential distribution should generate positive values', () => {
    const params = { mean: 1.0 };
    for (let i = 0; i < 100; i++) {
      const sample = Distributions.exponential(params);
      expect(sample).toBeGreaterThan(0);
    }
  });

  test('deterministic distribution should return exact value', () => {
    const params = { value: 5.0 };
    const sample = Distributions.deterministic(params);
    expect(sample).toBe(5.0);
  });

  test('uniform distribution should generate values within range', () => {
    const params = { low: 1.0, high: 5.0 };
    for (let i = 0; i < 100; i++) {
      const sample = Distributions.uniform(params);
      expect(sample).toBeGreaterThanOrEqual(1.0);
      expect(sample).toBeLessThanOrEqual(5.0);
    }
  });
});

// Test generateRandomSample function
describe('generateRandomSample', () => {
  test('should generate samples from specified distribution', () => {
    const expSample = generateRandomSample('exponential', { mean: 1.0 });
    expect(expSample).toBeGreaterThan(0);

    const detSample = generateRandomSample('deterministic', { value: 3.0 });
    expect(detSample).toBe(3.0);

    expect(() => {
      generateRandomSample('invalid_distribution', {});
    }).toThrow();
  });
});

// Test simulateQueueNetwork function with a simple M/M/1 queue
describe('simulateQueueNetwork', () => {
  test('should simulate a simple M/M/1 queue', () => {
    // Create a simple single-node queue
    const nodes = {
      1: new Queue(1, 'exponential', { mean: 1/10 }) // Service rate μ = 10
    };
    
    const routingMatrix = {
      1: {} // Exit node
    };
    
    const externalArrivalRates = {
      1: 5 // Arrival rate λ = 5
    };
    
    const arrivalDistributions = {
      1: 'exponential'
    };
    
    const arrivalParams = {
      1: { mean: 1/5 }
    };
    
    // Run a short simulation
    const results = simulateQueueNetwork(
      nodes,
      routingMatrix,
      externalArrivalRates,
      arrivalDistributions,
      arrivalParams,
      100, // totalJobs
      10,  // warmupPeriod
      50,  // simulationPeriod
      1,   // timeInterval
      123  // seed
    );
    
    // Check that results contain expected properties
    expect(results).toHaveProperty('meanSojournTime');
    expect(results).toHaveProperty('confidenceInterval');
    expect(results).toHaveProperty('nodeStats');
    expect(results).toHaveProperty('utilizations');
    expect(results).toHaveProperty('sojournTimes');
    
    // For M/M/1 queue with λ=5, μ=10, theoretical mean sojourn time is 1/(μ-λ) = 1/(10-5) = 0.2
    // Allow some deviation due to simulation randomness
    expect(results.meanSojournTime).toBeGreaterThan(0);
    
    // Utilization should be λ/μ = 5/10 = 0.5
    expect(results.utilizations[1]).toBeGreaterThan(0);
    expect(results.utilizations[1]).toBeLessThan(1); // System should be stable
  });
});

// Test Little's Law validation
describe('calculateLittleL', () => {
  test('should calculate Little\'s L correctly', () => {
    const mockResults = {
      meanSojournTime: 0.2,
      nodeStats: {
        1: {
          queueLengths: Array(100).fill(1) // Average queue length of 1
        }
      }
    };
    
    const externalArrivalRates = {
      1: 5
    };
    
    const littleResults = calculateLittleL(
      mockResults,
      externalArrivalRates,
      mockResults.meanSojournTime
    );
    
    // Little's L = λW = 5 * 0.2 = 1
    expect(littleResults.littleL).toBeCloseTo(1, 1);
    expect(littleResults.simulatedAverage).toBeCloseTo(1, 1);
    expect(littleResults.ratio).toBeCloseTo(1, 1);
  });
});

// Test Jackson's Theorem validation
describe('validateWithJackson', () => {
  test('should validate with Jackson\'s theorem correctly', () => {
    const mockSimulation = {
      meanSojournTime: 0.3,
      confidenceInterval: 0.05,
      utilizations: {
        1: 0.5,
        2: 0.5
      },
      nodeStats: {
        1: {
          queueLengths: Array(100).fill(1)
        },
        2: {
          queueLengths: Array(100).fill(1)
        }
      }
    };
    
    const arrivalRate = 5;
    const serviceRates = [10, 10];
    const numQueues = 2;
    
    const jacksonResults = validateWithJackson(
      mockSimulation,
      arrivalRate,
      serviceRates,
      numQueues
    );
    
    // Check that results contain expected properties
    expect(jacksonResults).toHaveProperty('theoretical');
    expect(jacksonResults).toHaveProperty('simulated');
    expect(jacksonResults).toHaveProperty('percentageError');
    
    // Theoretical utilization should be λ/μ = 5/10 = 0.5
    expect(jacksonResults.theoretical.utilizations[0]).toBeCloseTo(0.5, 1);
    expect(jacksonResults.theoretical.utilizations[1]).toBeCloseTo(0.5, 1);
  });
});
