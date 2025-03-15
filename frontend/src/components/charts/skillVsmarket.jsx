// // // import React from 'react';
// // // import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';

// // // const data = [
// // //   {
// // //     skill: 'JavaScript',
// // //     userLevel: 80,
// // //     marketDemand: 90,
// // //   },
// // //   {
// // //     skill: 'React',
// // //     userLevel: 70,
// // //     marketDemand: 85,
// // //   },
// // //   {
// // //     skill: 'Node.js',
// // //     userLevel: 60,
// // //     marketDemand: 75,
// // //   },
// // //   {
// // //     skill: 'Python',
// // //     userLevel: 50,
// // //     marketDemand: 80,
// // //   },
// // //   {
// // //     skill: 'AWS',
// // //     userLevel: 40,
// // //     marketDemand: 95,
// // //   },
// // //   {
// // //     skill: 'Docker',
// // //     userLevel: 30,
// // //     marketDemand: 70,
// // //   },
// // // ];

// // // function SkillsVsMarketChart() {
// // //   return (
// // //     <ResponsiveContainer width="100%" height="100%">
// // //       <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
// // //         <PolarGrid stroke="rgba(8, 145, 178, 0.2)" />
// // //         <PolarAngleAxis 
// // //           dataKey="skill" 
// // //           tick={{ fill: "#67e8f9", fontSize: 12 }}
// // //           stroke="#0e7490"
// // //         />
// // //         <PolarRadiusAxis 
// // //           angle={30} 
// // //           domain={[0, 100]} 
// // //           tick={{ fill: "#67e8f9" }}
// // //           stroke="#0e7490"
// // //         />
// // //         <Radar 
// // //           name="Your Skills" 
// // //           dataKey="userLevel" 
// // //           stroke="#0891b2"
// // //           fill="#0891b2"
// // //           fillOpacity={0.2}
// // //         />
// // //         <Radar 
// // //           name="Market Demand" 
// // //           dataKey="marketDemand" 
// // //           stroke="#0e7490"
// // //           fill="#0e7490"
// // //           fillOpacity={0.2}
// // //         />
// // //         <Legend 
// // //           wrapperStyle={{ color: "#67e8f9" }}
// // //           formatter={(value) => <span className="text-cyan-300">{value}</span>}
// // //         />
// // //       </RadarChart>
// // //     </ResponsiveContainer>
// // //   );
// // // }

// // // export default SkillsVsMarketChart;




// // import { Bar } from 'react-chartjs-2';
// // import {
// //   Chart as ChartJS,
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// // } from 'chart.js';

// // ChartJS.register(
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   Title,
// //   Tooltip,
// //   Legend
// // );

// // const SkillsVsMarketChart = ({ userSkills, marketDemand }) => {
// //   // Create a set of user skills for quick lookup
// //   const userSkillsSet = new Set(userSkills.map(skill => skill.toLowerCase()));
  
// //   // Sort market demand by demand score (highest first)
// //   const sortedDemand = [...marketDemand].sort((a, b) => b.demandScore - a.demandScore);
  
// //   // Take top 8 skills
// //   const topSkills = sortedDemand.slice(0, 8);
  
// //   const chartData = {
// //     labels: topSkills.map(item => item.skill),
// //     datasets: [
// //       {
// //         label: 'Market Demand',
// //         data: topSkills.map(item => item.demandScore),
// //         backgroundColor: 'rgba(0, 255, 255, 0.6)',
// //         borderColor: 'rgba(0, 255, 255, 1)',
// //         borderWidth: 1,
// //       },
// //       {
// //         label: 'Your Skills',
// //         data: topSkills.map(item => userSkillsSet.has(item.skill.toLowerCase()) ? 100 : 0),
// //         backgroundColor: 'rgba(255, 99, 132, 0.6)',
// //         borderColor: 'rgba(255, 99, 132, 1)',
// //         borderWidth: 1,
// //       },
// //     ],
// //   };

// //   const options = {
// //     responsive: true,
// //     maintainAspectRatio: false,
// //     plugins: {
// //       legend: {
// //         position: 'top',
// //         labels: {
// //           color: 'rgba(224, 255, 255, 0.8)',
// //         },
// //       },
// //       tooltip: {
// //         callbacks: {
// //           label: function(context) {
// //             const label = context.dataset.label || '';
// //             const value = context.raw || 0;
            
