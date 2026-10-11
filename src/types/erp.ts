export type UserRole = 'super_admin' | 'master_admin' | 'normal_admin' | 'teacher' | 'student' | 'parent';

export interface SchoolColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface SchoolTenant {
  id: string; // e.g. "school-ssck-kandy"
  name: string; // e.g. "Sri Sumangala College - Kandy"
  code: string; // e.g. "SSCK-1934"
  establishedYear: number;
  location: string;
  adminEmail: string;
  adminName: string;
  phone: string;
  status: 'active' | 'pending' | 'suspended';
  subscriptionPlan: 'starter' | 'professional' | 'enterprise';
  studentCount: number;
  teacherCount: number;
  colors: SchoolColors;
  subdomain: string; // e.g. "ssck" -> ssck.ceyteq.edu.lk
  motto?: string;
  logoUrl?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface CampusTenant extends SchoolTenant {
  // Backwards compatibility alias
  year: number;
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
