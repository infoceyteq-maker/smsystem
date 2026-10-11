import React from 'react';
import { UserProfile } from '../types/erp';
import { 
  LogOut, 
  ShieldCheck, 
  Users, 
  Calendar, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  AlertCircle,
  GraduationCap,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface DashboardPreviewProps {
  user: UserProfile;
  onSignOut: () => void;
  onSwitchRole: () => void;
}

export const DashboardPreview: React.FC<DashboardPreviewProps> = ({
  user,
  onSignOut,
  onSwitchRole,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-in fade-in zoom-in-95 duration-300">
      {/* Top Banner */}
      <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl p-6 sm:p-8 mb-6 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#0A84FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0A84FF] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/30 ring-2 ring-white/10">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {user.fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#0A84FF]/20 text-[#0A84FF] border border-[#0A84FF]/30">
                  {user.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-[#8E8E93] mt-1">
                {user.designation || user.gradeLevel || user.department} · {user.tenantName}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-2">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#30D158]" />
                  <span>Authenticated via Supabase JWT</span>
                </span>
                <span>·</span>
                <span className="font-mono text-zinc-500">ID: {user.username}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={onSwitchRole}
              className="px-3.5 py-2 rounded-xl text-xs font-medium bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white border border-white/10 transition"
            >
              Switch Role
            </button>
            <button
              onClick={onSignOut}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FF453A]/15 hover:bg-[#FF453A]/25 text-[#FF453A] border border-[#FF453A]/30 transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out to ERP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Role-Specific Metric Cards */}
      {user.role === 'master_admin' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5">
              <span className="text-xs text-[#8E8E93] font-medium block">Total Enrolled</span>
              <span className="text-2xl font-bold text-white mt-1 block">1,420</span>
              <span className="text-[11px] text-[#30D158] mt-1 block">↑ 8.4% vs last term</span>
            </div>
            <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5">
              <span className="text-xs text-[#8E8E93] font-medium block">Active Faculty</span>
              <span className="text-2xl font-bold text-white mt-1 block">98</span>
              <span className="text-[11px] text-zinc-400 mt-1 block">100% attendance rate</span>
            </div>
            <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5">
              <span className="text-xs text-[#8E8E93] font-medium block">Daily Attendance</span>
              <span className="text-2xl font-bold text-white mt-1 block">96.4%</span>
              <span className="text-[11px] text-[#30D158] mt-1 block">1,369 present today</span>
            </div>
            <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5">
              <span className="text-xs text-[#8E8E93] font-medium block">Tuition Collected</span>
              <span className="text-2xl font-bold text-white mt-1 block">$184,200</span>
              <span className="text-[11px] text-[#0A84FF] mt-1 block">94.2% collected</span>
            </div>
          </div>

          <div className="bg-[#1C1C1E] border border-white/5 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Campus Executive Audit Log</h3>
              <span className="text-xs text-[#0A84FF]">Live Supabase Stream</span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#30D158]" />
                  <span className="text-zinc-200">Session verified via Supabase Auth RLS</span>
                </div>
                <span className="text-[#8E8E93]">Just now</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#0A84FF]" />
                  <span className="text-zinc-200">Term 1 2026 Examination schedule published to Grade 12</span>
                </div>
                <span className="text-[#8E8E93]">42 mins ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {user.role === 'normal_admin' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5">
              <span className="text-xs text-[#8E8E93]">Pending Admissions</span>
              <span className="text-2xl font-bold text-white mt-1 block">14 Students</span>
              <span className="text-[11px] text-[#0A84FF] mt-1 block">Requires approval</span>
            </div>
            <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5">
              <span className="text-xs text-[#8E8E93]">Faculty On Duty</span>
              <span className="text-2xl font-bold text-white mt-1 block">92 / 98</span>
              <span className="text-[11px] text-zinc-400 mt-1 block">6 on planned academic leave</span>
            </div>
            <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5">
              <span className="text-xs text-[#8E8E93]">Facilities Status</span>
              <span className="text-2xl font-bold text-[#30D158] mt-1 block">Optimal</span>
              <span className="text-[11px] text-zinc-400 mt-1 block">Colombo Main Campus</span>
            </div>
          </div>
        </div>
      )}

      {user.role === 'teacher' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5">
              <span className="text-xs text-[#8E8E93]">Assigned Section</span>
              <span className="text-xl font-bold text-white mt-1 block">Grade 12-A (Sciences)</span>
              <span className="text-[11px] text-zinc-400 mt-1 block">Room 304 · 38 Students</span>
            </div>
            <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5">
              <span className="text-xs text-[#8E8E93]">Today's Attendance</span>
              <span className="text-xl font-bold text-[#30D158] mt-1 block">37 / 38 Present</span>
              <span className="text-[11px] text-zinc-400 mt-1 block">1 excused absence</span>
            </div>
            <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5">
              <span className="text-xs text-[#8E8E93]">Next Lecture</span>
              <span className="text-xl font-bold text-[#0A84FF] mt-1 block">10:30 AM</span>
              <span className="text-[11px] text-zinc-400 mt-1 block">Quantum Mechanics III</span>
            </div>
          </div>
        </div>
      )}

      {user.role === 'student' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5">
              <span className="text-xs text-[#8E8E93]">Admission Number</span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">COL-2026-042</span>
              <span className="text-[11px] text-zinc-400 mt-1 block">Grade 12 Mathematics</span>
            </div>
            <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5">
              <span className="text-xs text-[#8E8E93]">Term Attendance</span>
              <span className="text-xl font-bold text-[#30D158] mt-1 block">98.2%</span>
              <span className="text-[11px] text-[#30D158] mt-1 block">Exemplary Standing</span>
            </div>
            <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5">
              <span className="text-xs text-[#8E8E93]">Term 1 Tuition Status</span>
              <span className="text-xl font-bold text-white mt-1 block">Paid · Full</span>
              <span className="text-[11px] text-[#30D158] mt-1 block">Receipt #COL-INV-889</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
