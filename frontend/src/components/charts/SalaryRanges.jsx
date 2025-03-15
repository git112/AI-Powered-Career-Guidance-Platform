// // // // import React, { useState } from 'react';
// // // // import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

// // // // const SalaryRangesChart = () => {
// // // //   const [hoveredBar, setHoveredBar] = useState(null);
  
// // // //   const data = [
// // // //     {
// // // //       name: 'Software Engineer',
// // // //       minimum: 80,
// // // //       median: 115,
// // // //       maximum: 150,
// // // //     },
// // // //     {
// // // //       name: 'Data Scientist',
// // // //       minimum: 90,
// // // //       median: 125,
// // // //       maximum: 160,
// // // //     },
// // // //     {
// // // //       name: 'Frontend Developer',
// // // //       minimum: 70,
// // // //       median: 95,
// // // //       maximum: 130,
// // // //     },
// // // //     {
// // // //       name: 'Backend Developer',
// // // //       minimum: 75,
// // // //       median: 105,
// // // //       maximum: 140,
// // // //     },
// // // //     {
// // // //       name: 'DevOps Engineer',
// // // //       minimum: 95,
// // // //       median: 130,
// // // //       maximum: 175,
// // // //     },
// // // //     {
// // // //       name: 'Mobile Developer',
// // // //       minimum: 70,
// // // //       median: 100,
// // // //       maximum: 135,
// // // //     },
// // // //   ];

// // // //   // Updated muted cyan color scheme
// // // //   const colors = {
// // // //     minimum: '#0891b2',    // cyan-600
// // // //     median: '#0e7490',     // cyan-700
// // // //     maximum: '#155e75',    // cyan-800
// // // //     muted: '#164e63',      // cyan-900
// // // //     hover: '#22d3ee',      // cyan-400 (for hover effects)
// // // //     text: '#67e8f9',       // cyan-300 (for text)
// // // //   };

// // // //   const CustomTooltip = ({ active, payload, label }) => {
// // // //     if (active && payload && payload.length) {
// // // //       const dataPoint = data.find(item => item.name === label);
      
// // // //       return (
// // // //         <div className="bg-zinc-900/90 p-4 rounded-xl border border-cyan-800/20 shadow-lg backdrop-blur-sm">
// // // //           <p className="text-cyan-300 font-semibold mb-2">{label}</p>
// // // //           <div className="space-y-1">
// // // //             <p className="text-cyan-400 text-sm flex items-center">
// // // //               <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: colors.minimum }}></span>
// // // //               Minimum: ${dataPoint.minimum}K
// // // //             </p>
// // // //             <p className="text-cyan-400 text-sm flex items-center">
// // // //               <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: colors.median }}></span>
// // // //               Median: ${dataPoint.median}K
// // // //             </p>
// // // //             <p className="text-cyan-400 text-sm flex items-center">
// // // //               <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: colors.maximum }}></span>
// // // //               Maximum: ${dataPoint.maximum}K
// // // //             </p>
// // // //           </div>
// // // //         </div>
// // // //       );
// // // //     }
// // // //     return null;
// // // //   };

// // // //   const CustomLegend = ({ payload }) => {
// // // //     return (
// // // //       <div className="flex justify-center gap-6 pt-4">
// // // //         {payload.map((entry, index) => (
// // // //           <div key={`legend-${index}`} className="flex items-center">
// // // //             <div 
// // // //               className="w-3 h-3 mr-2 rounded-full" 
// // // //               style={{ 
// // // //                 backgroundColor: entry.color,
// // // //                 boxShadow: '0 0 8px rgba(8, 145, 178, 0.1)' // More subtle shadow
// // // //               }}
// // // //             ></div>
// // // //             <span className="text-cyan-300 text-sm">
// // // //               {entry.value}
// // // //             </span>
// // // //           </div>
// // // //         ))}
// // // //       </div>
// // // //     );
// // // //   };

// // // //   const handleMouseEnter = (data) => {
// // // //     setHoveredBar(data.name);
// // // //   };

// // // //   const handleMouseLeave = () => {
// // // //     setHoveredBar(null);
// // // //   };

// // // //   return (
// // // //     <div className="bg-zinc-900/50 rounded-xl p-4 h-full backdrop-blur-sm">
// // // //       <ResponsiveContainer width="100%" height="90%">
// // // //         <BarChart
// // // //           data={data}
// // // //           margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
// // // //           barSize={20}
// // // //           barGap={0}
// // // //           barCategoryGap={30}
// // // //         >
// // // //           <XAxis 
// // // //             dataKey="name" 
// // // //             tick={{ fill: '#67e8f9' }} // cyan-300
// // // //             axisLine={{ stroke: '#155e75' }} // cyan-800
// // // //           />
// // // //           <YAxis 
// // // //             tick={{ fill: '#67e8f9' }} // cyan-300
// // // //             axisLine={{ stroke: '#155e75' }} // cyan-800
// // // //             label={{ 
// // // //               value: 'Salary ($K)', 
// // // //               angle: -90, 
// // // //               position: 'insideLeft', 
// // // //               fill: '#67e8f9', // cyan-300
// // // //             }}
// // // //           />
// // // //           <Tooltip content={<CustomTooltip />} />
// // // //           <Legend content={<CustomLegend />} />
          
