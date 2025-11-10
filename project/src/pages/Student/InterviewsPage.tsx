import React, { useState, useEffect } from 'react';
import { Video, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Users, MapPin, Phone, Monitor, Eye, Play } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { applicationService } from '../../services/applicationService';

interface Interview {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  type: 'technical' | 'hr' | 'behavioral' | 'final' | 'group' | 'case_study' | 'mr_tr_1' | 'mr_tr_2' | 'hr_1' | 'hr_2';
  mode: 'online' | 'offline' | 'phone';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'in_progress' | 'missed';
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // in minutes
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
  applicationId: string;
  round: number;
  totalRounds: number;
  preparationMaterials?: {
    title: string;
    type: 'document' | 'video' | 'link';
    url: string;
  }[];
  technicalRequirements?: string[];
}

const InterviewsPage: React.FC = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterMode, setFilterMode] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    setLoading(true);
    try {
      const response = await applicationService.getMyInterviews();
      if (response.success && response.data) {
        setInterviews(response.data);
      } else {
        setInterviews(getMockInterviews());
      }
    } catch (error) {
      console.warn('Failed to load interviews from API, using fallback data:', error);
      setInterviews(getMockInterviews());
    } finally {
      setLoading(false);
    }
  };

  const getMockInterviews = (): Interview[] => [
    {
      id: '1',
      jobTitle: 'Frontend Developer',
      company: 'TechCorp Inc.',
      companyLogo: 'https://via.placeholder.com/40',
      type: 'mr_tr_1',
      mode: 'online',
      status: 'scheduled',
      scheduledDate: '2024-02-25',
      scheduledTime: '14:00',
      duration: 60,
      interviewer: {
        name: 'Sarah Johnson',
        position: 'Senior Frontend Engineer & Team Lead',
        email: 'sarah.johnson@techcorp.com'
      },
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      instructions: 'Managerial + Technical Review Round 1. Discussion on technical approach and team collaboration.',
      applicationId: 'app-001',
      round: 5,
      totalRounds: 8,
      preparationMaterials: [
        {
          title: 'Team Structure & Processes',
          type: 'document',
          url: '#'
        },
        {
          title: 'Technical Leadership Expectations',
          type: 'video',
          url: '#'
        }
      ],
      technicalRequirements: [
        'Stable internet connection',
        'Working webcam and microphone'
      ]
    },
    {
      id: '2',
      jobTitle: 'Full Stack Developer',
      company: 'StartupXYZ',
      type: 'hr_1',
      mode: 'online',
      status: 'completed',
      scheduledDate: '2024-02-20',
      scheduledTime: '10:30',
      duration: 45,
      interviewer: {
        name: 'Mike Chen',
        position: 'HR Manager'
      },
      meetingLink: 'https://zoom.us/j/123456789',
      applicationId: 'app-002',
      round: 7,
      totalRounds: 8,
      feedback: {
        rating: 4,
        comments: 'Great communication skills and enthusiasm for the role.',
        strengths: ['Communication', 'Cultural fit', 'Motivation'],
        improvements: ['Could elaborate more on career goals']
      },
      result: 'selected',
      nextRound: {
        type: 'Technical Round',
        scheduledDate: '2024-02-28'
      }
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'technical':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'hr':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'behavioral':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'final':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'group':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'case_study':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'online':
        return <Monitor className="w-4 h-4" />;
      case 'offline':
        return <MapPin className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'rescheduled':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'in_progress':
        return <Play className="w-5 h-5 text-purple-500" />;
      case 'missed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'selected':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleViewDetails = (interview: Interview) => {
    setSelectedInterview(interview);
    setShowDetailsModal(true);
  };

  const handleJoinInterview = (interview: Interview) => {
    if (interview.meetingLink) {
      window.open(interview.meetingLink, '_blank');
    } else if (interview.phoneNumber) {
      alert(`Please call: ${interview.phoneNumber}`);
    } else {
      alert(`Please visit: ${interview.location}`);
    }
  };

  const isInterviewToday = (date: string) => {
    const today = new Date().toISOString().split('T')[0];
    return date === today;
  };

  const isInterviewSoon = (date: string, time: string) => {
    const interviewDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const timeDiff = interviewDateTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    return hoursDiff <= 2 && hoursDiff > 0;
  };

  const filteredInterviews = interviews.filter(interview => {
    const statusMatch = filterStatus === 'all' || interview.status === filterStatus;
    const typeMatch = filterType === 'all' || interview.type === filterType;
    const modeMatch = filterMode === 'all' || interview.mode === filterMode;
    return statusMatch && typeMatch && modeMatch;
  });

  const statusCounts = {
    all: interviews.length,
    scheduled: interviews.filter(i => i.status === 'scheduled').length,
    completed: interviews.filter(i => i.status === 'completed').length,
    cancelled: interviews.filter(i => i.status === 'cancelled').length,
    in_progress: interviews.filter(i => i.status === 'in_progress').length
  };

  const upcomingInterviews = interviews.filter(i => 
    i.status === 'scheduled' && new Date(`${i.scheduledDate}T${i.scheduledTime}`) > new Date()
  ).sort((a, b) => 
    new Date(`${a.scheduledDate}T${a.scheduledTime}`).getTime() - 
    new Date(`${b.scheduledDate}T${b.scheduledTime}`).getTime()
  );

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading interviews...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <Video className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">My Interviews</h1>
        </div>
        <p className="text-gray-600 mt-2">Manage and track your interview schedule</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{statusCounts.all}</div>
          <div className="text-sm text-gray-600">Total Interviews</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{statusCounts.scheduled}</div>
          <div className="text-sm text-gray-600">Scheduled</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">{statusCounts.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-red-600">{statusCounts.cancelled}</div>
          <div className="text-sm text-gray-600">Cancelled</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-purple-600">{statusCounts.in_progress}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="in_progress">In Progress</option>
              <option value="missed">Missed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="technical">Technical</option>
              <option value="hr">HR</option>
              <option value="behavioral">Behavioral</option>
              <option value="final">Final</option>
              <option value="group">Group</option>
              <option value="case_study">Case Study</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Modes</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="phone">Phone</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interviews List */}
      <div className="space-y-4">
        {filteredInterviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews found</h3>
            <p className="text-gray-600">No interviews match your current filters.</p>
          </div>
        ) : (
          filteredInterviews.map(interview => (
            <div key={interview.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{interview.jobTitle}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(interview.type)}`}>
                      {interview.type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(interview.status)}`}>
                      {interview.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{interview.company}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(interview.scheduledDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{interview.scheduledTime} ({interview.duration}min)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getModeIcon(interview.mode)}
                      <span className="capitalize">{interview.mode}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{interview.interviewer.name}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleViewDetails(interview)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {interview.status === 'scheduled' && (
                    <button
                      onClick={() => handleJoinInterview(interview)}
                      className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InterviewsPage;