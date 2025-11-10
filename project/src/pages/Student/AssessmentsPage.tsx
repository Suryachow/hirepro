import React, { useState, useEffect } from 'react';
import { ClipboardList, Clock, CheckCircle, XCircle, AlertTriangle, Play, Eye, Calendar, Timer, Lightbulb, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAI } from '../../contexts/AIContext';
import parseFormattedResponse from '../../utils/aiFormatter';
import { applicationService } from '../../services/applicationService';

interface Assessment {
  id: string;
  title: string;
  company: string;
  jobTitle: string;
  type: 'technical' | 'aptitude' | 'personality' | 'coding' | 'domain' | 'basic_coding' | 'coding_r1' | 'coding_r2' | 'aptitude_basic_coding';
  status: 'pending' | 'in_progress' | 'completed' | 'expired' | 'scheduled';
  dueDate: string;
  duration: number; // in minutes
  score?: number;
  maxScore?: number;
  startedAt?: string;
  completedAt?: string;
  instructions?: string;
  feedback?: string;
  scheduledAt?: string;
}

const AssessmentsPage: React.FC = () => {
  const { user } = useAuth();
  const { generateCodingExplanation, isLoading: aiLoading, error: aiError } = useAI();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [aiExplanation, setAiExplanation] = useState('');
  const [showAIExplanation, setShowAIExplanation] = useState(false);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    setLoading(true);
    try {
      const response = await applicationService.getMyAssessments();
      if (response.success && response.data) {
        setAssessments(response.data);
      } else {
        // Fallback to mock data
        setAssessments(getMockAssessments());
      }
    } catch (error) {
      console.warn('Failed to load assessments from API, using fallback data:', error);
      setAssessments(getMockAssessments());
    } finally {
      setLoading(false);
    }
  };

  const getMockAssessments = (): Assessment[] => {
    return [
      {
        id: '1',
        title: 'Frontend Development Assessment',
        company: 'TechCorp Inc.',
        jobTitle: 'Frontend Developer',
        type: 'technical',
        status: 'pending',
        dueDate: '2024-02-15',
        duration: 90,
        instructions: 'This assessment will test your knowledge of React, JavaScript, and CSS. You will have 90 minutes to complete 25 questions.',
        scheduledAt: '2024-02-10T10:00:00Z'
      },
      {
        id: '2',
        title: 'Aptitude + Basic Coding Assessment',
        company: 'DataFlow Solutions',
        jobTitle: 'Backend Engineer',
        type: 'aptitude_basic_coding',
        status: 'completed',
        dueDate: '2024-01-25',
        duration: 90,
        score: 85,
        maxScore: 100,
        startedAt: '2024-01-23T14:00:00Z',
        completedAt: '2024-01-23T15:30:00Z',
        feedback: 'Excellent logical reasoning skills and basic coding fundamentals demonstrated.'
      }
    ];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'in_progress':
        return <Play className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'expired':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'scheduled':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleViewDetails = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setShowDetailsModal(true);
  };

  const handleStartAssessment = (assessmentId: string) => {
    alert(`Starting assessment ${assessmentId}. This would redirect to the assessment interface.`);
  };

  const filteredAssessments = assessments.filter(assessment => {
    const statusMatch = filterStatus === 'all' || assessment.status === filterStatus;
    const typeMatch = filterType === 'all' || assessment.type === filterType;
    return statusMatch && typeMatch;
  });

  const statusCounts = {
    all: assessments.length,
    pending: assessments.filter(a => a.status === 'pending').length,
    in_progress: assessments.filter(a => a.status === 'in_progress').length,
    completed: assessments.filter(a => a.status === 'completed').length,
    scheduled: assessments.filter(a => a.status === 'scheduled').length,
    expired: assessments.filter(a => a.status === 'expired').length
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <ClipboardList className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Assessments</h1>
        </div>
        <p className="text-gray-600 mt-2">Manage and take your job-related assessments</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{statusCounts.all}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{statusCounts.in_progress}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">{statusCounts.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-purple-600">{statusCounts.scheduled}</div>
          <div className="text-sm text-gray-600">Scheduled</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-red-600">{statusCounts.expired}</div>
          <div className="text-sm text-gray-600">Expired</div>
        </div>
      </div>

      {/* Assessments List */}
      <div className="space-y-4">
        {filteredAssessments.map((assessment) => (
          <div key={assessment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{assessment.title}</h3>
                <p className="text-gray-600 mb-2">{assessment.company} - {assessment.jobTitle}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span>Due: {new Date(assessment.dueDate).toLocaleDateString()}</span>
                  <span>Duration: {assessment.duration} minutes</span>
                  <span className="capitalize">{assessment.type.replace('_', ' ')}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {getStatusIcon(assessment.status)}
                <button
                  onClick={() => handleViewDetails(assessment)}
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                >
                  View Details
                </button>
                {(assessment.status === 'pending' || assessment.status === 'in_progress') && (
                  <button
                    onClick={() => handleStartAssessment(assessment.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {assessment.status === 'pending' ? 'Start' : 'Continue'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assessment Details Modal */}
      {showDetailsModal && selectedAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedAssessment.title}</h2>
            <div className="space-y-4">
              <div>
                <strong>Company:</strong> {selectedAssessment.company}
              </div>
              <div>
                <strong>Job Title:</strong> {selectedAssessment.jobTitle}
              </div>
              <div>
                <strong>Type:</strong> {selectedAssessment.type.replace('_', ' ').toUpperCase()}
              </div>
              <div>
                <strong>Status:</strong> {selectedAssessment.status.replace('_', ' ').toUpperCase()}
              </div>
              <div>
                <strong>Duration:</strong> {selectedAssessment.duration} minutes
              </div>
              {selectedAssessment.instructions && (
                <div>
                  <strong>Instructions:</strong>
                  <p className="mt-2 text-gray-700">{selectedAssessment.instructions}</p>
                </div>
              )}
              {selectedAssessment.score !== undefined && (
                <div>
                  <strong>Score:</strong> {selectedAssessment.score}/{selectedAssessment.maxScore}
                </div>
              )}
              {showAIExplanation && aiExplanation && (() => {
                const parsed = parseFormattedResponse(aiExplanation);
                return (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    {parsed.title && <h4 className="font-semibold text-blue-900 mb-2">💡 {parsed.title}</h4>}
                    <div className="text-blue-800 text-sm whitespace-pre-wrap">
                      {parsed.points.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {parsed.points.map((p, idx) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{parsed.raw}</p>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className="flex justify-between space-x-3 mt-6">
              <button
                onClick={async () => {
                  if (selectedAssessment.type.includes('coding')) {
                    try {
                      const explanation = await generateCodingExplanation(
                        selectedAssessment.title
                      );
                      setAiExplanation(explanation);
                      setShowAIExplanation(true);
                    } catch (err) {
                      console.error('Failed to get explanation:', err);
                    }
                  }
                }}
                disabled={aiLoading || !selectedAssessment.type.includes('coding')}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {aiLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Getting Explanation...</span>
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-4 w-4" />
                    <span>AI Explanation</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentsPage;