import React, { useState } from 'react';
import { RegistrationHeader } from './RegistrationHeader';
import { Step1BasicInfo } from './Step1BasicInfo';
import { Step2Parents } from './Step2Parents';
import { Step3Academic } from './Step3Academic';
import { RegistrationSuccess } from './RegistrationSuccess';
import { 
  StudentRegistrationFormData, 
  StudentRegistrationResult 
} from '../../types/studentRegistration';
import { submitStudentRegistration } from '../../actions/studentRegistrationActions';
import confetti from 'canvas-confetti';

interface StudentRegistrationWizardProps {
  onExit?: () => void;
  onGoToDashboard?: () => void;
}

const INITIAL_FORM_STATE: StudentRegistrationFormData = {
  // Step 1: Basic Info (matching Stu 1.png)
  admissionNo: '2026/0148',
  fullName: 'K. Senuri Perera',
  dob: '18 January 2010',
  ageAtAdmission: 16,

  // Step 2: Parents (matching Stu 2.png)
  fatherName: 'Nimal Perera',
  fatherNic: '197812301456',
  fatherPhone: '+94 77 234 5678',
  motherName: 'Dilani Perera',
  motherNic: '198156701289',
  motherPhone: '+94 71 345 6789',

  // Step 3: Academic & Extras (matching stu 3.png)
  grade: 'Grade 12',
  classSection: '12-A',
  olIndexNo: '2025123486',
  stream: 'Science',
  sportsInterest: true,
  societiesInterest: false,
};

export const StudentRegistrationWizard: React.FC<StudentRegistrationWizardProps> = ({
  onExit,
  onGoToDashboard,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<StudentRegistrationFormData>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<StudentRegistrationResult | null>(null);

  const handleUpdateForm = (fields: Partial<StudentRegistrationFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitStudentRegistration(formData);
      setSubmissionResult(result);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#007AFF', '#34C759', '#FFD60A'],
        });
      } catch (_) {}
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setCurrentStep(1);
    setSubmissionResult(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {submissionResult ? (
        <RegistrationSuccess
          result={submissionResult}
          onReset={handleReset}
          onGoToDashboard={onGoToDashboard || onExit}
        />
      ) : (
        <div className="space-y-6">
          <RegistrationHeader
            currentStep={currentStep}
            onPrevStep={handlePrevStep}
            canGoBack={currentStep > 1}
            onExit={onExit}
          />

          {currentStep === 1 && (
            <Step1BasicInfo
              data={formData}
              onChange={handleUpdateForm}
              onNext={handleNextStep}
            />
          )}

          {currentStep === 2 && (
            <Step2Parents
              data={formData}
              onChange={handleUpdateForm}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
            />
          )}

          {currentStep === 3 && (
            <Step3Academic
              data={formData}
              onChange={handleUpdateForm}
              onSubmit={handleSubmit}
              onPrev={handlePrevStep}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      )}
    </div>
  );
};
