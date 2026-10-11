import React from 'react';
import { CheckCircle2, ArrowRight, RotateCcw, Clock, ShieldCheck, GraduationCap } from 'lucide-react';
import { StudentRegistrationResult } from '../../types/studentRegistration';

interface RegistrationSuccessProps {
  result: StudentRegistrationResult;
  onReset: () => void;
  onGoToDashboard?: () => void;
}

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
  result,
  onReset,
  onGoToDashboard,
}) => {
  return (
    <div className="w-full bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 text-center shadow-lg animate-in zoom-in-95 duration-300 space-y-6">
      {/* Glowing Checkmark */}
      <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200 text-[#34C759] flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Master Admin Approval</span>
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Submission Received
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1.5 max-w-md mx-auto leading-relaxed">
          The student profile for <strong className="text-gray-900">{result.fullName}</strong> has been logged to the Sri Sumangala College queue.
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-gray-50/80 border border-gray-200 rounded-2xl p-4 sm:p-5 text-left space-y-3 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
          <span className="text-xs text-gray-500 font-medium">Admission Number</span>
          <span className="font-mono text-xs font-bold text-gray-900">
            {result.admissionNo}
          </span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
          <span className="text-xs text-gray-500 font-medium">Academic Assignment</span>
          <span className="text-xs font-bold text-gray-900">
            {result.grade} ({result.classSection}) · {result.stream}
          </span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
          <span className="text-xs text-gray-500 font-medium">Verification Timestamp</span>
          <span className="text-xs text-gray-600 font-medium">
            {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}, 09:41
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">Campus Tenant</span>
          <span className="text-xs text-gray-700 font-semibold">Sri Sumangala College · Kandy 2026</span>
        </div>
      </div>

      {/* Status Next Steps Banner */}
      <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl text-left text-xs text-blue-900 leading-relaxed">
        <strong>What happens next?</strong> The registrar checks birth certificate records against government identity registers. Once approved in the Master Admin panel, parent credentials and student card are generated.
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={onReset}
          className="w-full sm:flex-1 py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs sm:text-sm rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Register Another Student</span>
        </button>

        {onGoToDashboard && (
          <button
            onClick={onGoToDashboard}
            className="w-full sm:flex-1 py-3.5 px-4 bg-[#007AFF] hover:bg-[#0062CC] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Security stamp */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-2">
        <ShieldCheck className="w-3.5 h-3.5 text-[#007AFF]" />
        <span>Data secured by Row Level Security (RLS) on public.students</span>
      </div>
    </div>
  );
};
