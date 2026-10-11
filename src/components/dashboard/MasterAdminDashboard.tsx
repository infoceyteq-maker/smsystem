import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { StatCard } from './StatCard';
import { QuickActionCard } from './QuickActionCard';
import { PopulationDonutChart } from './PopulationDonutChart';
import { WeeklyAttendanceChart } from './WeeklyAttendanceChart';
import { RecentActivityList } from './RecentActivityList';
import { ReadyForReviewCard } from './ReadyForReviewCard';
import { InvitationModal } from './InvitationModal';
import { ApprovalsModal } from './ApprovalsModal';
import { ManageUsersModal } from './ManageUsersModal';

// Final Modules
import { ApprovalDashboard } from '../approvals/ApprovalDashboard';
import { DailyAttendanceForm } from '../attendance/DailyAttendanceForm';
import { PaymentCollectionForm } from '../payments/PaymentCollectionForm';

import { 
  getMasterAdminStats, 
  getPopulationBreakdown, 
  getWeeklyAttendance, 
  getRecentActivities,
  INITIAL_PENDING_PROFILES 
} from '../../actions/masterAdminActions';
import { 
  MasterAdminStats, 
  PopulationCategory, 
  DailyAttendance, 
  ActivityItem, 
  PendingProfileItem 
} from '../../types/dashboard';
import { Send, ClipboardCheck, Users } from 'lucide-react';

interface MasterAdminDashboardProps {
  onReturnToLogin?: () => void;
  onOpenRegistration?: () => void;
  onOpenTeacherRegistration?: () => void;
  initialTab?: string;
}