// // // //           {['minimum', 'median', 'maximum'].map((key, i) => (
// // // //             <Bar 
// // // //               key={key}
// // // //               dataKey={key}
// // // //               name={key.charAt(0).toUpperCase() + key.slice(1)}
// // // //               onMouseEnter={handleMouseEnter}
// // // //               onMouseLeave={handleMouseLeave}
// // // //               fill={colors[key]}
// // // //             >
// // // //               {data.map((entry, index) => (
// // // //                 <Cell 
// // // //                   key={`${key}-${index}`}
// // // //                   fill={hoveredBar === null || hoveredBar === entry.name ? colors[key] : colors.muted}
// // // //                   opacity={hoveredBar === null || hoveredBar === entry.name ? 1 : 0.4}
// // // //                   style={{ 
// // // //                     filter: hoveredBar === entry.name ? `drop-shadow(0 0 4px ${colors.hover})` : 'none',
// // // //                     transition: 'all 0.3s ease'
// // // //                   }}
// // // //                 />
// // // //               ))}
// // // //             </Bar>
// // // //           ))}
// // // //         </BarChart>
// // // //       </ResponsiveContainer>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default SalaryRangesChart;



// // // import { Bar } from 'react-chartjs-2';
// // // import {
// // //   Chart as ChartJS,
// // //   CategoryScale,
// // //   LinearScale,
// // //   BarElement,
// // //   Title,
// // //   Tooltip,
// // //   Legend,
// // // } from 'chart.js';

// // // ChartJS.register(
// // //   CategoryScale,
// // //   LinearScale,
// // //   BarElement,
// // //   Title,
// // //   Tooltip,
// // //   Legend
// // // );

// // // const SalaryRangesChart = ({ salaryRanges }) => {
// // //   // Format data for chart
// // //   const chartData = {
// // //     labels: salaryRanges.map(range => range.role),
// // //     datasets: [
// // //       {
// // //         label: 'Min Salary (K)',
// // //         data: salaryRanges.map(range => range.minSalary / 1000),
// // //         backgroundColor: 'rgba(0, 255, 255, 0.2)',
// // //         borderColor: 'rgba(0, 255, 255, 0.5)',
// // //         borderWidth: 1,
// // //       },
// // //       {
// // //         label: 'Median Salary (K)',
// // //         data: salaryRanges.map(range => range.medianSalary / 1000),
// // //         backgroundColor: 'rgba(0, 255, 255, 0.5)',
// // //         borderColor: 'rgba(0, 255, 255, 0.8)',
// // //         borderWidth: 1,
// // //       },
// // //       {
// // //         label: 'Max Salary (K)',
// // //         data: salaryRanges.map(range => range.maxSalary / 1000),
// // //         backgroundColor: 'rgba(0, 255, 255, 0.8)',
// // //         borderColor: 'rgba(0, 255, 255, 1)',
// // //         borderWidth: 1,
// // //       },
// // //     ],
// // //   };

// // //   const options = {
// // //     responsive: true,
// // //     maintainAspectRatio: false,
// // //     plugins: {
// // //       legend: {
// // //         position: 'top',
// // //         labels: {
// // //           color: 'rgba(224, 255, 255, 0.8)',
// // //         },
// // //       },
// // //     },
// // //     scales: {
// // //       y: {
// // //         beginAtZero: true,
// // //         grid: {
// // //           color: 'rgba(224, 255, 255, 0.1)',
// // //         },
// // //         ticks: {
// // //           color: 'rgba(224, 255, 255, 0.8)',
// // //         },
// // //       },
// // //       x: {
// // //         grid: {
// // //           color: 'rgba(224, 255, 255, 0.1)',
// // //         },
// // //         ticks: {
// // //           color: 'rgba(224, 255, 255, 0.8)',
// // //         },
// // //       },
// // //     },
// // //   };

// // //   return <Bar data={chartData} options={options} />;
// // // };

// // // export default SalaryRangesChart;





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

// // const SalaryRangesChart = ({ salaryRanges = [] }) => {
// //   // If no data, show placeholder
// //   if (!salaryRanges || salaryRanges.length === 0) {
// //     return (
// //       <div className="flex items-center justify-center h-full">
// //         <p className="text-cyan-50/70">No salary data available</p>
// //       </div>
// //     );
// //   }

