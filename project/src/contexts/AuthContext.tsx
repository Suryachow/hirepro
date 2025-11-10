import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  registerStudent: (userData: StudentRegisterData) => Promise<boolean>;
  registerAdmin: (userData: AdminRegisterData) => Promise<boolean>;
  registerSuperAdmin: (userData: SuperAdminRegisterData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

interface StudentRegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  resume?: File;
  skills?: string[];
  experience?: string;
  education?: string;
}

interface AdminRegisterData {
  email: string;
  password: string;
  name: string;
  company: string;
  jobTitle: string;
  department?: string;
  phone?: string;
}

interface SuperAdminRegisterData {
  email: string;
  password: string;
  name: string;
  inviteCode: string;
  twoFactorEnabled: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Fallback mock data for development/offline mode
const FALLBACK_USERS: User[] = [
  {
    id: '1',
    email: 'student@example.com',
    name: 'John Doe',
    role: 'student',
    createdAt: new Date(),
    lastLogin: new Date(),
  },
  {
    id: '2',
    email: 'admin@company.com',
    name: 'Jane Smith',
    role: 'admin',
    createdAt: new Date(),
    lastLogin: new Date(),
  },
  {
    id: '3',
    email: 'superadmin@platform.com',
    name: 'Admin User',
    role: 'super-admin',
    createdAt: new Date(),
    lastLogin: new Date(),
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Check if we should use mock data
    const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    
    if (useMockData) {
      // Use mock authentication for development
      const foundUser = FALLBACK_USERS.find(u => u.email === email);
      
      if (foundUser && password === 'password') {
        const userWithLastLogin = { ...foundUser, lastLogin: new Date() };
        setUser(userWithLastLogin);
        localStorage.setItem('currentUser', JSON.stringify(userWithLastLogin));
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    }
    
    try {
      // Try live API
      const response = await authService.login({ email, password });
      
      if (response.success && response.data) {
        const { user: userData, token, refreshToken } = response.data;
        authService.setAuthToken(token);
        authService.setRefreshToken(refreshToken);
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.warn('API login failed, falling back to mock data:', error);
      
      // Fallback to mock authentication for development
      const foundUser = FALLBACK_USERS.find(u => u.email === email);
      
      if (foundUser && password === 'password') {
        const userWithLastLogin = { ...foundUser, lastLogin: new Date() };
        setUser(userWithLastLogin);
        localStorage.setItem('currentUser', JSON.stringify(userWithLastLogin));
        setLoading(false);
        return true;
      }
    }
    
    setLoading(false);
    return false;
  };

  const registerStudent = async (userData: StudentRegisterData): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Try live API first
      const response = await authService.registerStudent({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        phone: userData.phone,
        skills: userData.skills,
        experience: userData.experience,
        education: userData.education,
      });
      
      if (response.success && response.data) {
        const { user: newUser, token, refreshToken } = response.data;
        authService.setAuthToken(token);
        authService.setRefreshToken(refreshToken);
        setUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.warn('API student registration failed, falling back to mock data:', error);
      
      // Fallback to mock registration for development
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        role: 'student',
        createdAt: new Date(),
        profile: {
          phone: userData.phone,
          skills: userData.skills || [],
          experience: userData.experience,
          education: userData.education,
        }
      };
      
      FALLBACK_USERS.push(newUser);
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const registerAdmin = async (userData: AdminRegisterData): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Try live API first
      const response = await authService.registerAdmin({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        company: userData.company,
        jobTitle: userData.jobTitle,
        department: userData.department,
        phone: userData.phone,
      });
      
      if (response.success && response.data) {
        const { user: newUser, token, refreshToken } = response.data;
        authService.setAuthToken(token);
        authService.setRefreshToken(refreshToken);
        setUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.warn('API admin registration failed, falling back to mock data:', error);
      
      // Validate corporate email domain
      const emailDomain = userData.email.split('@')[1];
      const blockedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
      
      if (blockedDomains.includes(emailDomain)) {
        setLoading(false);
        return false;
      }
      
      // Fallback to mock registration for development
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        role: 'admin',
        createdAt: new Date(),
        profile: {
          company: userData.company,
          jobTitle: userData.jobTitle,
          department: userData.department,
          phone: userData.phone,
        }
      };
      
      FALLBACK_USERS.push(newUser);
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const registerSuperAdmin = async (userData: SuperAdminRegisterData): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Try live API first
      const response = await authService.registerSuperAdmin({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        inviteCode: userData.inviteCode,
        twoFactorEnabled: userData.twoFactorEnabled,
      });
      
      if (response.success && response.data) {
        const { user: newUser, token, refreshToken } = response.data;
        authService.setAuthToken(token);
        authService.setRefreshToken(refreshToken);
        setUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.warn('API super admin registration failed, falling back to mock data:', error);
      
      // Fallback to mock registration for development
      // Validate invite code
      const validCodes = ['SUPER2024', 'ADMIN-INVITE-001', 'SA-PLATFORM-2024'];
      if (!validCodes.includes(userData.inviteCode.toUpperCase())) {
        setLoading(false);
        return false;
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        role: 'super-admin',
        createdAt: new Date(),
        profile: {
          twoFactorEnabled: userData.twoFactorEnabled,
          inviteCode: userData.inviteCode,
        }
      };
      
      FALLBACK_USERS.push(newUser);
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const logout = async () => {
    try {
      // Try to logout via API to invalidate tokens
      await authService.logout();
    } catch (error) {
      console.warn('API logout failed:', error);
    } finally {
      // Always clear local state and storage
      authService.clearAuthToken();
      authService.clearRefreshToken();
      setUser(null);
      localStorage.removeItem('currentUser');
    }
  };

  const value = {
    user,
    login,
    registerStudent,
    registerAdmin,
    registerSuperAdmin,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};