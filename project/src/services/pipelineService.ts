import { apiService, ApiResponse } from './api';

interface PipelineStage {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'pending' | 'rejected';
  completedDate?: string;
  feedback?: string;
  icon?: React.ReactNode;
  order: number;
}

interface ApplicationPipeline {
  id: string;
  applicationId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  currentStage: number;
  stages: PipelineStage[];
  overallStatus: 'active' | 'rejected' | 'completed';
  lastUpdated: string;
}

interface PipelineUpdate {
  stageId: string;
  status: 'completed' | 'current' | 'pending' | 'rejected';
  feedback?: string;
  completedDate?: string;
}

interface PipelineStats {
  totalPipelines: number;
  activePipelines: number;
  completedPipelines: number;
  rejectedPipelines: number;
  averageCompletionTime: number;
  stageStats: {
    stageName: string;
    averageTime: number;
    completionRate: number;
  }[];
}

class PipelineService {
  async getMyPipelines(): Promise<ApiResponse<ApplicationPipeline[]>> {
    return apiService.get<ApplicationPipeline[]>('/pipelines/my');
  }

  async getPipelineById(id: string): Promise<ApiResponse<ApplicationPipeline>> {
    return apiService.get<ApplicationPipeline>(`/pipelines/${id}`);
  }

  async getPipelineByApplicationId(applicationId: string): Promise<ApiResponse<ApplicationPipeline>> {
    return apiService.get<ApplicationPipeline>(`/pipelines/application/${applicationId}`);
  }

  async createPipeline(applicationId: string): Promise<ApiResponse<ApplicationPipeline>> {
    return apiService.post<ApplicationPipeline>('/pipelines', { applicationId });
  }

  async updatePipelineStage(
    pipelineId: string,
    stageId: string,
    updates: PipelineUpdate
  ): Promise<ApiResponse<ApplicationPipeline>> {
    return apiService.patch<ApplicationPipeline>(`/pipelines/${pipelineId}/stages/${stageId}`, updates);
  }

  async advancePipelineStage(pipelineId: string, feedback?: string): Promise<ApiResponse<ApplicationPipeline>> {
    return apiService.post<ApplicationPipeline>(`/pipelines/${pipelineId}/advance`, { feedback });
  }

  async rejectPipeline(pipelineId: string, reason?: string): Promise<ApiResponse<ApplicationPipeline>> {
    return apiService.post<ApplicationPipeline>(`/pipelines/${pipelineId}/reject`, { reason });
  }

  async completePipeline(pipelineId: string, feedback?: string): Promise<ApiResponse<ApplicationPipeline>> {
    return apiService.post<ApplicationPipeline>(`/pipelines/${pipelineId}/complete`, { feedback });
  }

  async getPipelineStats(): Promise<ApiResponse<PipelineStats>> {
    return apiService.get<PipelineStats>('/pipelines/stats');
  }

  async getPipelinesByCompany(companyId: string): Promise<ApiResponse<ApplicationPipeline[]>> {
    return apiService.get<ApplicationPipeline[]>(`/pipelines/company/${companyId}`);
  }

  async getPipelinesByJob(jobId: string): Promise<ApiResponse<ApplicationPipeline[]>> {
    return apiService.get<ApplicationPipeline[]>(`/pipelines/job/${jobId}`);
  }

  async getDefaultStages(): Promise<ApiResponse<Omit<PipelineStage, 'status' | 'completedDate' | 'feedback'>[]>> {
    return apiService.get('/pipelines/default-stages');
  }

  async customizePipelineStages(
    pipelineId: string,
    stages: Omit<PipelineStage, 'status' | 'completedDate' | 'feedback'>[]
  ): Promise<ApiResponse<ApplicationPipeline>> {
    return apiService.put<ApplicationPipeline>(`/pipelines/${pipelineId}/stages`, { stages });
  }

  async addPipelineNote(pipelineId: string, note: string): Promise<ApiResponse<void>> {
    return apiService.post<void>(`/pipelines/${pipelineId}/notes`, { note });
  }

  async getPipelineNotes(pipelineId: string): Promise<ApiResponse<{ id: string; note: string; createdAt: string; createdBy: string }[]>> {
    return apiService.get(`/pipelines/${pipelineId}/notes`);
  }

  async scheduleInterview(
    pipelineId: string,
    stageId: string,
    interviewData: {
      type: string;
      scheduledDate: string;
      scheduledTime: string;
      duration: number;
      interviewer: {
        name: string;
        position: string;
        email?: string;
      };
      mode: 'online' | 'offline' | 'phone';
      location?: string;
      meetingLink?: string;
      phoneNumber?: string;
      instructions?: string;
    }
  ): Promise<ApiResponse<any>> {
    return apiService.post(`/pipelines/${pipelineId}/stages/${stageId}/interview`, interviewData);
  }

  async scheduleAssessment(
    pipelineId: string,
    stageId: string,
    assessmentData: {
      title: string;
      type: string;
      dueDate: string;
      duration: number;
      instructions?: string;
    }
  ): Promise<ApiResponse<any>> {
    return apiService.post(`/pipelines/${pipelineId}/stages/${stageId}/assessment`, assessmentData);
  }

  async getPipelineTimeline(pipelineId: string): Promise<ApiResponse<{
    event: string;
    description: string;
    timestamp: string;
    type: 'stage_change' | 'interview' | 'assessment' | 'note' | 'feedback';
  }[]>> {
    return apiService.get(`/pipelines/${pipelineId}/timeline`);
  }

  async exportPipelineData(pipelineId: string): Promise<ApiResponse<Blob>> {
    return apiService.get(`/pipelines/${pipelineId}/export`);
  }

  async bulkUpdatePipelines(
    updates: {
      pipelineId: string;
      stageId: string;
      updates: PipelineUpdate;
    }[]
  ): Promise<ApiResponse<ApplicationPipeline[]>> {
    return apiService.post<ApplicationPipeline[]>('/pipelines/bulk-update', { updates });
  }
}

export const pipelineService = new PipelineService();
export type {
  PipelineStage,
  ApplicationPipeline,
  PipelineUpdate,
  PipelineStats,
};