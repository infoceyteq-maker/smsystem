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
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
      desc: 'Full multi-campus governance, all databases, finances & staff',
    },
    normal_admin: {
      badge: 'Normal Admin',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: <School className="w-5 h-5 text-blue-600" />,
      desc: 'Colombo campus administration, student admissions, scheduling',
    },
    teacher: {
      badge: 'Teacher / Faculty',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <UserCheck className="w-5 h-5 text-emerald-600" />,
      desc: 'Grade roster, live attendance tracking, subject marks',
    },
    student: {
      badge: 'Student',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: <GraduationCap className="w-5 h-5 text-amber-600" />,
      desc: 'Personal attendance, timetable, fee invoices & reports',
    },
    parent: {
      badge: 'Parent',
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: <UserCheck className="w-5 h-5 text-gray-600" />,
      desc: 'Child academic progress and tuition portal',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          Select Role / Demo Persona
        </h3>
        <p className="text-xs text-gray-500 mt-1 mb-5">
          Select any sample profile to pre-fill credentials and test RBAC data access.
        </p>

        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {Object.entries(DEMO_ERP_ACCOUNTS).map(([username, account]) => {
            const meta = roleMeta[account.profile.role];
            return (
              <div
                key={username}
                className="p-3.5 bg-gray-50/80 hover:bg-blue-50/50 border border-gray-200 hover:border-blue-300 rounded-2xl flex items-center justify-between gap-3 transition group cursor-pointer"
                onClick={() => {
                  onSelectAccount(username, account.password, false);
                  onClose();
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-xs">
                    {meta.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900 group-hover:text-[#007AFF] transition">
                        {account.profile.fullName}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${meta.color}`}>
                        {meta.badge}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                      {meta.desc}
                    </p>
                    <p className="text-[11px] text-gray-400 font-mono mt-1">
                      User: {username} · Pass: {account.password}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAccount(username, account.password, true);
                      onClose();
                    }}
                    className="px-2.5 py-1 text-xs font-semibold bg-[#007AFF] hover:bg-[#0062CC] text-white rounded-lg shadow-xs transition"
                  >
                    Quick Sign In
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Password for all sample accounts: <code className="font-mono text-gray-700 bg-gray-100 px-1 py-0.5 rounded">Password@2026</code></span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 font-medium"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
