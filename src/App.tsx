/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { SignInForm } from './components/SignInForm';
import { Footer } from './components/Footer';
import { BiometricModal } from './components/BiometricModal';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { RoleQuickPicker } from './components/RoleQuickPicker';
import { SupabaseDocsModal } from './components/SupabaseDocsModal';
import { DashboardPreview } from './components/DashboardPreview';
import { MasterAdminDashboard } from './components/dashboard/MasterAdminDashboard';
import { InvitationModal } from './components/dashboard/InvitationModal';
import { StudentRegistrationWizard } from './components/registration/StudentRegistrationWizard';
import { TeacherRegistrationWizard } from './components/teacher-registration/TeacherRegistrationWizard';
import { DEFAULT_CAMPUS, DEMO_ERP_ACCOUNTS } from './lib/supabase';
import { UserProfile } from './types/erp';

export default function App() {
  // Navigation / Slide state (From Figma 8 / 18, 9 / 18, etc.)
  const [currentSlide, setCurrentSlide] = useState(8);
  const totalSlides = 18;

  // Viewport responsive preview simulation
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Modals state
  const [isBiometricOpen, setIsBiometricOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isRolePickerOpen, setIsRolePickerOpen] = useState(false);
  const [isSupabaseDocsOpen, setIsSupabaseDocsOpen] = useState(false);
  const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false);

  // Authenticated state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Form pre-fill values
  const [prefillIdentifier, setPrefillIdentifier] = useState('master.admin');
  const [prefillPassword, setPrefillPassword] = useState('Password@2026');

  // Explicit Screen mode switcher for quick reviewer navigation
  const [viewingScreen, setViewingScreen] = useState<
    'signin' | 'master_dashboard' | 'approvals' | 'attendance' | 'payments' | 'registration' | 'teacher_registration'
  >('signin');

  // Slide navigation handlers
  const handlePrevSlide = () => {
    if (currentSlide === 9) {
      setCurrentSlide(8);
      setViewingScreen('signin');
    } else {
      setCurrentSlide(9);
      setViewingScreen('master_dashboard');
    }
  };

  const handleNextSlide = () => {
    if (currentSlide === 8) {
      setCurrentSlide(9);
      setViewingScreen('master_dashboard');
    } else {
      setCurrentSlide(8);
      setViewingScreen('signin');
    }
  };

  const handleSignInSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'master_admin') {
      setViewingScreen('master_dashboard');
      setCurrentSlide(9);
    } else {
      setCurrentSlide(9);
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setViewingScreen('signin');
    setCurrentSlide(8);
  };

  const handleSelectRolePreset = (username: string, password: string, autoSubmit?: boolean) => {
    setPrefillIdentifier(username);
    setPrefillPassword(password);
    if (autoSubmit) {
      const account = DEMO_ERP_ACCOUNTS[username];
      if (account) {
        handleSignInSuccess(account.profile);
      }
    }
  };

  // If in master admin dashboard mode or any of its sub-modules
  const isDashboardView =
    viewingScreen === 'master_dashboard' ||
    viewingScreen === 'approvals' ||
    viewingScreen === 'attendance' ||
    viewingScreen === 'payments' ||
    (currentUser?.role === 'master_admin' && currentSlide !== 8);

  const getDashboardInitialTab = () => {
    if (viewingScreen === 'approvals') return 'approvals';
    if (viewingScreen === 'attendance') return 'attendance';
    if (viewingScreen === 'payments') return 'payments';
    return 'overview';
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 flex flex-col justify-between font-sans selection:bg-blue-100 selection:text-blue-900 relative overflow-x-hidden">
      {/* Subtle soft backdrop gradient */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-[#F8F9FA] to-[#F8F9FA] -z-10" />

      {/* Quick Screen Selector Ribbon (Top floating pill for reviewer) */}
      <div className="w-full bg-white/90 backdrop-blur-md border-b border-gray-200 py-2 px-3 sm:px-4 flex flex-wrap items-center justify-between gap-2 text-xs z-30 select-none shadow-xs sticky top-0">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full py-0.5">
          <span className="text-gray-500 hidden md:inline shrink-0 font-bold uppercase tracking-wider text-[11px]">ERP Modules:</span>
          
          <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200 gap-1 shrink-0 overflow-x-auto">
            <button
              onClick={() => {
                setViewingScreen('signin');
                setCurrentSlide(8);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                viewingScreen === 'signin' && !currentUser
                  ? 'bg-[#007AFF] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              1. Sign In (Slide 8)
            </button>
            <button
              onClick={() => {
                setViewingScreen('master_dashboard');
                setCurrentSlide(9);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                viewingScreen === 'master_dashboard'
                  ? 'bg-[#007AFF] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              2. Master Admin (Slide 9)
            </button>
            <button
              onClick={() => {
                setViewingScreen('approvals');
                setCurrentSlide(9);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                viewingScreen === 'approvals'
                  ? 'bg-[#007AFF] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]" />
              <span>3. Approvals Dashboard</span>
            </button>
            <button
              onClick={() => {
                setViewingScreen('attendance');
                setCurrentSlide(9);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                viewingScreen === 'attendance'
                  ? 'bg-[#007AFF] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#007AFF]" />
              <span>4. Daily Attendance</span>
            </button>
            <button
              onClick={() => {
                setViewingScreen('payments');
                setCurrentSlide(9);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                viewingScreen === 'payments'
                  ? 'bg-[#007AFF] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
              <span>5. Fees & Payments</span>
            </button>
            <button
              onClick={() => {
                setViewingScreen('registration');
                setCurrentSlide(10);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                viewingScreen === 'registration'
                  ? 'bg-[#007AFF] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>6. Student Registration</span>
            </button>
            <button
              onClick={() => {
                setViewingScreen('teacher_registration');
                setCurrentSlide(11);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                viewingScreen === 'teacher_registration'
                  ? 'bg-[#007AFF] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>7. Teacher Registration</span>
            </button>
            <button
              onClick={() => setIsInvitationModalOpen(true)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#007AFF] hover:bg-blue-50 transition flex items-center gap-1 whitespace-nowrap cursor-pointer"
            >
              <span>+ Invite Link</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsSupabaseDocsOpen(true)}
            className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition text-[11px] font-bold whitespace-nowrap shadow-xs cursor-pointer"
          >
            Supabase SQL Editor Code
          </button>
        </div>
      </div>

      {viewingScreen === 'teacher_registration' ? (
        // Teacher Registration 3-Step Wizard View
        <div className="w-full flex-1 flex flex-col justify-between">
          <TeacherRegistrationWizard 
            onExit={() => setViewingScreen('master_dashboard')}
            onGoToDashboard={() => setViewingScreen('master_dashboard')}
          />
          <Footer
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            onPrevSlide={handlePrevSlide}
            onNextSlide={handleNextSlide}
          />
        </div>
      ) : viewingScreen === 'registration' ? (
        // Student Registration 3-Step Wizard View
        <div className="w-full flex-1 flex flex-col justify-between">
          <StudentRegistrationWizard 
            onExit={() => setViewingScreen('master_dashboard')}
            onGoToDashboard={() => setViewingScreen('master_dashboard')}
          />
          <Footer
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            onPrevSlide={handlePrevSlide}
            onNextSlide={handleNextSlide}
          />
        </div>
      ) : isDashboardView ? (
        // Master Admin Dashboard View
        <div className="w-full flex-1 flex flex-col justify-between">
          <MasterAdminDashboard
            initialTab={getDashboardInitialTab()}
            onReturnToLogin={handleSignOut}
            onOpenRegistration={() => {
              setViewingScreen('registration');
              setCurrentSlide(10);
            }}
            onOpenTeacherRegistration={() => {
              setViewingScreen('teacher_registration');
              setCurrentSlide(11);
            }}
          />
        </div>
      ) : currentUser ? (
        // Preview state for other authenticated personas
        <div className="w-full flex-1 flex flex-col justify-between">
          <Header
            campus={DEFAULT_CAMPUS}
            onOpenSupabaseDocs={() => setIsSupabaseDocsOpen(true)}
            onOpenQuickRoles={() => setIsRolePickerOpen(true)}
            viewportMode={viewportMode}
            onSetViewportMode={setViewportMode}
          />
          <DashboardPreview
            user={currentUser}
            onSignOut={handleSignOut}
            onSwitchRole={() => setIsRolePickerOpen(true)}
          />
          <Footer
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            onPrevSlide={handlePrevSlide}
            onNextSlide={handleNextSlide}
          />
        </div>
      ) : (
        // Default View: Slide 8 Sign In Form
        <div className="w-full flex-1 flex flex-col justify-between">
          <Header
            campus={DEFAULT_CAMPUS}
            onOpenSupabaseDocs={() => setIsSupabaseDocsOpen(true)}
            onOpenQuickRoles={() => setIsRolePickerOpen(true)}
            viewportMode={viewportMode}
            onSetViewportMode={setViewportMode}
          />

          <main className="flex-1 flex items-center justify-center py-6 px-4">
            <div
              className={`w-full transition-all duration-300 mx-auto ${
                viewportMode === 'mobile'
                  ? 'max-w-[390px] border border-gray-200 rounded-[36px] bg-white shadow-md p-2'
                  : viewportMode === 'tablet'
                  ? 'max-w-[768px] border border-gray-200 rounded-[32px] bg-white shadow-sm p-4'
                  : 'max-w-xl'
              }`}
            >
              <SignInForm
                onSignInSuccess={handleSignInSuccess}
                onOpenBiometrics={() => setIsBiometricOpen(true)}
                onOpenForgotPassword={() => setIsForgotPasswordOpen(true)}
                defaultIdentifier={prefillIdentifier}
                defaultPassword={prefillPassword}
              />
            </div>
          </main>

          <Footer
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            onPrevSlide={handlePrevSlide}
            onNextSlide={handleNextSlide}
          />
        </div>
      )}

      {/* Global Interactive Overlays */}
      <BiometricModal
        isOpen={isBiometricOpen}
        onClose={() => setIsBiometricOpen(false)}
        targetUsername={prefillIdentifier}
        onSuccess={handleSignInSuccess}
      />

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        initialIdentifier={prefillIdentifier}
      />

      <RoleQuickPicker
        isOpen={isRolePickerOpen}
        onClose={() => setIsRolePickerOpen(false)}
        onSelectAccount={handleSelectRolePreset}
      />

      <SupabaseDocsModal
        isOpen={isSupabaseDocsOpen}
        onClose={() => setIsSupabaseDocsOpen(false)}
      />

      <InvitationModal
        isOpen={isInvitationModalOpen}
        onClose={() => setIsInvitationModalOpen(false)}
      />
    </div>
  );
}
