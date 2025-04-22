import React, { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

/**
 * QueueLengthChart component displays real-time queue lengths for each node
 * 
 * @param {Object} props
 * @param {Object} props.data - Simulation data - node stats
 * @param {Array} props.nodeIds - Array of node IDs 
 * @param {String} props.theme - theme
 */
const QueueLengthChart = ({ data, nodeIds, theme }) => {
  const [chartData, setChartData] = useState([]);
  
  
  const nodeColors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', 
    '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'
  ];

  useEffect(() => {
    if (!data || !data.nodeStats) return;

   
    const processedData = [];
    
    let maxDataPoints = 0;
    nodeIds.forEach(nodeId => {
      const nodeData = data.nodeStats[nodeId];
      if (nodeData && nodeData.times && nodeData.times.length > maxDataPoints) {
        maxDataPoints = nodeData.times.length;
      }
    });

    // Create data points 
    for (let i = 0; i < maxDataPoints; i++) {
      const dataPoint = { time: 0 };
      
      nodeIds.forEach(nodeId => {
        const nodeData = data.nodeStats[nodeId];
        if (nodeData && nodeData.times && nodeData.times[i] !== undefined) {
          dataPoint.time = nodeData.times[i];
          dataPoint[`node${nodeId}`] = nodeData.queueLengths[i];
        }
      });
      
      processedData.push(dataPoint);
    }
    
    //  prevent performance issues
    const maxPoints = 1000;
    const step = processedData.length > maxPoints ? Math.floor(processedData.length / maxPoints) : 1;
    const sampledData = processedData.filter((_, index) => index % step === 0);
    
    setChartData(sampledData);
  }, [data, nodeIds]);


  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  const gridColor = theme === 'dark' ? '#444444' : '#cccccc';
  const backgroundColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';

  return (
    <div className="w-full h-96 p-4 rounded-lg" style={{ backgroundColor }}>
      <h3 className="text-xl font-semibold mb-4" style={{ color: textColor }}>
        Queue Lengths Over Time
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="time" 
            label={{ 
              value: 'Simulation Time', 
              position: 'insideBottomRight', 
              offset: -10,
              style: { fill: textColor }
            }}
            stroke={textColor}
          />
          <YAxis 
            label={{ 
              value: 'Queue Length', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: textColor } 
            }}
            stroke={textColor}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: backgroundColor, 
              borderColor: gridColor,
              color: textColor
            }}
            labelStyle={{ color: textColor }}
          />
          <Legend wrapperStyle={{ color: textColor }} />
          
          {nodeIds.map((nodeId, index) => (
            <Line
              key={nodeId}
              type="stepAfter"
              dataKey={`node${nodeId}`}
              name={`Node ${nodeId}`}
              stroke={nodeColors[index % nodeColors.length]}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default QueueLengthChart;
