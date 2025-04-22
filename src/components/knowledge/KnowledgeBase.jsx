import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Latex from 'react-latex';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const KnowledgeBase = () => {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState('intro');
  
  // Theme-based styling
  const backgroundColor = theme === 'dark' ? '#1e293b' : '#ffffff';
  const borderColor = theme === 'dark' ? '#334155' : '#e2e8f0';
  const cardBg = theme === 'dark' ? '#334155' : '#f8fafc';

  const sections = {
    intro: {
      title: 'Introduction to Queueing Theory',
      content: `Queueing theory is a mathematical study of waiting lines, or queues. 
      It analyzes the behavior of systems where customers arrive, wait for service, 
      and depart after being served. The theory helps predict queue lengths, waiting times, 
      and system performance under various conditions.`
    },
    notation: {
      title: "Kendall's Notation",
      content: (
        <>
          <p>Queues are described using Kendall's notation: A/B/c/K/N/D where:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>A: arrival process distribution</li>
            <li>B: service time distribution</li>
            <li>c: number of servers</li>
            <li>K: system capacity (default: ∞)</li>
            <li>N: population size (default: ∞)</li>
            <li>D: service discipline (default: FIFO)</li>
          </ul>
          <p className="mt-4">Common distributions:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>M: Markovian (exponential)</li>
            <li>D: Deterministic</li>
            <li>G: General</li>
          </ul>
        </>
      )
    },
    littleLaw: {
      title: "Little's Law",
      content: (
        <>
          <p>
            <Latex>{'$L = \\lambda W$'}</Latex> where:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>L: average number of customers in the system</li>
            <li>λ: average arrival rate</li>
            <li>W: average time spent in the system</li>
          </ul>
          <p className="mt-4">Similarly for the queue:</p>
          <p>
            <Latex>{'$L_q = \\lambda W_q$'}</Latex> where:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Lq: average queue length</li>
            <li>Wq: average waiting time in queue</li>
          </ul>
        </>
      )
    },
    mm1: {
      title: 'M/M/1 Queue',
      content: (
        <>
          <p>For an M/M/1 queue with arrival rate λ and service rate μ:</p>
          <div className="space-y-4 mt-4">
            <p>Utilization: <Latex>{'$\\rho = \\frac{\\lambda}{\\mu}$'}</Latex></p>
            <p>Average number in system: <Latex>{'$L = \\frac{\\rho}{1-\\rho}$'}</Latex></p>
            <p>Average number in queue: <Latex>{'$L_q = \\frac{\\rho^2}{1-\\rho}$'}</Latex></p>
            <p>Average time in system: <Latex>{'$W = \\frac{1}{\\mu-\\lambda}$'}</Latex></p>
            <p>Average waiting time: <Latex>{'$W_q = \\frac{\\rho}{\\mu-\\lambda}$'}</Latex></p>
          </div>
        </>
      )
    },
    mmc: {
      title: 'M/M/c Queue',
      content: (
        <>
          <p>For an M/M/c queue with c servers:</p>
          <div className="space-y-4 mt-4">
            <p>Utilization: <Latex>{'$\\rho = \\frac{\\lambda}{c\\mu}$'}</Latex></p>
            <p>Probability of empty system:</p>
            <p>
              <Latex>{'$P_0 = [\\sum_{n=0}^{c-1}\\frac{(c\\rho)^n}{n!} + \\frac{(c\\rho)^c}{c!(1-\\rho)}]^{-1}$'}</Latex>
            </p>
            <p>Average queue length:</p>
            <p>
              <Latex>{'$L_q = \\frac{P_0(c\\rho)^c\\rho}{c!(1-\\rho)^2}$'}</Latex>
            </p>
          </div>
        </>
      )
    },
    stability: {
      title: 'System Stability',
      content: (
        <>
          <p>A queueing system is considered stable when:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              The utilization factor ρ is less than 1:
              <p className="mt-2">
                <Latex>{'$\\rho = \\frac{\\lambda}{c\\mu} < 1$'}</Latex>
              </p>
            </li>
            <li>The average queue length remains finite</li>
            <li>The waiting time remains finite</li>
          </ul>
          <p className="mt-4">
            When ρ ≥ 1, the queue will grow indefinitely and the system becomes unstable.
          </p>
        </>
      )
    }
  };

  return (
    <div
      className="rounded-lg border p-4 space-y-6"
      style={{ 
        backgroundColor,
        borderColor
      }}
    >
      <h2 className="text-xl font-semibold">Knowledge Base</h2>
      
      <div className="space-y-4">
        {Object.entries(sections).map(([key, section]) => (
          <div
            key={key}
            className="border rounded-lg overflow-hidden"
            style={{ borderColor }}
          >
            <button
              className="w-full p-4 flex justify-between items-center text-left"
              style={{ backgroundColor: cardBg }}
              onClick={() => setActiveSection(activeSection === key ? null : key)}
            >
              <h3 className="text-lg font-medium">{section.title}</h3>
              <ChevronDownIcon 
                className={`w-5 h-5 transform transition-transform ${
                  activeSection === key ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {activeSection === key && (
              <div className="p-4 space-y-4">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeBase; 