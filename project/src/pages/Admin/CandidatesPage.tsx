import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Eye, Mail, Phone, Calendar, MapPin, Star, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Application, JobPosting, Student, ApplicationStatus } from '../../types';

interface CandidateWithDetails {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  skills: string[];
  experience: string;
  resumeUrl?: string;
  applications: Application[];
  totalApplications: number;
  latestApplication?: Application;
}

const CandidatesPage: React.FC = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<CandidateWithDetails[]>([]);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);

  // Mock data - In real app, this would come from API
  useEffect(() => {
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
      }
    ];

    const mockCandidates: CandidateWithDetails[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        skills: ['React', 'TypeScript', 'Node.js', 'Python'],
        experience: '3 years',
        resumeUrl: '/resumes/john-smith.pdf',
        applications: [
          {
            id: 'app1',
            jobId: '1',
            studentId: '1',
            status: 'interview-1',
            appliedAt: new Date('2024-01-16'),
            resumeUrl: '/resumes/john-smith.pdf',
            coverLetter: 'I am excited to apply for this position...',
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
          }
        ],
        totalApplications: 2
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 987-6543',
        location: 'Austin, TX',
        skills: ['React', 'Vue.js', 'CSS', 'JavaScript'],
        experience: '2 years',
        resumeUrl: '/resumes/sarah-johnson.pdf',
        applications: [
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
          }
        ],
        totalApplications: 1
      },
      {
        id: '3',
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        phone: '+1 (555) 456-7890',
        location: 'Seattle, WA',
        skills: ['Node.js', 'MongoDB', 'Express', 'AWS'],
        experience: '4 years',
        resumeUrl: '/resumes/mike-chen.pdf',
        applications: [
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
          }
        ],
        totalApplications: 1
      }
    ];

    // Set latest application for each candidate
    mockCandidates.forEach(candidate => {
      candidate.latestApplication = candidate.applications.sort(
        (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
      )[0];
    });

    setJobPostings(mockJobPostings);
    setCandidates(mockCandidates);
  }, [user?.id]);

  const getStatusColor = (status: ApplicationStatus) => {
    const colors = {
      'applied': 'bg-blue-100 text-blue-800',
      'screening': 'bg-yellow-100 text-yellow-800',
      'assessment': 'bg-purple-100 text-purple-800',
      'coding-challenge': 'bg-indigo-100 text-indigo-800',
      'interview-1': 'bg-orange-100 text-orange-800',
      'interview-2': 'bg-orange-100 text-orange-800',
      'hr-interview': 'bg-pink-100 text-pink-800',
      'final-interview': 'bg-red-100 text-red-800',
      'offer': 'bg-green-100 text-green-800',
      'accepted': 'bg-emerald-100 text-emerald-800',
      'rejected': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getJobTitle = (jobId: string) => {
    const job = jobPostings.find(j => j.id === jobId);
    return job ? job.title : 'Unknown Job';
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesJob = selectedJob === 'all' || 
                      candidate.applications.some(app => app.jobId === selectedJob);
    
    const matchesStatus = statusFilter === 'all' || 
                         candidate.applications.some(app => app.status === statusFilter);
    
    return matchesSearch && matchesJob && matchesStatus;
  });

  const getApplicationsForJob = (jobId: string) => {
    return candidates.reduce((total, candidate) => {
      return total + candidate.applications.filter(app => app.jobId === jobId).length;
    }, 0);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
        </div>
        <p className="text-gray-600 mt-2">Manage and track candidate applications</p>
      </div>

      {/* Job Applications Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {jobPostings.map(job => (
          <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{job.company}</p>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-blue-600">
                {getApplicationsForJob(job.id)}
              </div>
              <div className="text-sm text-gray-500">
                {getApplicationsForJob(job.id) === 1 ? 'Application' : 'Applications'}
              </div>
            </div>
          </div>
        ))}
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="applied">Applied</option>
            <option value="screening">Screening</option>
            <option value="assessment">Assessment</option>
            <option value="interview-1">Interview</option>
            <option value="offer">Offer</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Candidates List */}
      <div className="space-y-4">
        {filteredCandidates.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          filteredCandidates.map(candidate => (
            <div key={candidate.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4" />
                            <span>{candidate.email}</span>
                          </div>
                          {candidate.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-4 w-4" />
                              <span>{candidate.phone}</span>
                            </div>
                          )}
                          {candidate.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{candidate.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Experience:</span>
                        <p className="text-sm text-gray-600">{candidate.experience}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Applications:</span>
                        <p className="text-sm text-gray-600">{candidate.totalApplications} total</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Latest Status:</span>
                        {candidate.latestApplication && (
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(candidate.latestApplication.status)}`}>
                            {candidate.latestApplication.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700">Skills:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {candidate.skills.map(skill => (
                          <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {candidate.resumeUrl && (
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Download className="h-5 w-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => setExpandedCandidate(expandedCandidate === candidate.id ? null : candidate.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      {expandedCandidate === candidate.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Expanded Applications Details */}
              {expandedCandidate === candidate.id && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Application History</h4>
                  <div className="space-y-4">
                    {candidate.applications.map(application => (
                      <div key={application.id} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h5 className="font-medium text-gray-900">{getJobTitle(application.jobId)}</h5>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                              </div>
                              {application.aiScore && (
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4" />
                                  <span>AI Score: {application.aiScore}%</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(application.status)}`}>
                            {application.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                        {application.coverLetter && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">Cover Letter:</span>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{application.coverLetter}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CandidatesPage;