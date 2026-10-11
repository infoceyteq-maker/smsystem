export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceStudentItem {
  id: string;
  admissionNo: string;
  fullName: string;
  gender: 'Male' | 'Female';
  avatarInitials: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface AttendanceBatchPayload {
  classId: string;
  className: string;
  attendanceDate: string;
  recordedBy: string;
  students: {
    studentId: string;
    admissionNo: string;
    status: AttendanceStatus;
    notes?: string;
  }[];
}

export type FeeStatus = 'paid' | 'pending' | 'overdue';

export interface PaymentStudentLookup {
  id: string;
  admissionNo: string;
  fullName: string;
  gradeLevel: string;
  classSection: string;
  guardianName: string;
  guardianPhone: string;
  outstandingBalance: number; // in USD
  totalBilled: number;
  paidAmount: number;
  feeStatus: FeeStatus;
  dueDate: string;
  currency: string;
  lastPaymentDate?: string;
  status: 'active' | 'pending';
}

export interface PaymentTransactionPayload {
  studentId: string;
  admissionNo: string;
  studentName: string;
  gradeLevel: string;
  purpose: 'school_fee' | 'exam_fee' | 'oba_fee' | 'lab_levy';
  purposeLabel: string;
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'bank_transfer' | 'cash' | 'online';
  notes?: string;
}

export interface PaymentReceipt {
  receiptNumber: string;
  invoiceNumber: string;
  studentId: string;
  admissionNo: string;
  studentName: string;
  gradeLevel: string;
  purposeLabel: string;
  amountPaid: number;
  currency: string;
  paymentMethod: string;
  previousBalance: number;
  remainingBalance: number;
  paidAt: string;
  cashierName: string;
  tenantName: string;
}
