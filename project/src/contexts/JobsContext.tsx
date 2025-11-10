import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Job } from '../types';
import { jobService } from '../services/jobService';

interface JobsContextType {
  jobs: Job[];
  addJob: (job: Omit<Job, 'id' | 'postedDate'>) => Promise<Job>;
  loading: boolean;
  error: string | null;
  loadJobs: () => Promise<void>;
}

const JobsContext = createContext<JobsContextType | null>(null);

export const JobsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load jobs on component mount
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobService.getJobs();
      if (response.success && response.data) {
        setJobs(response.data.jobs);
      }
    } catch (error) {
      console.warn('Failed to load jobs from API:', error);
      setError('Failed to load jobs');
      // Keep empty array as fallback
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const addJob = async (jobData: Omit<Job, 'id' | 'postedDate'>) => {
    try {
      const response = await jobService.createJob(jobData);
      if (response.success && response.data) {
        setJobs(prev => [...prev, response.data]);
        return response.data;
      }
    } catch (error) {
      console.warn('Failed to create job via API, using fallback:', error);
      // Fallback to local creation
      const newJob: Job = {
        ...jobData,
        id: Date.now().toString(),
        postedDate: new Date().toISOString(),
      };
      setJobs(prev => [...prev, newJob]);
      return newJob;
    }
  };

  return (
    <JobsContext.Provider value={{ jobs, addJob, loading, error, loadJobs }}>
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};