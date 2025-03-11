// import React, { useState, useEffect, useRef } from 'react';
// import CountUp from 'react-countup';

// const StatsCard = ({ number, label, subtext, className = "", isVisible }) => {
//   const finalNumber = parseFloat(number);
  
//   return (
//     <div className={`shadow-lg p-8 rounded-xl transform hover:scale-105 transition-transform hover:shadow-2xl bg-black hover:shadow-cyan-400 ${className}`}>
//       <div className="flex flex-col items-start gap-4">
//         <div>
//           <div className="flex items-baseline gap-1">
//             <span className="text-4xl font-bold text-cyan-100">
//               {isVisible && (
//                 <CountUp
//                   start={0}
//                   end={finalNumber}
//                   duration={2.5}
//                   decimals={finalNumber % 1 !== 0 ? 1 : 0}
//                 />
//               )}
//             </span>
//             <span className="text-2xl text-cyan-400">+</span>
//           </div>
//           <h3 className="text-xl font-semibold text-cyan-50 mt-2">{label}</h3>
//           <p className="text-black-600 mt-1 text-sm">{subtext}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AnalyticsSection = () => {
//   const [isVisible, setIsVisible] = useState(false);
//   const sectionRef = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//           observer.unobserve(entry.target);
//         }
//       },
//       {
//         threshold: 0.2,
//       }
//     );

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current);
//     }

//     return () => {
//       if (sectionRef.current) {
//         observer.unobserve(sectionRef.current);
//       }
//     };
//   }, []);

//   return (
//     <section ref={sectionRef} className="w-full py-12 md:py-24 bg-muted/20">
//       <div className="container mx-auto px-4 md:px-6">
//         <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 text-cyan-100">
//           📊 GigPilot Stats
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
//           <StatsCard 
//             number="10000"
//             label="Total Gigs Completed"
//             subtext="Over 10,000 gigs completed by freelancers using GigPilot"
//             isVisible={isVisible}
//           />
          
//           <StatsCard 
//             number="1500"
//             label="Average Freelancer Earnings"
//             subtext="Freelancers earn 50% more with GigPilot"
//             isVisible={isVisible}
//           />
          
//           <StatsCard 
//             number="50000"
//             label="Freelancers in the Community"
//             subtext="Join a growing community of 50,000 freelancers"
//             isVisible={isVisible}
//           />
          
//           <StatsCard 
//             number="90"
//             label="Success Rate"
//             subtext="90% of freelancers land gigs within a week"
//             isVisible={isVisible}
//           />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AnalyticsSection;


import React from 'react';

const stats = [
  {
    value: "10K+",
    title: "Active Users",
    description: "Professionals using our platform"
  },
  {
    value: "85%",
    title: "Success Rate",
    description: "Users finding better opportunities"
  },
  {
    value: "5K+",
    title: "Job Matches",
    description: "Successful job placements"
  },
  {
    value: "24/7",
    title: "AI Support",
    description: "Always available to help"
  }
];

const StatsSection = () => {
  return (
    <section className="bg-muted/20 text-cyan-100 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">🚀 Power in Numbers!</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="shadow-lg p-8 rounded-xl transform hover:scale-105 transition-transform hover:shadow-2xl bg-black hover:shadow-cyan-400 ">
              <h3 className="text-4xl font-bold text-cyan-100">{stat.value}</h3>
              <p className="text-lg font-semibold mt-2">{stat.title}</p>
              <p className="text-muted-foreground mt-1">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
