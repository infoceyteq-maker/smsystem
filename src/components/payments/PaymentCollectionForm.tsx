import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  User, 
  Calendar, 
  Phone, 
  ChevronDown, 
  Building, 
  ShieldCheck, 
  Receipt,
  AlertTriangle,
  TrendingUp,
  Clock,
  Filter,
  Check
} from 'lucide-react';
import { PaymentStudentLookup, PaymentReceipt, FeeStatus } from '../../types/modules';
import { processStudentPayment } from '../../actions/modulesActions';
import { PaymentReceiptModal } from './PaymentReceiptModal';
import confetti from 'canvas-confetti';

interface PaymentCollectionFormProps {
  onBack?: () => void;
}

const SAMPLE_PAYMENT_STUDENTS: PaymentStudentLookup[] = [
  {
    id: 'std-01',
    admissionNo: 'COL-2026-042',
    fullName: 'Kavindu Senanayake',
    gradeLevel: 'Grade 12 (12-A)',
    classSection: '12-A',
    guardianName: 'Nimal Perera',
    guardianPhone: '+94 77 234 5678',
    outstandingBalance: 850.00,
    totalBilled: 1200.00,
    paidAmount: 350.00,
    feeStatus: 'pending',
    dueDate: '2026-10-31',
    currency: 'USD',
    lastPaymentDate: '15 Jan 2026',
    status: 'active',
  },
  {
    id: 'std-02',
    admissionNo: '2026/0148',
    fullName: 'K. Senuri Perera',
    gradeLevel: 'Grade 12 (12-A)',
    classSection: '12-A',
    guardianName: 'Nimal Perera',
    guardianPhone: '+94 77 234 5678',
    outstandingBalance: 1200.00,
    totalBilled: 1200.00,
    paidAmount: 0.00,
    feeStatus: 'overdue',
    dueDate: '2026-09-30',
    currency: 'USD',
    lastPaymentDate: 'Never',
    status: 'active',
  },
  {
    id: 'std-03',
    admissionNo: 'COL-2026-043',
    fullName: 'Amaya Vidanapathirana',
    gradeLevel: 'Grade 12 (12-B)',
    classSection: '12-B',
    guardianName: 'Sunil Vidanapathirana',
    guardianPhone: '+94 71 889 2210',
    outstandingBalance: 450.00,
    totalBilled: 1200.00,
    paidAmount: 750.00,
    feeStatus: 'pending',
    dueDate: '2026-10-25',
    currency: 'USD',
    lastPaymentDate: '10 Feb 2026',
    status: 'active',
  },
  {
    id: 'std-04',
    admissionNo: 'COL-2026-044',
    fullName: 'Nuwan Jayawardena',
    gradeLevel: 'Grade 11 (11-A)',
    classSection: '11-A',
    guardianName: 'Bandula Jayawardena',
    guardianPhone: '+94 77 999 1122',
    outstandingBalance: 0.00,
    totalBilled: 1100.00,
    paidAmount: 1100.00,
    feeStatus: 'paid',
    dueDate: '2026-10-15',
    currency: 'USD',
    lastPaymentDate: '05 Oct 2026',
    status: 'active',
  },
  {
    id: 'std-05',
    admissionNo: 'COL-2026-045',
    fullName: 'Rashmika Wickramasinghe',
    gradeLevel: 'Grade 10 (10-A)',
    classSection: '10-A',
    guardianName: 'Dhammika Wickramasinghe',
    guardianPhone: '+94 70 333 4455',
    outstandingBalance: 0.00,
    totalBilled: 950.00,
    paidAmount: 950.00,
    feeStatus: 'paid',
    dueDate: '2026-09-15',
    currency: 'USD',
    lastPaymentDate: '01 Mar 2026',
    status: 'active',
  },
  {
    id: 'std-06',
    admissionNo: 'COL-2026-046',
    fullName: 'Tharushi Dissanayake',
    gradeLevel: 'Grade 10 (10-A)',
    classSection: '10-A',
    guardianName: 'Anura Dissanayake',
    guardianPhone: '+94 71 445 6677',
    outstandingBalance: 600.00,
    totalBilled: 950.00,
    paidAmount: 350.00,
    feeStatus: 'overdue',
    dueDate: '2026-09-25',
    currency: 'USD',
    lastPaymentDate: '18 Jan 2026',
    status: 'active',
  },
];

