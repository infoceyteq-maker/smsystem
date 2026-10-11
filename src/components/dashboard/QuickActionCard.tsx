import React from 'react';
import { ChevronRight } from 'lucide-react';

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  badge?: number;
  subtitle: string;
  onClick: () => void;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  title,
  badge,
  subtitle,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200/90 hover:border-blue-300 hover:shadow-sm rounded-2xl p-4 sm:p-5 flex items-center justify-between cursor-pointer transition duration-200 group shadow-xs"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-blue-100/60 transition duration-200 text-[#007AFF]">
          {icon}
        </div>
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900 tracking-tight group-hover:text-[#007AFF] transition">
              {title}
            </span>
            {badge !== undefined && badge > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF3B30] text-white shadow-xs">
                {badge}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 mt-0.5 line-clamp-1 font-medium">
            {subtitle}
          </span>
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#007AFF] group-hover:translate-x-0.5 transition shrink-0 ml-2" />
    </div>
  );
};
