import { apiService, ApiResponse } from './api';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Mock application stats
const mockApplicationStats = {
  total: 15,
  pending: 3,
  underReview: 5,
  shortlisted: 2,
  rejected: 4,
  accepted: 1
};

// Mock assessments data
const mockAssessments: Assessment[] = [
  {
    id: '1',
    applicationId: '1',
    jobTitle: 'Frontend Developer',
    company: 'Tech Corp',
    companyLogo: 'https://via.placeholder.com/40',
    type: 'coding',
    status: 'pending',
    timeLimit: 120,
    totalQuestions: 15,
    completedQuestions: 0,
    score: null,
    createdAt: '2024-01-16T10:00:00Z',
    dueDate: '2024-01-20T23:59:59Z',
    instructions: 'Complete the coding assessment within the time limit.',
    questions: []
  },
  {
    id: '2',
    applicationId: '2',
    jobTitle: 'Backend Developer',
    company: 'StartupXYZ',
    companyLogo: 'https://via.placeholder.com/40',
    type: 'technical',
    status: 'completed',
    timeLimit: 90,
    totalQuestions: 20,
    completedQuestions: 20,
    score: 85,
    createdAt: '2024-01-12T09:00:00Z',
    dueDate: '2024-01-15T23:59:59Z',
    completedAt: '2024-01-14T14:30:00Z',
    instructions: 'Technical assessment covering backend concepts.',
    feedback: 'Good understanding of backend principles.',
    questions: []
  }
];

// Mock interviews data
const mockInterviews: Interview[] = [
  {
    id: '1',
    applicationId: '1',
    jobTitle: 'Frontend Developer',
    company: 'Tech Corp',
    companyLogo: 'https://via.placeholder.com/40',
    type: 'technical',
    mode: 'online',
    status: 'scheduled',
    scheduledDate: '2024-01-25',
    scheduledTime: '14:00',
    duration: 60,
    interviewer: {
      name: 'Sarah Johnson',
      position: 'Senior Frontend Developer',
      email: 'sarah.johnson@techcorp.com'
    },
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    instructions: 'Please join 5 minutes early. Have your IDE ready for coding questions.'
  },
  {
    id: '2',
    applicationId: '2',
    jobTitle: 'Backend Developer',
    company: 'StartupXYZ',
    companyLogo: 'https://via.placeholder.com/40',
    type: 'hr',
    mode: 'online',
    status: 'completed',
    scheduledDate: '2024-01-18',
    scheduledTime: '10:00',
    duration: 45,
    interviewer: {
      name: 'Mike Chen',
      position: 'HR Manager',
      email: 'mike.chen@startupxyz.com'
    },
    meetingLink: 'https://zoom.us/j/123456789',
    instructions: 'Behavioral interview focusing on cultural fit.',
    feedback: {
      rating: 4,
      comments: 'Great communication skills and cultural alignment.'
    }
  }
];

// Mock applications data
const mockApplications: Application[] = [
  {
    id: '1',
    jobId: '1',
    userId: 'student1',
    jobTitle: 'Frontend Developer',
    company: 'Tech Corp',
    appliedDate: '2024-01-15',
    status: 'under_review',
    atsScore: 85,
    coverLetter: 'I am excited to apply for this position...',
    resumeFileName: 'john_doe_resume.pdf'
  },
  {
    id: '2',
    jobId: '2',
    userId: 'student1',
    jobTitle: 'Backend Developer',
    company: 'StartupXYZ',
    appliedDate: '2024-01-10',
    status: 'shortlisted',
    atsScore: 92,
    coverLetter: 'With my experience in Node.js and Python...',
    resumeFileName: 'john_doe_resume.pdf'
  },
  {
    id: '3',
    jobId: '3',
    userId: 'student1',
    jobTitle: 'Full Stack Developer',
    company: 'Innovation Labs',
    appliedDate: '2024-01-08',
    status: 'pending',
    atsScore: 78,
    resumeFileName: 'john_doe_resume.pdf'
  }
];

