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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Biometric Viewfinder Frame */}
        <div className="relative w-32 h-32 my-4 rounded-3xl border-2 border-dashed border-blue-300 flex items-center justify-center bg-blue-50/50 overflow-hidden shadow-xs">
          {/* Scanning sweep line */}
          {scanState === 'scanning' && (
            <div className="absolute inset-x-0 h-1 bg-[#007AFF] shadow-[0_0_15px_#007AFF] animate-scan-line" />
          )}

          {/* Center Glyph depends on state */}
          {scanState === 'success' ? (
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#34C759] flex items-center justify-center animate-in zoom-in-75">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          ) : scanState === 'failed' ? (
            <div className="w-16 h-16 rounded-full bg-red-100 text-[#FF3B30] flex items-center justify-center animate-in shake">
              <AlertCircle className="w-10 h-10" />
            </div>
          ) : (
            <svg
              className={`w-16 h-16 text-[#007AFF] transition duration-300 ${
                scanState === 'verifying' ? 'scale-110 opacity-90' : 'opacity-70'
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 7V5a2 2 0 0 1 2-2h2" />
              <path d="M16 3h2a2 2 0 0 1 2 2v2" />
              <path d="M20 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M8 21H6a2 2 0 0 1-2-2v-2" />
              <circle cx="9" cy="9.5" r="1.2" fill="currentColor" />
              <circle cx="15" cy="9.5" r="1.2" fill="currentColor" />
              <path d="M12 11.5v2a1 1 0 0 1-1 1" />
              <path d="M9 16.5c1 1 5 1 6 0" />
            </svg>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 tracking-tight mt-1">
          {scanState === 'success'
            ? 'Identity Confirmed'
            : scanState === 'failed'
            ? 'Scan Unsuccessful'
            : 'Face ID Verification'}
        </h3>

        <p className="text-xs text-gray-500 mt-1 max-w-[240px] leading-relaxed">
          {statusText}
        </p>

        <div className="mt-6 flex items-center gap-1.5 text-[11px] text-gray-400">
          <Shield className="w-3.5 h-3.5 text-[#007AFF]" />
          <span>FIDO2 / WebAuthn · Secure Enclave</span>
        </div>
      </div>
    </div>
  );
};
