import React, { useRef } from 'react';
import { Camera, Calendar, ArrowRight, Upload, Phone, Mail, MapPin } from 'lucide-react';
import { TeacherRegistrationFormData, GenderType } from '../../types/teacherRegistration';

interface Step1PersonalProps {
  data: TeacherRegistrationFormData;
  onChange: (fields: Partial<TeacherRegistrationFormData>) => void;
  onNext: () => void;
}

export const Step1Personal: React.FC<Step1PersonalProps> = ({
  data,
  onChange,
  onNext,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onChange({ photoUrl: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.firstName.trim() || !data.lastName.trim() || !data.nic.trim()) return;
    onNext();
  };

  const genders: GenderType[] = ['Female', 'Male', 'Other'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Portrait Photo Upload Section */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5 shadow-xs">
        {/* Avatar Container */}
        <div className="relative group shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-300 group-hover:border-[#007AFF] overflow-hidden flex items-center justify-center transition shadow-xs">
            {data.photoUrl ? (
              <img
                src={data.photoUrl}
                alt="Teacher Portrait"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-gray-600 transition">
                <Camera className="w-7 h-7 mb-1 text-gray-400" />
                <span className="text-[10px] font-semibold">Add Photo</span>
              </div>
            )}
          </div>

          {/* Camera upload badge */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#007AFF] text-white flex items-center justify-center shadow-md hover:bg-[#0062CC] transition cursor-pointer"
            title="Upload portrait photo"
          >
            <Upload className="w-4 h-4" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>

        {/* Text descriptions */}
        <div className="text-center sm:text-left flex-1">
          <h3 className="text-sm font-bold text-gray-900 tracking-tight">
            Teacher ID Photo
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed font-normal">
            Upload a professional, passport-style front portrait for the official Sri Sumangala College Kandy staff directory and digital ID badge.
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
            >
              Choose Photo
            </button>
            <span className="text-[11px] text-gray-400">
              JPG or PNG (max 4MB) · Auto-synced to Supabase Storage
            </span>
          </div>
        </div>
      </div>

      {/* 2. Personal Information Fields Card */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-1">
          <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
            Personal Details
          </h2>
          <span className="text-[11px] text-gray-500 font-medium">
            Verified identity
          </span>
        </div>

        {/* First Name & Last Name (2-column on md/lg) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 transition shadow-xs">
            <label className="text-[11px] font-medium text-gray-500 block">
              First Name
            </label>
            <input
              type="text"
              value={data.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              placeholder="e.g. Amaya"
              required
              className="w-full bg-transparent text-gray-900 text-sm sm:text-base outline-none font-normal placeholder:text-gray-400 mt-0.5"
            />
          </div>

          <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 transition shadow-xs">
            <label className="text-[11px] font-medium text-gray-500 block">
              Last Name
            </label>
            <input
              type="text"
              value={data.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              placeholder="e.g. Fernando"
              required
              className="w-full bg-transparent text-gray-900 text-sm sm:text-base outline-none font-normal placeholder:text-gray-400 mt-0.5"
            />
          </div>
        </div>

        {/* NIC & Date of Birth (2-column on md/lg) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* NIC */}
          <div className="bg-white border border-[#007AFF] rounded-xl px-4 py-2.5 shadow-sm ring-1 ring-blue-500/20">
            <label className="text-[11px] font-bold text-[#007AFF] block">
              NIC (National Identity Card)
            </label>
            <input
              type="text"
              value={data.nic}
              onChange={(e) => onChange({ nic: e.target.value })}
              placeholder="198854203190"
              required
              className="w-full bg-transparent text-gray-900 text-sm sm:text-base outline-none font-mono placeholder:text-gray-400 mt-0.5"
            />
          </div>

          {/* DOB */}
          <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 transition shadow-xs">
            <label className="text-[11px] font-medium text-gray-500 block">
              Date of Birth
            </label>
            <div className="flex items-center justify-between mt-0.5">
              <input
                type="text"
                value={data.dob}
                onChange={(e) => onChange({ dob: e.target.value })}
                placeholder="14 August 1988"
                required
                className="w-full bg-transparent text-gray-900 text-sm sm:text-base outline-none font-normal placeholder:text-gray-400"
              />
              <Calendar className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
            </div>
          </div>
        </div>

        {/* Gender Segmented Control */}
        <div>
          <label className="text-[11px] font-medium text-gray-500 block mb-1.5">
            Gender
          </label>
          <div className="grid grid-cols-3 p-1 bg-gray-100 rounded-xl border border-gray-200 shadow-xs">
            {genders.map((g) => {
              const isSelected = data.gender === g;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => onChange({ gender: g })}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    isSelected
                      ? 'bg-white text-[#007AFF] shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>

        {/* Permanent Residential Address */}
        <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 transition shadow-xs">
          <label className="text-[11px] font-medium text-gray-500 block">
            Residential Address
          </label>
          <div className="flex items-start gap-2 mt-0.5">
            <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
            <input
              type="text"
              value={data.address}
              onChange={(e) => onChange({ address: e.target.value })}
              placeholder="No. 42, Peradeniya Road, Kandy"
              required
              className="w-full bg-transparent text-gray-900 text-sm outline-none placeholder:text-gray-400 font-normal"
            />
          </div>
        </div>

        {/* Phone & Email (2-column on md/lg) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 transition shadow-xs">
            <label className="text-[11px] font-medium text-gray-500 block">
              Contact Phone (SMS Alerts)
            </label>
            <div className="flex items-center gap-2 mt-0.5">
              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="tel"
                value={data.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                placeholder="+94 77 456 7890"
                required
                className="w-full bg-transparent text-gray-900 text-sm font-mono outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 transition shadow-xs">
            <label className="text-[11px] font-medium text-gray-500 block">
              Official Email
            </label>
            <div className="flex items-center gap-2 mt-0.5">
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="email"
                value={data.email}
                onChange={(e) => onChange({ email: e.target.value })}
                placeholder="amaya.fernando@astercollege.edu"
                required
                className="w-full bg-transparent text-gray-900 text-sm outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2">
        <button
          type="submit"
          className="w-full py-4 px-4 bg-[#007AFF] hover:bg-[#0062CC] active:bg-[#0052A3] text-white font-semibold text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-md shadow-blue-500/20 active:scale-[0.99] transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Next: Professional Appointment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
