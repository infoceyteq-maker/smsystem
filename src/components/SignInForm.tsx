import React, { useState } from 'react';
import { Eye, EyeOff, X, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { signInWithCredentials } from '../actions/authActions';
import { UserProfile } from '../types/erp';
import { SchoolLogo } from './common/SchoolLogo';

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
            colors: ['#007AFF', '#34C759', '#111827'],
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
    <div className="w-full max-w-[420px] mx-auto px-4 py-8 sm:py-10 flex flex-col items-center select-none animate-in fade-in duration-300">
      {/* 1. Official Sri Sumangala College Crest Badge */}
      <div className="mb-4 flex flex-col items-center">
        <SchoolLogo size="2xl" interactive={true} />
        {/* College Colors Tricolor Line */}
        <div className="w-20 h-1.5 rounded-full flex overflow-hidden mt-3 shadow-2xs border border-gray-200">
          <div className="w-1/3 bg-[#0B3C96]" />
          <div className="w-1/3 bg-[#FFC72C]" />
          <div className="w-1/3 bg-white" />
        </div>
      </div>

      {/* 2. Heading & Subtitle */}
      <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 text-center">
        Sri Sumangala College
      </h1>
      <div className="flex items-center gap-1.5 mt-1">
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#0B3C96]/10 text-[#0B3C96] border border-[#0B3C96]/20">
          KANDY
        </span>
        <span className="text-xs font-semibold text-amber-700">
          Estd - 1934
        </span>
      </div>
      <p className="text-xs text-gray-500 text-center mt-1.5 mb-6 font-medium">
        School Management System (ERP) · Kandy
      </p>

      {/* Error Callout Banner if authentication failed */}
      {errorMessage && (
        <div className="w-full mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800 animate-in shake duration-200 shadow-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-600 hover:text-red-900"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Form Container */}
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* Field 1: Username / Admission No */}
        <div
          className={`relative w-full bg-white rounded-xl px-4 pt-2.5 pb-2.5 transition-all duration-200 shadow-xs ${
            isFocusedIdentifier
              ? 'border border-[#007AFF] shadow-sm ring-2 ring-blue-500/10'
              : 'border border-gray-200 hover:border-gray-300'
          }`}
        >
          <label
            htmlFor="identifier-input"
            className={`text-xs block font-medium transition-colors ${
              isFocusedIdentifier ? 'text-[#007AFF]' : 'text-gray-500'
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
              className="w-full bg-transparent text-gray-900 text-sm sm:text-base outline-none placeholder:text-gray-400 font-normal"
            />
            {identifier && (
              <button
                type="button"
                onClick={() => setIdentifier('')}
                className="text-gray-400 hover:text-gray-600 p-0.5 transition"
                title="Clear username"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Field 2: Password */}
        <div
          className={`relative w-full bg-white rounded-xl px-4 pt-2.5 pb-2.5 transition-all duration-200 shadow-xs ${
            isFocusedPassword
              ? 'border border-[#007AFF] shadow-sm ring-2 ring-blue-500/10'
              : 'border border-gray-200 hover:border-gray-300'
          }`}
        >
          <label
            htmlFor="password-input"
            className={`text-xs block transition-colors ${
              isFocusedPassword ? 'text-[#007AFF] font-medium' : 'text-gray-500'
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
              className="w-full bg-transparent text-gray-900 text-sm sm:text-base outline-none placeholder:text-gray-400 font-normal tracking-wide"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 p-1 transition"
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
            className="text-xs text-[#007AFF] hover:underline font-medium transition"
          >
            Forgot password?
          </button>
        </div>

        {/* 4. Face ID / Touch ID Biometric Section */}
        <div className="pt-2 pb-1 flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={onOpenBiometrics}
            className="group flex flex-col items-center gap-1.5 focus:outline-none p-2 rounded-xl hover:bg-gray-100/70 transition"
          >
            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#007AFF] group-hover:scale-105 transition duration-200">
              {/* Apple Face ID Viewfinder Glyph */}
              <svg
                className="w-5 h-5 text-[#007AFF]"
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
            <span className="text-xs text-gray-600 font-medium group-hover:text-gray-900 transition">
              Sign in with Face ID or Touch ID
            </span>
          </button>
        </div>

        {/* 5. Primary CTA Button: Sign In */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 sm:py-4 px-4 bg-[#007AFF] hover:bg-[#0062CC] active:bg-[#0052A3] disabled:opacity-60 text-white font-semibold text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-md shadow-blue-500/20 active:scale-[0.99] transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
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
        <p className="text-[11px] sm:text-xs text-gray-500 text-center max-w-[340px] mx-auto leading-relaxed pt-2">
          Master Admin, staff, and students use the same sign-in. Your role determines your workspace.
        </p>
      </form>
    </div>
  );
};
