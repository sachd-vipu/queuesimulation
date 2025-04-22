# Interactive Queuing Simulation Dashboard

A modern, reactive web-based dashboard for simulating and visualizing queuing networks, built with React. This project is an enhanced, interactive version of the [tandem queue simulation](https://github.com/sachd-vipu/tandem-queue) originally developed for CSE 517.

## Overview

This project transforms the original Python-based queuing network simulation into an interactive web application, allowing users to dynamically configure, visualize, and analyze queuing systems in real-time.

## Live Demo

- Personal Website: [https://vipulsachdeva.tech/projects/queuesimulation](https://vipulsachdeva.tech/projects/queuesimulation)


## Deployment

This project is automatically deployed to the personal website using GitHub Actions. The deployment is triggered on every push to the main branch.
https://vipulsachdeva.tech/projects/queuesimulation/


## Features

### Core Functionalities
- **Interactive Network Configuration**
  - Visual network topology builder
  - Dynamic routing matrix configuration
  - Real-time parameter adjustment
  - Support for multiple queuing nodes

### Distribution Support
- **Configurable Distributions for Arrival & Service Times**
  - Exponential
  - Erlang
  - Hyperexponential
  - Deterministic
  - Uniform


### Visualization & Analytics
- **Real-time Performance Metrics**
  - Mean sojourn times
  - Queue lengths
  - Utilization rates
  - Confidence intervals

- **Interactive Charts**
  - Queue length variations
  - Batch mean sojourn times
  - Distribution histograms
  - Theoretical vs. simulated comparisons

### Validation Tools
- Little's Law validation
- Jackson's Theorem verification
- Confidence interval calculations
- Batch means analysis

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── config/
│   │   │   ├── DistributionConfigPanel.jsx
│   │   │   ├── NetworkConfigPanel.jsx
│   │   │   └── SimulationControls.jsx
│   │   ├── visualization/
│   │   │   ├── NetworkGraph.jsx
│   │   │   ├── PerformanceCharts.jsx
│   │   │   └── QueueVisualizer.jsx
│   │   └── analysis/
│   │       ├── ValidationPanel.jsx
│   │       └── StatisticsPanel.jsx
│   ├── lib/
│   │   ├── simulationEngine.js
│   │   ├── distributions.js
│   │   └── validators.js
│   ├── hooks/
│   │   └── useSimulation.js
│   └── utils/
│       ├── mathUtils.js
│       └── chartUtils.js
├── public/
├── .github/
│   └── workflows/
│       └── deploy.yml
└── package.json
```

## Added Functionalities from Original Project

1. **Interactive UI/UX**
   - Real-time parameter adjustments

2. **Enhanced Visualization**
   - Animated queue state changes
   - Interactive charts and graphs
   - Real-time performance metrics


## Future Scope

   
1. **Advanced Features**
   - Multiple server nodes
   - Priority queuing systems
   - Batch arrival/service support
   - Custom distribution definitions
   - Dynamic network topology visualization
   - Drag-and-drop node configuration
   - Add more distribution support for service and arrival times


## To-Do List
- [ ] Create drag and drop canvas for network topology
- [ ] Implement per node configuration and probability matrix 
- [ ] Implement network partitioning for distributed simulation
- [ ] Add support for bulk arrivals and services
- [ ] Implement simulation state persistence
- [ ] Simulation run comparison for last two runs or three runs
- [ ] Update Knowledge Base
- [ ] Optimize performance for large-scale simulations

## Installation

```bash
# Clone the repository
git clone https://github.com/sachd-vipu/queuesimulation.git

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Required GitHub Secrets
- `PAT_TOKEN`: Token(classic)

## Author

Vipul Sachdeva
