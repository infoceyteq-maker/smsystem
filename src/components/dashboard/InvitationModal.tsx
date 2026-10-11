import React, { useState } from 'react';
import { 
  X, 
  SendHorizontal, 
  Phone, 
  Mail, 
  Copy, 
  Check, 
  ShieldCheck 
} from 'lucide-react';
import { generateInvitationToken } from '../../actions/masterAdminActions';
import { GeneratedInvitationResult } from '../../types/dashboard';

interface InvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InvitationModal: React.FC<InvitationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [role, setRole] = useState<'student' | 'teacher'>('teacher');
  const [channel, setChannel] = useState<'sms' | 'email'>('sms');
  const [phoneNumber, setPhoneNumber] = useState('+94 77 456 7890');
  const [emailAddress, setEmailAddress] = useState('amaya.fernando@astercollege.edu');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  // Active generated link result
  const [generatedResult, setGeneratedResult] = useState<GeneratedInvitationResult>({
    id: 'inv-init-01',
    token: 't-8f9a',
    url: 'ceyteq.erp/register/t-8f9a',
    role: 'teacher',
    channel: 'sms',
    recipientName: 'Amaya Fernando · Teacher',
    recipientContact: '+94 77 456 7890',
    createdAtStr: 'Created 11 Oct 2026, 09:41',
    expiresAtStr: 'Expires 14 Oct 2026',
    statusText: 'SMS sent · Sample',
  });

  if (!isOpen) return null;

  const handleRoleChange = (newRole: 'student' | 'teacher') => {
    setRole(newRole);
    if (newRole === 'student') {
      setPhoneNumber('+94 71 889 2210');
      setEmailAddress('senuri.perera@gmail.com');
    } else {
      setPhoneNumber('+94 77 456 7890');
      setEmailAddress('amaya.fernando@astercollege.edu');
    }
  };

  const handleGenerateAndSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const recipientContact = channel === 'sms' ? phoneNumber : emailAddress;
      const result = await generateInvitationToken({
        role,
        channel,
        recipientContact,
      });

      if (result.success && result.data) {
        setGeneratedResult(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (!generatedResult?.url) return;
    navigator.clipboard.writeText(`https://${generatedResult.url}`);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-xl animate-in zoom-in-95 duration-200">
        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Invitation & Link Generator
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Self-onboarding tokens for Colombo Campus
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleGenerateAndSend} className="space-y-4 pt-4">
          {/* 1. iOS Segmented Control for Role */}
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5 uppercase tracking-wider">
              Select Recipient Type
            </label>
            <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  role === 'student'
                    ? 'bg-white text-[#007AFF] shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('teacher')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  role === 'teacher'
                    ? 'bg-white text-[#007AFF] shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Teacher
              </button>
            </div>
          </div>

          {/* 2. Channel Selector (SMS / Email) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setChannel('sms')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                channel === 'sms'
                  ? 'bg-blue-50 border-[#007AFF] text-[#007AFF]'
                  : 'bg-white border-gray-200 text-gray-500 hover:text-gray-800'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>SMS Direct</span>
            </button>
            <button
              type="button"
              onClick={() => setChannel('email')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                channel === 'email'
                  ? 'bg-blue-50 border-[#007AFF] text-[#007AFF]'
                  : 'bg-white border-gray-200 text-gray-500 hover:text-gray-800'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Link</span>
            </button>
          </div>

          {/* 3. Input Area */}
          <div className="bg-white border border-gray-200 focus-within:border-[#007AFF] rounded-xl px-4 py-2.5 transition shadow-xs">
            <label className="text-[11px] font-medium text-gray-500 block">
              {channel === 'sms' ? 'Phone Number' : 'Email Address'}
            </label>
            <div className="flex items-center gap-2 mt-0.5">
              {channel === 'sms' ? (
                <>
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+94 77 123 4567"
                    required
                    className="w-full bg-transparent text-gray-900 text-sm outline-none placeholder:text-gray-400 font-normal font-mono"
                  />
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="name@domain.com"
                    required
                    className="w-full bg-transparent text-gray-900 text-sm outline-none placeholder:text-gray-400 font-normal"
                  />
                </>
              )}
            </div>
          </div>

          {/* 4. Primary Button: Generate & Send Link */}
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-3.5 px-4 bg-[#007AFF] hover:bg-[#0062CC] active:bg-[#0052A3] disabled:opacity-60 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating Token...</span>
              </>
            ) : (
              <>
                <SendHorizontal className="w-4 h-4" />
                <span>Generate & Send Link</span>
              </>
            )}
          </button>
        </form>

        {/* 5. Result Card */}
        {generatedResult && (
          <div className="mt-5 pt-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800">
                Generated Link
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {generatedResult.statusText}
              </span>
            </div>

            {/* Read-only URL box with functional Copy Link button */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-xs">
              <span className="text-xs font-mono text-gray-700 truncate select-all px-1">
                https://{generatedResult.url}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shrink-0 ${
                  hasCopied
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 shadow-xs'
                }`}
              >
                {hasCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-500" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Meta tags */}
            <div className="flex items-center justify-between text-[11px] text-gray-400 px-0.5">
              <span>{generatedResult.createdAtStr}</span>
              <span className="font-medium text-amber-600">{generatedResult.expiresAtStr}</span>
            </div>
          </div>
        )}

        {/* Security badge footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#007AFF]" />
          <span>One-time cryptographic registration token (Supabase RLS protected)</span>
        </div>
      </div>
    </div>
  );
};
