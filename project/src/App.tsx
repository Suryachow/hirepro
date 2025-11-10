import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { JobsProvider } from './contexts/JobsContext';
import { PipelineProvider } from './contexts/PipelineContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AIProvider } from './contexts/AIContext';
import AIChat from './components/AI/AIChat';


import StudentLoginForm from './components/Auth/StudentLoginForm';
import AdminLoginForm from './components/Auth/AdminLoginForm';
import SuperAdminLoginForm from './components/Auth/SuperAdminLoginForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import SuperAdminDashboard from './components/Dashboard/SuperAdminDashboard';
import JobPostingsPage from './pages/Admin/JobPostingsPage';
import CandidatesPage from './pages/Admin/CandidatesPage';
import AdminPipelinePage from './pages/Admin/PipelinePage';
import StudentPipelinePage from './pages/Student/PipelinePage';
import AnalyticsPage from './pages/Admin/AnalyticsPage';
import JobsPage from './pages/Student/JobsPage';
import ApplicationsPage from './pages/Student/ApplicationsPage';
import AssessmentsPage from './pages/Student/AssessmentsPage';
import CodingChallengesPage from './pages/Student/CodingChallengesPage';
import InterviewsPage from './pages/Student/InterviewsPage';
import InterviewPreparationPage from './pages/Student/InterviewPreparationPage';
import MockInterviewsPage from './pages/Student/MockInterviewsPage';
import PracticePage from './pages/Student/PracticePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getDashboardComponent = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'super-admin':
        return <SuperAdminDashboard />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  return (
    <DashboardLayout>
      {getDashboardComponent()}
    </DashboardLayout>
  );
};

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  return (
    <>
      <Router>
        <Routes>
        <Route
          path="/student-login"
          element={user ? <Navigate to="/dashboard" replace /> : <StudentLoginForm />}
        />
        <Route
          path="/admin-login"
          element={user ? <Navigate to="/dashboard" replace /> : <AdminLoginForm />}
        />
        <Route
          path="/superadmin-login"
          element={user ? <Navigate to="/dashboard" replace /> : <SuperAdminLoginForm />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/jobs"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <JobsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/applications"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ApplicationsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/assessments"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AssessmentsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/challenges"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CodingChallengesPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/practice"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PracticePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/interview-preparation"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <InterviewPreparationPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/mock-interviews"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <MockInterviewsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/interviews"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <InterviewsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student-pipeline"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <StudentPipelinePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/job-postings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <JobPostingsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/candidates"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CandidatesPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/pipeline"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AdminPipelinePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/analytics"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AnalyticsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/student-login" replace />}
        />
      </Routes>
    </Router>
      <AIChat 
        isOpen={isAIChatOpen} 
        onClose={() => setIsAIChatOpen(false)}
        title="Career AI Assistant"
      />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <JobsProvider>
        <PipelineProvider>
          <AIProvider>
            <AppContent />
          </AIProvider>
        </PipelineProvider>
      </JobsProvider>
    </AuthProvider>
  );
}

export default App;