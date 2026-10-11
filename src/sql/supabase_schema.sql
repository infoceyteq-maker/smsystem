-- ==============================================================================
-- ASTER COLLEGE - SCHOOL MANAGEMENT ERP (CEYTEQ SOLUTIONS)
-- COMPLETE SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS) & RBAC
-- Run this directly in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Define Enum for Roles (Idempotent)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
    CREATE TYPE user_role_enum AS ENUM (
      'super_admin',
      'master_admin',
      'normal_admin',
      'teacher',
      'student',
      'parent'
    );
  END IF;
END $$;

-- 3. Tenants / Schools Table (Multi-School SaaS Architecture)
CREATE TABLE IF NOT EXISTS public.tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  academic_year INT NOT NULL DEFAULT 2026,
  location TEXT NOT NULL,
  admin_email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  subscription_plan TEXT DEFAULT 'enterprise' CHECK (subscription_plan IN ('starter', 'professional', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Multi-School Tenants
INSERT INTO public.tenants (id, name, code, academic_year, location, admin_email, phone, status, subscription_plan)
VALUES 
  ('campus-kandy-1934', 'Sri Sumangala College - Kandy', 'SSCK-1934', 2026, 'Kandy, Sri Lanka', 'master.admin@srisumangala.edu.lk', '+94 81 223 4567', 'active', 'enterprise'),
  ('school-kck-kandy', 'Kingswood College - Kandy', 'KCK-1891', 2026, 'Peradeniya Road, Kandy', 'principal@kingswood.lk', '+94 81 222 3456', 'active', 'professional'),
  ('school-dck-kandy', 'Dharmaraja College - Kandy', 'DCK-1887', 2026, 'Lake Round, Kandy', 'admin@dharmaraja.lk', '+94 81 222 8901', 'active', 'enterprise')
ON CONFLICT (id) DO NOTHING;

-- 3.1 Helper Functions for Strict Multi-Tenant Row Level Security (RLS)
CREATE OR REPLACE FUNCTION auth.school_id() 
RETURNS TEXT AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'school_id'),
    (current_setting('request.jwt.claims', true)::jsonb -> 'user_metadata' ->> 'school_id'),
    'campus-kandy-1934'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth.is_ceyteq_super_admin() 
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'role') = 'super_admin',
    FALSE
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 4. User Profiles Table (Synced with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE DEFAULT 'campus-kandy-1934',
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

-- Fast lookup indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_admission_no ON public.profiles(admission_no);
CREATE INDEX IF NOT EXISTS idx_profiles_tenant_role ON public.profiles(tenant_id, role);

-- 5. Automatic Supabase Auth User Trigger
-- Creates a public.profiles row automatically when a new auth.users record is created
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    username,
    full_name,
    role,
    tenant_id,
    admission_no
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role_enum, 'student'),
    COALESCE(NEW.raw_user_meta_data->>'tenant_id', 'campus-colombo-2026'),
    NEW.raw_user_meta_data->>'admission_no'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- 6. Students Table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  tenant_id TEXT NOT NULL REFERENCES public.tenants(id) DEFAULT 'campus-colombo-2026',
  admission_no TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  age_at_admission INT DEFAULT 16,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  grade_level TEXT NOT NULL,
  class_section TEXT NOT NULL,
  ol_index_no TEXT,
  stream TEXT, -- 'Science', 'Commerce', 'Arts', 'Technology'
  sports_interest BOOLEAN DEFAULT TRUE,
  societies_interest BOOLEAN DEFAULT FALSE,
  guardian_name TEXT,
  guardian_phone TEXT,
  guardian_email TEXT,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'enrolled', 'graduated', 'transferred', 'withdrawn')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_students_admission ON public.students(admission_no);

-- 6b. Parents & Guardians Table
CREATE TABLE IF NOT EXISTS public.parents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id TEXT NOT NULL REFERENCES public.tenants(id) DEFAULT 'campus-colombo-2026',
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  father_name TEXT,
  father_nic TEXT,
  father_phone TEXT,
  mother_name TEXT,
  mother_nic TEXT,
  mother_phone TEXT,
  emergency_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_parents_student ON public.parents(student_id);

-- 6c. Faculty & Teaching Staff Table
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  tenant_id TEXT NOT NULL REFERENCES public.tenants(id) DEFAULT 'campus-colombo-2026',
  staff_id TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  nic TEXT NOT NULL UNIQUE,
  address TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  photo_url TEXT,
  designation TEXT NOT NULL,
  teacher_grade TEXT NOT NULL,
  subject_specialization TEXT NOT NULL,
  first_appointment_date DATE NOT NULL,
  current_appointment_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'retired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_staff_id ON public.staff(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_nic ON public.staff(nic);

