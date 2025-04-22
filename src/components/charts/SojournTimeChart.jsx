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
  ErrorBar
} from 'recharts';

/**
 * SojournTimeChart component displays sojourn times with confidence intervals
 * 
 * @param {Object} props
 * @param {Object} props.data - Simulation data - sojourn times
 * @param {Number} props.confidenceLevel - Confidence level 
 * @param {String} props.theme - theme
 */
const SojournTimeChart = ({ data, confidenceLevel = 0.95, theme }) => {
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    if (!data || !data.meanSojournTime) return;

    const newChartData = [{
      name: 'Mean Sojourn Time',
      value: data.meanSojournTime,
      error: data.confidenceInterval
    }];
    
    setChartData(newChartData);
  }, [data]);

  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  const gridColor = theme === 'dark' ? '#444444' : '#cccccc';
  const backgroundColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
  const barColor = theme === 'dark' ? '#8884d8' : '#8884d8';

  return (
    <div className="w-full h-96 p-4 rounded-lg" style={{ backgroundColor }}>
      <h3 className="text-xl font-semibold mb-4" style={{ color: textColor }}>
        Mean Sojourn Time with {confidenceLevel * 100}% Confidence Interval
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
              value: 'Time', 
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
            formatter={(value, name) => [`${value.toFixed(4)}`, 'Value']}
            labelFormatter={(value) => `${value}`}
          />
          <Legend wrapperStyle={{ color: textColor }} />
          <Bar 
            dataKey="value" 
            fill={barColor} 
            isAnimationActive={false}
          >
            <ErrorBar 
              dataKey="error" 
              width={4} 
              strokeWidth={2} 
              stroke="#ff8042" 
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SojournTimeChart;
