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