interface Application {
  id: string;
  jobId: string;
  userId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'pending' | 'under_review' | 'shortlisted' | 'rejected' | 'accepted';
  atsScore: number;
  coverLetter?: string;
  resumeFileName: string;
  resumeUrl?: string;
  feedback?: string;
  notes?: string;
}

interface CreateApplicationRequest {
  jobId: string;
  coverLetter?: string;
  resumeFile?: File;
}

interface Assessment {
  id: string;
  applicationId: string;
  title: string;
  company: string;
  jobTitle: string;
  type: 'technical' | 'aptitude' | 'personality' | 'coding' | 'domain' | 'basic_coding' | 'coding_r1' | 'coding_r2' | 'aptitude_basic_coding';
  status: 'pending' | 'in_progress' | 'completed' | 'expired' | 'scheduled';
  dueDate: string;
  duration: number;
  score?: number;
  maxScore?: number;
  startedAt?: string;
  completedAt?: string;
  instructions?: string;
  feedback?: string;
  scheduledAt?: string;
  questions?: any[];
  answers?: any[];
}

interface Interview {
  id: string;
  applicationId: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  type: 'technical' | 'hr' | 'behavioral' | 'final' | 'group' | 'case_study' | 'mr_tr_1' | 'mr_tr_2' | 'hr_1' | 'hr_2';
  mode: 'online' | 'offline' | 'phone';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'in_progress' | 'missed';
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  interviewer: {
    name: string;
    position: string;
    email?: string;
  };
  location?: string;
  meetingLink?: string;
  phoneNumber?: string;
  instructions?: string;
  feedback?: {
    rating: number;
    comments: string;
    strengths: string[];
    improvements: string[];
  };
  result?: 'selected' | 'rejected' | 'pending';
  nextRound?: {
    type: string;
    scheduledDate?: string;
  };
  round: number;
  totalRounds: number;
  preparationMaterials?: {
    title: string;
    type: 'document' | 'video' | 'link';
    url: string;
  }[];
  technicalRequirements?: string[];
}

interface CodingChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'algorithms' | 'data-structures' | 'frontend' | 'backend' | 'fullstack' | 'database';
  language: string[];
  timeLimit: number;
  maxScore: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'expired';
  startDate: string;
  endDate: string;
  participants: number;
  myScore?: number;
  myRank?: number;
  totalParticipants?: number;
  tags: string[];
  problemStatement?: string;
  constraints?: string[];
  examples?: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  submittedAt?: string;
  executionTime?: number;
  memoryUsed?: number;
}

