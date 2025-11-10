import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Filter,
  FileText,
  Trophy,
  BookOpen,
  BarChart3,
  PieChart,
  Download,
  RefreshCw
} from 'lucide-react';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const [activeItem, setActiveItem] = useState('/dashboard');
  const [stats, setStats] = useState([
    { label: 'Total Applications', value: '0', icon: Users, color: 'text-blue-600' },
    { label: 'Active Jobs', value: '0', icon: Briefcase, color: 'text-green-600' },
    { label: 'Interviews Scheduled', value: '0', icon: Calendar, color: 'text-purple-600' },
    { label: 'Hired This Month', value: '0', icon: TrendingUp, color: 'text-orange-600' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    loadAdditionalData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load stats from API
      const [jobsResponse, applicationsResponse] = await Promise.all([
        jobService.getJobStats(),
        applicationService.getApplicationStats()
      ]);

      if (jobsResponse.success && applicationsResponse.success) {
        setStats([
          { label: 'Total Applications', value: applicationsResponse.data?.total?.toString() || '1,234', icon: Users, color: 'text-blue-600' },
          { label: 'Active Jobs', value: jobsResponse.data?.active?.toString() || '23', icon: Briefcase, color: 'text-green-600' },
          { label: 'Interviews Scheduled', value: applicationsResponse.data?.interviews?.toString() || '45', icon: Calendar, color: 'text-purple-600' },
          { label: 'Hired This Month', value: applicationsResponse.data?.hired?.toString() || '12', icon: TrendingUp, color: 'text-orange-600' },
        ]);
      }
    } catch (error) {
      console.warn('Failed to load dashboard data from API, using fallback:', error);
      // Fallback to mock data
      setStats([
        { label: 'Total Applications', value: '1,234', icon: Users, color: 'text-blue-600' },
        { label: 'Active Jobs', value: '23', icon: Briefcase, color: 'text-green-600' },
        { label: 'Interviews Scheduled', value: '45', icon: Calendar, color: 'text-purple-600' },
        { label: 'Hired This Month', value: '12', icon: TrendingUp, color: 'text-orange-600' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const [candidatePipeline, setCandidatePipeline] = useState([
    { stage: 'New Applications', count: 0, color: 'bg-blue-500' },
    { stage: 'Screening', count: 0, color: 'bg-yellow-500' },
    { stage: 'Assessment', count: 0, color: 'bg-purple-500' },
    { stage: 'Interview', count: 0, color: 'bg-emerald-500' },
    { stage: 'Offer', count: 0, color: 'bg-green-500' },
  ]);

  const [recentActivity, setRecentActivity] = useState([]);
  const [topJobs, setTopJobs] = useState([]);

  const loadAdditionalData = async () => {
    try {
      // Load pipeline data
      const pipelineResponse = await applicationService.getCandidatePipeline();
      if (pipelineResponse.success && pipelineResponse.data) {
        setCandidatePipeline(pipelineResponse.data);
      } else {
        // Fallback pipeline data
        setCandidatePipeline([
          { stage: 'New Applications', count: 45, color: 'bg-blue-500' },
          { stage: 'Screening', count: 23, color: 'bg-yellow-500' },
          { stage: 'Assessment', count: 18, color: 'bg-purple-500' },
          { stage: 'Interview', count: 12, color: 'bg-emerald-500' },
          { stage: 'Offer', count: 5, color: 'bg-green-500' },
        ]);
      }

      // Load recent activity
      const activityResponse = await applicationService.getRecentActivity();
      if (activityResponse.success && activityResponse.data) {
        setRecentActivity(activityResponse.data);
      } else {
        // Fallback activity data
        setRecentActivity([
          {
            type: 'application',
            message: 'New application for Frontend Developer',
            candidate: 'John Smith',
            time: '5 minutes ago',
            action: 'Review'
          },
          {
            type: 'interview',
            message: 'Interview completed for Backend Engineer',
            candidate: 'Sarah Johnson',
            time: '2 hours ago',
            action: 'View Feedback'
          },
          {
            type: 'offer',
            message: 'Offer accepted for Full Stack Developer',
            candidate: 'Mike Chen',
            time: '1 day ago',
            action: 'Send Onboarding'
          },
          {
            type: 'assessment',
            message: 'Assessment submitted for React Developer',
            candidate: 'Lisa Williams',
            time: '2 days ago',
            action: 'Review Score'
          },
        ]);
      }

      // Load top jobs
      const topJobsResponse = await jobService.getTopJobs();
      if (topJobsResponse.success && topJobsResponse.data) {
        setTopJobs(topJobsResponse.data);
      } else {
        // Fallback top jobs data
        setTopJobs([
          {
            title: 'Senior Frontend Developer',
            applications: 67,
            status: 'Active',
            posted: '1 week ago',
            deadline: '2 weeks left'
          },
          {
            title: 'Backend Engineer',
            applications: 43,
            status: 'Active',
            posted: '3 days ago',
            deadline: '3 weeks left'
          },
          {
            title: 'Full Stack Developer',
            applications: 89,
            status: 'Closing Soon',
            posted: '2 weeks ago',
            deadline: '3 days left'
          },
          {
            title: 'DevOps Engineer',
            applications: 34,
            status: 'Active',
            posted: '5 days ago',
            deadline: '2 weeks left'
          },
        ]);
      }
    } catch (error) {
      console.warn('Failed to load additional dashboard data:', error);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application': return <Users className="h-4 w-4 text-blue-600" />;
      case 'interview': return <Calendar className="h-4 w-4 text-emerald-600" />;
      case 'offer': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'assessment': return <BookOpen className="h-4 w-4 text-purple-600" />;
      default: return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Closing Soon': return 'bg-yellow-100 text-yellow-800';
      case 'Closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getJobStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Closing Soon': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'Closed': return <Clock className="h-4 w-4 text-red-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };



  // Student activity analytics data
  const studentActivity = [
    { metric: 'Active Students', value: '142', change: '+8 this week', icon: Users, color: 'bg-blue-500' },
    { metric: 'Applications Submitted', value: '327', change: '+42 this week', icon: FileText, color: 'bg-green-500' },
    { metric: 'Assessments Completed', value: '189', change: '+23 this week', icon: Trophy, color: 'bg-purple-500' },
    { metric: 'Interviews Scheduled', value: '56', change: '+12 this week', icon: Calendar, color: 'bg-orange-500' }
  ];

  // Analytics data
  const [dateRange, setDateRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('applications');

  const applicationsData = [
    { date: 'Mon', applications: 45, assessments: 32, interviews: 12 },
    { date: 'Tue', applications: 52, assessments: 38, interviews: 15 },
    { date: 'Wed', applications: 48, assessments: 35, interviews: 18 },
    { date: 'Thu', applications: 61, assessments: 42, interviews: 22 },
    { date: 'Fri', applications: 55, assessments: 39, interviews: 19 },
    { date: 'Sat', applications: 38, assessments: 28, interviews: 14 },
    { date: 'Sun', applications: 42, assessments: 31, interviews: 16 }
  ];

  const completionRateData = [
    { stage: 'Application', completed: 85, pending: 15 },
    { stage: 'Assessment', completed: 72, pending: 28 },
    { stage: 'Interview', completed: 68, pending: 32 },
    { stage: 'Final Review', completed: 91, pending: 9 }
  ];

  const jobTitlesData = [
    { title: 'Frontend Developer', applications: 89, fill: '#3B82F6' },
    { title: 'Backend Engineer', applications: 67, fill: '#10B981' },
    { title: 'Full Stack Developer', applications: 54, fill: '#8B5CF6' },
    { title: 'DevOps Engineer', applications: 43, fill: '#F59E0B' },
    { title: 'Data Scientist', applications: 38, fill: '#EF4444' },
    { title: 'Mobile Developer', applications: 32, fill: '#06B6D4' }
  ];

  const interviewStagesData = [
    { stage: 'Technical', count: 45, fill: '#3B82F6' },
    { stage: 'Behavioral', count: 38, fill: '#10B981' },
    { stage: 'System Design', count: 32, fill: '#8B5CF6' },
    { stage: 'Final Round', count: 28, fill: '#F59E0B' }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      applicationsData.map(row => Object.values(row).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "analytics_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Your admin management hub</p>
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

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <a
            href="/admin/jobs"
            className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 p-4 rounded-lg flex flex-col items-center text-center transition-all transform hover:scale-105"
          >
            <Briefcase className="h-6 w-6 text-blue-600 mb-2" />
            <span className="font-medium text-gray-900">Manage Jobs</span>
            <span className="text-xs text-gray-500 mt-1">15 active</span>
          </a>
          <a
            href="/admin/candidates"
            className="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 p-4 rounded-lg flex flex-col items-center text-center transition-all transform hover:scale-105"
          >
            <Users className="h-6 w-6 text-green-600 mb-2" />
            <span className="font-medium text-gray-900">Candidates</span>
            <span className="text-xs text-gray-500 mt-1">234 total</span>
          </a>
          <a
            href="/admin/assessments"
            className="bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 p-4 rounded-lg flex flex-col items-center text-center transition-all transform hover:scale-105"
          >
            <BookOpen className="h-6 w-6 text-purple-600 mb-2" />
            <span className="font-medium text-gray-900">Assessments</span>
            <span className="text-xs text-gray-500 mt-1">8 pending</span>
          </a>
          <a
            href="/admin/interviews"
            className="bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 p-4 rounded-lg flex flex-col items-center text-center transition-all transform hover:scale-105"
          >
            <Calendar className="h-6 w-6 text-orange-600 mb-2" />
            <span className="font-medium text-gray-900">Interviews</span>
            <span className="text-xs text-gray-500 mt-1">12 scheduled</span>
          </a>
          <a
            href="/admin/analytics"
            className="bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 p-4 rounded-lg flex flex-col items-center text-center transition-all transform hover:scale-105"
          >
            <TrendingUp className="h-6 w-6 text-indigo-600 mb-2" />
            <span className="font-medium text-gray-900">Analytics</span>
            <span className="text-xs text-gray-500 mt-1">View reports</span>
          </a>
        </div>
      </div>

      {/* Recent Activity & Top Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'application' ? 'bg-blue-100' :
                  activity.type === 'interview' ? 'bg-green-100' :
                  activity.type === 'assessment' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-600">{activity.candidate}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  {activity.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Top Jobs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Jobs</h2>
          <div className="space-y-4">
            {topJobs.map((job, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.applications} applications</p>
                  <p className="text-xs text-gray-500">{job.posted} • {job.deadline}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    getStatusColor(job.status)
                  }`}>
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All Jobs →
          </button>
        </div>
      </div>

      {/* Enhanced Analytics Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Student Activity Analytics</h2>
            <p className="text-sm text-gray-600 mt-1">Comprehensive insights into student engagement and performance</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
            </select>
            <button 
              onClick={exportData}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="space-y-8">
          {/* Applications Over Time */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-4">Applications & Activity Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={applicationsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="applications" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    name="Applications"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="assessments" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    name="Assessments"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="interviews" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    name="Interviews"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Completion Rates */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4">Stage Completion Rates</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={completionRateData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="stage" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E5E7EB', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="completed" fill="#10B981" name="Completed" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" fill="#F59E0B" name="Pending" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Job Titles */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4">Most Applied Job Titles</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={jobTitlesData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="applications"
                      label={({ title, applications }) => `${title}: ${applications}`}
                    >
                      {jobTitlesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E5E7EB', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Interview Stages & Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4">Interview Stage Distribution</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={interviewStagesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={70}
                      dataKey="count"
                    >
                      {interviewStagesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E5E7EB', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4">Offer Acceptance Rate</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">87.5%</div>
                <p className="text-sm text-gray-600 mb-4">Overall acceptance rate</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Offers Made:</span>
                    <span className="font-medium">48</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Accepted:</span>
                    <span className="font-medium text-green-600">42</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Declined:</span>
                    <span className="font-medium text-red-600">6</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4">Key Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. Time to Hire</span>
                  <span className="font-medium">18 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Interview Success Rate</span>
                  <span className="font-medium text-green-600">73%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Assessment Pass Rate</span>
                  <span className="font-medium text-blue-600">68%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Application Quality Score</span>
                  <span className="font-medium text-purple-600">8.2/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;