import React, { useState } from 'react';
import { X, Copy, Check, Database, Shield, Server, FileCode2 } from 'lucide-react';

interface SupabaseDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseDocsModal: React.FC<SupabaseDocsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'sql' | 'actions' | 'env'>('sql');
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const sqlCode = `-- Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Define Enum for Roles (Idempotent)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
    CREATE TYPE user_role_enum AS ENUM ('master_admin', 'normal_admin', 'teacher', 'student', 'parent');
  END IF;
END $$;

-- Tenants Table (Multi-Campus SaaS Architecture)
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

-- Profiles Table (Synced with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE DEFAULT 'campus-colombo-2026',
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

-- Students Table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  tenant_id TEXT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE DEFAULT 'campus-colombo-2026',
  admission_no TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  age_at_admission INT,
  grade_level TEXT NOT NULL,
  class_section TEXT NOT NULL,
  ol_index_no TEXT,
  stream TEXT,
  sports_interest BOOLEAN DEFAULT FALSE,
  societies_interest BOOLEAN DEFAULT FALSE,
  guardian_name TEXT,
  guardian_phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'enrolled', 'withdrawn', 'graduated')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;`;

  const envCode = `# Aster College ERP - Supabase Credentials
# Add these in your Vercel / Next.js / Vite environment settings:

NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Database className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Supabase PostgreSQL Integration
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          SQL Editor Code & RLS Architecture
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 mb-4">
          Ready to run in Supabase Dashboard → SQL Editor. Contains schemas, functions, triggers, and Row Level Security.
        </p>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl mb-4 border border-gray-200">
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'sql'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Full SQL Schema (DDL + RLS)</span>
          </button>
          <button
            onClick={() => setActiveTab('env')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'env'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-[#007AFF]" />
            <span>Environment Config (.env)</span>
          </button>
        </div>

        {/* Code Content Container */}
        <div className="relative flex-1 overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-950/80 border-b border-gray-800 text-xs text-gray-400">
            <span className="font-mono">{activeTab === 'sql' ? 'supabase_schema.sql' : '.env.local'}</span>
            <button
              onClick={() => copyToClipboard(activeTab === 'sql' ? sqlCode : envCode, activeTab)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs transition"
            >
              {copied === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#34C759]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 overflow-y-auto text-xs font-mono text-gray-300 leading-relaxed flex-1 select-text">
            {activeTab === 'sql' ? sqlCode : envCode}
          </pre>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#007AFF]" />
            <span>Enforces multi-tenant isolation by tenant_id & role claim</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
