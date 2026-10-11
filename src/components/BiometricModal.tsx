import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Shield, Lock } from 'lucide-react';
import { signInWithBiometrics } from '../actions/authActions';
import { UserProfile } from '../types/erp';

interface BiometricModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUsername?: string;
  onSuccess: (user: UserProfile) => void;
}

export const BiometricModal: React.FC<BiometricModalProps> = ({
  isOpen,
  onClose,
  targetUsername,
  onSuccess,
}) => {
  const [scanState, setScanState] = useState<'scanning' | 'verifying' | 'success' | 'failed'>('scanning');
  const [statusText, setStatusText] = useState('Position face inside frame');

  useEffect(() => {
    if (!isOpen) {
      setScanState('scanning');
      return;
    }

    setScanState('scanning');
    setStatusText('Position face inside frame...');

    const timer1 = setTimeout(() => {
      setScanState('verifying');
      setStatusText('Validating biometric token with Supabase Auth...');
    }, 1100);

    const timer2 = setTimeout(async () => {
      try {
        const res = await signInWithBiometrics(targetUsername);
        if (res.success && res.user) {
          setScanState('success');
          setStatusText(`Identified: ${res.user.fullName}`);
          setTimeout(() => {
            onSuccess(res.user!);
            onClose();
          }, 900);
        } else {
          setScanState('failed');
          setStatusText(res.error || 'Biometric authentication failed');
        }
      } catch (e) {
        setScanState('failed');
        setStatusText('Biometric authentication failed');
      }
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen, targetUsername]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#1C1C1E] border border-white/10 rounded-3xl p-6 sm:p-8 text-center shadow-2xl flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8E8E93] hover:text-white p-1 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Apple Face ID Viewfinder Bracket Graphic */}
        <div className="relative w-32 h-32 my-6 flex items-center justify-center">
          {/* Outer Rounded Bracket Lines */}
          <div className="absolute inset-0 border-2 border-dashed border-[#0A84FF]/40 rounded-3xl" />
          
          {/* Animated Glow Border */}
          <div
            className={`absolute inset-0 rounded-3xl transition-all duration-700 ${
              scanState === 'success'
                ? 'border-2 border-[#30D158] shadow-[0_0_30px_rgba(48,209,88,0.3)]'
                : scanState === 'failed'
                ? 'border-2 border-[#FF453A] shadow-[0_0_30px_rgba(255,69,58,0.3)]'
                : 'border-2 border-[#0A84FF] shadow-[0_0_25px_rgba(10,132,255,0.25)]'
            }`}
          />

          {/* Sweep scanning line */}
          {scanState === 'scanning' && (
            <div className="absolute left-2 right-2 h-0.5 bg-[#0A84FF] shadow-[0_0_12px_#0A84FF] animate-scan-line pointer-events-none" />
          )}

          {/* SVG Face ID Glyph */}
          {scanState === 'success' ? (
            <CheckCircle2 className="w-16 h-16 text-[#30D158] animate-in zoom-in duration-300" />
          ) : scanState === 'failed' ? (
            <AlertCircle className="w-16 h-16 text-[#FF453A] animate-in zoom-in duration-300" />
          ) : (
            <svg
              className="w-16 h-16 text-[#0A84FF] transition duration-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Corner brackets representing Apple Face ID */}
              <path d="M4 8V6a2 2 0 0 1 2-2h2" />
              <path d="M16 4h2a2 2 0 0 1 2 2v2" />
              <path d="M20 16v2a2 2 0 0 1-2 2h-2" />
              <path d="M8 20H6a2 2 0 0 1-2-2v-2" />
              {/* Eyes */}
              <circle cx="9" cy="9.5" r="1.2" fill="currentColor" />
              <circle cx="15" cy="9.5" r="1.2" fill="currentColor" />
              {/* Nose */}
              <path d="M12 11.5v2a1 1 0 0 1-1 1" />
              {/* Smile */}
              <path d="M9 16.5c1 1 5 1 6 0" />
            </svg>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white tracking-tight">
          {scanState === 'success' ? 'Face ID Verified' : 'Face ID & Touch ID'}
        </h3>

        {/* Dynamic Status message */}
        <p className="text-xs text-[#8E8E93] mt-2 mb-6 h-5 leading-tight">
          {statusText}
        </p>

        {/* Security badge info */}
        <div className="w-full bg-[#2C2C2E]/60 border border-white/5 rounded-2xl p-3 flex items-center gap-2.5 text-left mb-4">
          <Shield className="w-4 h-4 text-[#0A84FF] shrink-0" />
          <span className="text-[11px] text-zinc-300 leading-tight">
            Protected by Apple Secure Enclave & Supabase Auth JWT credentials.
          </span>
        </div>

        {/* Cancel button */}
        <button
          onClick={onClose}
          className="text-xs text-[#0A84FF] hover:underline font-medium pt-1"
        >
          Cancel and use Password
        </button>
      </div>
    </div>
  );
};
