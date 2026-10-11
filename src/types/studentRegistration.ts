export type AcademicStream = 'Science' | 'Commerce' | 'Arts' | 'Technology';

export interface StudentRegistrationFormData {
  // Step 1: Basic Info
  admissionNo: string;
  fullName: string;
  dob: string;
  ageAtAdmission: number;

  // Step 2: Parents / Guardians
  fatherName: string;
  fatherNic: string;
  fatherPhone: string;
  motherName: string;
  motherNic: string;
  motherPhone: string;

  // Step 3: Academic & Extracurriculars
  grade: string;
  classSection: string;
  olIndexNo: string;
  stream: AcademicStream;
  sportsInterest: boolean;
  societiesInterest: boolean;
}

export interface StudentRegistrationResult {
  success: boolean;
  registrationId: string;
  admissionNo: string;
  fullName: string;
  submittedAt: string;
  status: 'pending';
  grade: string;
  classSection: string;
  stream: AcademicStream;
  message: string;
}
