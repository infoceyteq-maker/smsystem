import React from 'react';
import { LogIn, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { ActivityItem } from '../../types/dashboard';

interface RecentActivityListProps {
  activities: ActivityItem[];
  onViewAll?: () => void;
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({
  activities,
  onViewAll,
}) => {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'signin':
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#007AFF] border border-blue-200/80 flex items-center justify-center shrink-0">
            <LogIn className="w-4 h-4" />
          </div>
        );
      case 'submission':
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        );
      case 'approved':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#34C759] border border-emerald-200/80 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
            <LogIn className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-full shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 tracking-tight">
          Recent activity
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs text-[#007AFF] hover:underline flex items-center gap-1 font-semibold transition"
        >
          <span>View activity</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* List items */}
      <div className="divide-y divide-gray-100 my-2">
        {activities.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="py-3 flex items-center justify-between gap-3 group hover:bg-gray-50/60 px-2 rounded-xl transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              {getIcon(item.type)}
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-gray-900 truncate">
                  {item.title}
                </span>
                <span className="text-[11px] text-gray-500 truncate mt-0.5">
                  {item.subtitle}
                </span>
              </div>
            </div>

            <span className="text-[11px] text-gray-400 font-mono shrink-0">
              {item.time}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
        <span>Logged into public.audit_logs</span>
        <span className="text-emerald-600 font-medium">Real-time sync</span>
      </div>
    </div>
  );
};
