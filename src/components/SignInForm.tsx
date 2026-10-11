import React, { useState } from 'react';
import { Eye, EyeOff, X, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { signInWithCredentials } from '../actions/authActions';
import { UserProfile } from '../types/erp';

interface SignInFormProps {
  onSignInSuccess: (user: UserProfile) => void;
  onOpenBiometrics: () => void;
  onOpenForgotPassword: () => void;
  defaultIdentifier?: string;
  defaultPassword?: string;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  onSignInSuccess,
  onOpenBiometrics,
  onOpenForgotPassword,
  defaultIdentifier = 'master.admin',
  defaultPassword = 'Password@2026',
}) => {
  const [identifier, setIdentifier] = useState(defaultIdentifier);
  const [password, setPassword] = useState(defaultPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFocusedIdentifier, setIsFocusedIdentifier] = useState(true);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  // Sync if prop defaults change (e.g. from preset picker)
  React.useEffect(() => {
    if (defaultIdentifier) setIdentifier(defaultIdentifier);
    if (defaultPassword) setPassword(defaultPassword);
  }, [defaultIdentifier, defaultPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await signInWithCredentials({
        identifier,
        password,
      });

      if (response.success && response.user) {
        // Trigger elegant Apple-style celebration
        try {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.65 },
            colors: ['#0A84FF', '#30D158', '#FFFFFF'],
          });
        } catch (_) {}

        onSignInSuccess(response.user);
      } else {
        setErrorMessage(response.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setErrorMessage('An unexpected error occurred during sign-in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 py-6 sm:py-8 flex flex-col items-center select-none animate-in fade-in duration-300">
      {/* 1. Squircle Graduation Cap Badge (Pixel-perfect match to screenshot) */}
      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#091E36]/90 border border-[#0A84FF]/30 flex items-center justify-center mb-6 shadow-xl shadow-blue-950/30 ring-1 ring-[#0A84FF]/20 group transition hover:scale-105">
        <svg
          className="w-10 h-10 sm:w-11 sm:h-11 text-[#0A84FF] transition"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Graduation Cap Outlines */}
          <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
          <path d="M22 10v6" />
          <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
        </svg>
      </div>

      {/* 2. Heading & Subtitle */}
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-center">
        Sign In to ERP
      </h1>
      <p className="text-xs sm:text-sm text-[#8E8E93] text-center mt-1.5 mb-7">
        One secure home for your school journey.
      </p>

      {/* Error Callout Banner if authentication failed */}
      {errorMessage && (
        <div className="w-full mb-4 p-3.5 bg-red-950/40 border border-[#FF453A]/40 rounded-xl flex items-start gap-2.5 text-xs text-red-200 animate-in shake duration-200">
          <AlertCircle className="w-4 h-4 text-[#FF453A] shrink-0 mt-0.5" />
          <div className="flex-1">
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Form Container */}
      <form onSubmit={handleSubmit} className="w-full space-y-3.5">
        {/* Field 1: Username / Admission No */}
        <div
          className={`relative w-full bg-[#1C1C1E] rounded-xl px-4 pt-2.5 pb-2.5 transition-all duration-200 ${
            isFocusedIdentifier
              ? 'border border-[#0A84FF] shadow-[0_0_15px_rgba(10,132,255,0.15)] ring-1 ring-[#0A84FF]/30'
              : 'border border-white/5 hover:border-white/10'
          }`}
        >
          <label
            htmlFor="identifier-input"
            className={`text-xs block font-medium transition-colors ${
              isFocusedIdentifier ? 'text-[#0A84FF]' : 'text-[#8E8E93]'
            }`}
          >
            Username/Admission No
          </label>
          <div className="flex items-center justify-between mt-0.5">
            <input
              id="identifier-input"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onFocus={() => {
                setIsFocusedIdentifier(true);
                setIsFocusedPassword(false);
              }}
              onBlur={() => setIsFocusedIdentifier(false)}
              placeholder="e.g. master.admin"
              autoComplete="username"
              required
              className="w-full bg-transparent text-white text-sm sm:text-base outline-none placeholder:text-zinc-600 font-normal"
            />
            {identifier && (
              <button
                type="button"
                onClick={() => setIdentifier('')}
                className="text-zinc-600 hover:text-zinc-300 p-0.5 transition"
                title="Clear username"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Field 2: Password */}
        <div
          className={`relative w-full bg-[#1C1C1E] rounded-xl px-4 pt-2.5 pb-2.5 transition-all duration-200 ${
            isFocusedPassword
              ? 'border border-[#0A84FF] shadow-[0_0_15px_rgba(10,132,255,0.15)] ring-1 ring-[#0A84FF]/30'
              : 'border border-white/5 hover:border-white/10'
          }`}
        >
          <label
            htmlFor="password-input"
            className={`text-xs block transition-colors ${
              isFocusedPassword ? 'text-[#0A84FF] font-medium' : 'text-[#8E8E93]'
            }`}
          >
            Password
          </label>
          <div className="flex items-center justify-between mt-0.5">
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => {
                setIsFocusedPassword(true);
                setIsFocusedIdentifier(false);
              }}
              onBlur={() => setIsFocusedPassword(false)}
              placeholder="•••••••••••••"
              autoComplete="current-password"
              required
              className="w-full bg-transparent text-white text-sm sm:text-base outline-none placeholder:text-zinc-600 font-normal tracking-wide"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#8E8E93] hover:text-white p-1 transition"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Forgot Password link (Aligned right below password) */}
        <div className="flex justify-end pt-0.5">
          <button
            type="button"
            onClick={onOpenForgotPassword}
            className="text-xs text-[#0A84FF] hover:underline font-normal transition"
          >
            Forgot password?
          </button>
        </div>

        {/* 4. Face ID / Touch ID Biometric Section (Exact glyph and text from screenshot) */}
        <div className="pt-3 pb-2 flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={onOpenBiometrics}
            className="group flex flex-col items-center gap-1.5 focus:outline-none"
          >
            <div className="w-9 h-9 flex items-center justify-center text-[#0A84FF] group-hover:scale-110 transition duration-200">
              {/* Apple Face ID Viewfinder Glyph */}
              <svg
                className="w-7 h-7 text-[#0A84FF]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* 4 corner brackets */}
                <path d="M4 7V5a2 2 0 0 1 2-2h2" />
                <path d="M16 3h2a2 2 0 0 1 2 2v2" />
                <path d="M20 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M8 21H6a2 2 0 0 1-2-2v-2" />
                {/* Eyes */}
                <circle cx="9" cy="9.5" r="1.1" fill="currentColor" />
                <circle cx="15" cy="9.5" r="1.1" fill="currentColor" />
                {/* Nose */}
                <path d="M12 11.5v2a1 1 0 0 1-1 1" />
                {/* Smile */}
                <path d="M9 16.5c1 1 5 1 6 0" />
              </svg>
            </div>
            <span className="text-xs text-[#8E8E93] group-hover:text-white transition">
              Sign in with Face ID or Touch ID
            </span>
          </button>
        </div>

        {/* 5. Primary CTA Button: Sign In */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 sm:py-4 px-4 bg-[#0A84FF] hover:bg-[#0077ED] active:bg-[#0066CC] disabled:opacity-60 text-white font-semibold text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/25 active:scale-[0.99] transition duration-150 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>

        {/* 6. Explanatory Sub-text */}
        <p className="text-[11px] sm:text-xs text-[#8E8E93] text-center max-w-[340px] mx-auto leading-relaxed pt-2">
          Master Admin, staff and students use the same sign-in. Your account determines your access.
        </p>
      </form>
    </div>
  );
};
