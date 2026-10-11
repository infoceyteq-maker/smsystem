import React from 'react';
import { X, CheckCircle2, XCircle, User, Phone, Mail, MapPin, Calendar, Award, ShieldCheck, GraduationCap } from 'lucide-react';
import { PendingProfileItem } from '../../types/dashboard';

interface ProfileDetailDrawerProps {
  profile: PendingProfileItem | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const ProfileDetailDrawer: React.FC<ProfileDetailDrawerProps> = ({
  profile,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!profile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Card */}
        <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#007AFF] text-xl font-bold shadow-xs">
            {profile.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                {profile.fullName}
              </h2>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
                  profile.type === 'student'
                    ? 'bg-blue-50 text-[#007AFF] border-blue-200'
                    : 'bg-purple-50 text-purple-700 border-purple-200'
                }`}
              >
                {profile.type.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5 font-mono">
              {profile.identifier} · {profile.gradeOrDept}
            </p>
            <p className="text-[11px] text-gray-400 mt-1 font-mono">
              Submitted: {profile.submittedAt}
            </p>
          </div>
        </div>

        {/* Details sections */}
        <div className="space-y-4 my-5 text-xs">
          <div className="p-4 bg-gray-50/80 border border-gray-200 rounded-2xl space-y-2.5 shadow-xs">
            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">
              Contact & Residency
            </h4>
            <div className="flex items-center gap-2.5 text-gray-600">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-600">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>Kandy District, Central Province, Sri Lanka</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50/80 border border-gray-200 rounded-2xl space-y-2.5 shadow-xs">
            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">
              Institutional Verification Check
            </h4>
            <div className="flex items-center justify-between text-gray-600">
              <span>National ID (NIC) / Birth Registry</span>
              <span className="font-mono text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Record
              </span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Tenant Assignment</span>
              <span className="font-medium text-gray-900">Sri Sumangala College · Kandy</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Authorization Action</span>
              <span className="text-amber-700 font-semibold">Requires Master Admin Signature</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={() => onReject(profile.id)}
            className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-[#FF3B30] border border-red-200 rounded-xl text-xs font-semibold transition"
          >
            Reject Application
          </button>
          <button
            onClick={() => onApprove(profile.id)}
            className="px-5 py-2.5 bg-[#34C759] hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-sm shadow-emerald-500/20 transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve & Provision Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