// //             if (context.datasetIndex === 0) {
// //               return `${label}: ${value}/100`;
// //             } else {
// //               return `${label}: ${value > 0 ? 'Yes' : 'No'}`;
// //             }
// //           }
// //         }
// //       }
// //     },
// //     scales: {
// //       y: {
// //         beginAtZero: true,
// //         max: 100,
// //         grid: {
// //           color: 'rgba(224, 255, 255, 0.1)',
// //         },
// //         ticks: {
// //           color: 'rgba(224, 255, 255, 0.8)',
// //         },
// //       },
// //       x: {
// //         grid: {
// //           color: 'rgba(224, 255, 255, 0.1)',
// //         },
// //         ticks: {
// //           color: 'rgba(224, 255, 255, 0.8)',
// //         },
// //       },
// //     },
// //   };

// //   return <Bar data={chartData} options={options} />;
// // };

// // export default SkillsVsMarketChart;

// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const SkillsVsMarketChart = ({ userSkills = [], marketDemand = [] }) => {
//   // If no data, show placeholder
//   if (!marketDemand || marketDemand.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <p className="text-cyan-50/70">No market demand data available</p>
//       </div>
//     );
//   }

//   // Create a set of user skills for quick lookup
//   const userSkillsSet = new Set(userSkills.map(skill => skill.toLowerCase()));
  
//   // Sort market demand by demand score (highest first)
//   const sortedDemand = [...marketDemand].sort((a, b) => b.demandScore - a.demandScore);
  
//   // Take top 8 skills
//   const topSkills = sortedDemand.slice(0, 8);
  
//   const chartData = {
//     labels: topSkills.map(item => item.skill),
//     datasets: [
//       {
//         label: 'Market Demand',
//         data: topSkills.map(item => item.demandScore),
//         backgroundColor: 'rgba(0, 255, 255, 0.6)',
//         borderColor: 'rgba(0, 255, 255, 1)',
//         borderWidth: 1,
//       },
//       {
//         label: 'Your Skills',
//         data: topSkills.map(item => userSkillsSet.has(item.skill.toLowerCase()) ? 100 : 0),
//         backgroundColor: 'rgba(255, 99, 132, 0.6)',
//         borderColor: 'rgba(255, 99, 132, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           color: 'rgba(224, 255, 255, 0.8)',
//         },
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         max: 100,
//         grid: {
//           color: 'rgba(224, 255, 255, 0.1)',
//         },
//         ticks: {
//           color: 'rgba(224, 255, 255, 0.8)',
//         },
//       },
//       x: {
//         grid: {
//           color: 'rgba(224, 255, 255, 0.1)',
//         },
//         ticks: {
//           color: 'rgba(224, 255, 255, 0.8)',
//         },
//       },
//     },
//   };

//   return <Bar data={chartData} options={options} />;
// };

// export default SkillsVsMarketChart;



import React from 'react';

const SkillsVsMarketChart = ({ userSkills = [], marketDemand = [] }) => {
  // If no data, show placeholder
  if (!marketDemand || marketDemand.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-cyan-50/70">No market demand data available</p>
      </div>
    );
  }

  // Create a set of user skills for quick lookup
  const userSkillsSet = new Set(userSkills.map(skill => skill.toLowerCase()));
  
  // Sort market demand by demand score (highest first)
  const sortedDemand = [...marketDemand].sort((a, b) => b.demandScore - a.demandScore);
  
  // Take top 8 skills
  const topSkills = sortedDemand.slice(0, 8);

  return (
    <div className="h-full">
      {topSkills.map((skill, index) => {
        const hasSkill = userSkillsSet.has(skill.skill.toLowerCase());
        return (
          <div key={index} className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-cyan-50">{skill.skill}</span>
              <span className="text-cyan-50">{skill.demandScore}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${hasSkill ? 'bg-green-500' : 'bg-cyan-500'}`}
                style={{ width: `${skill.demandScore}%` }}
              ></div>
            </div>
            {hasSkill && (
              <div className="text-xs text-green-400 mt-1">You have this skill</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SkillsVsMarketChart;