import React, { useState } from 'react';
import { Bell, Menu, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { SchoolLogo } from '../common/SchoolLogo';
import { LogoUploadModal } from '../common/LogoUploadModal';

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
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  return (
    <>
      <header className="w-full flex items-center justify-between pb-5 pt-1 select-none">
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0B3C96]/10 text-[#0B3C96] border border-[#0B3C96]/20">
                Sri Sumangala College
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 font-medium flex items-center gap-1.5 flex-wrap">
              <span>Sunday, 11 October 2026</span>
              <span>·</span>
              <span className="font-semibold text-gray-700">Kandy Campus</span>
              <span>·</span>
              <span className="text-amber-700 font-semibold">Estd - 1934</span>
            </p>
          </div>
        </div>

        {/* Top right actions (including prominent College Logo) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Sri Sumangala College Kandy Logo Badge (Top Right) */}
          <div 
            onClick={() => setIsLogoModalOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-300 shadow-xs cursor-pointer transition group"
            title="Sri Sumangala College Kandy Logo (Click to change/upload)"
          >
            <SchoolLogo size="sm" interactive={false} />
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[11px] font-bold text-gray-900 leading-tight">
                SSCK
              </span>
              <span className="text-[9px] text-[#0B3C96] font-semibold">
                Kandy
              </span>
            </div>
          </div>

          {/* Return to Sign In button */}
          {onReturnToLogin && (
            <button
              onClick={onReturnToLogin}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-600 hover:text-gray-900 hover:border-gray-300 border border-gray-200 shadow-xs transition"
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

          {/* User Avatar Circle with College Blue */}
          <div className="w-9 h-9 rounded-full bg-[#0B3C96] text-white flex items-center justify-center text-xs font-bold shadow-xs">
            MA
          </div>
        </div>
      </header>

      {/* Logo Modal */}
      <LogoUploadModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />
    </>
  );
};
