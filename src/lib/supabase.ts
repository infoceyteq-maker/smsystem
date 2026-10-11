import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SchoolTenant, CampusTenant, UserProfile } from '../types/erp';

// Environment variables for Supabase (compatible with Next.js & Vite)
const supabaseUrl = 
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  'https://demo-school-erp.supabase.co';

const supabaseAnonKey = 
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-anon-key-ceyteq-solutions';

export const isLiveSupabaseConfigured = Boolean(
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY)
);

// Real Supabase client instance
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Initial Seeded Multi-School Tenants
export const INITIAL_SCHOOLS: SchoolTenant[] = [
  {
    id: 'campus-kandy-1934',
    name: 'Sri Sumangala College - Kandy',
    code: 'SSCK-1934',
    establishedYear: 1934,
    location: 'Kandy, Sri Lanka',
    adminEmail: 'master.admin@srisumangala.edu.lk',
    adminName: 'Dr. Alistair Sterling',
    phone: '+94 81 223 4567',
    status: 'active',
    subscriptionPlan: 'enterprise',
    studentCount: 1248,
    teacherCount: 64,
    colors: {
      primary: '#0B3C96',
      secondary: '#FFC72C',
      accent: '#FFFFFF',
    },
    subdomain: 'ssck',
    motto: 'Estd - 1934',
    approvedAt: '2026-01-10T08:00:00Z',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'school-kck-kandy',
    name: 'Kingswood College - Kandy',
    code: 'KCK-1891',
    establishedYear: 1891,
    location: 'Peradeniya Road, Kandy',
    adminEmail: 'principal@kingswood.lk',
    adminName: 'L. B. Weerasinghe',
    phone: '+94 81 222 3456',
    status: 'active',
    subscriptionPlan: 'professional',
    studentCount: 1420,
    teacherCount: 72,
    colors: {
      primary: '#7A1A22',
      secondary: '#003366',
      accent: '#FFFFFF',
    },
    subdomain: 'kingswood',
    motto: 'Fide Scientia Virtute',
    approvedAt: '2026-02-15T10:00:00Z',
    createdAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'school-dck-kandy',
    name: 'Dharmaraja College - Kandy',
    code: 'DCK-1887',
    establishedYear: 1887,
    location: 'Lake Round, Kandy',
    adminEmail: 'admin@dharmaraja.lk',
    adminName: 'Ananda Gunaratne',
    phone: '+94 81 222 8901',
    status: 'active',
    subscriptionPlan: 'enterprise',
    studentCount: 1560,
    teacherCount: 78,
    colors: {
      primary: '#800020',
      secondary: '#FFD700',
      accent: '#FFFFFF',
    },
    subdomain: 'dharmaraja',
    motto: 'Estd - 1887',
    approvedAt: '2026-02-20T11:30:00Z',
    createdAt: '2026-02-10T00:00:00Z',
  },
  {
    id: 'school-tia-kandy',
    name: 'Trinity International Academy',
    code: 'TIA-2018',
    establishedYear: 2018,
    location: 'Kandy Hillcrest, Central Province',
    adminEmail: 'admissions@trinityacademy.lk',
    adminName: 'Sarah De Silva',
    phone: '+94 81 494 2200',
    status: 'pending',
    subscriptionPlan: 'professional',
    studentCount: 850,
    teacherCount: 45,
    colors: {
      primary: '#004D40',
      secondary: '#FFB300',
      accent: '#FFFFFF',
    },
    subdomain: 'trinity-intl',
    motto: 'Excellence in Education',
    createdAt: '2026-09-28T14:15:00Z',
  },
  {
    id: 'school-rga-colombo',
    name: 'Royal Gateway Academy - Colombo',
    code: 'RGA-2022',
    establishedYear: 2022,
    location: 'Colombo 07, Western Province',
    adminEmail: 'keith.perera@royalgateway.edu.lk',
    adminName: 'Keith Perera',
    phone: '+94 11 258 7766',
    status: 'pending',
    subscriptionPlan: 'starter',
    studentCount: 410,
    teacherCount: 24,
    colors: {
      primary: '#1E3A8A',
      secondary: '#38BDF8',
      accent: '#FFFFFF',
    },
    subdomain: 'royalgateway',
    motto: 'Empowering Future Leaders',
    createdAt: '2026-10-05T09:30:00Z',
  },
];

// Helper: Get persistent schools list
export const getSchoolsList = (): SchoolTenant[] => {
  if (typeof window === 'undefined') return INITIAL_SCHOOLS;
  try {
    const raw = localStorage.getItem('ceyteq_saas_schools');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}
  return INITIAL_SCHOOLS;
};

// Helper: Save persistent schools list
export const saveSchoolsList = (schools: SchoolTenant[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('ceyteq_saas_schools', JSON.stringify(schools));
    window.dispatchEvent(new Event('ceyteq_schools_updated'));
  } catch (_) {}
};

// Helper: Get currently active school tenant
export const getActiveSchool = (): SchoolTenant => {
  const schools = getSchoolsList();
  if (typeof window !== 'undefined') {
    try {
      const activeId = localStorage.getItem('ceyteq_active_school_id');
      if (activeId) {
        const found = schools.find((s) => s.id === activeId);
        if (found) return found;
      }
    } catch (_) {}
  }
  return schools[0] || INITIAL_SCHOOLS[0];
};

