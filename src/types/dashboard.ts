export interface MasterAdminStats {
  totalStudents: number;
  totalStudentsDelta: string;
  teachingStaff: number;
  teachingStaffLabel: string;
  latestAttendanceRate: number;
  latestAttendanceCount: number;
  latestAttendanceDate: string;
  pendingApplicationsCount: number;
  pendingStudentsCount: number;
  pendingTeachersCount: number;
}

export interface PopulationCategory {
  id: 'primary' | 'secondary' | 'al';
  name: string;
  grades: string;
  count: number;
  percentage: number;
  color: string;
}

export interface DailyAttendance {
  day: string;
  dateStr: string;
  present: number;
  total: number;
  percentage: number;
}

export interface ActivityItem {
  id: string;
  type: 'signin' | 'submission' | 'approved' | 'rejected' | 'invite';
  title: string;
  subtitle: string;
  time: string;
  timestamp: string;
}

export interface PendingProfileItem {
  id: string;
  fullName: string;
  type: 'student' | 'teacher';
  identifier: string; // admission number or staff ID
  gradeOrDept: string;
  email: string;
  phone: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface GenerateInvitationParams {
  role: 'student' | 'teacher';
  channel: 'sms' | 'email';
  recipientContact: string;
  recipientName?: string;
  tenantId?: string;
}

export interface GeneratedInvitationResult {
  id: string;
  token: string;
  url: string;
  role: 'student' | 'teacher';
  channel: 'sms' | 'email';
  recipientName: string;
  recipientContact: string;
  createdAtStr: string;
  expiresAtStr: string;
  statusText: string;
}

