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
import { DEFAULT_CAMPUS, DEMO_ERP_ACCOUNTS } from './lib/supabase';
import { UserProfile } from './types/erp';

export default function App() {
  // Navigation / Slide state (From Figma 8 / 18)
  const [currentSlide, setCurrentSlide] = useState(8);
  const totalSlides = 18;

  // Viewport responsive preview simulation
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Modals state
  const [isBiometricOpen, setIsBiometricOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isRolePickerOpen, setIsRolePickerOpen] = useState(false);
  const [isSupabaseDocsOpen, setIsSupabaseDocsOpen] = useState(false);

  // Authenticated state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Form pre-fill values
  const [prefillIdentifier, setPrefillIdentifier] = useState('master.admin');
  const [prefillPassword, setPrefillPassword] = useState('Password@2026');

  // Slide navigation handlers
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev > 1 ? prev - 1 : totalSlides));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev < totalSlides ? prev + 1 : 1));
  };

  const handleSignInSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    // Move to next slide representation (Role Dashboard)
    setCurrentSlide(9);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between font-sans selection:bg-[#0A84FF]/40 selection:text-white relative overflow-x-hidden">
      {/* Background radial gradient representing deep iOS 27 OLED backdrop */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/15 via-black to-black -z-10" />

      {/* Main App Container with responsive viewport frame if toggled */}
      <div
        className={`w-full mx-auto flex-1 flex flex-col justify-between transition-all duration-300 ${
          viewportMode === 'mobile'
            ? 'max-w-[420px] my-6 rounded-[44px] ring-1 ring-white/10 shadow-2xl bg-black overflow-hidden'
            : viewportMode === 'tablet'
            ? 'max-w-[820px] my-6 rounded-[32px] ring-1 ring-white/10 shadow-2xl bg-black overflow-hidden'
            : 'max-w-full'
        }`}
      >
        {/* Top Header */}
        <Header
          campus={DEFAULT_CAMPUS}
          onOpenSupabaseDocs={() => setIsSupabaseDocsOpen(true)}
          onOpenQuickRoles={() => setIsRolePickerOpen(true)}
          viewportMode={viewportMode}
          onSetViewportMode={setViewportMode}
        />

        {/* Content Area */}
        <main className="flex-1 flex items-center justify-center py-6 sm:py-12 px-4">
          {currentUser && currentSlide !== 8 ? (
            <DashboardPreview
              user={currentUser}
              onSignOut={handleSignOut}
              onSwitchRole={() => setIsRolePickerOpen(true)}
            />
          ) : (
            <SignInForm
              defaultIdentifier={prefillIdentifier}
              defaultPassword={prefillPassword}
              onSignInSuccess={handleSignInSuccess}
              onOpenBiometrics={() => setIsBiometricOpen(true)}
              onOpenForgotPassword={() => setIsForgotPasswordOpen(true)}
            />
          )}
        </main>

        {/* Bottom Footer */}
        <Footer
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          onPrevSlide={handlePrevSlide}
          onNextSlide={handleNextSlide}
        />
      </div>

      {/* Interactive Modals */}
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
    </div>
  );
}
