/**
 * Integration tests for the queue simulation dashboard
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { ThemeProvider } from '../contexts/ThemeContext';

// Mock the chart components to avoid rendering issues in tests
jest.mock('recharts', () => ({
  LineChart: () => <div data-testid="line-chart" />,
  Line: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: () => <div data-testid="bar-chart" />,
  Bar: () => <div />,
  ErrorBar: () => <div />,
  ReferenceLine: () => <div />,
  Cell: () => <div />
}));

describe('App Integration', () => {
  test('renders main application components', async () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );
    
    // Check for header
    expect(screen.getByText('Tandem Queue Simulation')).toBeInTheDocument();
    
    // Check for theme toggle
    expect(screen.getByLabelText(/Switch to/)).toBeInTheDocument();
    
    // Check for main sections
    expect(screen.getByText('Simulation Results')).toBeInTheDocument();
    expect(screen.getByText('Knowledge Base')).toBeInTheDocument();
  });
  
  test('theme toggle changes theme', async () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );
    
    const themeToggle = screen.getByLabelText(/Switch to/);
    
    // Get initial theme
    const initialTheme = document.body.className;
    
    // Toggle theme
    fireEvent.click(themeToggle);
    
    // Check that theme changed
    expect(document.body.className).not.toBe(initialTheme);
  });
});

describe('Simulation Configuration', () => {
  test('network configuration panel allows adding nodes', async () => {
    render(
      <ThemeProvider>
        <NetworkConfigPanel 
          routingMatrix={{ 1: {}, 2: {} }}
          onRoutingMatrixChange={jest.fn()}
          parallelQueues={false}
          onParallelQueuesChange={jest.fn()}
          theme="light"
        />
      </ThemeProvider>
    );
    
    // Check for network configuration panel
    expect(screen.getByText('Network Configuration')).toBeInTheDocument();
    
    // Check for add node button
    const addNodeButton = screen.getByText('Add Node');
    expect(addNodeButton).toBeInTheDocument();
    
    // Click add node button
    fireEvent.click(addNodeButton);
    
    // Check for add node modal
    expect(screen.getByText('Add New Node')).toBeInTheDocument();
  });
  
  test('distribution configuration panel allows selecting distributions', async () => {
    const nodeIds = [1, 2];
    
    render(
      <ThemeProvider>
        <DistributionConfigPanel 
          arrivalDistributions={{}}
          arrivalParams={{}}
          serviceDistributions={{}}
          serviceParams={{}}
          onArrivalDistributionsChange={jest.fn()}
          onArrivalParamsChange={jest.fn()}
          onServiceDistributionsChange={jest.fn()}
          onServiceParamsChange={jest.fn()}
          nodeIds={nodeIds}
          theme="light"
        />
      </ThemeProvider>
    );
    
    // Check for distribution configuration panel
    expect(screen.getByText('Distribution Configuration')).toBeInTheDocument();
    
    // Check for arrival distributions section
    expect(screen.getByText('Arrival Distributions')).toBeInTheDocument();
    
    // Check for service distributions section
    expect(screen.getByText('Service Distributions')).toBeInTheDocument();
  });
  
  test('simulation control panel allows adjusting parameters', async () => {
    render(
      <ThemeProvider>
        <SimulationControlPanel 
          isRunning={false}
          onStart={jest.fn()}
          onPause={jest.fn()}
          onReset={jest.fn()}
          simulationPeriod={100}
          onSimulationPeriodChange={jest.fn()}
          warmupPeriod={10}
          onWarmupPeriodChange={jest.fn()}
          confidenceLevel={0.95}
          onConfidenceLevelChange={jest.fn()}
          simulationSpeed={1}
          onSimulationSpeedChange={jest.fn()}
          simulationProgress={0}
          theme="light"
        />
      </ThemeProvider>
    );
    
    // Check for simulation controls panel
    expect(screen.getByText('Simulation Controls')).toBeInTheDocument();
    
    // Check for start button
    expect(screen.getByText('Start')).toBeInTheDocument();
    
    // Check for pause button
    expect(screen.getByText('Pause')).toBeInTheDocument();
    
    // Check for reset button
    expect(screen.getByText('Reset')).toBeInTheDocument();
    
    // Check for simulation parameters
    expect(screen.getByText('Simulation Parameters')).toBeInTheDocument();
  });
});

describe('Visualization Components', () => {
  test('queue length chart renders with data', async () => {
    const mockData = {
      nodeStats: {
        1: {
          times: [0, 1, 2, 3],
          queueLengths: [0, 1, 2, 1]
        },
        2: {
          times: [0, 1, 2, 3],
          queueLengths: [0, 2, 1, 0]
        }
      }
    };
    
    render(
      <ThemeProvider>
        <QueueLengthChart 
          data={mockData}
          nodeIds={[1, 2]}
          theme="light"
        />
      </ThemeProvider>
    );
    
    // Check for chart title
    expect(screen.getByText('Queue Lengths Over Time')).toBeInTheDocument();
    
    // Check for chart component
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });
  
  test('sojourn time chart renders with data', async () => {
    const mockData = {
      meanSojournTime: 0.5,
      confidenceInterval: 0.05
    };
    
    render(
      <ThemeProvider>
        <SojournTimeChart 
          data={mockData}
          confidenceLevel={0.95}
          theme="light"
        />
      </ThemeProvider>
    );
    
    // Check for chart title
    expect(screen.getByText(/Mean Sojourn Time with/)).toBeInTheDocument();
    
    // Check for chart component
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
  
  test('batch means chart renders with data', async () => {
    const mockSojournTimes = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
    
    render(
      <ThemeProvider>
        <BatchMeansChart 
          sojournTimes={mockSojournTimes}
          batchSize={2}
          confidenceLevel={0.95}
          theme="light"
        />
      </ThemeProvider>
    );
    
    // Check for chart title
    expect(screen.getByText(/Batch Means/)).toBeInTheDocument();
    
    // Check for chart component
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });
  
  test('utilization chart renders with data', async () => {
    const mockUtilizations = {
      1: 0.5,
      2: 0.7
    };
    
    render(
      <ThemeProvider>
        <UtilizationChart 
          utilizations={mockUtilizations}
          theme="light"
        />
      </ThemeProvider>
    );
    
    // Check for chart title
    expect(screen.getByText('Node Utilization')).toBeInTheDocument();
    
    // Check for chart component
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
});

describe('Knowledge Base', () => {
  test('knowledge base section renders content', async () => {
    render(
      <ThemeProvider>
        <KnowledgeBaseSection />
      </ThemeProvider>
    );
    
    // Check for knowledge base title
    expect(screen.getByText('Queuing Theory Knowledge Base')).toBeInTheDocument();
    
    // Check for section headings
    expect(screen.getByText('Introduction to Queuing Theory')).toBeInTheDocument();
    expect(screen.getByText('Kendall\'s Notation')).toBeInTheDocument();
    expect(screen.getByText('Distribution Types')).toBeInTheDocument();
    expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
    expect(screen.getByText('Little\'s Law')).toBeInTheDocument();
    expect(screen.getByText('Jackson\'s Theorem')).toBeInTheDocument();
    expect(screen.getByText('References and Further Reading')).toBeInTheDocument();
  });
});
