import React, { useState } from 'react';
import { X, Building2, Check, Sparkles, Mail, Phone, MapPin, Globe, Shield, Calendar } from 'lucide-react';
import { SchoolTenant, SchoolColors } from '../../types/erp';
import { registerNewSchool } from '../../lib/supabase';

interface RegisterSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchoolRegistered: (newSchool: SchoolTenant) => void;
}

export const RegisterSchoolModal: React.FC<RegisterSchoolModalProps> = ({
  isOpen,
  onClose,
  onSchoolRegistered,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    establishedYear: 2026,
    location: '',
    adminName: '',
    adminEmail: '',
    phone: '',
    subscriptionPlan: 'professional' as 'starter' | 'professional' | 'enterprise',
    subdomain: '',
    status: 'active' as 'active' | 'pending',
    studentCount: 500,
    teacherCount: 30,
    motto: '',
    primaryColor: '#0B3C96',
    secondaryColor: '#FFC72C',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim() || !formData.adminEmail.trim()) {
      setErrorMsg('Please fill in all required fields (School Name, Code, and Admin Email).');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const colors: SchoolColors = {
        primary: formData.primaryColor,
        secondary: formData.secondaryColor,
        accent: '#FFFFFF',
      };

      const created = registerNewSchool({
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        establishedYear: Number(formData.establishedYear) || 2026,
        location: formData.location.trim() || 'Sri Lanka',
        adminName: formData.adminName.trim() || 'Principal / Administrator',
        adminEmail: formData.adminEmail.trim().toLowerCase(),
        phone: formData.phone.trim() || '+94 11 000 0000',
        status: formData.status,
        subscriptionPlan: formData.subscriptionPlan,
        studentCount: Number(formData.studentCount) || 100,
        teacherCount: Number(formData.teacherCount) || 10,
        colors,
        subdomain: formData.subdomain.trim().toLowerCase() || formData.code.trim().toLowerCase(),
        motto: formData.motto.trim() || `Estd - ${formData.establishedYear}`,
        approvedAt: formData.status === 'active' ? new Date().toISOString() : undefined,
      });

      onSchoolRegistered(created);
      onClose();
    } catch (err) {
      setErrorMsg('Failed to register school. Please verify all details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-200 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-white to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#007AFF] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                Register New Client School
              </h2>
              <p className="text-xs text-gray-500">
                Ceyteq Super Admin Multi-Tenant Provisioning
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

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-gray-700">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          {/* Section 1: School Identity */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#007AFF]" />
              <span>1. School Identity & Location</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">
                  Official School Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananda College Colombo"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const codeGuess = name.split(' ').map(w => w[0]).join('').slice(0, 4).toUpperCase();
                    setFormData(prev => ({
                      ...prev,
                      name,
                      code: prev.code || codeGuess,
                      subdomain: prev.subdomain || codeGuess.toLowerCase(),
                    }));
                  }}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#007AFF] focus:ring-2 focus:ring-blue-100 outline-none text-xs text-gray-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Tenant Code (Identifier) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ACC-1886"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#007AFF] focus:ring-2 focus:ring-blue-100 outline-none text-xs text-gray-900 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Established Year
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1934"
                  value={formData.establishedYear}
                  onChange={(e) => setFormData({ ...formData, establishedYear: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#007AFF] focus:ring-2 focus:ring-blue-100 outline-none text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Campus City / District
                </label>
                <input
                  type="text"
                  placeholder="e.g. Colombo 10, Western Province"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#007AFF] focus:ring-2 focus:ring-blue-100 outline-none text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Subdomain Route
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="e.g. ananda"
                    value={formData.subdomain}
                    onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-l-xl focus:bg-white focus:border-[#007AFF] focus:ring-2 focus:ring-blue-100 outline-none text-xs text-gray-900 font-mono"
                  />
                  <span className="px-2.5 py-2.5 bg-gray-100 border border-l-0 border-gray-200 rounded-r-xl text-[11px] text-gray-500 font-mono">
                    .ceyteq.edu.lk
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: School Master Admin Credentials */}
          <div className="pt-3 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#007AFF]" />
              <span>2. School Master Admin & Contact</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Admin / Principal Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Nihal Jayawardena"
                  value={formData.adminName}
                  onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#007AFF] focus:ring-2 focus:ring-blue-100 outline-none text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Admin Official Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. principal@ananda.lk"
                  value={formData.adminEmail}
                  onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#007AFF] focus:ring-2 focus:ring-blue-100 outline-none text-xs text-gray-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Telephone Contact
                </label>
                <input
                  type="text"
                  placeholder="e.g. +94 11 269 5544"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#007AFF] focus:ring-2 focus:ring-blue-100 outline-none text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Initial Subscription Tier
                </label>
                <select
                  value={formData.subscriptionPlan}
                  onChange={(e) => setFormData({ ...formData, subscriptionPlan: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#007AFF] focus:ring-2 focus:ring-blue-100 outline-none text-xs text-gray-900 font-medium"
                >
                  <option value="starter">Starter Plan (Up to 500 Students)</option>
                  <option value="professional">Professional Plan (Up to 1,500 Students)</option>
                  <option value="enterprise">Enterprise Plan (Unlimited + Dedicated SLA)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Branding & Status */}
          <div className="pt-3 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>3. School Colors & Approval Status</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Primary Color (Navy / Crimson)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-gray-300 p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-24 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Secondary Color (Gold / Blue)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-gray-300 p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="w-24 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Initial Provisioning Status
                </label>
                <div className="flex items-center gap-3 pt-1">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'active'}
                      onChange={() => setFormData({ ...formData, status: 'active' })}
                      className="text-[#007AFF] focus:ring-[#007AFF]"
                    />
                    <span className="font-semibold text-emerald-700">Active</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'pending'}
                      onChange={() => setFormData({ ...formData, status: 'pending' })}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-semibold text-amber-700">Pending Review</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#007AFF] hover:bg-blue-600 text-white shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Provisioning Tenant...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Provision School Tenant</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
