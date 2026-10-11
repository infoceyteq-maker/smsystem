import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  ShieldCheck, 
  Search, 
  SlidersHorizontal, 
  ExternalLink, 
  Sparkles, 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin, 
  Power, 
  TrendingUp, 
  DollarSign, 
  Filter, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SchoolTenant } from '../../types/erp';
import { 
  getSchoolsList, 
  saveSchoolsList, 
  updateSchoolStatus, 
  setActiveSchoolId, 
  getActiveSchool 
} from '../../lib/supabase';
import { RegisterSchoolModal } from './RegisterSchoolModal';
import { TenantRLSModal } from './TenantRLSModal';

interface SuperAdminDashboardProps {
  onOpenSchoolPortal: (schoolId: string) => void;
  onSignOut: () => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  onOpenSchoolPortal,
  onSignOut,
}) => {
  const [schools, setSchools] = useState<SchoolTenant[]>(() => getSchoolsList());
  const [activeSchool, setActiveSchool] = useState<SchoolTenant>(() => getActiveSchool());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');
  const [planFilter, setPlanFilter] = useState<'all' | 'starter' | 'professional' | 'enterprise'>('all');

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isRLSModalOpen, setIsRLSModalOpen] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Sync schools on local storage update
  useEffect(() => {
    const handleUpdate = () => {
      setSchools(getSchoolsList());
      setActiveSchool(getActiveSchool());
    };
    window.addEventListener('ceyteq_schools_updated', handleUpdate);
    window.addEventListener('ceyteq_active_school_changed', handleUpdate);
    return () => {
      window.removeEventListener('ceyteq_schools_updated', handleUpdate);
      window.removeEventListener('ceyteq_active_school_changed', handleUpdate);
    };
  }, []);

  // Compute metrics
  const totalSchools = schools.length;
  const activeSchools = schools.filter((s) => s.status === 'active').length;
  const pendingSchools = schools.filter((s) => s.status === 'pending').length;
  const totalPlatformStudents = schools.reduce((acc, curr) => acc + (curr.studentCount || 0), 0);
  const totalPlatformTeachers = schools.reduce((acc, curr) => acc + (curr.teacherCount || 0), 0);

  // Estimated platform MRR based on active plans
  const estimatedMRR = schools.reduce((acc, curr) => {
    if (curr.status !== 'active') return acc;
    if (curr.subscriptionPlan === 'enterprise') return acc + 650;
    if (curr.subscriptionPlan === 'professional') return acc + 350;
    return acc + 150;
  }, 0);

  // Filtered schools list
  const filteredSchools = schools.filter((school) => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.adminEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || school.status === statusFilter;
    const matchesPlan = planFilter === 'all' || school.subscriptionPlan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleApproveSchool = (school: SchoolTenant) => {
    const updated = updateSchoolStatus(school.id, 'active');
    if (updated) {
      setSchools(getSchoolsList());
      setActionSuccessMsg(`"${school.name}" has been approved and provisioned with full multi-tenant isolation!`);
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#007AFF', '#34C759', '#FFC72C'],
        });
      } catch (_) {}
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }
  };

  const handleToggleStatus = (schoolId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    updateSchoolStatus(schoolId, nextStatus as any);
    setSchools(getSchoolsList());
  };

  const handleSelectAndOpen = (schoolId: string) => {
    setActiveSchoolId(schoolId);
    onOpenSchoolPortal(schoolId);
  };

  return (
    <div className="w-full flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto select-none">
      {/* 1. Header Banner */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#007AFF] text-white flex items-center justify-center shadow-md shadow-blue-500/20 ring-1 ring-blue-600/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900">
                  Ceyteq Super Admin Control Plane
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#007AFF] border border-blue-200">
                  Multi-Tenant Master
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">
                Global SaaS Governance · Client School Provisioning · Supabase Row Level Security
              </p>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsRLSModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 shadow-2xs transition cursor-pointer"
            title="Inspect Supabase Row Level Security Isolation Policies"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>RLS Policies (SQL)</span>
          </button>

          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#007AFF] hover:bg-blue-600 text-white shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register New School</span>
          </button>

          <button
            onClick={onSignOut}
            className="p-2 rounded-xl bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-900 border border-gray-200 transition cursor-pointer"
            title="Sign Out"
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Success Notification Bar */}
      {actionSuccessMsg && (
        <div className="my-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900 shadow-xs animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActionSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Top Metric KPI Row (4 Cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        {/* Card 1: Total Schools */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-xs hover:border-gray-300 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Client Schools
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#007AFF] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">{totalSchools}</span>
            <span className="text-xs font-semibold text-emerald-600">
              {activeSchools} Active
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            Independent isolated database tenants
          </p>
        </div>

        {/* Card 2: Total Platform Students */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-xs hover:border-gray-300 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Platform Students
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">
              {totalPlatformStudents.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-purple-600">
              Across all schools
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            {totalPlatformTeachers} active faculty accounts
          </p>
        </div>

        {/* Card 3: Pending Approvals */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-xs hover:border-gray-300 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Pending Subscriptions
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">{pendingSchools}</span>
            {pendingSchools > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 animate-pulse">
                Action Required
              </span>
            ) : (
              <span className="text-xs text-gray-400">All reviewed</span>
            )}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            Awaiting Ceyteq review & provisioning
          </p>
        </div>

        {/* Card 4: Platform MRR */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-xs hover:border-gray-300 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Platform MRR (Est.)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#34C759] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">
              ${estimatedMRR.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-600">/month</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            SaaS subscription recurring revenue
          </p>
        </div>
      </section>

      {/* 3. Filter & Search Controls Bar */}
      <section className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-xs mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 flex-1 focus-within:bg-white focus-within:border-[#007AFF] focus-within:ring-2 focus-within:ring-blue-100 transition">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search school name, code (e.g. SSCK), admin email, or district..."
            className="w-full bg-transparent outline-none text-xs text-gray-900 font-medium placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-gray-400 hover:text-gray-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Tabs */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200">
            {(['all', 'active', 'pending', 'suspended'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {st === 'all' ? `All (${schools.length})` : st}
              </button>
            ))}
          </div>

          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none cursor-pointer"
          >
            <option value="all">All Plans</option>
            <option value="enterprise">Enterprise</option>
            <option value="professional">Professional</option>
            <option value="starter">Starter</option>
          </select>
        </div>
      </section>

      {/* 4. Schools Grid / Card Deck */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <span>Registered School Tenants</span>
            <span className="text-xs text-gray-400 font-normal">
              ({filteredSchools.length} of {schools.length})
            </span>
          </h2>
          <span className="text-xs text-gray-500 font-medium">
            Active Tenant: <strong className="text-gray-900">{activeSchool?.name}</strong>
          </span>
        </div>

        {filteredSchools.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-xs">
            <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-900">No schools found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              No registered client schools match your search query or filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setPlanFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSchools.map((school) => {
              const isCurrentActive = school.id === activeSchool?.id;
              const isPending = school.status === 'pending';
              const isSuspended = school.status === 'suspended';

              return (
                <div
                  key={school.id}
                  className={`bg-white rounded-3xl p-5 border transition flex flex-col justify-between shadow-xs relative overflow-hidden group ${
                    isCurrentActive
                      ? 'border-[#007AFF] ring-2 ring-blue-500/10'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {/* Top School Colors Ribbon Accent Strip */}
                  <div className="w-full h-1.5 absolute top-0 left-0 right-0 flex">
                    <div className="w-1/2" style={{ backgroundColor: school.colors.primary }} />
                    <div className="w-1/2" style={{ backgroundColor: school.colors.secondary }} />
                  </div>

                  <div>
                    {/* Top Row: School Badge, Code, Status */}
                    <div className="flex items-start justify-between gap-2 pt-1 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-extrabold text-xs shadow-xs"
                          style={{ backgroundColor: school.colors.primary }}
                        >
                          {school.code.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-[10px] font-bold text-gray-500 uppercase bg-gray-100 px-1.5 py-0.5 rounded">
                              {school.code}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium">
                              Estd - {school.establishedYear}
                            </span>
                          </div>
                          <h3 className="text-sm font-extrabold text-gray-900 tracking-tight leading-snug mt-0.5">
                            {school.name}
                          </h3>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {school.status === 'active' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Active</span>
                          </span>
                        )}
                        {school.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                            <span>Pending</span>
                          </span>
                        )}
                        {school.status === 'suspended' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            <span>Suspended</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Subdomain & Location */}
                    <div className="space-y-1.5 my-3 text-xs text-gray-600 bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-2 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{school.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="font-mono text-gray-700 truncate">{school.adminEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-gray-700">{school.phone}</span>
                      </div>
                    </div>

                    {/* Stats pills */}
                    <div className="grid grid-cols-3 gap-2 my-3 text-center">
                      <div className="bg-blue-50/50 p-2 rounded-xl border border-blue-100/60">
                        <span className="text-[10px] text-gray-500 block">Students</span>
                        <span className="text-xs font-bold text-gray-900 font-mono">
                          {school.studentCount.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-purple-50/50 p-2 rounded-xl border border-purple-100/60">
                        <span className="text-[10px] text-gray-500 block">Faculty</span>
                        <span className="text-xs font-bold text-gray-900 font-mono">
                          {school.teacherCount}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-xl border border-gray-200">
                        <span className="text-[10px] text-gray-500 block">Plan</span>
                        <span className="text-xs font-bold text-gray-900 capitalize">
                          {school.subscriptionPlan.slice(0, 4)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Bottom */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 mt-2">
                    {/* If pending, show Approve button */}
                    {isPending ? (
                      <button
                        onClick={() => handleApproveSchool(school)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-[#34C759] hover:bg-emerald-600 text-white shadow-xs transition cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Activate Subscription</span>
                      </button>
                    ) : (
                      <>
                        {/* Toggle active / suspended */}
                        <button
                          onClick={() => handleToggleStatus(school.id, school.status)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                            isSuspended
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200'
                          }`}
                          title={isSuspended ? 'Reactivate school subscription' : 'Suspend school subscription'}
                        >
                          {isSuspended ? 'Reactivate' : 'Suspend'}
                        </button>

                        {/* Launch School ERP Portal */}
                        <button
                          onClick={() => handleSelectAndOpen(school.id)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                            isCurrentActive
                              ? 'bg-[#007AFF] hover:bg-blue-600 text-white'
                              : 'bg-gray-900 hover:bg-black text-white'
                          }`}
                        >
                          <span>{isCurrentActive ? 'Active School ERP' : 'Launch School Portal'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Modals */}
      <RegisterSchoolModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSchoolRegistered={(newSchool) => {
          setSchools(getSchoolsList());
          setActionSuccessMsg(`New school "${newSchool.name}" has been registered successfully!`);
          setTimeout(() => setActionSuccessMsg(null), 4000);
        }}
      />

      <TenantRLSModal
        isOpen={isRLSModalOpen}
        onClose={() => setIsRLSModalOpen(false)}
      />
    </div>
  );
};
