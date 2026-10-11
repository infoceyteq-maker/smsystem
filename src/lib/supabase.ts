import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, CampusTenant } from '../types/erp';

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

// Default active campus tenant
export const DEFAULT_CAMPUS: CampusTenant = {
  id: 'campus-colombo-2026',
  name: 'Aster College - Colombo Campus',
  code: 'COL-2026',
  year: 2026,
  location: 'Colombo, Sri Lanka',
  isActive: true,
};

// Seeded / Sample ERP Accounts for seamless demonstration and testing of RBAC
export const DEMO_ERP_ACCOUNTS: Record<string, { password: string; profile: UserProfile }> = {
  'master.admin': {
    password: 'Password@2026',
    profile: {
      id: 'usr-master-001',
      username: 'master.admin',
      email: 'master.admin@astercollege.edu',
      fullName: 'Dr. Alistair Sterling',
      role: 'master_admin',
      tenantId: 'campus-colombo-2026',
      tenantName: 'Colombo campus · 2026',
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
      email: 'admin.operations@astercollege.edu',
      fullName: 'Nadia Wickramasinghe',
      role: 'normal_admin',
      tenantId: 'campus-colombo-2026',
      tenantName: 'Colombo campus · 2026',
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
      email: 'm.perera@astercollege.edu',
      fullName: 'Prof. Mohan Perera',
      role: 'teacher',
      tenantId: 'campus-colombo-2026',
      tenantName: 'Colombo campus · 2026',
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
      email: 'k.senanayake@astercollege.edu',
      fullName: 'Kavindu Senanayake',
      role: 'student',
      tenantId: 'campus-colombo-2026',
      tenantName: 'Colombo campus · 2026',
      admissionNo: 'COL-2026-042',
      gradeLevel: 'Grade 12 (Advanced Level)',
      department: 'Mathematics & Computing Stream',
      isBiometricEnrolled: true,
      status: 'active',
      lastSignInAt: new Date().toISOString(),
    },
  },
};
