import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * KnowledgeBaseSection component for displaying information about queuing theory
 */
const KnowledgeBaseSection = () => {
  const { theme } = useTheme();
  
  // Theme-based styling
  const backgroundColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
  const borderColor = theme === 'dark' ? '#444444' : '#e5e7eb';
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  const headingColor = theme === 'dark' ? '#3b82f6' : '#2563eb';
  
  return (
    <div 
      className="w-full p-6 rounded-lg border"
      style={{ 
        backgroundColor, 
        color: textColor,
        borderColor
      }}
    >
      <h2 className="text-2xl font-bold mb-6" style={{ color: headingColor }}>
        Queuing Theory Knowledge Base
      </h2>
      
      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold mb-3">Introduction to Queuing Theory</h3>
          <p className="mb-3">
            Queuing theory is the mathematical study of waiting lines or queues. It is a branch of operations research that examines every component of waiting in line, including the arrival process, service process, number of servers, number of system places, and the number of customers.
          </p>
          <p>
            The theory enables the mathematical analysis of several related processes, including arriving at the queue, waiting in the queue, and being served at the front of the queue. The theory permits the derivation and calculation of several performance measures including the average waiting time in the queue or the system, the expected number of customers in the queue or the system, and the probability of encountering the system in certain states.
          </p>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-3">Kendall's Notation</h3>
          <p className="mb-3">
            Queuing models are commonly described using Kendall's notation in the form A/S/c/K/N/D, where:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>A</strong>: Arrival process distribution</li>
            <li><strong>S</strong>: Service time distribution</li>
            <li><strong>c</strong>: Number of servers</li>
            <li><strong>K</strong>: System capacity (maximum number of customers allowed)</li>
            <li><strong>N</strong>: Population size</li>
            <li><strong>D</strong>: Service discipline (e.g., FIFO, LIFO)</li>
          </ul>
          <p className="mt-3">
            Common distributions include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>M</strong>: Markovian (exponential) distribution</li>
            <li><strong>D</strong>: Deterministic distribution</li>
            <li><strong>G</strong>: General distribution</li>
            <li><strong>E<sub>k</sub></strong>: Erlang distribution with parameter k</li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-3">Distribution Types</h3>
          <p className="mb-3">
            This simulation supports various distribution types for arrival and service processes:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border" style={{ borderColor }}>
              <h4 className="font-semibold mb-2">Exponential Distribution</h4>
              <p>
                The exponential distribution describes the time between events in a Poisson process. It is commonly used to model inter-arrival times and service times in queuing systems.
              </p>
              <p className="mt-2">
                <strong>Parameter:</strong> Mean (λ)
              </p>
              <p className="mt-1">
                <strong>PDF:</strong> f(x) = λe<sup>-λx</sup> for x ≥ 0
              </p>
            </div>
            
            <div className="p-4 rounded-lg border" style={{ borderColor }}>
              <h4 className="font-semibold mb-2">Erlang Distribution</h4>
              <p>
                The Erlang distribution represents the sum of k independent exponentially distributed random variables, each with mean θ.
              </p>
              <p className="mt-2">
                <strong>Parameters:</strong> Shape (k), Scale (θ)
              </p>
              <p className="mt-1">
                <strong>PDF:</strong> f(x) = (x<sup>k-1</sup>e<sup>-x/θ</sup>)/(θ<sup>k</sup>(k-1)!) for x ≥ 0
              </p>
            </div>
            
            <div className="p-4 rounded-lg border" style={{ borderColor }}>
              <h4 className="font-semibold mb-2">Hyperexponential Distribution</h4>
              <p>
                The hyperexponential distribution is a mixture of exponential distributions, used to model processes with high variability.
              </p>
              <p className="mt-2">
                <strong>Parameters:</strong> Probabilities (p<sub>i</sub>), Means (μ<sub>i</sub>)
              </p>
            </div>
            
            <div className="p-4 rounded-lg border" style={{ borderColor }}>
              <h4 className="font-semibold mb-2">Coxian Distribution</h4>
              <p>
                The Coxian distribution is a phase-type distribution that generalizes the Erlang distribution by allowing different rates in each phase and probabilistic advancement.
              </p>
              <p className="mt-2">
                <strong>Parameters:</strong> Rates (λ<sub>i</sub>), Probabilities (p<sub>i</sub>)
              </p>
            </div>
          </div>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-3">Performance Metrics</h3>
          <p className="mb-3">
            Several key performance metrics are used to evaluate queuing systems:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Utilization (ρ):</strong> The fraction of time the server is busy. For a stable system, ρ must be less than 1.
            </li>
            <li>
              <strong>Mean Queue Length (L<sub>q</sub>):</strong> The average number of customers waiting in the queue.
            </li>
            <li>
              <strong>Mean System Length (L):</strong> The average number of customers in the system (waiting and being served).
            </li>
            <li>
              <strong>Mean Waiting Time (W<sub>q</sub>):</strong> The average time a customer spends waiting in the queue.
            </li>
            <li>
              <strong>Mean Sojourn Time (W):</strong> The average time a customer spends in the system (waiting plus service time).
            </li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-3">Little's Law</h3>
          <p className="mb-3">
            Little's Law is a fundamental theorem in queuing theory that states:
          </p>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
            <p className="text-lg font-semibold">L = λW</p>
          </div>
          <p className="mt-3">
            Where:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>L</strong>: Mean number of customers in the system</li>
            <li><strong>λ</strong>: Average customer arrival rate</li>
            <li><strong>W</strong>: Mean time a customer spends in the system</li>
          </ul>
          <p className="mt-3">
            This law applies to any stable system, regardless of the specific arrival or service distributions, and is used to validate simulation results.
          </p>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-3">Jackson's Theorem</h3>
          <p className="mb-3">
            Jackson's theorem applies to networks of queues, stating that in an open network of queues where:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>External arrivals to each node follow a Poisson process</li>
            <li>Service times are exponentially distributed</li>
            <li>Routing is probabilistic and independent of the system state</li>
          </ul>
          <p className="mt-3">
            Then each node behaves as if it were an independent M/M/c queue with an adjusted arrival rate that accounts for both external arrivals and internal transfers from other nodes.
          </p>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-3">Network Partitioning</h3>
          <p className="mb-3">
            Network partitioning in queuing systems involves dividing the network into separate components that can operate independently. This approach:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Allows for parallel processing of events in different partitions</li>
            <li>Requires synchronization mechanisms when jobs move between partitions</li>
            <li>May use rollback mechanisms to maintain causal ordering of events</li>
            <li>Can significantly improve simulation performance for large networks</li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-3">References and Further Reading</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Kleinrock, L. (1975). Queueing Systems, Volume 1: Theory. Wiley-Interscience.</li>
            <li>Gross, D., Shortle, J. F., Thompson, J. M., & Harris, C. M. (2008). Fundamentals of Queueing Theory. Wiley-Interscience.</li>
            <li>Bolch, G., Greiner, S., de Meer, H., & Trivedi, K. S. (2006). Queueing Networks and Markov Chains. Wiley-Interscience.</li>
            <li>Harchol-Balter, M. (2013). Performance Modeling and Design of Computer Systems: Queueing Theory in Action. Cambridge University Press.</li>
            <li><a href="https://en.wikipedia.org/wiki/Phase-type_distribution" style={{ color: headingColor }}>Wikipedia: Phase-Type Distributions</a></li>
            <li><a href="https://qmodels.readthedocs.io/en/latest/mm1.html" style={{ color: headingColor }}>Queueing Models Documentation</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default KnowledgeBaseSection;