export const PaymentCollectionForm: React.FC<PaymentCollectionFormProps> = ({ onBack }) => {
  const [studentsList, setStudentsList] = useState<PaymentStudentLookup[]>(SAMPLE_PAYMENT_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [feeStatusFilter, setFeeStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  
  // Selected student for Bursar Payment Terminal
  const [selectedStudent, setSelectedStudent] = useState<PaymentStudentLookup>(SAMPLE_PAYMENT_STUDENTS[0]);
  const [purpose, setPurpose] = useState<'school_fee' | 'exam_fee' | 'oba_fee' | 'lab_levy'>('school_fee');
  const [amount, setAmount] = useState<number>(selectedStudent.outstandingBalance);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer' | 'cash' | 'online'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState<PaymentReceipt | null>(null);

  // High-level aggregates
  const totalBilled = 186400;
  const totalCollected = 154200;
  const totalPending = 23800;
  const totalOverdue = 8400;
  const collectionPercentage = Math.round((totalCollected / totalBilled) * 100);

  const purposeLabels: Record<string, string> = {
    school_fee: 'School Tuition Fee (Term 2 · 2026)',
    exam_fee: 'Term Examination & Evaluation Fee',
    oba_fee: "Old Boys' Association (OBA) Subscription",
    lab_levy: 'Advanced Science Laboratory & IT Levy',
  };

  const handleSelectStudent = (student: PaymentStudentLookup) => {
    setSelectedStudent(student);
    setAmount(student.outstandingBalance > 0 ? student.outstandingBalance : 250);
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    setIsProcessing(true);
    const res = await processStudentPayment(
      {
        studentId: selectedStudent.id,
        admissionNo: selectedStudent.admissionNo,
        studentName: selectedStudent.fullName,
        gradeLevel: selectedStudent.gradeLevel,
        purpose,
        purposeLabel: purposeLabels[purpose],
        amount,
        paymentMethod,
        currency: 'USD',
      },
      selectedStudent.outstandingBalance
    );

    setIsProcessing(false);

    if (res.success && res.receipt) {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#34C759', '#007AFF', '#FFD60A'],
        });
      } catch (_) {}

      // Update student balance in local list
      setStudentsList((prev) =>
        prev.map((s) => {
          if (s.id === selectedStudent.id) {
            const nextOutstanding = Math.max(0, s.outstandingBalance - amount);
            const nextPaid = s.paidAmount + amount;
            return {
              ...s,
              outstandingBalance: nextOutstanding,
              paidAmount: nextPaid,
              feeStatus: nextOutstanding === 0 ? 'paid' : s.feeStatus,
              lastPaymentDate: 'Today',
            };
          }
          return s;
        })
      );

      // Update selected student instance
      setSelectedStudent((prev) => ({
        ...prev,
        outstandingBalance: Math.max(0, prev.outstandingBalance - amount),
        paidAmount: prev.paidAmount + amount,
        feeStatus: Math.max(0, prev.outstandingBalance - amount) === 0 ? 'paid' : prev.feeStatus,
      }));

      setGeneratedReceipt(res.receipt);
    }
  };

  // Filter student dues roster
  const filteredStudents = studentsList.filter((std) => {
    const matchesSearch =
      std.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.guardianName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      feeStatusFilter === 'all' ? true : std.feeStatus === feeStatusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      {/* 1. Header with back button */}
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
                Fees & Payment Collection
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Term 2 · 2026 Active
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Comprehensive bursar terminal, dues tracking, collection progress, and instant receipt generation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white border border-gray-200 px-3.5 py-2 rounded-xl flex items-center gap-2.5 shadow-xs text-xs">
            <Building className="w-4 h-4 text-[#007AFF]" />
            <div>
              <p className="font-bold text-gray-900 leading-tight">Colombo Campus Bursary</p>
              <p className="text-[10px] text-gray-400 leading-tight">Account No: 0048-9921-2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Term Fee Summaries (4 Metric Cards + Collection Progress Bar) */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#007AFF]" />
              <span>Term 2 Fee Collection Overview</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Target vs realized tuition, exam fees, and lab levies for Colombo Campus.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
            Academic Year 2026
          </span>
        </div>

        {/* 4 Metric Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-gray-50/80 border border-gray-200 p-4 rounded-xl shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
              Target Billings
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-gray-900 font-mono mt-1 block">
              ${totalBilled.toLocaleString()}
            </span>
            <span className="text-[11px] text-gray-400 mt-1 block">
              1,248 students enrolled
            </span>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl shadow-xs">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
              Collected Amount
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#34C759] font-mono mt-1 block">
              ${totalCollected.toLocaleString()}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
              {collectionPercentage}% of target collected
            </span>
          </div>

          <div className="bg-blue-50/60 border border-blue-200 p-4 rounded-xl shadow-xs">
            <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider block">
              Pending Dues
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#007AFF] font-mono mt-1 block">
              ${totalPending.toLocaleString()}
            </span>
            <span className="text-[11px] text-blue-700 font-medium mt-1 block">
              Due by 31 Oct 2026
            </span>
          </div>

          <div className="bg-red-50/60 border border-red-200 p-4 rounded-xl shadow-xs">
            <span className="text-[11px] font-semibold text-red-800 uppercase tracking-wider block">
              Overdue Amount
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#FF3B30] font-mono mt-1 block">
              ${totalOverdue.toLocaleString()}
            </span>
            <span className="text-[11px] text-red-700 font-medium mt-1 block">
              Requires Bursar follow-up
            </span>
          </div>
        </div>

        {/* Collection Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-700">Overall Collection Progress</span>
            <span className="font-mono font-bold text-gray-900">{collectionPercentage}% Complete</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
            <div
              style={{ width: `${collectionPercentage}%` }}
              className="h-full bg-gradient-to-r from-[#007AFF] to-[#34C759] rounded-full transition-all duration-500 shadow-xs"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span>$0.00</span>
            <span className="font-semibold text-gray-600">${totalCollected.toLocaleString()} Collected</span>
            <span>${totalBilled.toLocaleString()} Goal</span>
          </div>
        </div>
      </div>

      {/* 3. Main Operational Split (Left: Student Dues Directory & Filter, Right: Bursar Payment Terminal) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Student Dues & Lookup Directory */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                  Student Dues & Tuition Roster
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Search student admission numbers or filter by payment status.
                </p>
              </div>

              {/* Status Filter Chips */}
              <div className="p-1 bg-gray-100 rounded-xl border border-gray-200 flex items-center gap-1 shadow-xs">
                {(['all', 'pending', 'overdue', 'paid'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFeeStatusFilter(filter)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition capitalize ${
                      feeStatusFilter === filter
                        ? 'bg-white text-[#007AFF] shadow-xs'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Admission No (COL-2026-042), Name, or Guardian..."
                className="w-full bg-white border border-gray-200 focus:border-[#007AFF] rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-gray-900 outline-none placeholder:text-gray-400 shadow-xs transition"
              />
            </div>

            {/* Student List */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredStudents.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs">
                  No matching student records found.
                </div>
              ) : (
                filteredStudents.map((std) => {
                  const isSelected = selectedStudent.id === std.id;

                  return (
                    <div
                      key={std.id}
                      onClick={() => handleSelectStudent(std)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
                        isSelected
                          ? 'bg-blue-50/60 border-[#007AFF] ring-1 ring-blue-500/20'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                            isSelected
                              ? 'bg-[#007AFF] text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {std.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-900">
                              {std.fullName}
                            </span>
                            <span className="font-mono text-[11px] text-gray-500 font-medium">
                              {std.admissionNo}
                            </span>
                            {std.feeStatus === 'overdue' && (
                              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-red-50 text-[#FF3B30] border border-red-200">
                                Overdue
                              </span>
                            )}
                            {std.feeStatus === 'paid' && (
                              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-50 text-[#34C759] border border-emerald-200">
                                Paid
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 font-medium">
                            {std.gradeLevel} · Guardian: {std.guardianName} ({std.guardianPhone})
                          </p>
                        </div>
                      </div>

                      {/* Right Balance & Select Badge */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                        <div className="text-right">
                          <span className="text-xs font-bold text-gray-900 font-mono block">
                            ${std.outstandingBalance.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-gray-400 block font-medium">
                            {std.outstandingBalance === 0 ? 'Settled' : 'Due Balance'}
                          </span>
                        </div>

                        <button
                          type="button"
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                            isSelected
                              ? 'bg-[#007AFF] text-white shadow-xs'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Bursar Payment Terminal */}
        <div className="lg:col-span-5 space-y-4">
          <form
            onSubmit={handleProcessPayment}
            className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#007AFF]" />
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                  Bursar Payment Terminal
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                SECURE POSTGRES
              </span>
            </div>

            {/* Selected Student Active Card */}
            <div className="bg-gray-50/80 border border-gray-200 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Active Student Account
                </span>
                <span className="font-mono text-xs font-bold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200">
                  {selectedStudent.admissionNo}
                </span>
              </div>

              <div>
                <p className="text-base font-bold text-gray-900 tracking-tight">
                  {selectedStudent.fullName}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  {selectedStudent.gradeLevel} · Colombo Campus
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 text-xs">
                <div>
                  <span className="text-[11px] text-gray-400 block">Total Billed:</span>
                  <span className="font-bold text-gray-800 font-mono">
                    ${selectedStudent.totalBilled.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 block">Current Outstanding:</span>
                  <span className="font-bold text-[#FF3B30] font-mono">
                    ${selectedStudent.outstandingBalance.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Purpose Dropdown */}
            <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 transition shadow-xs">
              <label className="text-xs font-medium text-gray-500 block">
                Payment Purpose
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as any)}
                className="w-full bg-transparent text-gray-900 text-xs sm:text-sm font-semibold outline-none cursor-pointer mt-1"
              >
                <option value="school_fee">School Tuition Fee (Term 2 · 2026)</option>
                <option value="exam_fee">Term Examination & Evaluation Fee</option>
                <option value="oba_fee">Old Boys' Association (OBA) Subscription</option>
                <option value="lab_levy">Advanced Science Laboratory & IT Levy</option>
              </select>
            </div>

            {/* Payment Amount Input */}
            <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 transition shadow-xs">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-500 block">
                  Amount to Collect (USD)
                </label>
                <button
                  type="button"
                  onClick={() => setAmount(selectedStudent.outstandingBalance)}
                  className="text-[11px] text-[#007AFF] hover:underline font-semibold"
                >
                  Full Due (${selectedStudent.outstandingBalance.toFixed(2)})
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <DollarSign className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  required
                  className="w-full bg-transparent text-gray-900 text-lg font-bold font-mono outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5 uppercase tracking-wider">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'card', label: 'Credit/Debit Card' },
                  { id: 'bank_transfer', label: 'Bank Transfer' },
                  { id: 'cash', label: 'Cash (Bursar)' },
                  { id: 'online', label: 'Student Portal' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                      paymentMethod === m.id
                        ? 'bg-blue-50 border-[#007AFF] text-[#007AFF] shadow-xs'
                        : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Button: Process & Generate Receipt */}
            <button
              type="submit"
              disabled={isProcessing || amount <= 0}
              className="w-full py-3.5 px-4 bg-[#007AFF] hover:bg-[#0062CC] active:bg-[#0052A3] disabled:opacity-60 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Transaction...</span>
                </>
              ) : (
                <>
                  <Receipt className="w-4 h-4" />
                  <span>Record Payment & Issue Receipt (${amount.toFixed(2)})</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* 4. Payment Receipt Modal */}
      <PaymentReceiptModal
        receipt={generatedReceipt}
        onClose={() => setGeneratedReceipt(null)}
      />
    </div>
  );
};
