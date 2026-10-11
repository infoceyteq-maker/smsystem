import React from 'react';
import { ShieldCheck, UserCheck, GraduationCap, School, X, Check } from 'lucide-react';
import { DEMO_ERP_ACCOUNTS } from '../lib/supabase';
import { UserRole } from '../types/erp';

interface RoleQuickPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (username: string, password: string, autoSubmit?: boolean) => void;
}

export const RoleQuickPicker: React.FC<RoleQuickPickerProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
}) => {
  if (!isOpen) return null;

  const roleMeta: Record<UserRole, { badge: string; color: string; icon: React.ReactNode; desc: string }> = {
    master_admin: {
      badge: 'Master Admin',
      color: 'bg-purple-950/60 text-purple-300 border-purple-500/40',
      icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
      desc: 'Full multi-campus governance, all databases, finances & staff',
    },
    normal_admin: {
      badge: 'Normal Admin',
      color: 'bg-blue-950/60 text-blue-300 border-blue-500/40',
      icon: <School className="w-5 h-5 text-blue-400" />,
      desc: 'Colombo campus administration, student admissions, scheduling',
    },
    teacher: {
      badge: 'Teacher / Faculty',
      color: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
      icon: <UserCheck className="w-5 h-5 text-emerald-400" />,
      desc: 'Grade roster, live attendance tracking, subject marks',
    },
    student: {
      badge: 'Student',
      color: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
      icon: <GraduationCap className="w-5 h-5 text-amber-400" />,
      desc: 'Personal attendance, timetable, fee invoices & reports',
    },
    parent: {
      badge: 'Parent',
      color: 'bg-zinc-800 text-zinc-300 border-zinc-600',
      icon: <UserCheck className="w-5 h-5 text-zinc-400" />,
      desc: 'Child academic progress and tuition portal',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#1C1C1E] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8E8E93] hover:text-white p-1 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#0A84FF]/20 text-[#0A84FF] border border-[#0A84FF]/30">
            RBAC Testing Console
          </span>
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">
          Quick Preset Role Accounts
        </h3>
        <p className="text-xs text-[#8E8E93] mt-1 mb-5 leading-relaxed">
          Select any of the 4 standard School ERP roles to instantly populate the credentials and test authentication flow.
        </p>

        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {Object.entries(DEMO_ERP_ACCOUNTS).map(([key, data]) => {
            const meta = roleMeta[data.profile.role];
            return (
              <div
                key={key}
                onClick={() => {
                  onSelectAccount(data.profile.username, data.password, true);
                  onClose();
                }}
                className="group p-4 bg-[#2C2C2E]/70 hover:bg-[#2C2C2E] border border-white/5 hover:border-[#0A84FF]/50 rounded-2xl cursor-pointer transition flex items-center justify-between"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center shrink-0 mt-0.5">
                    {meta.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white group-hover:text-[#0A84FF] transition">
                        {data.profile.fullName}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${meta.color}`}>
                        {meta.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#8E8E93] mt-0.5">
                      <span className="font-mono text-zinc-300">{data.profile.username}</span>
                      <span>·</span>
                      <span>{data.profile.designation || data.profile.gradeLevel}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      {meta.desc}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 ml-3">
                  <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0A84FF]/10 text-[#0A84FF] group-hover:bg-[#0A84FF] group-hover:text-white transition">
                    Fill & Sign In
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
