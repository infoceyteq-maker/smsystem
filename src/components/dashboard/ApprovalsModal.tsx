import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, UserCheck, GraduationCap, School } from 'lucide-react';
import { PendingProfileItem } from '../../types/dashboard';
import { reviewApplication } from '../../actions/masterAdminActions';

interface ApprovalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingList: PendingProfileItem[];
  onUpdatePendingList: (updated: PendingProfileItem[]) => void;
}

export const ApprovalsModal: React.FC<ApprovalsModalProps> = ({
  isOpen,
  onClose,
  pendingList,
  onUpdatePendingList,
}) => {
  const [filter, setFilter] = useState<'all' | 'student' | 'teacher'>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = pendingList.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const handleAction = async (id: string, decision: 'approve' | 'reject') => {
    setProcessingId(id);
    await reviewApplication(id, decision);
    setProcessingId(null);

    // Update list in state
    const nextList = pendingList.map((item) => {
      if (item.id === id) {
        return { ...item, status: decision === 'approve' ? ('approved' as const) : ('rejected' as const) };
      }
      return item;
    });
    onUpdatePendingList(nextList);
  };

  const pendingActiveCount = pendingList.filter((p) => p.status === 'pending').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col max-h-[85vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-red-50 text-[#FF3B30] border border-red-200">
            {pendingActiveCount} Pending Review
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          Application Approval Queue
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 mb-4">
          Decide on student admissions and teacher appointments.
        </p>

        {/* Filter pills */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filter === 'all'
                ? 'bg-[#007AFF] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            All Pending ({pendingList.length})
          </button>
          <button
            onClick={() => setFilter('student')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filter === 'student'
                ? 'bg-[#007AFF] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setFilter('teacher')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filter === 'teacher'
                ? 'bg-[#007AFF] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            Teachers
          </button>
        </div>

        {/* Profiles list */}
        <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-gray-50/80 border border-gray-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border shadow-xs ${
                    item.type === 'student'
                      ? 'bg-blue-50 text-[#007AFF] border-blue-200'
                      : 'bg-purple-50 text-purple-700 border-purple-200'
                  }`}
                >
                  {item.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">
                      {item.fullName}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded-full border font-semibold ${
                        item.type === 'student'
                          ? 'bg-blue-50 text-[#007AFF] border-blue-200'
                          : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}
                    >
                      {item.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 font-medium">
                    {item.identifier} · {item.gradeOrDept}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
                    {item.submittedAt}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {item.status === 'approved' ? (
                  <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-50 text-[#34C759] border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approved</span>
                  </span>
                ) : item.status === 'rejected' ? (
                  <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-red-50 text-[#FF3B30] border border-red-200 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Rejected</span>
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => handleAction(item.id, 'reject')}
                      disabled={processingId === item.id}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 text-[#FF3B30] border border-red-200 transition"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleAction(item.id, 'approve')}
                      disabled={processingId === item.id}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#34C759] hover:bg-emerald-600 text-white shadow-xs transition"
                    >
                      Approve
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Decisions immediately update PostgreSQL database records</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
