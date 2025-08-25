import React, { useState } from "react";

const PortfolioPerformance: React.FC = () => {
  const [active, setActive] = useState("Monthly");
  // Aquí iría el gráfico, puedes integrar ApexCharts o cualquier otro chart
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-5">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Portfolio Performance</h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Here is your performance stats of each month</p>
        </div>
        <div>
          <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
            {['Monthly', 'Quarterly', 'Annually'].map((label) => (
              <button
                key={label}
                className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${active === label ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => setActive(label)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        {/* Aquí va el gráfico, puedes usar ApexCharts o cualquier otro */}
        <div className="-ml-4 min-w-[900px] xl:min-w-full pl-2" style={{ minHeight: 350 }}>
          {/* Chart placeholder */}
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-lg" style={{ height: 335 }}>
            [Portfolio Performance Chart]
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPerformance;
