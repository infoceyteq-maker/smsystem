import React from 'react';
import { 
  GraduationCap, 
  ChevronDown, 
  Check, 
  ArrowLeft, 
  Activity, 
  Users, 
  Sparkles,
  Trophy
} from 'lucide-react';
import { StudentRegistrationFormData, AcademicStream } from '../../types/studentRegistration';

interface Step3AcademicProps {
  data: StudentRegistrationFormData;
  onChange: (fields: Partial<StudentRegistrationFormData>) => void;
  onSubmit: () => void;
  onPrev: () => void;
  isSubmitting?: boolean;
}

export const Step3Academic: React.FC<Step3AcademicProps> = ({
  data,
  onChange,
  onSubmit,
  onPrev,
  isSubmitting = false,
}) => {
  const streamOptions: AcademicStream[] = ['Science', 'Commerce', 'Arts', 'Technology'];

  const isALevel = data.grade === 'Grade 12' || data.grade === 'Grade 13';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-200">
      {/* Responsive 2-column layout on Tablet/Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card 1: Academic Information */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
              Academic
            </h2>
            <span className="text-[11px] text-gray-500 font-medium">
              2026 intake
            </span>
          </div>

          {/* Grade Dropdown */}
          <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 relative shadow-xs">
            <label className="text-[11px] font-medium text-gray-500 block">
              Grade
            </label>
            <div className="flex items-center justify-between mt-0.5">
              <select
                value={data.grade}
                onChange={(e) => onChange({ grade: e.target.value })}
                className="w-full bg-transparent text-gray-900 text-sm sm:text-base outline-none font-semibold cursor-pointer appearance-none"
              >
                <option value="Grade 12">Grade 12 (Advanced Level)</option>
                <option value="Grade 13">Grade 13 (Advanced Level)</option>
                <option value="Grade 11">Grade 11 (Ordinary Level)</option>
                <option value="Grade 10">Grade 10 (Secondary)</option>
                <option value="Grade 9">Grade 9 (Secondary)</option>
                <option value="Grade 6">Grade 6 (Middle School)</option>
                <option value="Grade 1">Grade 1 (Primary)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 pointer-events-none shrink-0" />
            </div>
          </div>

          {/* Class Section */}
          <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 shadow-xs">
            <label className="text-[11px] font-medium text-gray-500 block">
              Class Section
            </label>
            <input
              type="text"
              value={data.classSection}
              onChange={(e) => onChange({ classSection: e.target.value })}
              placeholder="e.g. 12-A"
              required
              className="w-full bg-transparent text-gray-900 text-sm sm:text-base outline-none font-normal placeholder:text-gray-400 mt-0.5"
            />
          </div>

          {/* Conditional A/L Fields: O/L Index & Stream */}
          {isALevel && (
            <div className="space-y-4 pt-2 border-t border-gray-100 animate-in fade-in duration-200">
              {/* O/L Index No */}
              <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 shadow-xs">
                <label className="text-[11px] font-medium text-gray-500 block">
                  O/L Index No
                </label>
                <input
                  type="text"
                  value={data.olIndexNo}
                  onChange={(e) => onChange({ olIndexNo: e.target.value })}
                  placeholder="2025123486"
                  required={isALevel}
                  className="w-full bg-transparent text-gray-900 text-sm sm:text-base outline-none font-mono placeholder:text-gray-400 mt-0.5"
                />
              </div>

              {/* Stream Selection Chips */}
              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-2">
                  Stream
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {streamOptions.map((stream) => {
                    const isSelected = data.stream === stream;
                    return (
                      <button
                        key={stream}
                        type="button"
                        onClick={() => onChange({ stream })}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                          isSelected
                            ? 'bg-blue-50 border-[#007AFF] text-[#007AFF] shadow-xs'
                            : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {stream}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Extra Curriculars Toggle Switches */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 space-y-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
                Extra Curriculars
              </h2>
              <span className="text-[11px] text-gray-500 font-medium">
                Clubs & sports
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-1 mb-5">
              Select student interests for house assignment and sports coach notifications.
            </p>

            <div className="space-y-4">
              {/* Toggle 1: Sports */}
              <div className="p-4 bg-gray-50/80 border border-gray-200 rounded-2xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                      Sports
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Cricket, Rugby, Swimming, Athletics
                    </span>
                  </div>
                </div>

                {/* iOS Toggle Switch */}
                <button
                  type="button"
                  onClick={() => onChange({ sportsInterest: !data.sportsInterest })}
                  className={`w-12 h-7 rounded-full p-0.5 transition duration-200 ease-in-out focus:outline-none ${
                    data.sportsInterest ? 'bg-[#34C759]' : 'bg-gray-200'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white shadow-md transform transition duration-200 ease-in-out ${
                      data.sportsInterest ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Societies */}
              <div className="p-4 bg-gray-50/80 border border-gray-200 rounded-2xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#007AFF] border border-blue-200 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                      Societies
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Debating, Media, Science Union, Interact
                    </span>
                  </div>
                </div>

                {/* iOS Toggle Switch */}
                <button
                  type="button"
                  onClick={() => onChange({ societiesInterest: !data.societiesInterest })}
                  className={`w-12 h-7 rounded-full p-0.5 transition duration-200 ease-in-out focus:outline-none ${
                    data.societiesInterest ? 'bg-[#34C759]' : 'bg-gray-200'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white shadow-md transform transition duration-200 ease-in-out ${
                      data.societiesInterest ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-[11px] text-gray-500 leading-relaxed mt-4">
            Submission routes profile to Aster College Master Admin for verification before admission card issuance.
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="flex-1 py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs sm:text-sm rounded-xl transition duration-150 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3.5 px-4 bg-[#007AFF] hover:bg-[#0062CC] active:bg-[#0052A3] disabled:opacity-60 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 active:scale-[0.99] transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Submitting to Supabase...</span>
            </>
          ) : (
            <>
              <span>Submit Registration</span>
              <Check className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