export const MasterAdminDashboard: React.FC<MasterAdminDashboardProps> = ({
  onReturnToLogin,
  onOpenRegistration,
  onOpenTeacherRegistration,
  initialTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync initialTab when changed from outside (e.g. top reviewer ribbon)
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Modals
  const [isSendInvitesOpen, setIsSendInvitesOpen] = useState(false);
  const [isApprovalsOpen, setIsApprovalsOpen] = useState(false);
  const [isManageUsersOpen, setIsManageUsersOpen] = useState(false);

  // Live Data States
  const [stats, setStats] = useState<MasterAdminStats | null>(null);
  const [population, setPopulation] = useState<PopulationCategory[]>([]);
  const [attendance, setAttendance] = useState<DailyAttendance[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [pendingList, setPendingList] = useState<PendingProfileItem[]>(INITIAL_PENDING_PROFILES);

  useEffect(() => {
    async function loadData() {
      const [s, p, a, act] = await Promise.all([
        getMasterAdminStats(),
        getPopulationBreakdown(),
        getWeeklyAttendance(),
        getRecentActivities(),
      ]);
      setStats(s);
      setPopulation(p);
      setAttendance(a);
      setActivities(act);
    }
    loadData();
  }, []);

  const pendingActiveCount = pendingList.filter((p) => p.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 flex flex-col lg:flex-row font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        pendingApprovalsCount={pendingActiveCount}
        onOpenSendInvites={() => setIsSendInvitesOpen(true)}
        onOpenApprovals={() => setActiveTab('approvals')}
        onOpenRegistration={onOpenRegistration}
        onOpenTeacherRegistration={onOpenTeacherRegistration}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Dashboard Content Canvas */}
      <main className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Header */}
        <DashboardHeader
          onToggleMobileMenu={() => setIsMobileSidebarOpen(true)}
          onReturnToLogin={onReturnToLogin}
          pendingApprovalsCount={pendingActiveCount}
        />

        {/* Tab-based View Routing */}
        {activeTab === 'approvals' ? (
          <ApprovalDashboard onBack={() => setActiveTab('overview')} />
        ) : activeTab === 'attendance' ? (
          <DailyAttendanceForm onBack={() => setActiveTab('overview')} />
        ) : activeTab === 'payments' ? (
          <PaymentCollectionForm onBack={() => setActiveTab('overview')} />
        ) : (
          /* Default: Overview Tab */
          <>
            {/* Top 4 Stat Metric Cards (Row 1) */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 my-2">
              <StatCard
                label="Total students"
                value={stats ? stats.totalStudents.toLocaleString() : '1,248'}
                subtext={stats?.totalStudentsDelta || '↑ 48 this term'}
                subtextColor="text-[#007AFF]"
                onClick={onOpenRegistration}
              />
              <StatCard
                label="Teaching staff"
                value={stats ? stats.teachingStaff : 64}
                subtext={stats?.teachingStaffLabel || 'Active teaching accounts'}
                subtextColor="text-purple-600"
                onClick={onOpenTeacherRegistration}
              />
              <StatCard
                label="Latest attendance"
                value={stats ? `${stats.latestAttendanceRate}%` : '94.2%'}
                subtext={stats ? `${stats.latestAttendanceCount.toLocaleString()} present · ${stats.latestAttendanceDate}` : '1,176 present · Fri, 09 Oct'}
                subtextColor="text-[#34C759]"
                onClick={() => setActiveTab('attendance')}
              />
              <StatCard
                label="Pending applications"
                value={pendingActiveCount}
                subtext={`${stats?.pendingStudentsCount || 8} students · ${stats?.pendingTeachersCount || 4} teachers`}
                subtextColor="text-amber-600"
                onClick={() => setActiveTab('approvals')}
              />
            </section>

            {/* 3 Quick Action Cards (Row 2) */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 my-3">
              <QuickActionCard
                icon={<Send className="w-5 h-5 text-[#007AFF]" />}
                title="Send Invites"
                subtitle="SMS or email registration links"
                onClick={() => setIsSendInvitesOpen(true)}
              />
              <QuickActionCard
                icon={<ClipboardCheck className="w-5 h-5 text-[#007AFF]" />}
                title="Pending Approvals"
                badge={pendingActiveCount}
                subtitle={`${stats?.pendingStudentsCount || 8} students · ${stats?.pendingTeachersCount || 4} teachers`}
                onClick={() => setActiveTab('approvals')}
              />
              <QuickActionCard
                icon={<Users className="w-5 h-5 text-[#007AFF]" />}
                title="Manage Users"
                subtitle="Roles, access, and school profiles"
                onClick={() => setIsManageUsersOpen(true)}
              />
            </section>

            {/* Visual Charts (Row 3) */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4 my-3">
              <PopulationDonutChart
                categories={population}
                totalStudents={stats?.totalStudents || 1248}
              />
              <WeeklyAttendanceChart
                data={attendance}
                totalCapacity={stats?.totalStudents || 1248}
                averageRate={94.4}
              />
            </section>

            {/* Recent Activity & Ready For Review (Row 4) */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-4 my-3">
              <div className="lg:col-span-2">
                <RecentActivityList
                  activities={activities}
                  onViewAll={() => setActiveTab('approvals')}
                />
              </div>
              <div className="lg:col-span-1">
                <ReadyForReviewCard
                  pendingCount={pendingActiveCount}
                  studentsCount={stats?.pendingStudentsCount || 8}
                  teachersCount={stats?.pendingTeachersCount || 4}
                  onOpenApprovals={() => setActiveTab('approvals')}
                />
              </div>
            </section>

            {/* Bottom Metadata Footer */}
            <footer className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 pt-6 pb-2 border-t border-gray-200 mt-4">
              <span>Illustrative sample data · Academic year 2026</span>
              <span className="font-mono mt-1 sm:mt-0 font-medium text-gray-400">Updated 11 Oct 2026, 09:41</span>
            </footer>
          </>
        )}
      </main>

      {/* Interactive Modals */}
      <InvitationModal
        isOpen={isSendInvitesOpen}
        onClose={() => setIsSendInvitesOpen(false)}
      />

      <ApprovalsModal
        isOpen={isApprovalsOpen}
        onClose={() => setIsApprovalsOpen(false)}
        pendingList={pendingList}
        onUpdatePendingList={setPendingList}
      />

      <ManageUsersModal
        isOpen={isManageUsersOpen}
        onClose={() => setIsManageUsersOpen(false)}
      />
    </div>
  );
};
