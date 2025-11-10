import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  Calendar,
  Trophy,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Users,
  Award,
  Sparkles,
  Loader
} from 'lucide-react';
import JobRecommendations from './JobRecommendations';
import { useAI } from '../../contexts/AIContext';

const StudentDashboard: React.FC = () => {
  const { askQuestion, isLoading: aiLoading } = useAI();
  const [aiTip, setAiTip] = useState('');
  const [showAiTip, setShowAiTip] = useState(false);
  const [tipsLoading, setTipsLoading] = useState(false);

  useEffect(() => {
    loadAiTip();
  }, []);

  const loadAiTip = async () => {
    setTipsLoading(true);
    try {
      const tip = await askQuestion('Give me one short, actionable career tip for job seekers in 1-2 sentences. Focus on practical advice for interviews, resumes, or skill development.');
      setAiTip(tip);
      setShowAiTip(true);
    } catch (err) {
      console.error('Failed to load AI tip:', err);
    } finally {
      setTipsLoading(false);
    }
  };

  const stats = [
    { label: 'Applications Sent', value: '12', icon: FileText, color: 'text-blue-600' },
    { label: 'Interviews Scheduled', value: '3', icon: Calendar, color: 'text-green-600' },
    { label: 'Assessments Completed', value: '8', icon: BookOpen, color: 'text-purple-600' },
    { label: 'Profile Views', value: '47', icon: Users, color: 'text-orange-600' },
  ];

  const recentApplications = [
    {
      id: 1,
      position: 'Frontend Developer',
      company: 'TechCorp Inc.',
      appliedAt: '2 days ago',
      status: 'interview-1'
    },
    {
      id: 2,
      position: 'Full Stack Engineer',
      company: 'StartupXYZ',
      appliedAt: '5 days ago',
      status: 'assessment'
    },
    {
      id: 3,
      position: 'React Developer',
      company: 'Digital Solutions',
      appliedAt: '1 week ago',
      status: 'offer'
    }
  ];



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'offer': return 'bg-green-100 text-green-800';
      case 'interview-1': return 'bg-blue-100 text-blue-800';
      case 'assessment': return 'bg-purple-100 text-purple-800';
      case 'screening': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'offer': return <CheckCircle className="h-4 w-4" />;
      case 'interview-1': return <Calendar className="h-4 w-4" />;
      case 'assessment': return <Trophy className="h-4 w-4" />;
      case 'screening': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'offer':
        return 'Offer Received';
      case 'interview-1':
        return 'Interview Scheduled';
      case 'assessment':
        return 'Assessment Pending';
      default:
        return 'Under Review';
    }
  };

  const upcomingEvents = [
    {
      type: 'Interview',
      company: 'TechCorp',
      time: 'Tomorrow, 2:00 PM',
      description: 'Technical Interview - Frontend Developer'
    },
    {
      type: 'Assessment',
      company: 'StartupXYZ',
      time: 'Due in 2 days',
      description: 'Coding Challenge - Full Stack Engineer'
    },
    {
      type: 'Deadline',
      company: 'DataInc',
      time: 'In 5 days',
      description: 'Application deadline - Data Scientist'
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
        <p className="text-gray-600">Your career application hub</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-100">
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link
            to="/dashboard/jobs"
            className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 p-4 rounded-lg flex flex-col items-center text-center transition-all transform hover:scale-105"
          >
            <Briefcase className="h-6 w-6 text-blue-600 mb-2" />
            <span className="font-medium text-gray-900">Browse Jobs</span>
            <span className="text-xs text-gray-500 mt-1">23 new today</span>
          </Link>
          <Link
            to="/dashboard/applications"
            className="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 p-4 rounded-lg flex flex-col items-center text-center transition-all transform hover:scale-105"
          >
            <FileText className="h-6 w-6 text-green-600 mb-2" />
            <span className="font-medium text-gray-900">Applications</span>
            <span className="text-xs text-gray-500 mt-1">12 active</span>
          </Link>
          <Link
            to="/dashboard/assessments"
            className="bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 p-4 rounded-lg flex flex-col items-center text-center transition-all transform hover:scale-105"
          >
            <BookOpen className="h-6 w-6 text-purple-600 mb-2" />
            <span className="font-medium text-gray-900">Assessments</span>
            <span className="text-xs text-gray-500 mt-1">2 pending</span>
          </Link>
          <Link
            to="/dashboard/coding-challenges"
            className="bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 p-4 rounded-lg flex flex-col items-center text-center transition-all transform hover:scale-105"
          >
            <Trophy className="h-6 w-6 text-orange-600 mb-2" />
            <span className="font-medium text-gray-900">Challenges</span>
            <span className="text-xs text-gray-500 mt-1">5 available</span>
          </Link>
          <Link
            to="/dashboard/interviews"
            className="bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 p-4 rounded-lg flex flex-col items-center text-center transition-all transform hover:scale-105"
          >
            <Calendar className="h-6 w-6 text-indigo-600 mb-2" />
            <span className="font-medium text-gray-900">Interviews</span>
            <span className="text-xs text-gray-500 mt-1">1 upcoming</span>
          </Link>
        </div>
      </div>

      {/* AI Tip Section */}
      {showAiTip && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-sm border border-purple-200 p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg flex-shrink-0">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Career Tip from AI</h3>
              {tipsLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader className="h-4 w-4 text-purple-600 animate-spin" />
                  <p className="text-gray-600">Loading AI tip...</p>
                </div>
              ) : (
                <p className="text-gray-700">{aiTip}</p>
              )}
            </div>
            <button
              onClick={loadAiTip}
              disabled={tipsLoading}
              className="flex-shrink-0 text-purple-600 hover:text-purple-700 disabled:text-gray-400 transition-colors"
              title="Get another tip"
            >
              <Sparkles className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Job Recommendations */}
      <JobRecommendations />

      {/* Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h2>
          <div className="space-y-4">
            {recentApplications.slice(0, 3).map((app) => (
              <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{app.position}</h3>
                  <p className="text-sm text-gray-600">{app.company}</p>
                  <p className="text-xs text-gray-500">{app.appliedAt}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    app.status === 'offer' ? 'bg-green-100 text-green-800' :
                    app.status === 'interview-1' ? 'bg-blue-100 text-blue-800' :
                    app.status === 'assessment' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {getStatusBadge(app.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All Applications →
          </button>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-lg ${
                  event.type === 'Interview' ? 'bg-blue-100' :
                  event.type === 'Assessment' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  {event.type === 'Interview' ? <Calendar className="h-4 w-4 text-blue-600" /> :
                   event.type === 'Assessment' ? <BookOpen className="h-4 w-4 text-purple-600" /> :
                   <Clock className="h-4 w-4 text-orange-600" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{event.type}</h3>
                  <p className="text-sm text-gray-600">{event.company}</p>
                  <p className="text-xs text-gray-500">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;