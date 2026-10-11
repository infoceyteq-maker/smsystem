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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#007AFF] mb-4 shadow-xs">
          <KeyRound className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          Reset ERP Credentials
        </h3>
        <p className="text-xs text-gray-500 mt-1.5 mb-6 leading-relaxed">
          Enter your official institutional Username or Student Admission Number to receive password reset authorization.
        </p>

        {submittedMessage ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-[#34C759] shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                {submittedMessage}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 transition shadow-xs">
              <label className="text-xs font-medium text-gray-500 block">
                Username or Admission No
              </label>
              <div className="flex items-center gap-2 mt-0.5">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. master.admin or 2026/0148"
                  required
                  className="w-full bg-transparent text-gray-900 text-sm outline-none placeholder:text-gray-400 font-normal"
                />
              </div>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-[11px] text-gray-500 leading-relaxed">
              Self-service password reset links are automatically dispatched to the verified parent or staff email on record in PostgreSQL <code className="font-mono text-gray-700 bg-gray-100 px-1 rounded">auth.users</code>.
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !identifier.trim()}
                className="flex-1 py-3 px-4 bg-[#007AFF] hover:bg-[#0062CC] disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