class ApplicationService {
  // Applications
  async getMyApplications(): Promise<ApiResponse<Application[]>> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: mockApplications
      };
    }
    
    try {
      return await apiService.get<Application[]>('/applications/my');
    } catch (error) {
      console.warn('Failed to load applications from API, using mock data:', error);
      return {
        success: true,
        data: mockApplications
      };
    }
  }

  async getApplicationById(id: string): Promise<ApiResponse<Application>> {
    return apiService.get<Application>(`/applications/${id}`);
  }

  async createApplication(applicationData: CreateApplicationRequest): Promise<ApiResponse<Application>> {
    const formData = new FormData();
    formData.append('jobId', applicationData.jobId);
    if (applicationData.coverLetter) {
      formData.append('coverLetter', applicationData.coverLetter);
    }
    if (applicationData.resumeFile) {
      formData.append('resume', applicationData.resumeFile);
    }

    return apiService.post<Application>('/applications', formData);
  }

  async withdrawApplication(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`/applications/${id}`);
  }

  async getApplicationStats(): Promise<ApiResponse<{
    total: number;
    pending: number;
    underReview: number;
    shortlisted: number;
    rejected: number;
    accepted: number;
  }>> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        success: true,
        data: mockApplicationStats
      };
    }
    
    return apiService.get('/applications/stats');
  }

  // Assessments
  async getMyAssessments(): Promise<ApiResponse<Assessment[]>> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: mockAssessments
      };
    }

    try {
      return await apiService.get<Assessment[]>('/assessments/my');
    } catch (error) {
      console.warn('Failed to load assessments from API, using mock data:', error);
      return {
        success: true,
        data: mockAssessments
      };
    }
  }

  async getAssessmentById(id: string): Promise<ApiResponse<Assessment>> {
    return apiService.get<Assessment>(`/assessments/${id}`);
  }

  async startAssessment(id: string): Promise<ApiResponse<Assessment>> {
    return apiService.post<Assessment>(`/assessments/${id}/start`);
  }

  async submitAssessment(id: string, answers: any[]): Promise<ApiResponse<Assessment>> {
    return apiService.post<Assessment>(`/assessments/${id}/submit`, { answers });
  }

  async getAssessmentQuestions(id: string): Promise<ApiResponse<any[]>> {
    return apiService.get<any[]>(`/assessments/${id}/questions`);
  }

  // Interviews
  async getMyInterviews(): Promise<ApiResponse<Interview[]>> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: mockInterviews
      };
    }

    try {
      return await apiService.get<Interview[]>('/interviews/my');
    } catch (error) {
      console.warn('Failed to load interviews from API, using mock data:', error);
      return {
        success: true,
        data: mockInterviews
      };
    }
  }

  async getInterviewById(id: string): Promise<ApiResponse<Interview>> {
    return apiService.get<Interview>(`/interviews/${id}`);
  }

  async rescheduleInterview(id: string, newDate: string, newTime: string): Promise<ApiResponse<Interview>> {
    return apiService.post<Interview>(`/interviews/${id}/reschedule`, {
      scheduledDate: newDate,
      scheduledTime: newTime,
    });
  }

  async joinInterview(id: string): Promise<ApiResponse<{ meetingLink: string }>> {
    return apiService.post<{ meetingLink: string }>(`/interviews/${id}/join`);
  }

  async submitInterviewFeedback(id: string, feedback: any): Promise<ApiResponse<void>> {
    return apiService.post<void>(`/interviews/${id}/feedback`, feedback);
  }

  // Coding Challenges
  async getCodingChallenges(): Promise<ApiResponse<CodingChallenge[]>> {
    return apiService.get<CodingChallenge[]>('/coding-challenges');
  }

  async getCodingChallengeById(id: string): Promise<ApiResponse<CodingChallenge>> {
    return apiService.get<CodingChallenge>(`/coding-challenges/${id}`);
  }

  async startCodingChallenge(id: string): Promise<ApiResponse<CodingChallenge>> {
    return apiService.post<CodingChallenge>(`/coding-challenges/${id}/start`);
  }

  async submitCodingChallenge(id: string, solution: string, language: string): Promise<ApiResponse<CodingChallenge>> {
    return apiService.post<CodingChallenge>(`/coding-challenges/${id}/submit`, {
      solution,
      language,
    });
  }

  async getCodingChallengeLeaderboard(id: string): Promise<ApiResponse<any[]>> {
    return apiService.get<any[]>(`/coding-challenges/${id}/leaderboard`);
  }

  // File uploads
  async uploadResume(file: File): Promise<ApiResponse<{ url: string; filename: string }>> {
    const formData = new FormData();
    formData.append('resume', file);
    return apiService.post<{ url: string; filename: string }>('/upload/resume', formData);
  }

  async calculateATSScore(jobId: string, resumeFile: File): Promise<ApiResponse<{ score: number; analysis: any }>> {
    const formData = new FormData();
    formData.append('jobId', jobId);
    formData.append('resume', resumeFile);
    return apiService.post<{ score: number; analysis: any }>('/applications/ats-score', formData);
  }
}

export const applicationService = new ApplicationService();
export type {
  Application,
  CreateApplicationRequest,
  Assessment,
  Interview,
  CodingChallenge,
};