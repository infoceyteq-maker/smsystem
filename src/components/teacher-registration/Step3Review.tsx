import React from 'react';
import { 
  Check, 
  ArrowLeft, 
  Edit3, 
  ShieldCheck, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  Send 
} from 'lucide-react';
import { TeacherRegistrationFormData } from '../../types/teacherRegistration';

interface Step3ReviewProps {
  data: TeacherRegistrationFormData;
  onChange: (fields: Partial<TeacherRegistrationFormData>) => void;
  onSubmit: () => void;
  onPrev: () => void;
  onJumpToStep: (step: 1 | 2) => void;
  isSubmitting?: boolean;
}

export const Step3Review: React.FC<Step3ReviewProps> = ({
  data,
  onChange,
  onSubmit,
  onPrev,
  onJumpToStep,
  isSubmitting = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.agreedToTerms) return;
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Header Profile Summary Card */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-200 overflow-hidden shrink-0 shadow-xs">
            {data.photoUrl ? (
              <img
                src={data.photoUrl}
                alt="Teacher Portrait"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-xl text-gray-700">
                {data.firstName.charAt(0)}{data.lastName.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                {data.firstName} {data.lastName}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Draft Ready
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1 font-semibold">
              {data.designation} · {data.teacherGrade}
            </p>
            <p className="text-[11px] text-[#007AFF] mt-0.5 font-medium">
              Specialization: {data.subjectSpecialization}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onJumpToStep(1)}
          className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* 2. Responsive 2-Column Summary Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Personal Details Summary */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Personal Information
            </h3>
            <button
              type="button"
              onClick={() => onJumpToStep(1)}
              className="text-xs text-[#007AFF] hover:underline font-semibold"
            >
              Edit
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">National Identity Card (NIC)</span>
              <span className="font-mono text-gray-900 font-bold">{data.nic}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Date of Birth</span>
              <span className="text-gray-900 font-medium">{data.dob}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Gender</span>
              <span className="text-gray-900 font-medium">{data.gender}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Contact Number</span>
              <span className="font-mono text-gray-900 font-medium">{data.phone}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Official Email</span>
              <span className="text-gray-900 font-medium">{data.email}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Address</span>
              <span className="text-gray-900 font-medium truncate max-w-[200px]">{data.address}</span>
            </div>
          </div>
        </div>

        {/* Professional Details Summary */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Appointment Records
            </h3>
            <button
              type="button"
              onClick={() => onJumpToStep(2)}
              className="text-xs text-[#007AFF] hover:underline font-semibold"
            >
              Edit
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Academic Designation</span>
              <span className="text-gray-900 font-bold">{data.designation}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Teacher Grade</span>
              <span className="text-gray-900 font-medium">{data.teacherGrade}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">First Appointment Date</span>
              <span className="text-gray-900 font-medium">{data.firstAppointmentDate}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Current Campus Appointment</span>
              <span className="text-gray-900 font-medium">{data.currentAppointmentDate}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Campus Assignment</span>
              <span className="text-gray-900 font-semibold">Aster College · Colombo</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Confirmation Checkbox */}
      <div className="p-4 bg-gray-50/80 border border-gray-200 rounded-2xl flex items-start gap-3 shadow-xs">
        <input
          type="checkbox"
          id="confirm-terms"
          checked={data.agreedToTerms}
          onChange={(e) => onChange({ agreedToTerms: e.target.checked })}
          className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#007AFF] focus:ring-[#007AFF]"
        />
        <label htmlFor="confirm-terms" className="text-xs text-gray-600 leading-relaxed cursor-pointer select-none">
          I certify that the information entered above is accurate and matches my official government teacher service record. I understand this profile will be reviewed by the Master Admin and routed to the Colombo Campus registry.
        </label>
      </div>

      {/* 4. Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="flex-1 py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs sm:text-sm rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          disabled={!data.agreedToTerms || isSubmitting}
          className="flex-1 py-3.5 px-4 bg-[#007AFF] hover:bg-[#0062CC] active:bg-[#0052A3] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 active:scale-[0.99] transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Transmitting...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit for Master Admin Approval</span>
            </>
          )}
        </button>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-2">
        <ShieldCheck className="w-3.5 h-3.5 text-[#007AFF]" />
        <span>Stored with status='Pending' in Supabase staff and profiles tables</span>
      </div>
    </form>
  );
};
