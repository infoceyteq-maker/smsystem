import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext: string;
  subtextColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  subtextColor = 'text-gray-500',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs transition duration-200 ${
        onClick ? 'cursor-pointer hover:border-blue-300 hover:shadow-sm' : ''
      }`}
    >
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </span>
      <div className="my-1.5">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          {value}
        </span>
      </div>
      <span className={`text-[11px] sm:text-xs font-medium ${subtextColor} leading-tight`}>
        {subtext}
      </span>
    </div>
  );
};
