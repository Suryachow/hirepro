import React, { createContext, useContext, useState, useEffect } from 'react';
import { FileText, User, Code, Video, Trophy } from 'lucide-react';
import { pipelineService } from '../services/pipelineService';

interface PipelineStage {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'pending' | 'rejected';
  completedDate?: string;
  feedback?: string;
  icon: React.ReactNode;
}

interface ApplicationPipeline {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  currentStage: number;
  stages: PipelineStage[];
  overallStatus: 'active' | 'rejected' | 'completed';
}

interface PipelineContextType {
  pipelines: ApplicationPipeline[];
  loading: boolean;
  error: string | null;
  addPipeline: (pipeline: Omit<ApplicationPipeline, 'id'>) => void;
  updatePipelineStage: (pipelineId: string, stageId: string, updates: Partial<PipelineStage>) => void;
  refreshPipelines: () => Promise<void>;
}

const PipelineContext = createContext<PipelineContextType | null>(null);

// Helper function to create stage icons
const getStageIcon = (stageId: string) => {
  switch (stageId) {
    case 'apply':
      return <FileText className="w-5 h-5" />;
    case 'aptitude_basic_coding':
      return <User className="w-5 h-5" />;
    case 'coding_r1':
    case 'coding_r2':
      return <Code className="w-5 h-5" />;
    case 'mr_tr_1':
    case 'mr_tr_2':
    case 'hr_1':
      return <Video className="w-5 h-5" />;
    case 'hr_2':
      return <Trophy className="w-5 h-5" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
};

// Helper function to create default 8-stage pipeline
const createDefaultStages = (): PipelineStage[] => [
  {
    id: 'apply',
    name: 'Apply',
    status: 'pending',
    icon: getStageIcon('apply')
  },
  {
    id: 'aptitude_basic_coding',
    name: 'Aptitude + Basic coding',
    status: 'pending',
    icon: getStageIcon('aptitude_basic_coding')
  },
  {
    id: 'coding_r1',
    name: 'Coding R1',
    status: 'pending',
    icon: getStageIcon('coding_r1')
  },
  {
    id: 'coding_r2',
    name: 'Coding R2',
    status: 'pending',
    icon: getStageIcon('coding_r2')
  },
  {
    id: 'mr_tr_1',
    name: 'MR+TR-1',
    status: 'pending',
    icon: getStageIcon('mr_tr_1')
  },
  {
    id: 'mr_tr_2',
    name: 'MR+TR-2',
    status: 'pending',
    icon: getStageIcon('mr_tr_2')
  },
  {
    id: 'hr_1',
    name: 'HR-1',
    status: 'pending',
    icon: getStageIcon('hr_1')
  },
  {
    id: 'hr_2',
    name: 'HR-2',
    status: 'pending',
    icon: getStageIcon('hr_2')
  }
];

export const PipelineProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [pipelines, setPipelines] = useState<ApplicationPipeline[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch pipelines from API with fallback to mock data
  const fetchPipelines = async (): Promise<ApplicationPipeline[]> => {
    try {
      const response = await pipelineService.getPipelines();
      if (response.success && response.data) {
        return response.data;
      }
    } catch (error) {
      console.warn('Failed to fetch pipelines from API, using fallback data:', error);
    }
    
    // Fallback mock data for development
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockPipelines: ApplicationPipeline[] = [
          {
            id: '1',
            jobTitle: 'Frontend Developer',
            company: 'TechCorp Inc.',
            appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            currentStage: 3,
            overallStatus: 'active',
            stages: createDefaultStages().map((stage, index) => ({
              ...stage,
              status: index < 2 ? 'completed' : index === 2 ? 'current' : 'pending',
              completedDate: index < 2 ? new Date(Date.now() - (5 - index) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
              feedback: index === 1 ? 'Good performance in logical reasoning and basic coding skills.' : undefined
            }))
          },
          {
            id: '2',
            jobTitle: 'Backend Engineer',
            company: 'DataFlow Solutions',
            appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            currentStage: 6,
            overallStatus: 'active',
            stages: createDefaultStages().map((stage, index) => ({
              ...stage,
              status: index < 5 ? 'completed' : index === 5 ? 'current' : 'pending',
              completedDate: index < 5 ? new Date(Date.now() - (7 - index) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
              feedback: index === 4 ? 'Great technical discussion, showed deep understanding.' : undefined
            }))
          },
          {
            id: '3',
            jobTitle: 'Full Stack Developer',
            company: 'StartupXYZ',
            appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            currentStage: 2,
            overallStatus: 'rejected',
            stages: createDefaultStages().map((stage, index) => ({
              ...stage,
              status: index === 0 ? 'completed' : index === 1 ? 'rejected' : 'pending',
              completedDate: index === 0 ? new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : 
                           index === 1 ? new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
              feedback: index === 1 ? 'Unfortunately, we decided to move forward with other candidates.' : undefined
            }))
          },
          {
            id: '4',
            jobTitle: 'Software Engineer',
            company: 'InnovateTech',
            appliedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            currentStage: 8,
            overallStatus: 'completed',
            stages: createDefaultStages().map((stage, index) => ({
              ...stage,
              status: 'completed',
              completedDate: new Date(Date.now() - (15 - index * 2) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              feedback: index === 7 ? 'Congratulations! We are pleased to extend an offer.' : 
                       index === 6 ? 'Great cultural fit, team is excited to work with you.' : 
                       index === 4 ? 'Excellent technical knowledge and communication.' : undefined
            }))
          }
        ];
        resolve(mockPipelines);
      }, 1000); // Simulate network delay
    });
  };

  const refreshPipelines = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPipelines();
      setPipelines(data);
    } catch (err) {
      setError('Failed to fetch pipeline data');
      console.error('Error fetching pipelines:', err);
    } finally {
      setLoading(false);
    }
  };

  const addPipeline = async (pipeline: Omit<ApplicationPipeline, 'id'>) => {
    try {
      const response = await pipelineService.createPipeline(pipeline);
      
      if (response.success && response.data) {
        setPipelines(prev => [...prev, response.data]);
        return response.data;
      }
    } catch (error) {
      console.warn('Failed to create pipeline via API, using fallback:', error);
    }
    
    // Fallback to local creation
    const newPipeline: ApplicationPipeline = {
      ...pipeline,
      id: Date.now().toString(),
      stages: pipeline.stages.length > 0 ? pipeline.stages : createDefaultStages()
    };
    setPipelines(prev => [...prev, newPipeline]);
    return newPipeline;
  };

  const updatePipelineStage = async (pipelineId: string, stageId: string, updates: Partial<PipelineStage>) => {
    try {
      const response = await pipelineService.updatePipelineStage(pipelineId, stageId, updates);
      
      if (response.success && response.data) {
        setPipelines(prev => prev.map(pipeline => 
          pipeline.id === pipelineId ? response.data : pipeline
        ));
        return;
      }
    } catch (error) {
      console.warn('Failed to update pipeline stage via API, using fallback:', error);
    }
    
    // Fallback to local update
    setPipelines(prev => prev.map(pipeline => {
      if (pipeline.id === pipelineId) {
        const updatedStages = pipeline.stages.map(stage => 
          stage.id === stageId ? { ...stage, ...updates } : stage
        );
        
        // Update current stage and overall status based on stage updates
        const currentStageIndex = updatedStages.findIndex(stage => stage.status === 'current');
        const completedStages = updatedStages.filter(stage => stage.status === 'completed').length;
        const hasRejected = updatedStages.some(stage => stage.status === 'rejected');
        
        let overallStatus: 'active' | 'rejected' | 'completed' = 'active';
        if (hasRejected) {
          overallStatus = 'rejected';
        } else if (completedStages === updatedStages.length) {
          overallStatus = 'completed';
        }
        
        return {
          ...pipeline,
          stages: updatedStages,
          currentStage: currentStageIndex >= 0 ? currentStageIndex + 1 : completedStages + 1,
          overallStatus
        };
      }
      return pipeline;
    }));
  };

  // Load pipelines on mount
  useEffect(() => {
    refreshPipelines();
  }, []);

  return (
    <PipelineContext.Provider value={{
      pipelines,
      loading,
      error,
      addPipeline,
      updatePipelineStage,
      refreshPipelines
    }}>
      {children}
    </PipelineContext.Provider>
  );
};

export const usePipeline = () => {
  const context = useContext(PipelineContext);
  if (!context) {
    throw new Error('usePipeline must be used within a PipelineProvider');
  }
  return context;
};

export type { ApplicationPipeline, PipelineStage };