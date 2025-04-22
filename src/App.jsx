import React, { useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import SimulationPanel from './components/simulation/SimulationPanel';
import ResultsPanel from './components/simulation/ResultsPanel';
import KnowledgeBase from './components/knowledge/KnowledgeBase';
import { useTheme } from './contexts/ThemeContext';

/**
 * App component - Main application layout
 */
const App = () => {
  const { theme } = useTheme();
  const [simulationConfig, setSimulationConfig] = useState({
    queueType: 'M/M/1',
    arrivalRate: 1,
    serviceRate: 2,
    numServers: 1,
    bufferSize: Infinity,
    timeLimit: 100,
    warmupPeriod: 10,
    distribution: {
      arrival: 'exponential',
      service: 'exponential'
    }
  });

  const [simulationResults, setSimulationResults] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Theme-based styling
  const backgroundColor = theme === 'dark' ? '#0f172a' : '#f8fafc';
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  
  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor,
        color: textColor
      }}
    >
      <Header />
      
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar with Configuration */}
        <div className="w-full lg:w-1/4 p-4">
          <Sidebar 
            config={simulationConfig}
            onConfigChange={setSimulationConfig}
            isSimulating={isSimulating}
            onStartSimulation={() => setIsSimulating(true)}
            onStopSimulation={() => setIsSimulating(false)}
          />
            </div>
          
        {/* Main Content */}
        <div className="flex-1 p-4">
            <div className="space-y-8">
            {/* Simulation Visualization */}
            <SimulationPanel 
              config={simulationConfig}
              isSimulating={isSimulating}
              onResultsUpdate={setSimulationResults}
            />

            {/* Results and Analytics */}
            {simulationResults && (
              <ResultsPanel 
                results={simulationResults}
                config={simulationConfig}
              />
            )}

            {/* Knowledge Base */}
            <KnowledgeBase />
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;
