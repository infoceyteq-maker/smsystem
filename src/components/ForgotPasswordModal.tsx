import React, { useState } from 'react';
import { X, Mail, CheckCircle2, KeyRound } from 'lucide-react';
import { requestPasswordReset } from '../actions/authActions';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIdentifier?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialIdentifier = '',
}) => {
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setIsSubmitting(true);
    const res = await requestPasswordReset(identifier);
    setIsSubmitting(false);
    setSubmittedMessage(res.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#1C1C1E] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8E8E93] hover:text-white p-1 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#0A84FF]/10 border border-[#0A84FF]/20 flex items-center justify-center text-[#0A84FF] mb-4">
          <KeyRound className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">
          Reset ERP Credentials
        </h3>
        <p className="text-xs text-[#8E8E93] mt-1.5 mb-6 leading-relaxed">
          Enter your official institutional Username or Student Admission Number to receive password reset authorization.
        </p>

        {submittedMessage ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#30D158] shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-200 leading-relaxed">
                {submittedMessage}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white font-medium text-sm rounded-xl transition"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#2C2C2E] rounded-xl border border-white/10 px-4 py-2.5 focus-within:border-[#0A84FF] transition">
              <label className="text-[11px] font-medium text-[#8E8E93] block">
                Username or Admission No
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. master.admin or COL-2026-042"
                required
                className="w-full bg-transparent text-white text-sm outline-none placeholder:text-zinc-500 mt-0.5"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !identifier.trim()}
              className="w-full py-3.5 bg-[#0A84FF] hover:bg-[#0077ED] disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Record...</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span>Send Reset Authorization</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
