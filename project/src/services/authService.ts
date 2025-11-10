import { apiService, ApiResponse } from './api';
import { User } from '../types';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

interface StudentRegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  skills?: string[];
  experience?: string;
  education?: string;
}

interface AdminRegisterRequest {
  email: string;
  password: string;
  name: string;
  company: string;
  jobTitle: string;
  department?: string;
  phone?: string;
}

interface SuperAdminRegisterRequest {
  email: string;
  password: string;
  name: string;
  inviteCode: string;
  twoFactorEnabled: boolean;
}

interface SuperAdminLoginRequest {
  email: string;
  password: string;
  inviteCode: string;
  twoFactorCode: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return apiService.post<LoginResponse>('/auth/login', credentials);
  }

  async registerStudent(userData: StudentRegisterRequest): Promise<ApiResponse<LoginResponse>> {
    return apiService.post<LoginResponse>('/auth/register/student', userData);
  }

  async registerAdmin(userData: AdminRegisterRequest): Promise<ApiResponse<LoginResponse>> {
    return apiService.post<LoginResponse>('/auth/register/admin', userData);
  }

  async registerSuperAdmin(userData: SuperAdminRegisterRequest): Promise<ApiResponse<LoginResponse>> {
    return apiService.post<LoginResponse>('/auth/register/superadmin', userData);
  }

  async superAdminLogin(credentials: SuperAdminLoginRequest): Promise<ApiResponse<LoginResponse>> {
    return apiService.post<LoginResponse>('/auth/superadmin/login', credentials);
  }

  async validateInviteCode(code: string): Promise<ApiResponse<{ valid: boolean }>> {
    return apiService.post<{ valid: boolean }>('/auth/validate-invite', { code });
  }

  async validateTwoFactor(code: string): Promise<ApiResponse<{ valid: boolean }>> {
    return apiService.post<{ valid: boolean }>('/auth/validate-2fa', { code });
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string }>> {
    return apiService.post<{ token: string }>('/auth/refresh', { refreshToken });
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await apiService.post<void>('/auth/logout');
      // Clear local storage after successful API call
      this.clearAuthToken();
      return response;
    } catch (error) {
      console.warn('Failed to logout from API, clearing local storage anyway:', error);
      // Clear local storage even if API call fails
      this.clearAuthToken();
      return {
        success: true,
        data: undefined
      };
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiService.get<User>('/auth/me');
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiService.put<User>('/auth/profile', userData);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiService.post<void>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return apiService.post<void>('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiService.post<void>('/auth/reset-password', {
      token,
      newPassword,
    });
  }

  // Utility methods
  setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  setRefreshToken(token: string): void {
    localStorage.setItem('refreshToken', token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  clearAuthToken(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
  }

  clearRefreshToken(): void {
    localStorage.removeItem('refreshToken');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const authService = new AuthService();
export type {
  LoginRequest,
  LoginResponse,
  StudentRegisterRequest,
  AdminRegisterRequest,
  SuperAdminRegisterRequest,
  SuperAdminLoginRequest,
};