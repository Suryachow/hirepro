import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, Building, Briefcase } from 'lucide-react';

const AdminLoginForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    company: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, registerAdmin } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateCorporateEmail = (email: string): boolean => {
    // Check if email is from a corporate domain (not common free email providers)
    const freeEmailProviders = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
      'aol.com', 'icloud.com', 'protonmail.com', 'mail.com'
    ];
    
    const domain = email.split('@')[1]?.toLowerCase();
    return !!(domain && !freeEmailProviders.includes(domain));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      const success = await login(formData.email, formData.password);
      if (!success) {
        setError('Invalid email or password');
      }
    } else {
      // Registration validation
      if (!validateCorporateEmail(formData.email)) {
        setError('Please use a corporate email address (not personal email providers)');
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        setLoading(false);
        return;
      }

      if (!formData.company.trim()) {
        setError('Company name is required');
        setLoading(false);
        return;
      }

      const success = await registerAdmin({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        company: formData.company,
        jobTitle: 'Admin'
      });
      
      if (!success) {
        setError('Registration failed. Please try again.');
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Admin Portal' : 'Join as Hiring Manager'}
            </h1>
            <p className="text-gray-600">
              {isLogin ? 'Manage your recruitment pipeline' : 'Start hiring top talent with AI-powered tools'}
            </p>
            
            {!isLogin && (
              <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                <p className="text-xs text-emerald-800 font-medium mb-1">🎯 Trusted by 500+ companies worldwide</p>
                <p className="text-xs text-emerald-700">Reduce hiring time by 60% with our AI-powered platform</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                      placeholder="Enter your full name"
                      required={!isLogin}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                      placeholder="Enter your company name"
                      required={!isLogin}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  placeholder="Enter your corporate email"
                  required
                />
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">
                  Please use your company email address (not Gmail, Yahoo, etc.)
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 8 characters required
                </p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                </div>
              ) : (
                isLogin ? 'Access Admin Portal' : 'Create Admin Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ email: '', password: '', name: '', company: '', confirmPassword: '' });
              }}
              className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign in'}
            </button>
          </div>

          {isLogin && (
            <>
              <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                <h3 className="text-sm font-medium text-emerald-900 mb-2">Demo Account:</h3>
                <p className="text-xs text-emerald-700">Email: admin@company.com</p>
                <p className="text-xs text-emerald-700">Password: password</p>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                <h3 className="text-sm font-medium text-emerald-900 mb-3">Your admin dashboard includes:</h3>
                <div className="grid grid-cols-2 gap-3 text-xs text-emerald-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Job posting management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Candidate pipeline</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Interview scheduling</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Analytics & reports</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Assessment tools</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Team collaboration</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {!isLogin && (
            <>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Platform Features:</h3>
                <div className="grid grid-cols-1 gap-2 text-xs text-blue-700">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-500">📝</span>
                    <span>Create and manage unlimited job postings</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-500">👥</span>
                    <span>Advanced candidate pipeline management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-500">🤖</span>
                    <span>AI-powered candidate screening and matching</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-500">📊</span>
                    <span>Real-time analytics and hiring insights</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-500">⚡</span>
                    <span>Automated interview scheduling</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-500">🎯</span>
                    <span>Skills-based assessment tools</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <h3 className="text-sm font-medium text-green-900 mb-2">Why top companies choose us:</h3>
                <div className="grid grid-cols-1 gap-2 text-xs text-green-700">
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span><strong>60% faster hiring:</strong> Streamlined process from posting to offer</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span><strong>85% better matches:</strong> AI-powered candidate screening</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span><strong>40% cost reduction:</strong> Eliminate third-party recruiting fees</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span><strong>24/7 support:</strong> Dedicated customer success team</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLoginForm;