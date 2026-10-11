import React from 'react';
import { DailyAttendance } from '../../types/dashboard';

interface WeeklyAttendanceChartProps {
  data: DailyAttendance[];
  totalCapacity?: number;
  averageRate?: number;
}

export const WeeklyAttendanceChart: React.FC<WeeklyAttendanceChartProps> = ({
  data,
  totalCapacity = 1248,
  averageRate = 94.4,
}) => {
  const maxVal = totalCapacity;

  return (
    <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-full shadow-xs">
      {/* Header with Title and Average Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 tracking-tight">
            Weekly Attendance Overview
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            05–09 October 2026 · Students present
          </p>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
          {averageRate}% avg
        </span>
      </div>

      {/* Main Bar Chart Graphic */}
      <div className="my-5 flex items-end gap-3 sm:gap-4 h-52 pt-4 relative">
        {/* Left Y-Axis labels */}
        <div className="flex flex-col justify-between h-full py-1 text-[10px] text-gray-400 font-mono select-none pr-1">
          <span>{totalCapacity.toLocaleString()}</span>
          <span>{Math.round(totalCapacity / 2).toLocaleString()}</span>
          <span>0</span>
        </div>

        {/* Horizontal gridlines */}
        <div className="absolute left-10 right-0 top-6 border-b border-gray-100 pointer-events-none" />
        <div className="absolute left-10 right-0 top-1/2 border-b border-gray-100 pointer-events-none" />
        <div className="absolute left-10 right-0 bottom-7 border-b border-gray-200 pointer-events-none" />

        {/* 5 Daily Attendance Bars */}
        <div className="flex-1 flex items-end justify-between h-full pb-7 pl-2">
          {data.map((item) => {
            // Proportional height
            const heightPercent = Math.min(100, Math.max(10, (item.present / maxVal) * 100));

            return (
              <div
                key={item.day}
                className="flex-1 flex flex-col items-center justify-end h-full group relative px-1 sm:px-2"
              >
                {/* Number label above the bar */}
                <span className="text-[11px] sm:text-xs font-bold text-gray-700 mb-1.5 transition-transform group-hover:-translate-y-0.5 font-mono">
                  {item.present.toLocaleString()}
                </span>

                {/* Soft rounded Bar with iOS Gradient */}
                <div className="w-full max-w-[42px] bg-gray-100 rounded-t-xl h-full flex items-end overflow-hidden p-0.5">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-[#007AFF] to-[#5AC8FA] rounded-t-lg transition-all duration-500 group-hover:brightness-105 shadow-xs"
                  />
                </div>

                {/* Day label below baseline */}
                <div className="absolute -bottom-6 flex flex-col items-center">
                  <span className="text-xs font-semibold text-gray-700">
                    {item.day}
                  </span>
                  <span className="text-[9px] text-gray-400 font-mono hidden sm:inline">
                    {item.dateStr}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Notes */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
        <span>Benchmark: Colombo Campus 92%</span>
        <span className="text-[#007AFF] font-medium">+2.4% above threshold</span>
      </div>
    </div>
  );
};
