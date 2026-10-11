import React from 'react';
import { X, CheckCircle2, Printer, Download, Share2, ShieldCheck, GraduationCap } from 'lucide-react';
import { PaymentReceipt } from '../../types/modules';

interface PaymentReceiptModalProps {
  receipt: PaymentReceipt | null;
  onClose: () => void;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  receipt,
  onClose,
}) => {
  if (!receipt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Brand & Title */}
        <div className="text-center pb-5 border-b border-gray-100">
          <div className="w-12 h-12 rounded-2xl bg-[#007AFF] text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/25">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">
            Official Payment Receipt
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {receipt.tenantName} · Finance Department
          </p>
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#34C759] border border-emerald-200 font-mono shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>PAYMENT VERIFIED · {receipt.receiptNumber}</span>
          </div>
        </div>

        {/* Receipt Content Details */}
        <div className="space-y-3 my-5 text-xs">
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Student Name</span>
            <span className="text-gray-900 font-bold">{receipt.studentName}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Admission Number</span>
            <span className="text-gray-900 font-mono font-semibold">{receipt.admissionNo}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Academic Level</span>
            <span className="text-gray-900 font-semibold">{receipt.gradeLevel}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Payment Purpose</span>
            <span className="text-gray-900 font-semibold">{receipt.purposeLabel}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Payment Channel</span>
            <span className="text-gray-900 font-semibold uppercase">{receipt.paymentMethod.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Timestamp</span>
            <span className="text-gray-900 font-mono">
              {new Date(receipt.paidAt).toLocaleString()}
            </span>
          </div>

          {/* Amount Paid Callout Box */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between mt-4 shadow-xs">
            <div>
              <span className="text-[11px] font-bold text-[#007AFF] uppercase tracking-wider block">
                Total Amount Paid
              </span>
              <span className="text-[11px] text-gray-500">
                Official Bursar Settlement
              </span>
            </div>
            <span className="text-2xl font-extrabold text-[#007AFF] font-mono">
              ${receipt.amountPaid.toFixed(2)} {receipt.currency}
            </span>
          </div>
        </div>

        {/* Security watermark */}
        <div className="py-2.5 px-3 bg-gray-50 rounded-xl flex items-center gap-2 text-[11px] text-gray-500 mb-5 border border-gray-100">
          <ShieldCheck className="w-4 h-4 text-[#007AFF] shrink-0" />
          <span>Cryptographically logged to PostgreSQL <code className="font-mono text-gray-700">public.payments</code>. Valid for tax clearance.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-[#007AFF] hover:bg-[#0062CC] text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            Done & Return
          </button>
        </div>
      </div>
    </div>
  );
};