-- 7. Academic Classes Table
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id TEXT NOT NULL REFERENCES public.tenants(id) DEFAULT 'campus-colombo-2026',
  name TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  academic_year INT NOT NULL DEFAULT 2026,
  teacher_id UUID REFERENCES public.profiles(id),
  room_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Daily Attendance Table
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id TEXT NOT NULL REFERENCES public.tenants(id) DEFAULT 'campus-colombo-2026',
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id),
  attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  recorded_by UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, attendance_date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(attendance_date);

-- 9. School Fee Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id TEXT NOT NULL REFERENCES public.tenants(id) DEFAULT 'campus-colombo-2026',
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

-- 10. Self-Onboarding Invitations Table
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id TEXT NOT NULL REFERENCES public.tenants(id) DEFAULT 'campus-colombo-2026',
  token TEXT NOT NULL UNIQUE,
  role user_role_enum NOT NULL DEFAULT 'student',
  recipient_name TEXT NOT NULL,
  recipient_contact TEXT NOT NULL, -- phone number or email
  channel TEXT NOT NULL CHECK (channel IN ('sms', 'email')),
  url TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id),
  expires_at TIMESTAMPTZ NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invitations_token ON public.invitations(token);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Helper Function: Read user role safely
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role_enum AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper Function: Read user tenant safely
CREATE OR REPLACE FUNCTION public.current_user_tenant()
RETURNS TEXT AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- RLS: TENANTS
DROP POLICY IF EXISTS "Anyone can read tenant details" ON public.tenants;
CREATE POLICY "Anyone can read tenant details"
  ON public.tenants FOR SELECT
  TO public
  USING (true);

-- RLS: PROFILES
DROP POLICY IF EXISTS "Ceyteq super admins can do all on profiles" ON public.profiles;
CREATE POLICY "Ceyteq super admins can do all on profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.current_user_role() = 'super_admin');

DROP POLICY IF EXISTS "School Master admins manage own school profiles" ON public.profiles;
CREATE POLICY "School Master admins manage own school profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (
    public.current_user_role() = 'master_admin'
    AND tenant_id = public.current_user_tenant()
  );

DROP POLICY IF EXISTS "Normal admins manage campus profiles" ON public.profiles;
CREATE POLICY "Normal admins manage campus profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (
    public.current_user_role() = 'normal_admin' 
    AND tenant_id = public.current_user_tenant()
  );

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- RLS: ATTENDANCE
DROP POLICY IF EXISTS "Admins full attendance access" ON public.attendance;
CREATE POLICY "Admins full attendance access"
  ON public.attendance FOR ALL
  TO authenticated
  USING (
    public.current_user_role() IN ('master_admin', 'normal_admin')
    AND tenant_id = public.current_user_tenant()
  );

DROP POLICY IF EXISTS "Teachers manage class attendance" ON public.attendance;
CREATE POLICY "Teachers manage class attendance"
  ON public.attendance FOR ALL
  TO authenticated
  USING (
    public.current_user_role() = 'teacher'
    AND tenant_id = public.current_user_tenant()
  );

DROP POLICY IF EXISTS "Students view own attendance" ON public.attendance;
CREATE POLICY "Students view own attendance"
  ON public.attendance FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM public.students WHERE profile_id = auth.uid()
    )
  );

-- RLS: PAYMENTS
DROP POLICY IF EXISTS "Admins manage payments" ON public.payments;
CREATE POLICY "Admins manage payments"
  ON public.payments FOR ALL
  TO authenticated
  USING (
    public.current_user_role() IN ('master_admin', 'normal_admin')
    AND tenant_id = public.current_user_tenant()
  );

DROP POLICY IF EXISTS "Students read own payments" ON public.payments;
CREATE POLICY "Students read own payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM public.students WHERE profile_id = auth.uid()
    )
  );

-- RLS: INVITATIONS
DROP POLICY IF EXISTS "Admins manage invitations" ON public.invitations;
CREATE POLICY "Admins manage invitations"
  ON public.invitations FOR ALL
  TO authenticated
  USING (
    public.current_user_role() IN ('master_admin', 'normal_admin')
    AND tenant_id = public.current_user_tenant()
  );

DROP POLICY IF EXISTS "Public can view valid invitation tokens" ON public.invitations;
CREATE POLICY "Public can view valid invitation tokens"
  ON public.invitations FOR SELECT
  TO public
  USING (
    expires_at > NOW() 
    AND is_used = FALSE
  );

-- RLS: STAFF
DROP POLICY IF EXISTS "Admins manage staff" ON public.staff;
CREATE POLICY "Admins manage staff"
  ON public.staff FOR ALL
  TO authenticated
  USING (
    public.current_user_role() IN ('master_admin', 'normal_admin')
    AND tenant_id = public.current_user_tenant()
  );

DROP POLICY IF EXISTS "Teachers can view own staff record" ON public.staff;
CREATE POLICY "Teachers can view own staff record"
  ON public.staff FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

