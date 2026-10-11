import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PopulationCategory } from '../../types/dashboard';

interface PopulationDonutChartProps {
  categories: PopulationCategory[];
  totalStudents: number;
}

export const PopulationDonutChart: React.FC<PopulationDonutChartProps> = ({
  categories,
  totalStudents,
}) => {
  const chartData = categories.map((cat) => ({
    name: cat.name,
    value: cat.count,
    color: cat.color,
    percentage: cat.percentage,
    grades: cat.grades,
  }));

  return (
    <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-full shadow-xs">
      {/* Header */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 tracking-tight">
          School Population
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Active students · Academic year 2026
        </p>
      </div>

      {/* Donut Chart & Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-4">
        {/* Donut Graphic */}
        <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs shadow-lg">
                        <p className="font-bold text-gray-900">{data.name} ({data.grades})</p>
                        <p className="text-gray-600 mt-0.5 font-mono">
                          {data.value.toLocaleString()} students ({data.percentage}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={86}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Callout Metric */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {totalStudents.toLocaleString()}
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Enrolled
            </span>
          </div>
        </div>

        {/* Legend Breakdown */}
        <div className="flex flex-col justify-center space-y-3 w-full sm:w-auto">
          {chartData.map((cat) => (
            <div key={cat.name} className="flex items-center justify-between sm:justify-start gap-3">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: cat.color }}
                />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-900">
                    {cat.name}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {cat.grades}
                  </span>
                </div>
              </div>
              <div className="text-right sm:ml-4 font-mono">
                <span className="text-xs font-bold text-gray-800">
                  {cat.percentage}%
                </span>
                <span className="text-[10px] text-gray-400 block">
                  {cat.value} std
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Insight */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
        <span>Capacity utilization: 89.1%</span>
        <span className="font-medium text-emerald-600">Optimal class size</span>
      </div>
    </div>
  );
};
