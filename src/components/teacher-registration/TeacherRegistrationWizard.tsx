import React, { useState } from 'react';
import { TeacherHeader } from './TeacherHeader';
import { Step1Personal } from './Step1Personal';
import { Step2Professional } from './Step2Professional';
import { Step3Review } from './Step3Review';
import { TeacherRegistrationSuccess } from './TeacherRegistrationSuccess';
import { 
  TeacherRegistrationFormData, 
  TeacherRegistrationResult 
} from '../../types/teacherRegistration';
import { submitTeacherRegistration } from '../../actions/teacherRegistrationActions';
import confetti from 'canvas-confetti';

interface TeacherRegistrationWizardProps {
  onExit?: () => void;
  onGoToDashboard?: () => void;
}

const INITIAL_TEACHER_FORM: TeacherRegistrationFormData = {
  // Step 1: Personal Info
  photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
  firstName: 'Amaya',
  lastName: 'Fernando',
  nic: '198854203190',
  address: 'No. 42, Peradeniya Road, Kandy',
  dob: '14 August 1988',
  gender: 'Female',
  phone: '+94 77 456 7890',
  email: 'amaya.fernando@srisumangala.edu.lk',

  // Step 2: Professional Details
  designation: 'Senior Faculty Lecturer',
  teacherGrade: 'Grade 1 - Class I',
  subjectSpecialization: 'Advanced Physics & Mechanics',
  firstAppointmentDate: '02 January 2015',
  currentAppointmentDate: '15 January 2022',

  // Step 3: Confirmation
  agreedToTerms: true,
};

export const TeacherRegistrationWizard: React.FC<TeacherRegistrationWizardProps> = ({
  onExit,
  onGoToDashboard,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<TeacherRegistrationFormData>(INITIAL_TEACHER_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<TeacherRegistrationResult | null>(null);

  const handleUpdateForm = (fields: Partial<TeacherRegistrationFormData>) => {
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
      const result = await submitTeacherRegistration(formData);
      setSubmissionResult(result);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#007AFF', '#34C759', '#BF5AF2'],
        });
      } catch (_) {}
    } catch (error) {
      console.error('Teacher registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_TEACHER_FORM);
    setCurrentStep(1);
    setSubmissionResult(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {submissionResult ? (
        <TeacherRegistrationSuccess
          result={submissionResult}
          onReset={handleReset}
          onGoToDashboard={onGoToDashboard || onExit}
        />
      ) : (
        <div className="space-y-6">
          <TeacherHeader
            currentStep={currentStep}
            onPrevStep={handlePrevStep}
            canGoBack={currentStep > 1}
            onExit={onExit}
          />

          {currentStep === 1 && (
            <Step1Personal
              data={formData}
              onChange={handleUpdateForm}
              onNext={handleNextStep}
            />
          )}

          {currentStep === 2 && (
            <Step2Professional
              data={formData}
              onChange={handleUpdateForm}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
            />
          )}

          {currentStep === 3 && (
            <Step3Review
              data={formData}
              onChange={handleUpdateForm}
              onSubmit={handleSubmit}
              onPrev={handlePrevStep}
              onJumpToStep={(step) => setCurrentStep(step as 1 | 2 | 3)}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      )}
    </div>
  );
};
