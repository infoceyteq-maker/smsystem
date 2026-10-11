import React, { useState } from 'react';
import { X, Search, ShieldCheck, UserCheck, GraduationCap, School } from 'lucide-react';
import { DEMO_ERP_ACCOUNTS } from '../../lib/supabase';

interface ManageUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageUsersModal: React.FC<ManageUsersModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const usersList = Object.values(DEMO_ERP_ACCOUNTS).map((item) => item.profile);
  const filteredUsers = usersList.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col max-h-[85vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          Manage Institution Users & RBAC
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 mb-4">
          Sri Sumangala College Kandy roles, access permissions, and Supabase JWT status.
        </p>

        {/* Search bar */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 mb-4 focus-within:border-[#007AFF] transition shadow-xs">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, role, username..."
            className="w-full bg-transparent text-gray-900 text-xs outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Users list */}
        <div className="space-y-2 overflow-y-auto flex-1 pr-1">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="p-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-800 shadow-xs">
                  {user.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">
                      {user.fullName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-[#007AFF] border border-blue-200">
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                    {user.email} · {user.username}
                  </p>
                </div>
              </div>

              <div className="text-right flex flex-col items-end">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Active</span>
                </span>
                <span className="text-[10px] text-gray-400 mt-1 font-mono">
                  {user.designation || user.gradeLevel || 'Sri Sumangala College, Kandy'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Row Level Security enforced on public.profiles</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
