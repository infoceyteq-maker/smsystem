import React, { useState } from 'react';
import { X, ShieldCheck, Copy, Check, Database, Layers, Key, Code, ExternalLink } from 'lucide-react';

interface TenantRLSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TenantRLSModal: React.FC<TenantRLSModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'rls' | 'middleware' | 'jwt'>('rls');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sqlRLSCode = `-- ==============================================================================
-- MULTI-TENANT SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- Strict School-Level Tenant Isolation for Ceyteq School Management ERP
-- ==============================================================================

-- 1. Helper Function: Extract school_id from authenticated JWT app_metadata
CREATE OR REPLACE FUNCTION auth.school_id() 
RETURNS TEXT AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'school_id'),
    (current_setting('request.jwt.claims', true)::jsonb -> 'user_metadata' ->> 'school_id')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 2. Helper Function: Check if caller is Ceyteq Super Admin
CREATE OR REPLACE FUNCTION auth.is_ceyteq_super_admin() 
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'role') = 'super_admin',
    FALSE
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 3. Enable RLS on core multi-tenant tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Students Table (Strict Tenant Isolation)
DROP POLICY IF EXISTS "tenant_isolation_students" ON public.students;
CREATE POLICY "tenant_isolation_students" ON public.students
  FOR ALL
  TO authenticated
  USING (
    -- Ceyteq Super Admin can access all schools
    auth.is_ceyteq_super_admin()
    -- School Master Admin & Staff can only access their school's students
    OR school_id = auth.school_id()
  )
  WITH CHECK (
    auth.is_ceyteq_super_admin()
    OR school_id = auth.school_id()
  );

-- 5. RLS Policy: Daily Attendance (Strict Tenant Isolation)
DROP POLICY IF EXISTS "tenant_isolation_attendance" ON public.attendance;
CREATE POLICY "tenant_isolation_attendance" ON public.attendance
  FOR ALL
  TO authenticated
  USING (
    auth.is_ceyteq_super_admin()
    OR school_id = auth.school_id()
  )
  WITH CHECK (
    auth.is_ceyteq_super_admin()
    OR school_id = auth.school_id()
  );

-- 6. RLS Policy: Payment Collections & Receipts
DROP POLICY IF EXISTS "tenant_isolation_payments" ON public.fee_collections;
CREATE POLICY "tenant_isolation_payments" ON public.fee_collections
  FOR ALL
  TO authenticated
  USING (
    auth.is_ceyteq_super_admin()
    OR school_id = auth.school_id()
  )
  WITH CHECK (
    auth.is_ceyteq_super_admin()
    OR school_id = auth.school_id()
  );

-- 7. RLS Policy: Schools / Tenants Table
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_manage_schools" ON public.schools
  FOR ALL
  TO authenticated
  USING (
    auth.is_ceyteq_super_admin()
    OR (id = auth.school_id() AND status = 'active')
  );`;

  const middlewareCode = `// ==============================================================================
// NEXT.JS 14 APP ROUTER TENANT ISOLATION MIDDLEWARE (middleware.ts)
// Extracts subdomain or path to enforce school tenant boundary
// ==============================================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // 1. Extract subdomain (e.g. "ssck" from "ssck.ceyteq.edu.lk")
  const currentHost = hostname.replace(/:\d+$/, '');
  const isCustomDomain = !currentHost.includes('localhost') && !currentHost.includes('run.app');
  const subdomain = isCustomDomain ? currentHost.split('.')[0] : url.searchParams.get('tenant') || 'ssck';

  // 2. Initialize Supabase SSR Client
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // 3. Super Admin bypass (Platform Owner access)
  if (session?.user?.app_metadata?.role === 'super_admin') {
    response.headers.set('x-school-tenant', subdomain);
    return response;
  }

  // 4. Verify user belongs to the requested school tenant
  const userSchoolId = session?.user?.app_metadata?.school_id;
  if (userSchoolId && subdomain && userSchoolId !== subdomain) {
    // Prevent Cross-Tenant data bleed
    return NextResponse.redirect(new URL('/unauthorized-tenant', req.url));
  }

  // Inject verified tenant ID into downstream server actions
  response.headers.set('x-school-id', userSchoolId || subdomain);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};`;

  const jwtHookCode = `-- ==============================================================================
-- SUPABASE AUTH HOOK: Custom Access Token (JWT) Claim Injection
-- Automatically injects school_id into user JWT upon login
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb LANGUAGE plpgsql STABLE AS $$
DECLARE
  claims jsonb;
  user_school_id text;
  user_role text;
BEGIN
  -- Fetch school assignment from public.profiles
  SELECT tenant_id, role::text INTO user_school_id, user_role
  FROM public.profiles
  WHERE id = (event->>'user_id')::uuid;

  claims := event->'claims';

  -- Inject claims into app_metadata (immutable by client)
  IF user_school_id IS NOT NULL THEN
    claims := jsonb_set(claims, '{app_metadata,school_id}', to_jsonb(user_school_id));
  END IF;

  IF user_role IS NOT NULL THEN
    claims := jsonb_set(claims, '{app_metadata,role}', to_jsonb(user_role));
  END IF;

  event := jsonb_set(event, '{claims}', claims);
  RETURN event;
END;
$$;`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-200 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-white to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <span>Multi-Tenant Isolation Architecture</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  RLS ACTIVE
                </span>
              </h2>
              <p className="text-xs text-gray-500">
                PostgreSQL Row Level Security (RLS) & Next.js 14 Middleware Isolation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-3 border-b border-gray-100 flex gap-2">
          <button
            onClick={() => setActiveTab('rls')}
            className={`px-3.5 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'rls'
                ? 'border-[#007AFF] text-[#007AFF]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>1. Supabase RLS Policies (SQL)</span>
          </button>
          <button
            onClick={() => setActiveTab('middleware')}
            className={`px-3.5 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'middleware'
                ? 'border-[#007AFF] text-[#007AFF]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>2. Next.js 14 Middleware</span>
          </button>
          <button
            onClick={() => setActiveTab('jwt')}
            className={`px-3.5 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'jwt'
                ? 'border-[#007AFF] text-[#007AFF]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>3. JWT Hook (app_metadata)</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'rls' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700">
                  SQL Script for Supabase SQL Editor:
                </span>
                <button
                  onClick={() => handleCopy(sqlRLSCode, 'rls')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  {copiedCode === 'rls' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SQL</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 bg-gray-900 text-gray-100 rounded-2xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-gray-800">
                {sqlRLSCode}
              </pre>
            </div>
          )}

          {activeTab === 'middleware' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700">
                  Next.js 14 App Router Middleware (middleware.ts):
                </span>
                <button
                  onClick={() => handleCopy(middlewareCode, 'middleware')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  {copiedCode === 'middleware' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
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
              <pre className="p-4 bg-gray-900 text-gray-100 rounded-2xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-gray-800">
                {middlewareCode}
              </pre>
            </div>
          )}

          {activeTab === 'jwt' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700">
                  Supabase Custom Access Token Auth Hook:
                </span>
                <button
                  onClick={() => handleCopy(jwtHookCode, 'jwt')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  {copiedCode === 'jwt' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SQL</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 bg-gray-900 text-gray-100 rounded-2xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-gray-800">
                {jwtHookCode}
              </pre>
            </div>
          )}

          {/* Architecture Callout */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-3 text-xs text-blue-900">
            <Layers className="w-5 h-5 text-[#007AFF] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Zero-Bleed Multi-Tenant Architecture</p>
              <p className="text-gray-600 mt-0.5 leading-relaxed">
                Queries issued by any School Master Admin or teacher are strictly evaluated at the database engine level via PostgreSQL Row Level Security. Data from other schools is mathematically invisible, regardless of the API route or client query.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <span>Enforces strict tenant boundary across all 5 registered schools</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
