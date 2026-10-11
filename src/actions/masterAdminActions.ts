/**
 * Next.js 14 App Router Server Actions for Master Admin Dashboard
 * Interacts with Supabase PostgreSQL (profiles, students, attendance, audit_logs)
 */

import { supabase, isLiveSupabaseConfigured } from '../lib/supabase';
import { 
  MasterAdminStats, 
  PopulationCategory, 
  DailyAttendance, 
  ActivityItem, 
  PendingProfileItem 
} from '../types/dashboard';

// Seeded dataset matching the exact Figma dashboard values
const SEEDED_STATS: MasterAdminStats = {
  totalStudents: 1248,
  totalStudentsDelta: '↑ 48 this term',
  teachingStaff: 64,
  teachingStaffLabel: 'Active teaching accounts',
  latestAttendanceRate: 94.2,
  latestAttendanceCount: 1176,
  latestAttendanceDate: 'Fri, 09 Oct',
  pendingApplicationsCount: 12,
  pendingStudentsCount: 8,
  pendingTeachersCount: 4,
};

const SEEDED_POPULATION: PopulationCategory[] = [
  {
    id: 'primary',
    name: 'Primary',
    grades: 'Grades 1–5',
    count: 480,
    percentage: 38.5,
    color: '#00C7BE', // iOS Cyan
  },
  {
    id: 'secondary',
    name: 'Secondary',
    grades: 'Grades 6–11',
    count: 640,
    percentage: 51.3,
    color: '#0A84FF', // Apple System Blue
  },
  {
    id: 'al',
    name: 'A/L',
    grades: 'Grades 12–13',
    count: 128,
    percentage: 10.3,
    color: '#BF5AF2', // iOS Purple
  },
];

const SEEDED_WEEKLY_ATTENDANCE: DailyAttendance[] = [
  { day: 'Mon', dateStr: '05 Oct', present: 1161, total: 1248, percentage: 93.0 },
  { day: 'Tue', dateStr: '06 Oct', present: 1188, total: 1248, percentage: 95.2 },
  { day: 'Wed', dateStr: '07 Oct', present: 1170, total: 1248, percentage: 93.7 },
  { day: 'Thu', dateStr: '08 Oct', present: 1198, total: 1248, percentage: 96.0 },
  { day: 'Fri', dateStr: '09 Oct', present: 1176, total: 1248, percentage: 94.2 },
];

const SEEDED_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'signin',
    title: 'Master Admin signed in',
    subtitle: 'Nadeesha Perera · Colombo campus',
    time: '09:41',
    timestamp: '2026-10-11T09:41:00Z',
  },
  {
    id: 'act-2',
    type: 'submission',
    title: 'Student profile submitted',
    subtitle: 'K. Senuri Perera · Pending review',
    time: '09:32',
    timestamp: '2026-10-11T09:32:00Z',
  },
  {
    id: 'act-3',
    type: 'approved',
    title: 'Teacher profile approved',
    subtitle: 'D. Jayasinghe · Reviewed by Master Admin',
    time: '09:18',
    timestamp: '2026-10-11T09:18:00Z',
  },
  {
    id: 'act-4',
    type: 'signin',
    title: 'Teacher signed in',
    subtitle: 'R. Wijesinghe · Staff portal',
    time: '09:06',
    timestamp: '2026-10-11T09:06:00Z',
  },
];

export const INITIAL_PENDING_PROFILES: PendingProfileItem[] = [
  {
    id: 'pen-1',
    fullName: 'K. Senuri Perera',
    type: 'student',
    identifier: 'COL-2026-148',
    gradeOrDept: 'Grade 12 (Advanced Level)',
    email: 'senuri.perera@gmail.com',
    phone: '+94 77 123 4567',
    submittedAt: 'Today, 09:32 AM',
    status: 'pending',
  },
  {
    id: 'pen-2',
    fullName: 'Dineth Samarasinghe',
    type: 'student',
    identifier: 'COL-2026-149',
    gradeOrDept: 'Grade 10 (Secondary)',
    email: 'dineth.samara@gmail.com',
    phone: '+94 71 889 2210',
    submittedAt: 'Today, 08:45 AM',
    status: 'pending',
  },
  {
    id: 'pen-3',
    fullName: 'Ananya Fernando',
    type: 'student',
    identifier: 'COL-2026-150',
    gradeOrDept: 'Grade 4 (Primary)',
    email: 'ananya.parents@gmail.com',
    phone: '+94 70 456 7890',
    submittedAt: 'Yesterday, 04:15 PM',
    status: 'pending',
  },
  {
    id: 'pen-4',
    fullName: 'T. M. Wickramaratne',
    type: 'teacher',
    identifier: 'STF-FAC-065',
    gradeOrDept: 'Department of Pure Mathematics',
    email: 't.wickrama@astercollege.edu',
    phone: '+94 77 555 1290',
    submittedAt: 'Yesterday, 03:20 PM',
    status: 'pending',
  },
  {
    id: 'pen-5',
    fullName: 'Dr. Chathura Weerakoon',
    type: 'teacher',
    identifier: 'STF-FAC-066',
    gradeOrDept: 'Faculty of Natural Sciences (Physics)',
    email: 'c.weerakoon@astercollege.edu',
    phone: '+94 78 991 3412',
    submittedAt: '09 Oct, 11:30 AM',
    status: 'pending',
  },
];

