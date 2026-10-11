export type GenderType = 'Female' | 'Male' | 'Other';

export interface TeacherRegistrationFormData {
  // Step 1: Personal Info
  photoUrl: string;
  firstName: string;
  lastName: string;
  nic: string;
  address: string;
  dob: string;
  gender: GenderType;
  phone: string;
  email: string;

  // Step 2: Professional Details
  designation: string;
  teacherGrade: string;
  subjectSpecialization: string;
  firstAppointmentDate: string;
  currentAppointmentDate: string;

  // Step 3: Confirmation
  agreedToTerms: boolean;
}

export interface TeacherRegistrationResult {
  success: boolean;
  staffId: string;
  fullName: string;
  nic: string;
  designation: string;
  teacherGrade: string;
  subjectSpecialization: string;
  submittedAt: string;
  status: 'pending';
  message: string;
}
