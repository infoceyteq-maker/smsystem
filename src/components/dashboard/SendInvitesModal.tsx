import React, { useState } from 'react';
import { X, Send, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { dispatchInvitations } from '../../actions/masterAdminActions';

interface SendInvitesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SendInvitesModal: React.FC<SendInvitesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [channel, setChannel] = useState<'both' | 'email' | 'sms'>('both');
  const [recipients, setRecipients] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipients.trim()) return;

    setIsSending(true);
    const count = recipients.split(/[\n,]+/).filter(Boolean).length || 1;
    const res = await dispatchInvitations(count, channel, role);
    setIsSending(false);
    setSuccessMessage(res.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#007AFF] mb-3 shadow-xs">
          <Send className="w-5 h-5" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          Send ERP Registration Invites
        </h3>
        <p className="text-xs text-gray-500 mt-1 mb-5">
          Generate secure, self-onboarding registration links for Aster College Colombo Campus.
        </p>

        {successMessage ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-[#34C759] shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                {successMessage}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            {/* Target Role selection */}
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5 uppercase tracking-wider">
                Target Role
              </label>
              <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    role === 'student'
                      ? 'bg-white text-[#007AFF] shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  New Students (Admissions)
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    role === 'teacher'
                      ? 'bg-white text-[#007AFF] shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Teaching Staff (Faculty)
                </button>
              </div>
            </div>

            {/* Delivery channel */}
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5 uppercase tracking-wider">
                Dispatch Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('both')}
                  className={`py-2 text-xs font-semibold rounded-xl border transition ${
                    channel === 'both'
                      ? 'bg-blue-50 border-[#007AFF] text-[#007AFF]'
                      : 'bg-white border-gray-200 text-gray-500 hover:text-gray-800'
                  }`}
                >
                  SMS & Email
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('sms')}
                  className={`py-2 text-xs font-semibold rounded-xl border transition ${
                    channel === 'sms'
                      ? 'bg-blue-50 border-[#007AFF] text-[#007AFF]'
                      : 'bg-white border-gray-200 text-gray-500 hover:text-gray-800'
                  }`}
                >
                  SMS Only
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('email')}
                  className={`py-2 text-xs font-semibold rounded-xl border transition ${
                    channel === 'email'
                      ? 'bg-blue-50 border-[#007AFF] text-[#007AFF]'
                      : 'bg-white border-gray-200 text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Email Only
                </button>
              </div>
            </div>

            {/* Recipients text area */}
            <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 transition shadow-xs">
              <label className="text-xs font-medium text-gray-500 block">
                Phone Numbers or Emails (comma or line separated)
              </label>
              <textarea
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="+94 77 123 4567, student.parent@example.com&#10;+94 71 889 2210"
                rows={3}
                required
                className="w-full bg-transparent text-gray-900 text-xs sm:text-sm outline-none placeholder:text-gray-400 font-mono mt-1"
              />
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
                disabled={isSending || !recipients.trim()}
                className="flex-1 py-3 px-4 bg-[#007AFF] hover:bg-[#0062CC] disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSending ? 'Sending Invites...' : 'Dispatch Invites'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
