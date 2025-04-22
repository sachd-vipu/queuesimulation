import React, { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  ErrorBar
} from 'recharts';
import { calculateBatchMeans } from '../../lib/simulationEngine';

/**
 * display batch means with C.I.s
 * @param {Object} props
 * @param {Array} props.sojournTimes - Array of sojourn times 
 * @param {Number} props.batchSize - Size of each batch
 * @param {Number} props.confidenceLevel - Confidence level for intervals
 * @param {String} props.theme -  theme
 */

const BatchMeansChart = ({ sojournTimes, batchSize = 100, confidenceLevel = 0.95, theme }) => {
  const [chartData, setChartData] = useState([]);
  const [overallMean, setOverallMean] = useState(0);
  
  useEffect(() => {
    if (!sojournTimes || sojournTimes.length === 0) return;

    //  batch means
    const { batchMeans, batchConfIntervals, batchNumbers } = calculateBatchMeans(
      sojournTimes,
      batchSize,
      confidenceLev
    );
    
    // Create data 
    const newChartData = batchNumbers.map((batchNum, index) => ({
      batchNumber: batchNum,
      mean: batchMeans[index],
      error: batchConfIntervals[index]
    }));
    
    // overall mean
    const mean = sojournTimes.reduce((sum, time) => sum + time, 0) / sojournTimes.length;
    
    setChartData(newChartData);
    setOverallMean(mean);
  }, [sojournTimes, batchSize, confidenceLevel]);

 
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  const gridColor = theme === 'dark' ? '#444444' : '#cccccc';
  const backgroundColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
  const lineColor = theme === 'dark' ? '#8884d8' : '#8884d8';
  const referenceLineColor = theme === 'dark' ? '#ff8042' : '#ff8042';

  return (
    <div className="w-full h-96 p-4 rounded-lg" style={{ backgroundColor }}>
      <h3 className="text-xl font-semibold mb-4" style={{ color: textColor }}>
        Batch Means (size={batchSize}) with {confidenceLevel * 100}% Confidence Intervals
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="batchNumber" 
            label={{ 
              value: 'Batch Number', 
              position: 'insideBottomRight', 
              offset: -10,
              style: { fill: textColor }
            }}
            stroke={textColor}
          />
          <YAxis 
            label={{ 
              value: 'Batch Mean Sojourn Time', 
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
            formatter={(value, name) => [
              name === 'mean' ? `${value.toFixed(4)}` : value, 
              name === 'mean' ? 'Batch Mean' : name
            ]}
            labelFormatter={(value) => `Batch ${value}`}
          />
          <Legend wrapperStyle={{ color: textColor }} />
          <ReferenceLine 
            y={overallMean} 
            label={{ 
              value: `Overall Mean: ${overallMean.toFixed(4)}`, 
              position: 'right',
              style: { fill: textColor }
            }} 
            stroke={referenceLineColor} 
            strokeDasharray="3 3" 
          />
          <Line
            type="monotone"
            dataKey="mean"
            name="Batch Mean"
            stroke={lineColor}
            isAnimationActive={false}
          >
            <ErrorBar 
              dataKey="error" 
              width={4} 
              strokeWidth={2} 
              stroke="#ff8042" 
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BatchMeansChart;
