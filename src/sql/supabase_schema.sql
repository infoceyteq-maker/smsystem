-- ==============================================================================
-- ASTER COLLEGE - SCHOOL MANAGEMENT ERP (CEYTEQ SOLUTIONS)
-- SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS) & RBAC
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Define Enum for Roles
CREATE TYPE user_role_enum AS ENUM (
  'master_admin',
  'normal_admin',
  'teacher',
  'student',
  'parent'
);

-- 3. Tenants Table (Multi-Campus SaaS Architecture)
CREATE TABLE IF NOT EXISTS public.tenants (
  id TEXT PRIMARY KEY DEFAULT 'campus-colombo-2026',
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  academic_year INT NOT NULL DEFAULT 2026,
  location TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Colombo Campus
INSERT INTO public.tenants (id, name, code, academic_year, location)
VALUES ('campus-colombo-2026', 'Aster College - Colombo Campus', 'COL-2026', 2026, 'Colombo, Sri Lanka')
ON CONFLICT (id) DO NOTHING;

-- 4. User Profiles Table (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role_enum NOT NULL DEFAULT 'student',
  admission_no TEXT UNIQUE,
  department TEXT,
  designation TEXT,
  grade_level TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_biometric_enrolled BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  last_sign_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Students Table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  tenant_id TEXT NOT NULL REFERENCES public.tenants(id),
  admission_no TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  grade_level TEXT NOT NULL,
  class_section TEXT NOT NULL,
  guardian_name TEXT,
  guardian_phone TEXT,
  guardian_email TEXT,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'enrolled',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Academic Classes Table
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id TEXT NOT NULL REFERENCES public.tenants(id),
  name TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  academic_year INT NOT NULL DEFAULT 2026,
  teacher_id UUID REFERENCES public.profiles(id),
  room_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Daily Attendance Table
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id TEXT NOT NULL REFERENCES public.tenants(id),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id),
  attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  recorded_by UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, attendance_date)
);

-- 8. School Fee Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id TEXT NOT NULL REFERENCES public.tenants(id),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE RESTRICT,
  invoice_number TEXT NOT NULL UNIQUE,
  term_title TEXT NOT NULL,
  amount_cents BIGINT NOT NULL, -- e.g. 150000 = $1,500.00
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('paid', 'pending', 'overdue', 'partially_paid')),
  payment_method TEXT CHECK (payment_method IN ('card', 'bank_transfer', 'cash', 'online')),
  paid_at TIMESTAMPTZ,
  due_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Helper Function: Extract user role from current JWT auth claims
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role_enum AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper Function: Extract tenant_id from current profile
CREATE OR REPLACE FUNCTION public.current_user_tenant()
RETURNS TEXT AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- RLS: PROFILES
-- Master Admin: Full access
CREATE POLICY "Master admins can do all on profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.current_user_role() = 'master_admin');

-- Normal Admin: Access within their tenant/campus
CREATE POLICY "Normal admins manage campus profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (
    public.current_user_role() = 'normal_admin' 
    AND tenant_id = public.current_user_tenant()
  );

-- Teachers and Students: Can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- RLS: ATTENDANCE
-- Master & Normal Admin: Full access to campus attendance
CREATE POLICY "Admins full attendance access"
  ON public.attendance FOR ALL
  TO authenticated
  USING (
    public.current_user_role() IN ('master_admin', 'normal_admin')
    AND tenant_id = public.current_user_tenant()
  );

-- Teachers: Can read and record attendance for their classes
CREATE POLICY "Teachers manage class attendance"
  ON public.attendance FOR ALL
  TO authenticated
  USING (
    public.current_user_role() = 'teacher'
    AND tenant_id = public.current_user_tenant()
  );

-- Students: Can only view their own attendance record
CREATE POLICY "Students view own attendance"
  ON public.attendance FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM public.students WHERE profile_id = auth.uid()
    )
  );

-- RLS: PAYMENTS
-- Admins: View & record payments
CREATE POLICY "Admins manage payments"
  ON public.payments FOR ALL
  TO authenticated
  USING (
    public.current_user_role() IN ('master_admin', 'normal_admin')
    AND tenant_id = public.current_user_tenant()
  );

-- Students: Can only read their own fee invoices & receipts
CREATE POLICY "Students read own payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM public.students WHERE profile_id = auth.uid()
    )
  );
