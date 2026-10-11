import React from 'react';
import { Bell, Menu, ArrowLeft } from 'lucide-react';

interface DashboardHeaderProps {
  onToggleMobileMenu: () => void;
  onReturnToLogin?: () => void;
  pendingApprovalsCount?: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onToggleMobileMenu,
  onReturnToLogin,
  pendingApprovalsCount = 12,
}) => {
  return (
    <header className="w-full flex items-center justify-between pb-6 pt-2 select-none">
      <div className="flex items-center gap-3">
        {/* Mobile menu hamburger */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-white text-gray-700 hover:text-gray-900 border border-gray-200 shadow-xs"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              Hello, Master Admin
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-[#007AFF] border border-blue-200">
              Sample Data
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">
            Sunday, 11 October 2026 · Colombo Campus
          </p>
        </div>
      </div>

      {/* Top right actions */}
      <div className="flex items-center gap-3">
        {/* Return to Sign In button */}
        {onReturnToLogin && (
          <button
            onClick={onReturnToLogin}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-600 hover:text-gray-900 hover:border-gray-300 border border-gray-200 shadow-xs transition"
            title="Return to Sign In Screen"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Sign In Screen</span>
          </button>
        )}

        {/* Notifications Bell */}
        <button 
          className="relative p-2.5 rounded-full bg-white border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 transition shadow-xs"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {pendingApprovalsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF3B30] ring-2 ring-white" />
          )}
        </button>

        {/* User Avatar Circle */}
        <div className="w-9 h-9 rounded-full bg-[#007AFF] text-white flex items-center justify-center text-xs font-bold shadow-xs">
          MA
        </div>
      </div>
    </header>
  );
};
