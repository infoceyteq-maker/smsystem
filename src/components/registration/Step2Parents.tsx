import React from 'react';
import { User, Phone, ArrowLeft, ArrowRight, Info } from 'lucide-react';
import { StudentRegistrationFormData } from '../../types/studentRegistration';

interface Step2ParentsProps {
  data: StudentRegistrationFormData;
  onChange: (fields: Partial<StudentRegistrationFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step2Parents: React.FC<Step2ParentsProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.fatherName.trim() || !data.fatherPhone.trim()) return;
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-200">
      {/* Student context chip */}
      <div className="flex items-center gap-2 text-xs text-[#007AFF] px-1 font-semibold">
        <User className="w-3.5 h-3.5" />
        <span>
          {data.fullName || 'K. Senuri Perera'} · {data.admissionNo || '2026/0148'}
        </span>
      </div>

      {/* Responsive Grid for Father & Mother cards on Tablet/Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card 1: Father/Guardian (Primary Contact) */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
              Father/Guardian
            </h2>
            <span className="text-[11px] text-gray-500 font-medium">
              Primary contact
            </span>
          </div>

          {/* Father Name */}
          <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 transition shadow-xs">
            <label className="text-[11px] font-medium text-gray-500 block">
              Name
            </label>
            <input
              type="text"
              value={data.fatherName}
              onChange={(e) => onChange({ fatherName: e.target.value })}
              placeholder="e.g. Nimal Perera"
              required
              className="w-full bg-transparent text-gray-900 text-sm sm:text-base outline-none font-normal placeholder:text-gray-400 mt-0.5"
            />
          </div>

          {/* Father NIC */}
          <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 transition shadow-xs">
            <label className="text-[11px] font-medium text-gray-500 block">
              NIC (National ID)
            </label>
            <input
              type="text"
              value={data.fatherNic}
              onChange={(e) => onChange({ fatherNic: e.target.value })}
              placeholder="197812301456"
              required
              className="w-full bg-transparent text-gray-900 text-sm sm:text-base outline-none font-mono placeholder:text-gray-400 mt-0.5"
            />
          </div>

          {/* Father Contact No */}
          <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 transition shadow-xs">
            <label className="text-[11px] font-medium text-gray-500 block">
              Contact No
            </label>
            <div className="flex items-center justify-between mt-0.5">
              <input
                type="tel"
                value={data.fatherPhone}
                onChange={(e) => onChange({ fatherPhone: e.target.value })}
                placeholder="+94 77 234 5678"
                required
                className="w-full bg-transparent text-gray-900 text-sm sm:text-base outline-none font-normal placeholder:text-gray-400 font-mono"
              />
              <Phone className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
            </div>
          </div>
        </div>

        {/* Card 2: Mother */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
              Mother
            </h2>
            <span className="text-[11px] text-gray-500 font-medium">
              Secondary contact
            </span>
          </div>

          {/* Mother Name */}
          <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 transition shadow-xs">
            <label className="text-[11px] font-medium text-gray-500 block">
              Name
            </label>
            <input
              type="text"
              value={data.motherName}
              onChange={(e) => onChange({ motherName: e.target.value })}
              placeholder="e.g. Dilani Perera"
              className="w-full bg-transparent text-gray-900 text-sm sm:text-base outline-none font-normal placeholder:text-gray-400 mt-0.5"
            />
          </div>

          {/* Mother NIC */}
          <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 transition shadow-xs">
            <label className="text-[11px] font-medium text-gray-500 block">
              NIC (National ID)
            </label>
            <input
              type="text"
              value={data.motherNic}
              onChange={(e) => onChange({ motherNic: e.target.value })}
              placeholder="198156701289"
              className="w-full bg-transparent text-gray-900 text-sm sm:text-base outline-none font-mono placeholder:text-gray-400 mt-0.5"
            />
          </div>

          {/* Mother Contact No */}
          <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 transition shadow-xs">
            <label className="text-[11px] font-medium text-gray-500 block">
              Contact No
            </label>
            <div className="flex items-center justify-between mt-0.5">
              <input
                type="tel"
                value={data.motherPhone}
                onChange={(e) => onChange({ motherPhone: e.target.value })}
                placeholder="+94 71 345 6789"
                className="w-full bg-transparent text-gray-900 text-sm sm:text-base outline-none font-normal placeholder:text-gray-400 font-mono"
              />
              <Phone className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Info Callout */}
      <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
        <Info className="w-4 h-4 text-[#007AFF] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Contact numbers will receive official SMS alerts for attendance logs, examination notices, and term tuition receipts.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs sm:text-sm rounded-xl transition duration-150 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          className="flex-1 py-3.5 px-4 bg-[#007AFF] hover:bg-[#0062CC] active:bg-[#0052A3] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 active:scale-[0.99] transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Next: Academic</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
