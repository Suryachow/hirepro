import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, Shield, Key, Smartphone } from 'lucide-react';

const SuperAdminLoginForm: React.FC = () => {
  const [step, setStep] = useState<'invite' | 'login' | '2fa'>('invite');
  const [formData, setFormData] = useState({
    inviteCode: '',
    email: '',
    password: '',
    twoFactorCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateInviteCode = (code: string): boolean => {
    // Mock invite code validation - in real app, this would be an API call
    const validCodes = ['SUPER2024', 'ADMIN-INVITE-001', 'SA-PLATFORM-2024'];
    return validCodes.includes(code.toUpperCase());
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateInviteCode(formData.inviteCode)) {
      setError('Invalid invite code. Please contact your system administrator.');
      return;
    }
    
    setStep('login');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock login validation for super admin
    if (formData.email === 'superadmin@platform.com' && formData.password === 'password') {
      setStep('2fa');
    } else {
      setError('Invalid credentials or insufficient privileges');
    }
    
    setLoading(false);
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock 2FA validation
    if (formData.twoFactorCode === '123456' || formData.twoFactorCode === '000000') {
      const success = await login(formData.email, formData.password);
      if (!success) {
        setError('Authentication failed');
      }
    } else {
      setError('Invalid 2FA code. Please try again.');
    }
    
    setLoading(false);
  };

  const renderInviteStep = () => (
    <form onSubmit={handleInviteSubmit} className="space-y-6">
      <div>
        <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-2">
          Invitation Code
        </label>
        <div className="relative">
          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            id="inviteCode"
            name="inviteCode"
            value={formData.inviteCode}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors uppercase"
            placeholder="Enter your invitation code"
            required
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Super Admin access requires a valid invitation code
        </p>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
      >
        Verify Invitation
      </button>

      <div className="mt-4 p-4 bg-purple-50 rounded-lg">
        <h3 className="text-sm font-medium text-purple-900 mb-2">Demo Invite Codes:</h3>
        <div className="text-xs text-purple-700 space-y-1">
          <p>• SUPER2024</p>
          <p>• ADMIN-INVITE-001</p>
          <p>• SA-PLATFORM-2024</p>
        </div>
      </div>
    </form>
  );

  const renderLoginStep = () => (
    <form onSubmit={handleLoginSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Super Admin Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            placeholder="Enter your admin email"
            required
          />
        </div>
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
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
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
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Verifying...</span>
          </div>
        ) : (
          'Continue to 2FA'
        )}
      </button>

      <div className="mt-4 p-4 bg-purple-50 rounded-lg">
        <h3 className="text-sm font-medium text-purple-900 mb-2">Demo Credentials:</h3>
        <p className="text-xs text-purple-700">Email: superadmin@platform.com</p>
        <p className="text-xs text-purple-700">Password: password</p>
      </div>
    </form>
  );

  const render2FAStep = () => (
    <form onSubmit={handle2FASubmit} className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Two-Factor Authentication</h3>
        <p className="text-sm text-gray-600">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <div>
        <label htmlFor="twoFactorCode" className="block text-sm font-medium text-gray-700 mb-2">
          Authentication Code
        </label>
        <div className="relative">
          <input
            type="text"
            id="twoFactorCode"
            name="twoFactorCode"
            value={formData.twoFactorCode}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-center text-2xl font-mono tracking-widest"
            placeholder="000000"
            maxLength={6}
            pattern="[0-9]{6}"
            required
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center">
          Code expires in 30 seconds
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || formData.twoFactorCode.length !== 6}
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Authenticating...</span>
          </div>
        ) : (
          'Access Super Admin Portal'
        )}
      </button>

      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <h3 className="text-sm font-medium text-green-900 mb-2">Demo 2FA Codes:</h3>
        <div className="text-xs text-green-700 space-y-1">
          <p>• 123456 (always valid)</p>
          <p>• 000000 (backup code)</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setStep('login')}
        className="w-full text-purple-600 hover:text-purple-700 font-medium transition-colors"
      >
        ← Back to Login
      </button>
    </form>
  );

  const getStepTitle = () => {
    switch (step) {
      case 'invite': return 'Super Admin Access';
      case 'login': return 'Secure Login';
      case '2fa': return 'Two-Factor Authentication';
      default: return 'Super Admin Portal';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'invite': return 'Enter your invitation code to proceed';
      case 'login': return 'Enter your credentials for verification';
      case '2fa': return 'Complete authentication with 2FA';
      default: return 'Secure access to platform administration';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getStepTitle()}
            </h1>
            <p className="text-gray-600">
              {getStepDescription()}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {step === 'invite' && renderInviteStep()}
          {step === 'login' && renderLoginStep()}
          {step === '2fa' && render2FAStep()}

          {step !== '2fa' && (
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Super Admin access is restricted and requires proper authorization
              </p>
            </div>
          )}

          {step === 'invite' && (
            <div className="mt-6 p-4 bg-amber-50 rounded-lg">
              <h3 className="text-sm font-medium text-amber-900 mb-2">Super Admin Privileges:</h3>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>• Manage all admin accounts and permissions</li>
                <li>• Access organization-wide analytics</li>
                <li>• Configure global platform settings</li>
                <li>• Control matching thresholds and templates</li>
                <li>• Monitor system security and compliance</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLoginForm;