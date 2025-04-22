import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';

/**
 * UtilizationChart component displays utilization metrics for each node
 * 
 * @param {Object} props
 * @param {Object} props.utilizations - Utilization data for each node
 * @param {String} props.theme - theme
 */
const UtilizationChart = ({ utilizations, theme }) => {
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    if (!utilizations) return;

    const processedData = Object.entries(utilizations).map(([nodeId, utilization]) => ({
      name: `Node ${nodeId}`,
      utilization: utilization
    }));
    
    setChartData(processedData);
  }, [utilizations]);

  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  const gridColor = theme === 'dark' ? '#444444' : '#cccccc';
  const backgroundColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
  
  const getBarColor = (utilization) => {
    if (utilization < 0.5) return '#82ca9d'; // Green for low 
    if (utilization < 0.8) return '#ffc658'; // Yellow for medium 
    return '#ff8042'; // Red for high 
  };

  return (
    <div className="w-full h-96 p-4 rounded-lg" style={{ backgroundColor }}>
      <h3 className="text-xl font-semibold mb-4" style={{ color: textColor }}>
        Node Utilization
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="name" 
            stroke={textColor}
          />
          <YAxis 
            label={{ 
              value: 'Utilization', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: textColor } 
            }}
            stroke={textColor}
            domain={[0, 1]}
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: backgroundColor, 
              borderColor: gridColor,
              color: textColor
            }}
            formatter={(value) => [`${(value * 100).toFixed(2)}%`, 'Utilization']}
          />
          <Legend wrapperStyle={{ color: textColor }} />
          <Bar 
            dataKey="utilization" 
            isAnimationActive={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.utilization)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UtilizationChart;
