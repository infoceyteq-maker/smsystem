import React from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Send, 
  ClipboardCheck, 
  Users, 
  Calendar, 
  CreditCard, 
  BarChart2, 
  Settings, 
  Plus, 
  ChevronDown, 
  X,
} from 'lucide-react';
import { SchoolLogo } from '../common/SchoolLogo';
import { TenantSwitcher } from '../common/TenantSwitcher';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  pendingApprovalsCount?: number;
  onOpenSendInvites: () => void;
  onOpenApprovals: () => void;
  onOpenRegistration?: () => void;
  onOpenTeacherRegistration?: () => void;
  onOpenSuperAdmin?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingApprovalsCount = 12,
  onOpenSendInvites,
  onOpenApprovals,
  onOpenRegistration,
  onOpenTeacherRegistration,
  onOpenSuperAdmin,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'invitations', label: 'Invitations', icon: Send, action: onOpenSendInvites },
    { 
      id: 'approvals', 
      label: 'Approvals', 
      icon: ClipboardCheck, 
      badge: pendingApprovalsCount,
    },
    { id: 'students', label: 'Students', icon: GraduationCap, action: onOpenRegistration },
    { id: 'staff', label: 'Staff', icon: Users, action: onOpenTeacherRegistration },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'reports', label: 'Reports', icon: BarChart2 },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-4 z-50 transition-transform duration-300 shadow-xs ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col space-y-5 overflow-y-auto pr-1">
          {/* Header Brand */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              <SchoolLogo size="md" interactive={true} />
              <div>
                <h1 className="text-sm font-bold text-gray-900 tracking-tight leading-none">
                  Sri Sumangala College
                </h1>
                <p className="text-[10px] uppercase font-semibold text-amber-700 tracking-wider mt-1">
                  KANDY · ESTD - 1934
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            {onCloseMobile && (
              <button 
                onClick={onCloseMobile}
                className="lg:hidden text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Multi-School Tenant Switcher */}
          <TenantSwitcher variant="sidebar" onOpenSuperAdmin={onOpenSuperAdmin} />

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      onSelectTab(item.id);
                    }
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-50 text-[#007AFF] border border-blue-200 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#007AFF]' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF3B30] text-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Promotional / Action Banner */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 rounded-2xl p-3.5 space-y-2 mt-4 shadow-xs">
            <h4 className="text-xs font-bold text-gray-900 leading-snug">
              A new chapter starts here
            </h4>
            <p className="text-[11px] text-gray-600 leading-relaxed font-normal">
              Invite students and teachers to complete their self-onboarding profiles.
            </p>
            <button
              onClick={onOpenSendInvites}
              className="w-full mt-1.5 py-2 px-3 bg-[#007AFF] hover:bg-[#0062CC] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/20 active:scale-[0.98] transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Send Invites</span>
            </button>
          </div>
        </div>

        {/* Footer Area: Settings & User Profile */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <button
            onClick={() => onSelectTab('settings')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition"
          >
            <Settings className="w-4 h-4 text-gray-400" />
            <span>Settings</span>
          </button>

          {/* User profile avatar chip */}
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-xs font-bold text-[#007AFF]">
              NP
            </div>
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-xs font-bold text-gray-900 truncate">
                Nadeesha Perera
              </span>
              <span className="text-[10px] text-gray-500 truncate font-medium">
                Master Admin
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
