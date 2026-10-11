import React from 'react';
import { Calendar, Save, ArrowRight, ShieldCheck } from 'lucide-react';
import { StudentRegistrationFormData } from '../../types/studentRegistration';

interface Step1BasicInfoProps {
  data: StudentRegistrationFormData;
  onChange: (fields: Partial<StudentRegistrationFormData>) => void;
  onNext: () => void;
}

export const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({
  data,
  onChange,
  onNext,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.admissionNo.trim() || !data.fullName.trim()) return;
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Basic Info Card */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-1">
          <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
            Basic Info
          </h2>
          <span className="text-[11px] text-gray-500 font-medium">
            Required fields
          </span>
        </div>

        {/* Admission No Input (Active Blue Outline) */}
        <div className="bg-white border border-[#007AFF] rounded-xl px-4 py-2.5 shadow-sm ring-1 ring-blue-500/20">
          <label className="text-[11px] font-bold text-[#007AFF] block">
            Admission No
          </label>
          <input
            type="text"
            value={data.admissionNo}
            onChange={(e) => onChange({ admissionNo: e.target.value })}
            placeholder="2026/0148"
            required
            className="w-full bg-transparent text-gray-900 text-sm sm:text-base outline-none font-normal placeholder:text-gray-400 mt-0.5"
          />
        </div>

        {/* Responsive Grid for Name and DOB on Tablet/Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Full Name */}
          <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 transition shadow-xs">
            <label className="text-[11px] font-medium text-gray-500 block">
              Name
            </label>
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              placeholder="e.g. K. Senuri Perera"
              required
              className="w-full bg-transparent text-gray-900 text-sm sm:text-base outline-none font-normal placeholder:text-gray-400 mt-0.5"
            />
          </div>

          {/* Date of Birth */}
          <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 transition shadow-xs">
            <label className="text-[11px] font-medium text-gray-500 block">
              Date of Birth
            </label>
            <div className="flex items-center justify-between mt-0.5">
              <input
                type="text"
                value={data.dob}
                onChange={(e) => onChange({ dob: e.target.value })}
                placeholder="18 January 2010"
                required
                className="w-full bg-transparent text-gray-900 text-sm sm:text-base outline-none font-normal placeholder:text-gray-400"
              />
              <Calendar className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
            </div>
          </div>
        </div>

        {/* Age at Admission */}
        <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 transition shadow-xs">
          <label className="text-[11px] font-medium text-gray-500 block">
            Age at Admission (Years)
          </label>
          <input
            type="number"
            min="4"
            max="25"
            value={data.ageAtAdmission || ''}
            onChange={(e) => onChange({ ageAtAdmission: parseInt(e.target.value) || 0 })}
            placeholder="16"
            className="w-full bg-transparent text-gray-900 text-sm sm:text-base outline-none font-normal placeholder:text-gray-400 mt-0.5"
          />
        </div>
      </div>

      {/* 2. Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => {}}
          className="flex-1 py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs sm:text-sm rounded-xl transition duration-150 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Draft</span>
        </button>

        <button
          type="submit"
          className="flex-1 py-3.5 px-4 bg-[#007AFF] hover:bg-[#0062CC] active:bg-[#0052A3] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 active:scale-[0.99] transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Next: Parents</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-2">
        <ShieldCheck className="w-3.5 h-3.5 text-[#007AFF]" />
        <span>Stored securely in PostgreSQL students table</span>
      </div>
    </form>
  );
};
