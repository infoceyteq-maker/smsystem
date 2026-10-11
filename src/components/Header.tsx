import React from 'react';
import { Database, Sliders, Laptop, Tablet, Smartphone } from 'lucide-react';
import { CampusTenant } from '../types/erp';
import { SchoolLogo } from './common/SchoolLogo';
import { TenantSwitcher } from './common/TenantSwitcher';

interface HeaderProps {
  campus: CampusTenant;
  onOpenSupabaseDocs: () => void;
  onOpenQuickRoles: () => void;
  onOpenSuperAdmin?: () => void;
  viewportMode: 'desktop' | 'tablet' | 'mobile';
  onSetViewportMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
}

export const Header: React.FC<HeaderProps> = ({
  campus,
  onOpenSupabaseDocs,
  onOpenQuickRoles,
  onOpenSuperAdmin,
  viewportMode,
  onSetViewportMode,
}) => {
  return (
    <header className="w-full flex items-center justify-between px-4 sm:px-8 py-4 border-b border-gray-200/80 bg-white/85 backdrop-blur-md z-40 select-none shadow-xs sticky top-0">
      {/* Brand Identity (Left) */}
      <div className="flex items-center gap-3">
        <SchoolLogo size="md" interactive={true} />
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-900 font-bold text-sm tracking-tight leading-tight">
              Sri Sumangala College
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-[#0B3C96] border border-blue-200">
              KANDY
            </span>
          </div>
          <span className="text-gray-500 text-[10px] tracking-wider font-semibold uppercase leading-tight mt-0.5">
            SCHOOL OPERATIONS · {campus?.code || 'SSCK-1934'}
          </span>
        </div>
      </div>

      {/* Center - Viewport preview switchers for testing responsiveness */}
      <div className="hidden lg:flex items-center bg-gray-100 border border-gray-200 rounded-full p-1 gap-1">
        <button
          onClick={() => onSetViewportMode('desktop')}
          title="Desktop 1440px view"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition ${
            viewportMode === 'desktop'
              ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Laptop className="w-3.5 h-3.5" />
          <span>Desktop</span>
        </button>
        <button
          onClick={() => onSetViewportMode('tablet')}
          title="iPad Tablet view"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition ${
            viewportMode === 'tablet'
              ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Tablet className="w-3.5 h-3.5" />
          <span>Tablet</span>
        </button>
        <button
          onClick={() => onSetViewportMode('mobile')}
          title="iPhone Mobile view"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition ${
            viewportMode === 'mobile'
              ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile</span>
        </button>
      </div>

      {/* Utility Quick Pickers (Right) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Tenant Switcher dropdown */}
        <TenantSwitcher onOpenSuperAdmin={onOpenSuperAdmin} />

        {onOpenSuperAdmin && (
          <button
            onClick={onOpenSuperAdmin}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 transition shadow-xs cursor-pointer"
            title="Ceyteq Multi-Tenant Super Admin Control Plane"
          >
            <span>Super Admin</span>
          </button>
        )}

        <button
          onClick={onOpenQuickRoles}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-900 shadow-xs transition"
          title="Quickly fill demo accounts (Master Admin, Teacher, Student, Parent)"
        >
          <Sliders className="w-3.5 h-3.5 text-[#007AFF]" />
          <span className="hidden sm:inline">Role Presets</span>
        </button>

        <button
          onClick={onOpenSupabaseDocs}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 transition shadow-xs"
          title="View PostgreSQL schema, RLS policies, and setup instructions"
        >
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden md:inline font-mono">SQL Editor</span>
        </button>
      </div>
    </header>
  );
};
