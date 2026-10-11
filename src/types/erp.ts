export type UserRole = 'master_admin' | 'normal_admin' | 'teacher' | 'student' | 'parent';

export interface CampusTenant {
  id: string;
  name: string;
  code: string;
  year: number;
  location: string;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  username: string; // e.g. "master.admin" or admission no "std.2026.042"
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  tenantId: string;
  tenantName: string;
  admissionNo?: string;
  department?: string;
  designation?: string;
  gradeLevel?: string;
  phone?: string;
  isBiometricEnrolled?: boolean;
  status: 'active' | 'suspended' | 'pending';
  lastSignInAt?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  role: UserRole | null;
  token?: string;
  tenant: CampusTenant | null;
  error?: string | null;
}

export interface SignInCredentials {
  identifier: string; // username or admission number
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: UserProfile;
  sessionToken?: string;
  message?: string;
  error?: string;
}

export interface ERPStatsSummary {
  totalStudents: number;
  totalFaculty: number;
  dailyAttendanceRate: number;
  outstandingFeesCount: number;
  activeTerms: string;
}