// Helper: Switch currently active school tenant
export const setActiveSchoolId = (schoolId: string): SchoolTenant => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('ceyteq_active_school_id', schoolId);
      window.dispatchEvent(new Event('ceyteq_active_school_changed'));
    } catch (_) {}
  }
  return getActiveSchool();
};

// Helper: Register a new school via Ceyteq Super Admin
export const registerNewSchool = (
  newSchool: Omit<SchoolTenant, 'id' | 'createdAt'>
): SchoolTenant => {
  const currentSchools = getSchoolsList();
  const schoolId = `school-${newSchool.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;
  const created: SchoolTenant = {
    ...newSchool,
    id: schoolId,
    createdAt: new Date().toISOString(),
  };

  const updated = [created, ...currentSchools];
  saveSchoolsList(updated);
  return created;
};

// Helper: Toggle or update school status (approve, suspend, activate)
export const updateSchoolStatus = (
  schoolId: string,
  newStatus: 'active' | 'pending' | 'suspended'
): SchoolTenant | null => {
  const currentSchools = getSchoolsList();
  let updatedSchool: SchoolTenant | null = null;

  const updated = currentSchools.map((s) => {
    if (s.id === schoolId) {
      updatedSchool = {
        ...s,
        status: newStatus,
        approvedAt: newStatus === 'active' ? new Date().toISOString() : s.approvedAt,
      };
      return updatedSchool;
    }
    return s;
  });

  if (updatedSchool) {
    saveSchoolsList(updated);
  }
  return updatedSchool;
};

// Default active campus tenant (Backwards compatibility)
const activeSchool = INITIAL_SCHOOLS[0];
export const DEFAULT_CAMPUS: CampusTenant = {
  ...activeSchool,
  year: activeSchool.establishedYear,
  isActive: activeSchool.status === 'active',
};

// Seeded / Sample ERP Accounts for seamless demonstration and testing of RBAC
export const DEMO_ERP_ACCOUNTS: Record<string, { password: string; profile: UserProfile }> = {
  'super.admin': {
    password: 'Password@2026',
    profile: {
      id: 'usr-super-000',
      username: 'super.admin',
      email: 'admin@ceyteq.com',
      fullName: 'Damith Jayawardena',
      role: 'super_admin',
      tenantId: 'platform-ceyteq-global',
      tenantName: 'Ceyteq Solutions · Multi-Tenant Platform',
      designation: 'SaaS Platform Lead & Cloud Architect',
      department: 'Infrastructure & Multi-Tenant Operations',
      isBiometricEnrolled: true,
      status: 'active',
      lastSignInAt: new Date().toISOString(),
    },
  },
  'master.admin': {
    password: 'Password@2026',
    profile: {
      id: 'usr-master-001',
      username: 'master.admin',
      email: 'master.admin@srisumangala.edu.lk',
      fullName: 'Dr. Alistair Sterling',
      role: 'master_admin',
      tenantId: 'campus-kandy-1934',
      tenantName: 'Sri Sumangala College · Kandy',
      designation: 'Director of Academic Affairs & Systems',
      department: 'Executive Governance',
      isBiometricEnrolled: true,
      status: 'active',
      lastSignInAt: new Date().toISOString(),
    },
  },
  'admin.colombo': {
    password: 'Password@2026',
    profile: {
      id: 'usr-admin-002',
      username: 'admin.colombo',
      email: 'admin.operations@srisumangala.edu.lk',
      fullName: 'Nadia Wickramasinghe',
      role: 'normal_admin',
      tenantId: 'campus-kandy-1934',
      tenantName: 'Sri Sumangala College · Kandy',
      designation: 'Campus Operations Manager',
      department: 'Campus Administration',
      isBiometricEnrolled: true,
      status: 'active',
      lastSignInAt: new Date().toISOString(),
    },
  },
  'prof.perera': {
    password: 'Password@2026',
    profile: {
      id: 'usr-teach-003',
      username: 'prof.perera',
      email: 'm.perera@srisumangala.edu.lk',
      fullName: 'Prof. Mohan Perera',
      role: 'teacher',
      tenantId: 'campus-kandy-1934',
      tenantName: 'Sri Sumangala College · Kandy',
      designation: 'Senior Faculty Lead - Advanced Sciences',
      department: 'Department of Physical Sciences',
      isBiometricEnrolled: true,
      status: 'active',
      lastSignInAt: new Date().toISOString(),
    },
  },
  'std.2026.042': {
    password: 'Password@2026',
    profile: {
      id: 'usr-std-004',
      username: 'std.2026.042',
      email: 'k.senanayake@srisumangala.edu.lk',
      fullName: 'Kavindu Senanayake',
      role: 'student',
      tenantId: 'campus-kandy-1934',
      tenantName: 'Sri Sumangala College · Kandy',
      admissionNo: 'SSCK-2026-042',
      gradeLevel: 'Grade 12 (Advanced Level)',
      department: 'Mathematics & Computing Stream',
      isBiometricEnrolled: true,
      status: 'active',
      lastSignInAt: new Date().toISOString(),
    },
  },
};
