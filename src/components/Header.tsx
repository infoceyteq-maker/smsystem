import React from 'react';
import { GraduationCap, ShieldCheck, Database, Sliders, Smartphone, Laptop, Tablet } from 'lucide-react';
import { CampusTenant } from '../types/erp';

interface HeaderProps {
  campus: CampusTenant;
  onOpenSupabaseDocs: () => void;
  onOpenQuickRoles: () => void;
  viewportMode: 'desktop' | 'tablet' | 'mobile';
  onSetViewportMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
}

export const Header: React.FC<HeaderProps> = ({
  campus,
  onOpenSupabaseDocs,
  onOpenQuickRoles,
  viewportMode,
  onSetViewportMode,
}) => {
  return (
    <header className="w-full flex items-center justify-between px-4 sm:px-8 py-5 border-b border-white/[0.04] bg-black/70 backdrop-blur-md z-40 select-none">
      {/* Brand Identity (Left) */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#0A84FF] flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
          <GraduationCap className="w-5 h-5 text-white" strokeWidth={2.2} />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-white font-bold text-sm tracking-tight leading-tight">
            Aster College
          </span>
          <span className="text-[#8E8E93] text-[10px] tracking-wider font-semibold uppercase leading-tight mt-0.5">
            SCHOOL OPERATIONS
          </span>
        </div>
      </div>

      {/* Center - Viewport preview switchers for testing responsiveness */}
      <div className="hidden lg:flex items-center bg-[#1C1C1E] border border-white/10 rounded-full p-1 gap-1">
        <button
          onClick={() => onSetViewportMode('desktop')}
          title="Desktop 1440px view"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition ${
            viewportMode === 'desktop'
              ? 'bg-[#2C2C2E] text-white shadow-sm'
              : 'text-[#8E8E93] hover:text-white'
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
              ? 'bg-[#2C2C2E] text-white shadow-sm'
              : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          <Tablet className="w-3.5 h-3.5" />
          <span>Tablet</span>
        </button>
        <button
          onClick={() => onSetViewportMode('mobile')}
          title="Mobile iPhone view"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition ${
            viewportMode === 'mobile'
              ? 'bg-[#2C2C2E] text-white shadow-sm'
              : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile</span>
        </button>
      </div>

      {/* Right Controls: Campus badge & quick tools */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Roles Preset button */}
        <button
          onClick={onOpenQuickRoles}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#1C1C1E] text-zinc-300 border border-white/10 hover:border-blue-500/40 hover:text-white transition"
          title="Quick auto-fill demo accounts for RBAC testing"
        >
          <Sliders className="w-3.5 h-3.5 text-[#0A84FF]" />
          <span>Role Presets</span>
        </button>

        {/* Supabase Architecture / Schema preview */}
        <button
          onClick={onOpenSupabaseDocs}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#1C1C1E] text-emerald-400 border border-emerald-500/20 hover:bg-emerald-950/30 transition"
          title="View Supabase PostgreSQL Schema & RLS Policies"
        >
          <Database className="w-3.5 h-3.5" />
          <span>Supabase & RLS</span>
        </button>

        {/* Campus Badge (Exact match from screenshot) */}
        <div className="flex items-center px-3.5 py-1.5 rounded-full bg-[#1C1C1E]/80 border border-white/10 shadow-inner">
          <span className="text-xs font-medium text-[#8E8E93]">
            {campus.name.replace('Aster College - ', '')} · {campus.year}
          </span>
        </div>
      </div>
    </header>
  );
};
