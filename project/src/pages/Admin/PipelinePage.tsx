import React, { useState, useEffect } from 'react';
import { Clock, Users, ChevronRight, Calendar, Star, Filter, Search, Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Application, JobPosting, ApplicationStatus } from '../../types';

interface PipelineStage {
  id: ApplicationStatus;
  name: string;
  description: string;
  color: string;
  icon: React.ReactNode;
}

interface CandidateInPipeline {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  jobId: string;
  currentStage: ApplicationStatus;
  appliedAt: Date;
  aiScore?: number;
  daysInStage: number;
  avatar?: string;
  application: Application;
}

const PipelinePage: React.FC = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<CandidateInPipeline[]>([]);
  const [selectedStage, setSelectedStage] = useState<ApplicationStatus | 'all'>('all');
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);

  const pipelineStages: PipelineStage[] = [
    {
      id: 'applied',
      name: 'Applied',
      description: 'Initial application received',
      color: 'bg-blue-500',
      icon: <Users className="h-4 w-4" />
    },
    {
      id: 'screening',
      name: 'Screening',
      description: 'Resume and profile review',
      color: 'bg-yellow-500',
      icon: <Eye className="h-4 w-4" />
    },
    {
      id: 'assessment',
      name: 'Assessment',
      description: 'Skills and aptitude testing',
      color: 'bg-purple-500',
      icon: <Star className="h-4 w-4" />
    },
    {
      id: 'coding-challenge',
      name: 'Coding Challenge',
      description: 'Technical coding assessment',
      color: 'bg-indigo-500',
      icon: <AlertCircle className="h-4 w-4" />
    },
    {
      id: 'interview-1',
      name: 'Technical Interview',
      description: 'First round technical interview',
      color: 'bg-orange-500',
      icon: <Calendar className="h-4 w-4" />
    },
    {
      id: 'interview-2',
      name: 'Manager Interview',
      description: 'Second round with hiring manager',
      color: 'bg-pink-500',
      icon: <Calendar className="h-4 w-4" />
    },
    {
      id: 'hr-interview',
      name: 'HR Interview',
      description: 'HR and culture fit interview',
      color: 'bg-teal-500',
      icon: <Calendar className="h-4 w-4" />
    },
    {
      id: 'final-interview',
      name: 'Final Interview',
      description: 'Final round with leadership',
      color: 'bg-red-500',
      icon: <Calendar className="h-4 w-4" />
    },
    {
      id: 'offer',
      name: 'Offer',
      description: 'Offer extended to candidate',
      color: 'bg-green-500',
      icon: <CheckCircle className="h-4 w-4" />
    },
    {
      id: 'accepted',
      name: 'Accepted',
      description: 'Offer accepted by candidate',
      color: 'bg-emerald-500',
      icon: <CheckCircle className="h-4 w-4" />
    },
    {
      id: 'rejected',
      name: 'Rejected',
      description: 'Application rejected',
      color: 'bg-gray-500',
      icon: <XCircle className="h-4 w-4" />
    }
  ];

  useEffect(() => {
    // Mock data - In real app, this would come from API
    const mockJobPostings: JobPosting[] = [
      {
        id: '1',
        title: 'Frontend Developer',
        company: 'TechCorp',
        description: 'Build amazing user interfaces',
        requirements: ['React', 'TypeScript'],
        skills: ['React', 'TypeScript', 'CSS'],
        location: 'Remote',
        type: 'full-time',
        salary: '$80,000 - $120,000',
        posted: new Date('2024-01-15'),
        deadline: new Date('2024-02-15'),
        status: 'active',
        adminId: user?.id || '',
        applications: []
      },
      {
        id: '2',
        title: 'Backend Developer',
        company: 'DataSoft',
        description: 'Build scalable APIs',
        requirements: ['Node.js', 'MongoDB'],
        skills: ['Node.js', 'MongoDB', 'Express'],
        location: 'New York',
        type: 'full-time',
        salary: '$90,000 - $130,000',
        posted: new Date('2024-01-20'),
        deadline: new Date('2024-02-20'),
        status: 'active',
        adminId: user?.id || '',
        applications: []
      },
      {
        id: '3',
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        description: 'Work on cutting-edge projects',
        requirements: ['React', 'Node.js', 'AWS'],
        skills: ['React', 'Node.js', 'AWS', 'Docker'],
        location: 'San Francisco',
        type: 'full-time',
        salary: '$100,000 - $150,000',
        posted: new Date('2024-01-25'),
        deadline: new Date('2024-02-25'),
        status: 'active',
        adminId: user?.id || '',
        applications: []
      }
    ];

    const mockApplications: Application[] = [
      {
        id: 'app1',
        jobId: '1',
        studentId: '1',
        status: 'interview-1',
        appliedAt: new Date('2024-01-16'),
        resumeUrl: '/resumes/john-smith.pdf',
        aiScore: 85,
        stages: [],
        currentStage: 4
      },
      {
        id: 'app2',
        jobId: '2',
        studentId: '1',
        status: 'screening',
        appliedAt: new Date('2024-01-21'),
        resumeUrl: '/resumes/john-smith.pdf',
        stages: [],
        currentStage: 1
      },
      {
        id: 'app3',
        jobId: '1',
        studentId: '2',
        status: 'applied',
        appliedAt: new Date('2024-01-18'),
        resumeUrl: '/resumes/sarah-johnson.pdf',
        aiScore: 78,
        stages: [],
        currentStage: 0
      },
      {
        id: 'app4',
        jobId: '2',
        studentId: '3',
        status: 'offer',
        appliedAt: new Date('2024-01-22'),
        resumeUrl: '/resumes/mike-chen.pdf',
        aiScore: 92,
        stages: [],
        currentStage: 8
      },
      {
        id: 'app5',
        jobId: '3',
        studentId: '4',
        status: 'assessment',
        appliedAt: new Date('2024-01-26'),
        resumeUrl: '/resumes/lisa-wang.pdf',
        aiScore: 88,
        stages: [],
        currentStage: 2
      },
      {
        id: 'app6',
        jobId: '1',
        studentId: '5',
        status: 'coding-challenge',
        appliedAt: new Date('2024-01-28'),
        resumeUrl: '/resumes/alex-brown.pdf',
        aiScore: 81,
        stages: [],
        currentStage: 3
      },
      {
        id: 'app7',
        jobId: '3',
        studentId: '6',
        status: 'final-interview',
        appliedAt: new Date('2024-01-19'),
        resumeUrl: '/resumes/emma-davis.pdf',
        aiScore: 94,
        stages: [],
        currentStage: 7
      },
      {
        id: 'app8',
        jobId: '2',
        studentId: '7',
        status: 'rejected',
        appliedAt: new Date('2024-01-17'),
        resumeUrl: '/resumes/tom-wilson.pdf',
        aiScore: 65,
        stages: [],
        currentStage: 10
      }
    ];

    const mockCandidates: CandidateInPipeline[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@email.com',
        jobTitle: 'Frontend Developer',
        jobId: '1',
        currentStage: 'interview-1',
        appliedAt: new Date('2024-01-16'),
        aiScore: 85,
        daysInStage: 5,
        application: mockApplications[0]
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        jobTitle: 'Frontend Developer',
        jobId: '1',
        currentStage: 'applied',
        appliedAt: new Date('2024-01-18'),
        aiScore: 78,
        daysInStage: 3,
        application: mockApplications[2]
      },
      {
        id: '3',
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        jobTitle: 'Backend Developer',
        jobId: '2',
        currentStage: 'offer',
        appliedAt: new Date('2024-01-22'),
        aiScore: 92,
        daysInStage: 1,
        application: mockApplications[3]
      },
      {
        id: '4',
        name: 'Lisa Wang',
        email: 'lisa.wang@email.com',
        jobTitle: 'Full Stack Developer',
        jobId: '3',
        currentStage: 'assessment',
        appliedAt: new Date('2024-01-26'),
        aiScore: 88,
        daysInStage: 2,
        application: mockApplications[4]
      },
      {
        id: '5',
        name: 'Alex Brown',
        email: 'alex.brown@email.com',
        jobTitle: 'Frontend Developer',
        jobId: '1',
        currentStage: 'coding-challenge',
        appliedAt: new Date('2024-01-28'),
        aiScore: 81,
        daysInStage: 1,
        application: mockApplications[5]
      },
      {
        id: '6',
        name: 'Emma Davis',
        email: 'emma.davis@email.com',
        jobTitle: 'Full Stack Developer',
        jobId: '3',
        currentStage: 'final-interview',
        appliedAt: new Date('2024-01-19'),
        aiScore: 94,
        daysInStage: 4,
        application: mockApplications[6]
      },
      {
        id: '7',
        name: 'Tom Wilson',
        email: 'tom.wilson@email.com',
        jobTitle: 'Backend Developer',
        jobId: '2',
        currentStage: 'rejected',
        appliedAt: new Date('2024-01-17'),
        aiScore: 65,
        daysInStage: 7,
        application: mockApplications[7]
      }
    ];

    setJobPostings(mockJobPostings);
    setCandidates(mockCandidates);
  }, [user?.id]);

  const getStageInfo = (stageId: ApplicationStatus) => {
    return pipelineStages.find(stage => stage.id === stageId);
  };

  const getCandidatesInStage = (stageId: ApplicationStatus) => {
    return candidates.filter(candidate => candidate.currentStage === stageId);
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = selectedStage === 'all' || candidate.currentStage === selectedStage;
    const matchesJob = selectedJob === 'all' || candidate.jobId === selectedJob;
    
    return matchesSearch && matchesStage && matchesJob;
  });

  const getJobTitle = (jobId: string) => {
    const job = jobPostings.find(j => j.id === jobId);
    return job ? job.title : 'Unknown Job';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <Clock className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Pipeline</h1>
        </div>
        <p className="text-gray-600 mt-2">Track candidates through your hiring pipeline</p>
      </div>

      {/* Pipeline Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Pipeline Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {pipelineStages.filter(stage => stage.id !== 'rejected').map((stage, index) => {
            const candidatesInStage = getCandidatesInStage(stage.id);
            return (
              <div key={stage.id} className="relative">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className={`w-12 h-12 ${stage.color} rounded-full flex items-center justify-center text-white mx-auto mb-2`}>
                    {stage.icon}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">{stage.name}</h3>
                  <p className="text-2xl font-bold text-gray-900">{candidatesInStage.length}</p>
                  <p className="text-xs text-gray-500">
                    {candidatesInStage.length === 1 ? 'candidate' : 'candidates'}
                  </p>
                </div>
                {index < pipelineStages.length - 2 && (
                  <ChevronRight className="absolute top-1/2 -right-2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Jobs</option>
            {jobPostings.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
          
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value as ApplicationStatus | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Stages</option>
            {pipelineStages.map(stage => (
              <option key={stage.id} value={stage.id}>{stage.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Candidates in Pipeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Candidates in Pipeline</h2>
          <p className="text-gray-600 mt-1">{filteredCandidates.length} candidates found</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredCandidates.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            filteredCandidates.map(candidate => {
              const stageInfo = getStageInfo(candidate.currentStage);
              return (
                <div key={candidate.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                        <p className="text-gray-600">{candidate.email}</p>
                        <p className="text-sm text-gray-500">{candidate.jobTitle}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700">Applied</p>
                        <p className="text-sm text-gray-500">
                          {new Date(candidate.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {candidate.aiScore && (
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-700">AI Score</p>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-semibold">{candidate.aiScore}%</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700">Days in Stage</p>
                        <p className="text-sm text-gray-500">{candidate.daysInStage} days</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700">Current Stage</p>
                        {stageInfo && (
                          <div className="flex items-center space-x-2">
                            <div className={`w-6 h-6 ${stageInfo.color} rounded-full flex items-center justify-center text-white`}>
                              {stageInfo.icon}
                            </div>
                            <span className="text-sm font-medium">{stageInfo.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default PipelinePage;