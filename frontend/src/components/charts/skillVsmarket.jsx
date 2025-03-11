import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    skill: 'JavaScript',
    userLevel: 80,
    marketDemand: 90,
  },
  {
    skill: 'React',
    userLevel: 70,
    marketDemand: 85,
  },
  {
    skill: 'Node.js',
    userLevel: 60,
    marketDemand: 75,
  },
  {
    skill: 'Python',
    userLevel: 50,
    marketDemand: 80,
  },
  {
    skill: 'AWS',
    userLevel: 40,
    marketDemand: 95,
  },
  {
    skill: 'Docker',
    userLevel: 30,
    marketDemand: 70,
  },
];

function SkillsVsMarketChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="rgba(8, 145, 178, 0.2)" />
        <PolarAngleAxis 
          dataKey="skill" 
          tick={{ fill: "#67e8f9", fontSize: 12 }}
          stroke="#0e7490"
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 100]} 
          tick={{ fill: "#67e8f9" }}
          stroke="#0e7490"
        />
        <Radar 
          name="Your Skills" 
          dataKey="userLevel" 
          stroke="#0891b2"
          fill="#0891b2"
          fillOpacity={0.2}
        />
        <Radar 
          name="Market Demand" 
          dataKey="marketDemand" 
          stroke="#0e7490"
          fill="#0e7490"
          fillOpacity={0.2}
        />
        <Legend 
          wrapperStyle={{ color: "#67e8f9" }}
          formatter={(value) => <span className="text-cyan-300">{value}</span>}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export default SkillsVsMarketChart;

