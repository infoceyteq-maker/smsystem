import React from 'react';
import { ArrowLeft, MoreHorizontal, Check } from 'lucide-react';
import { SchoolLogo } from '../common/SchoolLogo';

interface TeacherHeaderProps {
  currentStep: 1 | 2 | 3;
  onPrevStep: () => void;
  canGoBack: boolean;
  onExit?: () => void;
}

export const TeacherHeader: React.FC<TeacherHeaderProps> = ({
  currentStep,
  onPrevStep,
  canGoBack,
  onExit,
}) => {
  const stepTitles = {
    1: {
      label: 'Personal',
      subtitle: 'Your personal and identification details.',
    },
    2: {
      label: 'Professional',
      subtitle: 'Your academic designation and appointment history.',
    },
    3: {
      label: 'Review',
      subtitle: 'Review and verify all information before submission.',
    },
  };

  return (
    <div className="w-full select-none mb-6">
      {/* Top Bar with Navigation & Brand */}
      <div className="flex items-center justify-between py-2 mb-4">
        <button
          onClick={canGoBack ? onPrevStep : onExit}
          className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-xs transition"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <SchoolLogo size="sm" interactive={false} />
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-gray-900 leading-tight">
              Sri Sumangala College
            </span>
            <span className="text-[9px] font-semibold text-[#0B3C96]">
              KANDY · ESTD - 1934
            </span>
          </div>
        </div>

        <button
          onClick={onExit}
          className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-xs transition"
          title="Options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Title & Subtitle */}
      <div className="text-center sm:text-left mb-5">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
          <span className="text-[11px] font-bold text-[#007AFF] uppercase tracking-wider">
            Step {currentStep} of 3
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-[11px] text-gray-400 font-medium">Teacher Registration Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          {stepTitles[currentStep].label}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 font-normal">
          {stepTitles[currentStep].subtitle}
        </p>
      </div>

      {/* 3-Step Progress Indicator Bar */}
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map((step) => {
          const isDone = currentStep > step;
          const isCurrent = currentStep === step;

          return (
            <div key={step} className="flex flex-col gap-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isDone
                    ? 'bg-[#34C759]'
                    : isCurrent
                    ? 'bg-[#007AFF]'
                    : 'bg-gray-200'
                }`}
              />
              <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium">
                <span className={isCurrent ? 'text-gray-900 font-bold' : isDone ? 'text-[#34C759]' : ''}>
                  {step === 1 ? '1. Personal' : step === 2 ? '2. Professional' : '3. Review'}
                </span>
                {isDone && <Check className="w-3 h-3 text-[#34C759]" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
