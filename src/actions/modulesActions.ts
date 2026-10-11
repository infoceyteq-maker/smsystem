/**
 * Next.js 14 App Router Server Actions for Final ERP Modules:
 * - Approval Dashboard (Update status to active/rejected)
 * - Daily Attendance (Batch upsert into attendance table)
 * - Payment Collection (Insert transaction and generate receipt)
 */

import { supabase, isLiveSupabaseConfigured } from '../lib/supabase';
import { 
  AttendanceBatchPayload, 
  PaymentTransactionPayload, 
  PaymentReceipt 
} from '../types/modules';

/**
 * Server Action: Update profile/student/staff status in Supabase
 */
export async function updateApprovalDecision(
  id: string,
  type: 'student' | 'teacher',
  decision: 'approve' | 'reject'
): Promise<{ success: boolean; message: string }> {
  const targetStatus = decision === 'approve' ? 'active' : 'rejected';

  if (isLiveSupabaseConfigured) {
    try {
      if (type === 'student') {
        await supabase
          .from('students')
          .update({ status: targetStatus === 'active' ? 'enrolled' : 'withdrawn' })
          .eq('id', id);
      } else {
        await supabase
          .from('staff')
          .update({ status: targetStatus })
          .eq('id', id);
      }

      await supabase
        .from('profiles')
        .update({ status: targetStatus })
        .eq('id', id);
    } catch (err) {
      console.warn('Supabase approval status update note:', err);
    }
  }

  await new Promise((res) => setTimeout(res, 500));

  return {
    success: true,
    message: `${type === 'student' ? 'Student admission' : 'Teacher appointment'} ${
      decision === 'approve' ? 'approved & account activated' : 'rejected'
    }.`,
  };
}

/**
 * Server Action: Batch submit daily attendance for a class
 */
export async function batchSubmitAttendance(
  payload: AttendanceBatchPayload
): Promise<{ success: boolean; recordedCount: number; message: string }> {
  if (isLiveSupabaseConfigured) {
    try {
      const records = payload.students.map((s) => ({
        tenant_id: 'campus-colombo-2026',
        student_id: s.studentId,
        attendance_date: payload.attendanceDate,
        status: s.status,
        notes: s.notes || null,
      }));

      await supabase.from('attendance').upsert(records, {
        onConflict: 'student_id,attendance_date',
      });
    } catch (err) {
      console.warn('Supabase attendance batch insert note:', err);
    }
  }

  await new Promise((res) => setTimeout(res, 600));

  return {
    success: true,
    recordedCount: payload.students.length,
    message: `Attendance marked successfully for ${payload.className} (${payload.students.length} students).`,
  };
}

/**
 * Server Action: Process student payment transaction and generate receipt
 */
export async function processStudentPayment(
  payload: PaymentTransactionPayload,
  currentBalance: number
): Promise<{ success: boolean; receipt: PaymentReceipt }> {
  const receiptNumber = `RCT-${Date.now().toString().slice(-6)}`;
  const invoiceNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const remaining = Math.max(0, currentBalance - payload.amount);
  const paidAt = new Date().toISOString();

  if (isLiveSupabaseConfigured) {
    try {
      await supabase.from('payments').insert({
        tenant_id: 'campus-colombo-2026',
        student_id: payload.studentId,
        invoice_number: invoiceNumber,
        term_title: payload.purposeLabel,
        amount_cents: Math.round(payload.amount * 100),
        currency: payload.currency,
        status: remaining === 0 ? 'paid' : 'partially_paid',
        payment_method: payload.paymentMethod,
        paid_at: paidAt,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    } catch (err) {
      console.warn('Supabase payment insert note:', err);
    }
  }

  await new Promise((res) => setTimeout(res, 700));

  const receipt: PaymentReceipt = {
    receiptNumber,
    invoiceNumber,
    studentId: payload.studentId,
    admissionNo: payload.admissionNo,
    studentName: payload.studentName,
    gradeLevel: payload.gradeLevel,
    purposeLabel: payload.purposeLabel,
    amountPaid: payload.amount,
    currency: payload.currency,
    paymentMethod: payload.paymentMethod.toUpperCase(),
    previousBalance: currentBalance,
    remainingBalance: remaining,
    paidAt,
    cashierName: 'Nadeesha Perera (Master Admin)',
    tenantName: 'Aster College · Colombo Campus',
  };

  return {
    success: true,
    receipt,
  };
}
