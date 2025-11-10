export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin' | 'super-admin';
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  profile?: {
    // Student profile fields
    phone?: string;
    skills?: string[];
    experience?: string;
    education?: string;
    resumeUrl?: string;
    
    // Admin profile fields
    company?: string;
    jobTitle?: string;
    department?: string;
    
    // Super Admin profile fields
    twoFactorEnabled?: boolean;
    inviteCode?: string;
    permissions?: string[];
  };
}

export interface Student extends User {
  role: 'student';
  profile?: StudentProfile;
  applications: Application[];
}

export interface Admin extends User {
  role: 'admin';
  company: string;
  jobPostings: JobPosting[];
}

export interface SuperAdmin extends User {
  role: 'super-admin';
  permissions: string[];
  twoFactorEnabled: boolean;
}

export interface StudentProfile {
  phone?: string;
  location?: string;
  resumeUrl?: string;
  skills: string[];
  experience: string;
  education: Education[];
  portfolio?: string;
  linkedin?: string;
  github?: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  skills: string[];
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary?: string;
  posted: Date;
  deadline: Date;
  status: 'active' | 'paused' | 'closed';
  adminId: string;
  applications: Application[];
}

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  status: ApplicationStatus;
  appliedAt: Date;
  resumeUrl: string;
  coverLetter?: string;
  aiScore?: number;
  feedback?: string;
  stages: ApplicationStage[];
  currentStage: number;
}

export type ApplicationStatus = 
  | 'applied' 
  | 'screening' 
  | 'assessment' 
  | 'coding-challenge' 
  | 'interview-1' 
  | 'interview-2' 
  | 'hr-interview' 
  | 'final-interview' 
  | 'offer' 
  | 'accepted' 
  | 'rejected';

export interface ApplicationStage {
  stage: ApplicationStatus;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  completedAt?: Date;
  score?: number;
  feedback?: string;
  scheduledAt?: Date;
}

export interface Assessment {
  id: string;
  type: 'aptitude' | 'coding' | 'technical';
  title: string;
  duration: number;
  questions: Question[];
  passingScore: number;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'coding' | 'text';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  points: number;
  timeLimit?: number;
}

export interface Interview {
  id: string;
  applicationId: string;
  type: 'technical' | 'managerial' | 'hr' | 'final';
  scheduledAt: Date;
  duration: number;
  interviewers: string[];
  meetingLink?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  feedback?: string;
  score?: number;
}

export interface OfferLetter {
  id: string;
  applicationId: string;
  position: string;
  salary: number;
  startDate: Date;
  benefits: string[];
  pdfUrl?: string;
  status: 'draft' | 'sent' | 'accepted' | 'declined';
  sentAt?: Date;
  respondedAt?: Date;
}