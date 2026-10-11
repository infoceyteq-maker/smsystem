import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  GraduationCap, 
  School, 
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';
import { PendingProfileItem } from '../../types/dashboard';
import { INITIAL_PENDING_PROFILES } from '../../actions/masterAdminActions';
import { updateApprovalDecision } from '../../actions/modulesActions';
import { ProfileDetailDrawer } from './ProfileDetailDrawer';
import confetti from 'canvas-confetti';

interface ApprovalDashboardProps {
  onBack?: () => void;
}

export const ApprovalDashboard: React.FC<ApprovalDashboardProps> = ({ onBack }) => {
  const [profiles, setProfiles] = useState<PendingProfileItem[]>(INITIAL_PENDING_PROFILES);
  const [activeTab, setActiveTab] = useState<'all' | 'student' | 'teacher'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<PendingProfileItem | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    const target = profiles.find((p) => p.id === id);
    if (!target) return;

    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'approved' as const } : p))
    );

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#34C759', '#007AFF'],
      });
    } catch (_) {}

    setNotification(`Approved & Activated ${target.fullName} (${target.type.toUpperCase()}).`);
    setTimeout(() => setNotification(null), 3000);

    await updateApprovalDecision(id, target.type, 'approve');
  };

  const handleReject = async (id: string) => {
    const target = profiles.find((p) => p.id === id);
    if (!target) return;

    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'rejected' as const } : p))
    );

    setNotification(`Rejected application for ${target.fullName}.`);
    setTimeout(() => setNotification(null), 3000);

    await updateApprovalDecision(id, target.type, 'reject');
  };

  const filteredProfiles = profiles.filter((p) => {
    const matchesTab = activeTab === 'all' || p.type === activeTab;
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.gradeOrDept.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const pendingCount = profiles.filter((p) => p.status === 'pending').length;
  const studentPendingCount = profiles.filter((p) => p.status === 'pending' && p.type === 'student').length;
  const teacherPendingCount = profiles.filter((p) => p.status === 'pending' && p.type === 'teacher').length;

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-200">
      {/* 1. Header with back button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 shadow-xs transition"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                Approval Dashboard
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-[#FF3B30] border border-red-200 uppercase tracking-wider">
                {pendingCount} Pending
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Review and authorize pending student admissions and teacher appointments.
            </p>
          </div>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-2 text-xs">
          <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#007AFF]" />
            <span className="font-semibold text-gray-700">{studentPendingCount} Students</span>
          </div>
          <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-purple-600" />
            <span className="font-semibold text-gray-700">{teacherPendingCount} Teachers</span>
          </div>
        </div>
      </div>

      {/* Floating Notification Banner */}
      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900 font-semibold shadow-xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#34C759] shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 2. Controls: Segmented Control Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Segmented Tabs */}
        <div className="p-1 bg-gray-100 rounded-xl border border-gray-200 flex items-center gap-1 shadow-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'all'
                ? 'bg-white text-[#007AFF] shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            All ({profiles.length})
          </button>
          <button
            onClick={() => setActiveTab('student')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'student'
                ? 'bg-white text-[#007AFF] shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Pending Students
          </button>
          <button
            onClick={() => setActiveTab('teacher')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'teacher'
                ? 'bg-white text-[#007AFF] shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Pending Teachers
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search applicant name, ID..."
            className="w-full bg-white border border-gray-200 focus:border-[#007AFF] rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 outline-none placeholder:text-gray-400 shadow-xs transition"
          />
        </div>
      </div>

      {/* 3. Responsive Applicant Cards / Table */}
      <div className="space-y-3">
        {filteredProfiles.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 shadow-xs">
            <p className="text-sm font-semibold text-gray-700">No applicants found in this view</p>
            <p className="text-xs text-gray-400 mt-1">Try switching tabs or clearing your search filter.</p>
          </div>
        ) : (
          filteredProfiles.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs transition group"
            >
              {/* Left Applicant Details */}
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold border shrink-0 shadow-xs ${
                    item.type === 'student'
                      ? 'bg-blue-50 text-[#007AFF] border-blue-200'
                      : 'bg-purple-50 text-purple-700 border-purple-200'
                  }`}
                >
                  {item.fullName.charAt(0)}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 tracking-tight">
                      {item.fullName}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
                        item.type === 'student'
                          ? 'bg-blue-50 text-[#007AFF] border-blue-200'
                          : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}
                    >
                      {item.type.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-mono font-medium text-gray-500">
                      {item.identifier}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mt-1 font-medium">
                    {item.gradeOrDept} · <span className="text-gray-400 font-normal">{item.email}</span>
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5 font-mono">
                    Submitted: {item.submittedAt}
                  </p>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                {/* View Full Profile button */}
                <button
                  onClick={() => setSelectedProfile(item)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full Profile</span>
                </button>

                {item.status === 'approved' ? (
                  <span className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-[#34C759] border border-emerald-200 flex items-center gap-1.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approved & Active</span>
                  </span>
                ) : item.status === 'rejected' ? (
                  <span className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-50 text-[#FF3B30] border border-red-200 flex items-center gap-1.5 shadow-xs">
                    <XCircle className="w-4 h-4" />
                    <span>Rejected</span>
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 text-[#FF3B30] border border-red-200 transition cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#34C759] hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/20 active:scale-[0.98] transition flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. Full Profile Modal Drawer */}
      <ProfileDetailDrawer
        profile={selectedProfile}
        onClose={() => setSelectedProfile(null)}
        onApprove={(id) => {
          handleApprove(id);
          setSelectedProfile(null);
        }}
        onReject={(id) => {
          handleReject(id);
          setSelectedProfile(null);
        }}
      />
    </div>
  );
};