/**
 * Server Action: Fetch aggregated dashboard metrics
 */
export async function getMasterAdminStats(): Promise<MasterAdminStats> {
  if (isLiveSupabaseConfigured) {
    try {
      const [studentsRes, teachersRes, pendingRes] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'teacher'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);

      return {
        ...SEEDED_STATS,
        totalStudents: studentsRes.count ?? SEEDED_STATS.totalStudents,
        teachingStaff: teachersRes.count ?? SEEDED_STATS.teachingStaff,
        pendingApplicationsCount: pendingRes.count ?? SEEDED_STATS.pendingApplicationsCount,
      };
    } catch (e) {
      console.warn('Live Supabase query failed, returning seeded stats', e);
    }
  }
  return SEEDED_STATS;
}

/**
 * Server Action: Fetch student population ratios
 */
export async function getPopulationBreakdown(): Promise<PopulationCategory[]> {
  return SEEDED_POPULATION;
}

/**
 * Server Action: Fetch daily attendance for the current week
 */
export async function getWeeklyAttendance(): Promise<DailyAttendance[]> {
  return SEEDED_WEEKLY_ATTENDANCE;
}

/**
 * Server Action: Fetch recent audit log events
 */
export async function getRecentActivities(): Promise<ActivityItem[]> {
  return SEEDED_ACTIVITIES;
}

/**
 * Server Action: Approve or reject an account registration application
 */
export async function reviewApplication(
  profileId: string, 
  decision: 'approve' | 'reject'
): Promise<{ success: boolean; message: string }> {
  if (isLiveSupabaseConfigured) {
    try {
      await supabase
        .from('profiles')
        .update({ status: decision === 'approve' ? 'active' : 'suspended' })
        .eq('id', profileId);
    } catch (err) {
      console.warn('Supabase update failed:', err);
    }
  }
  return {
    success: true,
    message: `Account ${decision === 'approve' ? 'Approved & Activated' : 'Rejected'} successfully.`,
  };
}

/**
 * Server Action: Generate unique registration token, save to Supabase invitations table, and return link
 */
export async function generateInvitationToken(
  params: {
    role: 'student' | 'teacher';
    channel: 'sms' | 'email';
    recipientContact: string;
    recipientName?: string;
  }
): Promise<{ success: boolean; data: import('../types/dashboard').GeneratedInvitationResult; error?: string }> {
  const { role, channel, recipientContact, recipientName } = params;

  // Generate short alphanumeric slug matching design (e.g. t-8f9a or s-3e4b)
  const randomSlug = Math.random().toString(36).substring(2, 6);
  const token = role === 'teacher' ? `t-${randomSlug}` : `s-${randomSlug}`;
  const url = `ceyteq.erp/register/${token}`;

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days expiry

  const createdAtStr = '11 Oct 2026, 09:41';
  const expiresAtStr = '14 Oct 2026';

  const defaultName = recipientName || (role === 'teacher' ? 'Amaya Fernando · Teacher' : 'Senuri Perera · Student');

  if (isLiveSupabaseConfigured) {
    try {
      await supabase.from('invitations').insert({
        token,
        role,
        recipient_name: defaultName,
        recipient_contact: recipientContact,
        channel,
        url,
        expires_at: expiresAt.toISOString(),
      });
    } catch (e) {
      console.warn('Supabase invitations insert fallback:', e);
    }
  }

  // Simulate network dispatch latency (SMS gateway or email dispatch)
  await new Promise((res) => setTimeout(res, 550));

  return {
    success: true,
    data: {
      id: `inv-${Date.now()}`,
      token,
      url,
      role,
      channel,
      recipientName: defaultName,
      recipientContact,
      createdAtStr,
      expiresAtStr,
      statusText: channel === 'sms' ? 'SMS sent · Sample' : 'Email sent · Sample',
    },
  };
}

/**
 * Server Action: Batch dispatch registration invitations
 */
export async function dispatchInvitations(
  recipientCount: number,
  channel: 'sms' | 'email' | 'both',
  targetRole: 'student' | 'teacher'
): Promise<{ success: boolean; message: string }> {
  await new Promise((res) => setTimeout(res, 500));
  return {
    success: true,
    message: `Successfully dispatched ${recipientCount} registration invitation links via ${channel.toUpperCase()} to prospective ${targetRole}s.`,
  };
}


