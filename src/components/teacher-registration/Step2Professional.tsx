import React from 'react';
import { ChevronDown, Calendar, ArrowLeft, ArrowRight, BookOpen, School, Award, CheckCircle2 } from 'lucide-react';
import { TeacherRegistrationFormData } from '../../types/teacherRegistration';

interface Step2ProfessionalProps {
  data: TeacherRegistrationFormData;
  onChange: (fields: Partial<TeacherRegistrationFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step2Professional: React.FC<Step2ProfessionalProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
}) => {
  const designations = [
    'Senior Faculty Lecturer',
    'Head of Department (Sciences)',
    'Sectional Head (Advanced Level)',
    'Senior Teacher (Grade 1)',
    'Assistant Teacher',
    'Laboratory Instructor',
  ];

  const teacherGrades = [
    'Grade 1 - Class I',
    'Grade 1 - Class II',
    'Grade 2 - Class I',
    'Grade 2 - Class II',
    'Grade 3 - Class I',
  ];

  const subjects = [
    'Advanced Physics & Mechanics',
    'Pure Mathematics & Calculus',
    'Organic Chemistry',
    'Information Technology & Computing',
    'Biology & Genetics',
    'English Literature',
    'Economics & Accounting',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Academic & Professional Details Card */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-1">
          <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
            Professional Appointment Details
          </h2>
          <span className="text-[11px] text-gray-500 font-medium">
            Institutional records
          </span>
        </div>

        {/* Designation Dropdown */}
        <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 relative shadow-xs">
          <label className="text-[11px] font-medium text-gray-500 block">
            Academic Designation
          </label>
          <div className="flex items-center justify-between mt-0.5">
            <select
              value={data.designation}
              onChange={(e) => onChange({ designation: e.target.value })}
              className="w-full bg-transparent text-gray-900 text-sm sm:text-base outline-none font-semibold cursor-pointer appearance-none"
            >
              {designations.map((desig) => (
                <option key={desig} value={desig}>
                  {desig}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 pointer-events-none shrink-0" />
          </div>
        </div>

        {/* Teacher Grade Selection Pills */}
        <div>
          <label className="text-[11px] font-medium text-gray-500 block mb-2">
            Teacher Grade (Service Category)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {teacherGrades.map((grade) => {
              const isSelected = data.teacherGrade === grade;
              return (
                <button
                  key={grade}
                  type="button"
                  onClick={() => onChange({ teacherGrade: grade })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition text-left flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50 border-[#007AFF] text-[#007AFF] shadow-xs'
                      : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>{grade}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#007AFF]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Subject Specialization */}
        <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 relative shadow-xs">
          <label className="text-[11px] font-medium text-gray-500 block">
            Subject Specialization
          </label>
          <div className="flex items-center justify-between mt-0.5">
            <select
              value={data.subjectSpecialization}
              onChange={(e) => onChange({ subjectSpecialization: e.target.value })}
              className="w-full bg-transparent text-gray-900 text-sm outline-none font-semibold cursor-pointer appearance-none"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 pointer-events-none shrink-0" />
          </div>
        </div>

        {/* Date Pickers: First Appointment & Current School Appointment (2-column on md/lg) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {/* First Appointment Date */}
          <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 transition shadow-xs">
            <label className="text-[11px] font-medium text-gray-500 block">
              First Appointment Date (Teaching Service)
            </label>
            <div className="flex items-center justify-between mt-0.5">
              <input
                type="text"
                value={data.firstAppointmentDate}
                onChange={(e) => onChange({ firstAppointmentDate: e.target.value })}
                placeholder="02 January 2015"
                required
                className="w-full bg-transparent text-gray-900 text-sm outline-none font-normal placeholder:text-gray-400"
              />
              <Calendar className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
            </div>
          </div>

          {/* Current School Appointment Date */}
          <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 transition shadow-xs">
            <label className="text-[11px] font-medium text-gray-500 block">
              Current Campus Appointment Date
            </label>
            <div className="flex items-center justify-between mt-0.5">
              <input
                type="text"
                value={data.currentAppointmentDate}
                onChange={(e) => onChange({ currentAppointmentDate: e.target.value })}
                placeholder="15 January 2022"
                required
                className="w-full bg-transparent text-gray-900 text-sm outline-none font-normal placeholder:text-gray-400"
              />
              <Calendar className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs sm:text-sm rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          className="flex-1 py-3.5 px-4 bg-[#007AFF] hover:bg-[#0062CC] active:bg-[#0052A3] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 active:scale-[0.99] transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Next: Review & Submit</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
