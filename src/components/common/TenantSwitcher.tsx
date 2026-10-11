import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Building2, Check, ShieldCheck, Plus, ExternalLink, Sparkles } from 'lucide-react';
import { SchoolTenant } from '../../types/erp';
import { getSchoolsList, getActiveSchool, setActiveSchoolId } from '../../lib/supabase';

interface TenantSwitcherProps {
  onOpenSuperAdmin?: () => void;
  className?: string;
  variant?: 'pill' | 'header' | 'sidebar';
}

export const TenantSwitcher: React.FC<TenantSwitcherProps> = ({
  onOpenSuperAdmin,
  className = '',
  variant = 'header',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [schools, setSchools] = useState<SchoolTenant[]>(() => getSchoolsList());
  const [activeSchool, setActiveSchool] = useState<SchoolTenant>(() => getActiveSchool());
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSchool = (schoolId: string) => {
    const updated = setActiveSchoolId(schoolId);
    setActiveSchool(updated);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      {variant === 'sidebar' ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-blue-50/60 rounded-2xl p-3 border border-blue-200/80 flex items-center justify-between cursor-pointer hover:bg-blue-100/50 hover:border-blue-300 transition shadow-xs select-none text-left"
          title="Switch Active School Tenant"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-extrabold shrink-0 shadow-2xs"
              style={{ backgroundColor: activeSchool.colors.primary }}
            >
              {activeSchool.code.slice(0, 3)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#0B3C96] leading-tight truncate">
                {activeSchool.name}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-tight font-medium truncate">
                {activeSchool.location} · {activeSchool.code}
              </p>
            </div>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-xs transition cursor-pointer select-none text-left"
          title="Switch Active School Tenant"
        >
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px] font-extrabold shrink-0"
            style={{ backgroundColor: activeSchool.colors.primary }}
          >
            {activeSchool.code.slice(0, 3)}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-900 leading-none">
              {activeSchool.name}
            </span>
            <span className="text-[9px] text-gray-400 font-semibold uppercase leading-tight mt-0.5">
              {activeSchool.code} · Active Tenant
            </span>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-gray-900 uppercase tracking-wider">
                Select School Tenant
              </p>
              <p className="text-[10px] text-gray-400">
                Data isolated via Supabase RLS
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-[#007AFF]">
              Multi-School SaaS
            </span>
          </div>

          {/* School Items */}
          <div className="max-h-60 overflow-y-auto py-1 space-y-1">
            {schools.map((school) => {
              const isSelected = school.id === activeSchool.id;
              const isPending = school.status === 'pending';

              return (
                <button
                  key={school.id}
                  onClick={() => handleSelectSchool(school.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 text-[#007AFF]'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-extrabold shrink-0 shadow-2xs"
                      style={{ backgroundColor: school.colors.primary }}
                    >
                      {school.code.slice(0, 3)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold truncate">
                          {school.name}
                        </span>
                        {isPending && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">
                        {school.location} · {school.studentCount} Students
                      </p>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-[#007AFF] shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Ceyteq Super Admin Portal Link */}
          {onOpenSuperAdmin && (
            <div className="pt-2 mt-1 border-t border-gray-100">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenSuperAdmin();
                }}
                className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Ceyteq Super Admin Panel</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
