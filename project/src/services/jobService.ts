import { apiService, ApiResponse } from './api';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Mock data
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'Tech Corp',
    jobDescription: 'Build amazing user interfaces with React and TypeScript',
    qualifications: ['Bachelor\'s degree in Computer Science', '2+ years experience'],
    skillsRequired: ['React', 'TypeScript', 'CSS'],
    responsibilities: ['Develop UI components', 'Collaborate with designers'],
    requiredSkills: ['React', 'TypeScript', 'CSS'],
    postedDate: '2024-01-15',
    deadline: '2024-02-15',
    location: 'San Francisco, CA',
    salary: { min: 80000, max: 120000, currency: 'USD' },
    employmentType: 'full-time',
    experienceLevel: 'mid',
    department: 'Engineering',
    benefits: ['Health insurance', 'Remote work'],
    applicationCount: 25,
    status: 'active'
  },
  {
    id: '2',
    title: 'Backend Developer',
    company: 'StartupXYZ',
    jobDescription: 'Build scalable APIs and microservices',
    qualifications: ['Bachelor\'s degree', '3+ years experience'],
    skillsRequired: ['Node.js', 'Python', 'PostgreSQL'],
    responsibilities: ['Design APIs', 'Database optimization'],
    requiredSkills: ['Node.js', 'Python', 'PostgreSQL'],
    postedDate: '2024-01-10',
    deadline: '2024-02-10',
    location: 'New York, NY',
    salary: { min: 90000, max: 140000, currency: 'USD' },
    employmentType: 'full-time',
    experienceLevel: 'senior',
    department: 'Engineering',
    benefits: ['Health insurance', '401k'],
    applicationCount: 18,
    status: 'active'
  }
];

const mockJobStats = {
  totalJobs: 50,
  activeJobs: 35,
  totalApplications: 250,
  averageApplicationsPerJob: 7.1
};

interface Job {
  id: string;
  title: string;
  company: string;
  jobDescription: string;
  qualifications: string[];
  skillsRequired: string[];
  responsibilities: string[];
  requiredSkills: string[];
  postedDate: string;
  deadline: string;
  location?: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
  department?: string;
  benefits?: string[];
  applicationCount?: number;
  status: 'active' | 'closed' | 'draft';
}

interface JobFilters {
  search?: string;
  location?: string;
  employmentType?: string;
  experienceLevel?: string;
  department?: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  page?: number;
  limit?: number;
}

interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
}

interface CreateJobRequest {
  title: string;
  company: string;
  jobDescription: string;
  qualifications: string[];
  skillsRequired: string[];
  responsibilities: string[];
  deadline: string;
  location?: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
  department?: string;
  benefits?: string[];
}

class JobService {
  async getJobs(filters?: JobFilters): Promise<ApiResponse<JobsResponse>> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredJobs = [...mockJobs];
      
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredJobs = filteredJobs.filter(job => 
          job.title.toLowerCase().includes(searchTerm) ||
          job.company.toLowerCase().includes(searchTerm)
        );
      }
      
      return {
        success: true,
        data: {
          jobs: filteredJobs,
          total: filteredJobs.length,
          page: filters?.page || 1,
          totalPages: Math.ceil(filteredJobs.length / (filters?.limit || 10))
        }
      };
    }
    
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }

    const endpoint = `/jobs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiService.get<JobsResponse>(endpoint);
  }

  async getJobById(id: string): Promise<ApiResponse<Job>> {
    return apiService.get<Job>(`/jobs/${id}`);
  }

  async createJob(jobData: CreateJobRequest): Promise<ApiResponse<Job>> {
    return apiService.post<Job>('/jobs', jobData);
  }

  async updateJob(id: string, jobData: Partial<CreateJobRequest>): Promise<ApiResponse<Job>> {
    return apiService.put<Job>(`/jobs/${id}`, jobData);
  }

  async deleteJob(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`/jobs/${id}`);
  }

  async getJobsByCompany(companyId: string): Promise<ApiResponse<Job[]>> {
    return apiService.get<Job[]>(`/jobs/company/${companyId}`);
  }

  async getRecommendedJobs(userId: string): Promise<ApiResponse<Job[]>> {
    return apiService.get<Job[]>(`/jobs/recommended/${userId}`);
  }

  async searchJobs(query: string): Promise<ApiResponse<Job[]>> {
    return apiService.get<Job[]>(`/jobs/search?q=${encodeURIComponent(query)}`);
  }

  async getJobStats(): Promise<ApiResponse<{
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    averageApplicationsPerJob: number;
  }>> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        success: true,
        data: mockJobStats
      };
    }
    
    return apiService.get('/jobs/stats');
  }

  async toggleJobStatus(id: string): Promise<ApiResponse<Job>> {
    return apiService.patch<Job>(`/jobs/${id}/toggle-status`);
  }

  async getJobApplications(jobId: string): Promise<ApiResponse<any[]>> {
    return apiService.get<any[]>(`/jobs/${jobId}/applications`);
  }

  async getPopularSkills(): Promise<ApiResponse<{ skill: string; count: number }[]>> {
    return apiService.get('/jobs/popular-skills');
  }

  async getJobCategories(): Promise<ApiResponse<string[]>> {
    return apiService.get('/jobs/categories');
  }

  async getCompanies(): Promise<ApiResponse<{ id: string; name: string; jobCount: number }[]>> {
    return apiService.get('/jobs/companies');
  }
}

export const jobService = new JobService();
export type {
  Job,
  JobFilters,
  JobsResponse,
  CreateJobRequest,
};