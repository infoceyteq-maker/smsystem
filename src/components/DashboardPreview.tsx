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
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 mb-6 shadow-sm relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#007AFF] flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-blue-500/25 ring-2 ring-blue-100">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  {user.fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 text-[#007AFF] border border-blue-200">
                  {user.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                {user.designation || user.gradeLevel || user.department} · {user.tenantName}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-2">
                <span className="flex items-center gap-1 font-medium text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759]" />
                  <span>Authenticated via Supabase JWT</span>
                </span>
                <span>·</span>
                <span className="font-mono text-gray-400">ID: {user.username}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <button
              onClick={onSwitchRole}
              className="px-3.5 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl transition cursor-pointer"
            >
              Switch Persona
            </button>
            <button
              onClick={onSignOut}
              className="px-3.5 py-2 text-xs font-semibold bg-red-50 hover:bg-red-100 text-[#FF3B30] border border-red-200 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Role-specific Quick Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#007AFF] flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 tracking-tight">
            Role Access Level
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Permissions granted according to PostgreSQL Row Level Security policies for <strong>{user.role}</strong>.
          </p>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#34C759] flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 tracking-tight">
            Campus Context
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Scoped to Sri Sumangala College Kandy (SSCK-1934). All data isolated by multi-tenant schema.
          </p>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 tracking-tight">
            Biometric Enclave
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            {user.isBiometricEnrolled
              ? 'Face ID / Touch ID active for instant passkey login.'
              : 'Biometric credentials can be configured in account settings.'}
          </p>
        </div>
      </div>
    </div>
  );
};
