import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const SalaryRangesChart = () => {
  const [hoveredBar, setHoveredBar] = useState(null);
  
  const data = [
    {
      name: 'Software Engineer',
      minimum: 80,
      median: 115,
      maximum: 150,
    },
    {
      name: 'Data Scientist',
      minimum: 90,
      median: 125,
      maximum: 160,
    },
    {
      name: 'Frontend Developer',
      minimum: 70,
      median: 95,
      maximum: 130,
    },
    {
      name: 'Backend Developer',
      minimum: 75,
      median: 105,
      maximum: 140,
    },
    {
      name: 'DevOps Engineer',
      minimum: 95,
      median: 130,
      maximum: 175,
    },
    {
      name: 'Mobile Developer',
      minimum: 70,
      median: 100,
      maximum: 135,
    },
  ];

  // Updated muted cyan color scheme
  const colors = {
    minimum: '#0891b2',    // cyan-600
    median: '#0e7490',     // cyan-700
    maximum: '#155e75',    // cyan-800
    muted: '#164e63',      // cyan-900
    hover: '#22d3ee',      // cyan-400 (for hover effects)
    text: '#67e8f9',       // cyan-300 (for text)
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = data.find(item => item.name === label);
      
      return (
        <div className="bg-zinc-900/90 p-4 rounded-xl border border-cyan-800/20 shadow-lg backdrop-blur-sm">
          <p className="text-cyan-300 font-semibold mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-cyan-400 text-sm flex items-center">
              <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: colors.minimum }}></span>
              Minimum: ${dataPoint.minimum}K
            </p>
            <p className="text-cyan-400 text-sm flex items-center">
              <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: colors.median }}></span>
              Median: ${dataPoint.median}K
            </p>
            <p className="text-cyan-400 text-sm flex items-center">
              <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: colors.maximum }}></span>
              Maximum: ${dataPoint.maximum}K
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex justify-center gap-6 pt-4">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 mr-2 rounded-full" 
              style={{ 
                backgroundColor: entry.color,
                boxShadow: '0 0 8px rgba(8, 145, 178, 0.1)' // More subtle shadow
              }}
            ></div>
            <span className="text-cyan-300 text-sm">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const handleMouseEnter = (data) => {
    setHoveredBar(data.name);
  };

  const handleMouseLeave = () => {
    setHoveredBar(null);
  };

  return (
    <div className="bg-zinc-900/50 rounded-xl p-4 h-full backdrop-blur-sm">
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          barSize={20}
          barGap={0}
          barCategoryGap={30}
        >
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#67e8f9' }} // cyan-300
            axisLine={{ stroke: '#155e75' }} // cyan-800
          />
          <YAxis 
            tick={{ fill: '#67e8f9' }} // cyan-300
            axisLine={{ stroke: '#155e75' }} // cyan-800
            label={{ 
              value: 'Salary ($K)', 
              angle: -90, 
              position: 'insideLeft', 
              fill: '#67e8f9', // cyan-300
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
          
          {['minimum', 'median', 'maximum'].map((key, i) => (
            <Bar 
              key={key}
              dataKey={key}
              name={key.charAt(0).toUpperCase() + key.slice(1)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              fill={colors[key]}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`${key}-${index}`}
                  fill={hoveredBar === null || hoveredBar === entry.name ? colors[key] : colors.muted}
                  opacity={hoveredBar === null || hoveredBar === entry.name ? 1 : 0.4}
                  style={{ 
                    filter: hoveredBar === entry.name ? `drop-shadow(0 0 4px ${colors.hover})` : 'none',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalaryRangesChart;