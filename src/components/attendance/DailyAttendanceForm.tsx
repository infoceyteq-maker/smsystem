import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Check, 
  Save, 
  Users, 
  ChevronDown,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { AttendanceStudentItem, AttendanceStatus } from '../../types/modules';
import { batchSubmitAttendance } from '../../actions/modulesActions';
import confetti from 'canvas-confetti';

interface DailyAttendanceFormProps {
  onBack?: () => void;
}

const SAMPLE_STUDENTS: AttendanceStudentItem[] = [
  { id: 'std-01', admissionNo: 'COL-2026-042', fullName: 'Kavindu Senanayake', gender: 'Male', avatarInitials: 'KS', status: 'present' },
  { id: 'std-02', admissionNo: 'COL-2026-043', fullName: 'Amaya Vidanapathirana', gender: 'Female', avatarInitials: 'AV', status: 'present' },
  { id: 'std-03', admissionNo: 'COL-2026-044', fullName: 'Nuwan Jayawardena', gender: 'Male', avatarInitials: 'NJ', status: 'present' },
  { id: 'std-04', admissionNo: 'COL-2026-045', fullName: 'Senuri Perera', gender: 'Female', avatarInitials: 'SP', status: 'absent' },
  { id: 'std-05', admissionNo: 'COL-2026-046', fullName: 'Rashmika Wickramasinghe', gender: 'Male', avatarInitials: 'RW', status: 'present' },
  { id: 'std-06', admissionNo: 'COL-2026-047', fullName: 'Tharushi Dissanayake', gender: 'Female', avatarInitials: 'TD', status: 'late' },
  { id: 'std-07', admissionNo: 'COL-2026-048', fullName: 'Dineth Samarasinghe', gender: 'Male', avatarInitials: 'DS', status: 'present' },
  { id: 'std-08', admissionNo: 'COL-2026-049', fullName: 'Ananya Fernando', gender: 'Female', avatarInitials: 'AF', status: 'present' },
  { id: 'std-09', admissionNo: 'COL-2026-050', fullName: 'Praveen Karunaratne', gender: 'Male', avatarInitials: 'PK', status: 'present' },
  { id: 'std-10', admissionNo: 'COL-2026-051', fullName: 'Hansika Madushani', gender: 'Female', avatarInitials: 'HM', status: 'excused' },
];

export const DailyAttendanceForm: React.FC<DailyAttendanceFormProps> = ({ onBack }) => {
  const [selectedClass, setSelectedClass] = useState('Grade 12-A');
  const [attendanceDate, setAttendanceDate] = useState('2026-10-11');
  const [students, setStudents] = useState<AttendanceStudentItem[]>(SAMPLE_STUDENTS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const totalCount = students.length;
  const presentCount = students.filter((s) => s.status === 'present').length;
  const absentCount = students.filter((s) => s.status === 'absent').length;
  const lateCount = students.filter((s) => s.status === 'late').length;
  const excusedCount = students.filter((s) => s.status === 'excused').length;
  const attendanceRate = totalCount ? Math.round(((presentCount + lateCount) / totalCount) * 100) : 0;

  const handleSetStatus = (studentId: string, status: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status } : s))
    );
  };

  const handleMarkAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: 'present' })));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmittedMessage(null);

    const payload = {
      classId: 'cls-12a',
      className: selectedClass,
      attendanceDate: attendanceDate,
      recordedBy: 'Nadeesha Perera (Master Admin)',
      students: students.map((s) => ({
        studentId: s.id,
        admissionNo: s.admissionNo,
        status: s.status,
      })),
    };

    const res = await batchSubmitAttendance(payload);
    setIsSubmitting(false);

    if (res.success) {
      try {
        confetti({
          particleCount: 35,
          spread: 55,
          origin: { y: 0.65 },
          colors: ['#34C759', '#007AFF'],
        });
      } catch (_) {}

      setSubmittedMessage(res.message);
      setTimeout(() => setSubmittedMessage(null), 4000);
    }
  };

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-200">
      {/* 1. Header with class/date details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 shadow-xs transition"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                Daily Attendance
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {attendanceRate}% Present
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Record daily classroom roll call and sync with PostgreSQL attendance logs.
            </p>
          </div>
        </div>

        {/* Class and Date Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Class Section Picker */}
          <div className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs shadow-xs">
            <Users className="w-3.5 h-3.5 text-[#007AFF]" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-transparent text-gray-900 font-semibold outline-none cursor-pointer"
            >
              <option value="Grade 12-A" className="text-gray-900">Grade 12-A (Advanced Level)</option>
              <option value="Grade 12-B" className="text-gray-900">Grade 12-B (Science)</option>
              <option value="Grade 11-A" className="text-gray-900">Grade 11-A (O/L)</option>
              <option value="Grade 10-A" className="text-gray-900">Grade 10-A (Secondary)</option>
            </select>
          </div>

          {/* Date Picker */}
          <div className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="bg-transparent text-gray-900 font-medium outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {submittedMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900 font-semibold shadow-xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#34C759] shrink-0" />
          <span>{submittedMessage}</span>
        </div>
      )}

      {/* 2. Sticky Counters Ribbon & Quick Action */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Metric counts */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34C759]" />
            <span className="text-gray-500 font-medium">Present:</span>
            <span className="font-bold text-gray-900 font-mono text-sm">{presentCount}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B30]" />
            <span className="text-gray-500 font-medium">Absent:</span>
            <span className="font-bold text-gray-900 font-mono text-sm">{absentCount}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-gray-500 font-medium">Late:</span>
            <span className="font-bold text-gray-900 font-mono text-sm">{lateCount}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-gray-500 font-medium">Excused:</span>
            <span className="font-bold text-gray-900 font-mono text-sm">{excusedCount}</span>
          </div>

          <div className="hidden lg:block h-4 w-px bg-gray-200" />

          <span className="text-gray-500 text-xs font-semibold">
            {totalCount} Total Enrolled
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-end md:self-center">
          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#007AFF]" />
            <span>Mark All Present</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#007AFF] hover:bg-[#0062CC] disabled:opacity-60 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 active:scale-[0.98] transition flex items-center gap-1.5 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Attendance</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Student Roster Grid */}
      <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100 overflow-hidden shadow-xs">
        {students.map((student, idx) => (
          <div
            key={student.id}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/60 transition"
          >
            {/* Student info */}
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs font-mono text-gray-400 w-6">
                {(idx + 1).toString().padStart(2, '0')}
              </span>

              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-xs text-[#007AFF] shrink-0 shadow-xs">
                {student.avatarInitials}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">
                  {student.fullName}
                </p>
                <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                  {student.admissionNo} · {student.gender}
                </p>
              </div>
            </div>

            {/* Segmented Attendance Status Toggle */}
            <div className="p-1 bg-gray-100 rounded-xl border border-gray-200 flex items-center gap-1 shrink-0 self-end sm:self-center shadow-xs">
              <button
                type="button"
                onClick={() => handleSetStatus(student.id, 'present')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  student.status === 'present'
                    ? 'bg-[#34C759] text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Check className="w-3 h-3" />
                <span>Present</span>
              </button>

              <button
                type="button"
                onClick={() => handleSetStatus(student.id, 'absent')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  student.status === 'absent'
                    ? 'bg-[#FF3B30] text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <XCircle className="w-3 h-3" />
                <span>Absent</span>
              </button>

              <button
                type="button"
                onClick={() => handleSetStatus(student.id, 'late')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  student.status === 'late'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>Late</span>
              </button>

              <button
                type="button"
                onClick={() => handleSetStatus(student.id, 'excused')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  student.status === 'excused'
                    ? 'bg-[#007AFF] text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Excused
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Meta */}
      <div className="pt-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#007AFF]" />
          <span>Synced with PostgreSQL public.attendance table via Supabase RPC</span>
        </div>
        <span className="font-mono text-gray-400">Class In-charge: Mr. N. Senaratne</span>
      </div>
    </div>
  );
};
