import React from 'react';
import { 
  Users, 
  Building2, 
  TrendingUp, 
  Shield,
  Activity,
  Globe,
  Settings,
  AlertTriangle
} from 'lucide-react';

const SuperAdminDashboard: React.FC = () => {
  const stats = [
    { 
      title: 'Total Organizations', 
      value: '47', 
      change: '+3 this month', 
      icon: Building2, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Active Admins', 
      value: '156', 
      change: '+12 this week', 
      icon: Users, 
      color: 'bg-emerald-500' 
    },
    { 
      title: 'Platform Usage', 
      value: '94%', 
      change: '+2% vs last month', 
      icon: Activity, 
      color: 'bg-purple-500' 
    },
    { 
      title: 'System Health', 
      value: '99.9%', 
      change: 'All systems operational', 
      icon: Shield, 
      color: 'bg-green-500' 
    },
  ];

  const systemAlerts = [
    {
      type: 'warning',
      title: 'High API Usage',
      message: 'Organization "TechCorp" approaching rate limit',
      time: '2 hours ago',
      severity: 'medium'
    },
    {
      type: 'info',
      title: 'New Organization Signup',
      message: 'StartupXYZ completed verification process',
      time: '5 hours ago',
      severity: 'low'
    },
    {
      type: 'error',
      title: 'Failed Payment',
      message: 'Payment failed for organization "DataInc"',
      time: '1 day ago',
      severity: 'high'
    },
  ];

  const organizationActivity = [
    {
      name: 'TechCorp',
      admins: 8,
      jobs: 23,
      candidates: 456,
      lastActive: '2 hours ago',
      status: 'active'
    },
    {
      name: 'StartupXYZ',
      admins: 3,
      jobs: 7,
      candidates: 89,
      lastActive: '1 day ago',
      status: 'active'
    },
    {
      name: 'MegaCorp',
      admins: 15,
      jobs: 45,
      candidates: 1203,
      lastActive: '3 hours ago',
      status: 'active'
    },
    {
      name: 'InnovateLab',
      admins: 5,
      jobs: 12,
      candidates: 234,
      lastActive: '5 days ago',
      status: 'inactive'
    },
  ];

  const globalSettings = [
    { name: 'AI Matching Threshold', value: '75%', status: 'optimal' },
    { name: 'Auto-rejection Score', value: '40%', status: 'optimal' },
    { name: 'Email Rate Limit', value: '1000/hour', status: 'optimal' },
    { name: 'Storage Limit', value: '500GB', status: 'warning' },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'info': return <Activity className="h-4 w-4 text-blue-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-orange-50 border-orange-200';
      case 'low': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getSettingStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Super Admin Dashboard</h1>
        <p className="text-gray-600">Monitor platform health and manage global settings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-emerald-600 mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* System Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">System Alerts</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {systemAlerts.map((alert, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getAlertColor(alert.severity)}`}>
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{alert.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Global Settings</h2>
            <Settings className="h-5 w-5 text-gray-400" />
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {globalSettings.map((setting, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{setting.name}</p>
                    <p className="text-sm text-gray-600">{setting.value}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSettingStatusColor(setting.status)}`}>
                    {setting.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Manage Settings
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Manage Admins</span>
              </button>
              <button className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>Add Organization</span>
              </button>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>System Reports</span>
              </button>
              <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Organization Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Organization Activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admins
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jobs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {organizationActivity.map((org, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{org.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {org.admins}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {org.jobs}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {org.candidates}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {org.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(org.status)}`}>
                      {org.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;