// //   // Format data for chart
// //   const chartData = {
// //     labels: salaryRanges.map(range => range.role),
// //     datasets: [
// //       {
// //         label: 'Min Salary (K)',
// //         data: salaryRanges.map(range => range.minSalary / 1000),
// //         backgroundColor: 'rgba(0, 255, 255, 0.2)',
// //         borderColor: 'rgba(0, 255, 255, 0.5)',
// //         borderWidth: 1,
// //       },
// //       {
// //         label: 'Median Salary (K)',
// //         data: salaryRanges.map(range => range.medianSalary / 1000),
// //         backgroundColor: 'rgba(0, 255, 255, 0.5)',
// //         borderColor: 'rgba(0, 255, 255, 0.8)',
// //         borderWidth: 1,
// //       },
// //       {
// //         label: 'Max Salary (K)',
// //         data: salaryRanges.map(range => range.maxSalary / 1000),
// //         backgroundColor: 'rgba(0, 255, 255, 0.8)',
// //         borderColor: 'rgba(0, 255, 255, 1)',
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
// //     },
// //     scales: {
// //       y: {
// //         beginAtZero: true,
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

// // export default SalaryRangesChart;









// import React from 'react';

// const SalaryRangesChart = ({ salaryRanges = [] }) => {
//   // If no data, show placeholder
//   if (!salaryRanges || salaryRanges.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <p className="text-cyan-50/70">No salary data available</p>
//       </div>
//     );
//   }

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   return (
//     <div className="h-full overflow-y-auto">
//       {salaryRanges.map((range, index) => (
//         <div key={index} className="mb-6">
//           <h3 className="text-cyan-50 font-medium mb-2">{range.role}</h3>
          
//           <div className="relative pt-1">
//             <div className="flex mb-2 items-center justify-between">
//               <div>
//                 <span className="text-xs text-cyan-50/70">Min</span>
//                 <span className="text-xs font-semibold inline-block text-cyan-50 ml-1">
//                   {formatCurrency(range.minSalary)}
//                 </span>
//               </div>
//               <div>
//                 <span className="text-xs text-cyan-50/70">Median</span>
//                 <span className="text-xs font-semibold inline-block text-cyan-50 ml-1">
//                   {formatCurrency(range.medianSalary)}
//                 </span>
//               </div>
//               <div>
//                 <span className="text-xs text-cyan-50/70">Max</span>
//                 <span className="text-xs font-semibold inline-block text-cyan-50 ml-1">
//                   {formatCurrency(range.maxSalary)}
//                 </span>
//               </div>
//             </div>
            
//             <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-zinc-800">
//               <div style={{ width: '100%' }} className="relative">
//                 {/* Min to Max range */}
//                 <div 
//                   style={{ 
//                     width: '100%',
//                     background: 'linear-gradient(90deg, rgba(0,255,255,0.2) 0%, rgba(0,255,255,0.8) 100%)'
//                   }} 
//                   className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center h-2 rounded-full"
//                 ></div>
                
//                 {/* Median marker */}
//                 <div 
//                   style={{ 
//                     left: `${((range.medianSalary - range.minSalary) / (range.maxSalary - range.minSalary)) * 100}%`,
//                     transform: 'translateX(-50%)'
//                   }} 
//                   className="absolute top-0 w-1 h-2 bg-white rounded-full"
//                 ></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SalaryRangesChart;








import React from 'react';

const SalaryRangesChart = ({ data = [] }) => {
  // If no data, show placeholder
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-cyan-50/70">No salary data available</p>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Handle different possible property names in data
  const normalizedData = data.map(range => ({
    role: range.role || range.name || range.title || "Unknown",
    minSalary: range.minSalary || range.minimum || range.min || 0,
    medianSalary: range.medianSalary || range.median || range.avg || (range.minSalary + range.maxSalary) / 2 || 0,
    maxSalary: range.maxSalary || range.maximum || range.max || 0
  }));

  return (
    <div className="h-full overflow-y-auto">
      {normalizedData.map((range, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-cyan-50 font-medium mb-2">{range.role}</h3>
          
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs text-cyan-50/70">Min</span>
                <span className="text-xs font-semibold inline-block text-cyan-50 ml-1">
                  {formatCurrency(range.minSalary)}
                </span>
              </div>
              <div>
                <span className="text-xs text-cyan-50/70">Median</span>
                <span className="text-xs font-semibold inline-block text-cyan-50 ml-1">
                  {formatCurrency(range.medianSalary)}
                </span>
              </div>
              <div>
                <span className="text-xs text-cyan-50/70">Max</span>
                <span className="text-xs font-semibold inline-block text-cyan-50 ml-1">
                  {formatCurrency(range.maxSalary)}
                </span>
              </div>
            </div>
            
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-zinc-800">
              <div style={{ width: '100%' }} className="relative">
                {/* Min to Max range */}
                <div 
                  style={{ 
                    width: '100%',
                    background: 'linear-gradient(90deg, rgba(0,255,255,0.2) 0%, rgba(0,255,255,0.8) 100%)'
                  }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center h-2 rounded-full"
                ></div>
                
                {/* Median marker */}
                <div 
                  style={{ 
                    left: `${((range.medianSalary - range.minSalary) / (range.maxSalary - range.minSalary)) * 100}%`,
                    transform: 'translateX(-50%)'
                  }} 
                  className="absolute top-0 w-1 h-2 bg-white rounded-full"
                ></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SalaryRangesChart;