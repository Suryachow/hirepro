import React, { useState, useMemo } from 'react';
import { BarChart3, Users, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, Calendar, Target, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Application, ApplicationStatus } from '../../types';

interface AnalyticsData {
  totalApplications: number;
  totalCandidates: number;
  applicationsByStatus: Record<ApplicationStatus, number>;
  applicationsByMonth: { month: string; count: number }[];
  topJobs: { jobTitle: string; applicationCount: number }[];
  conversionRates: {
    applicationToInterview: number;
    interviewToOffer: number;
    offerToHired: number;
  };
}

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  // Mock analytics data
  const mockAnalyticsData: AnalyticsData = {
    totalApplications: 245,
    totalCandidates: 189,
    applicationsByStatus: {
      'pending': 45,
      'under_review': 32,
      'interview_scheduled': 28,
      'interviewed': 35,
      'offer_extended': 15,
      'hired': 42,
      'rejected': 48
    },
    applicationsByMonth: [
      { month: 'Jan', count: 28 },
      { month: 'Feb', count: 35 },
      { month: 'Mar', count: 42 },
      { month: 'Apr', count: 38 },
      { month: 'May', count: 51 },
      { month: 'Jun', count: 45 },
    ],
    topJobs: [
      { jobTitle: 'Software Engineer', applicationCount: 67 },
      { jobTitle: 'Data Analyst', applicationCount: 45 },
      { jobTitle: 'Product Manager', applicationCount: 38 },
      { jobTitle: 'UX Designer', applicationCount: 32 },
      { jobTitle: 'Marketing Specialist', applicationCount: 28 },
    ],
    conversionRates: {
      applicationToInterview: 65.3,
      interviewToOffer: 42.8,
      offerToHired: 78.6
    }
  };

  const statusConfig = {
    'pending': { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    'under_review': { icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    'interview_scheduled': { icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    'interviewed': { icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    'offer_extended': { icon: Target, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    'hired': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    'rejected': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
  };

  const maxApplicationCount = Math.max(...mockAnalyticsData.applicationsByMonth.map(item => item.count));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        </div>
        
        <div className="flex gap-2">
          {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900">{mockAnalyticsData.totalApplications}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">+12.5%</span>
            <span className="text-sm text-gray-500 ml-1">from last {selectedPeriod}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Candidates</p>
              <p className="text-3xl font-bold text-gray-900">{mockAnalyticsData.totalCandidates}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">+8.3%</span>
            <span className="text-sm text-gray-500 ml-1">from last {selectedPeriod}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hired This {selectedPeriod}</p>
              <p className="text-3xl font-bold text-gray-900">{mockAnalyticsData.applicationsByStatus.hired}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Award className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">+15.2%</span>
            <span className="text-sm text-gray-500 ml-1">from last {selectedPeriod}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900">{mockAnalyticsData.conversionRates.offerToHired.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">+3.1%</span>
            <span className="text-sm text-gray-500 ml-1">from last {selectedPeriod}</span>
          </div>
        </div>
      </div>

      {/* Application Status Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Status Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(mockAnalyticsData.applicationsByStatus).map(([status, count]) => {
            const config = statusConfig[status as ApplicationStatus];
            const Icon = config.icon;
            const percentage = ((count / mockAnalyticsData.totalApplications) * 100).toFixed(1);
            
            return (
              <div key={status} className={`p-4 rounded-lg border ${config.bg} ${config.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-5 w-5 ${config.color}`} />
                  <span className={`text-2xl font-bold ${config.color}`}>{count}</span>
                </div>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {status.replace('_', ' ')}
                </p>
                <p className="text-xs text-gray-600">{percentage}% of total</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Over Time */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Applications Over Time</h2>
          <div className="space-y-4">
            {mockAnalyticsData.applicationsByMonth.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 w-12">{item.month}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(item.count / maxApplicationCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 w-8 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Job Positions */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Most Applied Positions</h2>
          <div className="space-y-4">
            {mockAnalyticsData.topJobs.map((job, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                  </div>
                  <span className="font-medium text-gray-900">{job.jobTitle}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">{job.applicationCount}</span>
                  <p className="text-xs text-gray-500">applications</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recruitment Conversion Funnel</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-blue-600">{mockAnalyticsData.conversionRates.applicationToInterview}%</p>
              <p className="text-sm font-medium text-gray-700">Application to Interview</p>
              <p className="text-xs text-gray-500 mt-1">Screening success rate</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <Target className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-orange-600">{mockAnalyticsData.conversionRates.interviewToOffer}%</p>
              <p className="text-sm font-medium text-gray-700">Interview to Offer</p>
              <p className="text-xs text-gray-500 mt-1">Interview success rate</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <Award className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-green-600">{mockAnalyticsData.conversionRates.offerToHired}%</p>
              <p className="text-sm font-medium text-gray-700">Offer to Hired</p>
              <p className="text-xs text-gray-500 mt-1">Offer acceptance rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;