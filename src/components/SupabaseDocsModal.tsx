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

  const sqlCode = `-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define Enum for Roles
CREATE TYPE user_role_enum AS ENUM ('master_admin', 'normal_admin', 'teacher', 'student', 'parent');

-- Tenants Table (Multi-Campus SaaS Architecture)
CREATE TABLE public.tenants (
  id TEXT PRIMARY KEY DEFAULT 'campus-colombo-2026',
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  academic_year INT NOT NULL DEFAULT 2026,
  location TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles Table (Synced with Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role_enum NOT NULL DEFAULT 'student',
  admission_no TEXT UNIQUE,
  department TEXT,
  grade_level TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  last_sign_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Master admin has full access"
  ON public.profiles FOR ALL TO authenticated
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'master_admin');

CREATE POLICY "Normal admin views campus staff & students"
  ON public.profiles FOR ALL TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'normal_admin'
    AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users view own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid());`;

  const serverActionCode = `// app/actions/authActions.ts
'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signInAction(formData: FormData) {
  const cookieStore = cookies()
  const identifier = formData.get('identifier') as string
  const password = formData.get('password') as string

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
        set(name, value, options) { cookieStore.set({ name, value, ...options }) },
        remove(name, options) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  // 1. Resolve username/admission_no to auth email
  const { data: profile } = await supabase
    .from('profiles')
    .select('email, role')
    .or(\`username.eq.\${identifier},admission_no.eq.\${identifier.toUpperCase()}\`)
    .single()

  const authEmail = profile?.email || identifier

  // 2. Authenticate with Supabase JWT
  const { error } = await supabase.auth.signInWithPassword({
    email: authEmail,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // 3. Route according to verified Role
  if (profile?.role === 'master_admin') redirect('/dashboard/master')
  if (profile?.role === 'teacher') redirect('/dashboard/faculty')
  if (profile?.role === 'student') redirect('/portal/student')
  redirect('/dashboard')
}`;

  const envGuide = `# .env.local (Configured in Vercel Project Settings)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsIn..."

# Optional Service Role for Admin backend operations
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."
NEXT_PUBLIC_CAMPUS_ID="campus-colombo-2026"`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#1C1C1E] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Supabase & Next.js 14 Integration Blueprint
              </h3>
              <p className="text-[11px] text-[#8E8E93]">
                PostgreSQL Tables, Strict RLS Policies, and App Router Server Actions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8E8E93] hover:text-white p-1 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 pt-4 pb-3">
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'sql'
                ? 'bg-[#0A84FF] text-white shadow-sm'
                : 'bg-[#2C2C2E] text-[#8E8E93] hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>PostgreSQL & RLS Schema</span>
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'actions'
                ? 'bg-[#0A84FF] text-white shadow-sm'
                : 'bg-[#2C2C2E] text-[#8E8E93] hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Server Actions (`actions.ts`)</span>
          </button>
          <button
            onClick={() => setActiveTab('env')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'env'
                ? 'bg-[#0A84FF] text-white shadow-sm'
                : 'bg-[#2C2C2E] text-[#8E8E93] hover:text-white'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Environment Variables</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="relative flex-1 overflow-y-auto bg-black/50 border border-white/5 rounded-2xl p-4 font-mono text-xs text-zinc-300">
          <button
            onClick={() => {
              const code =
                activeTab === 'sql'
                  ? sqlCode
                  : activeTab === 'actions'
                  ? serverActionCode
                  : envGuide;
              copyToClipboard(code, activeTab);
            }}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2C2C2E] hover:bg-[#3A3A3C] text-xs font-sans text-white border border-white/10 transition"
          >
            {copied === activeTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#30D158]" />
                <span className="text-[#30D158]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          <pre className="whitespace-pre-wrap leading-relaxed">
            {activeTab === 'sql' && sqlCode}
            {activeTab === 'actions' && serverActionCode}
            {activeTab === 'env' && envGuide}
          </pre>
        </div>
      </div>
    </div>
  );
};
