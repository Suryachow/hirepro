import React, { useState, useEffect } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Play,
  Pause,
  RotateCcw,
  Star,
  Clock,
  CheckCircle,
  Building,
  User,
  MessageSquare,
  Camera,
  Settings,
  Award,
  TrendingUp,
  Calendar,
  ChevronRight,
  Timer,
  Lightbulb,
  Volume2,
  VolumeX,
  Loader
} from 'lucide-react';
import { useAI } from '../../contexts/AIContext';

interface MockInterviewQuestion {
  id: string;
  question: string;
  type: 'technical' | 'behavioral' | 'situational' | 'case-study';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeLimit: number; // in minutes
  followUpQuestions?: string[];
  evaluationCriteria: string[];
}

interface MockInterviewSession {
  id: string;
  companyId: string;
  interviewerName: string;
  interviewerRole: string;
  duration: number; // in minutes
  questions: MockInterviewQuestion[];
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'technical' | 'behavioral' | 'mixed';
  description: string;
}

interface CompanyMockInterview {
  id: string;
  name: string;
  logo: string;
  industry: string;
  totalSessions: number;
  completedSessions: number;
  averageScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
  sessions: MockInterviewSession[];
  interviewTips: string[];
  commonQuestions: string[];
}

interface InterviewResult {
  id: string;
  sessionId: string;
  companyId: string;
  startTime: Date;
  endTime: Date;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

const MockInterviewsPage: React.FC = () => {
  const [companies, setCompanies] = useState<CompanyMockInterview[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyMockInterview | null>(null);
  const [selectedSession, setSelectedSession] = useState<MockInterviewSession | null>(null);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [interviewResults, setInterviewResults] = useState<InterviewResult[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');

  // Mock data for companies and their mock interview sessions
  const mockCompanies: CompanyMockInterview[] = [
    {
      id: '1',
      name: 'Google',
      logo: '🔍',
      industry: 'Technology',
      totalSessions: 12,
      completedSessions: 4,
      averageScore: 78,
      difficulty: 'hard',
      interviewTips: [
        'Practice coding on a whiteboard or Google Docs',
        'Focus on explaining your thought process clearly',
        'Ask clarifying questions before starting',
        'Consider edge cases and optimize your solution'
      ],
      commonQuestions: [
        'Design a URL shortener',
        'Implement a LRU cache',
        'Tell me about a challenging project',
        'How do you handle disagreements in a team?'
      ],
      sessions: [
        {
          id: '1',
          companyId: '1',
          interviewerName: 'Sarah Chen',
          interviewerRole: 'Senior Software Engineer',
          duration: 45,
          difficulty: 'medium',
          type: 'technical',
          description: 'Technical coding interview focusing on algorithms and data structures',
          questions: [
            {
              id: '1',
              question: 'Given an array of integers, find two numbers that add up to a target sum.',
              type: 'technical',
              difficulty: 'medium',
              category: 'Arrays & Hashing',
              timeLimit: 15,
              followUpQuestions: [
                'What if the array is sorted?',
                'How would you handle duplicate values?',
                'Can you optimize the space complexity?'
              ],
              evaluationCriteria: [
                'Correct algorithm implementation',
                'Time and space complexity analysis',
                'Code clarity and structure',
                'Handling edge cases'
              ]
            },
            {
              id: '2',
              question: 'Design a system to handle millions of URL shortening requests per day.',
              type: 'technical',
              difficulty: 'hard',
              category: 'System Design',
              timeLimit: 25,
              evaluationCriteria: [
                'Scalability considerations',
                'Database design',
                'Caching strategies',
                'Load balancing'
              ]
            }
          ]
        },
        {
          id: '2',
          companyId: '1',
          interviewerName: 'Michael Rodriguez',
          interviewerRole: 'Engineering Manager',
          duration: 30,
          difficulty: 'medium',
          type: 'behavioral',
          description: 'Behavioral interview focusing on leadership and teamwork',
          questions: [
            {
              id: '3',
              question: 'Tell me about a time when you had to work with a difficult team member.',
              type: 'behavioral',
              difficulty: 'medium',
              category: 'Teamwork',
              timeLimit: 10,
              evaluationCriteria: [
                'STAR method usage',
                'Conflict resolution skills',
                'Empathy and understanding',
                'Professional growth'
              ]
            }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Microsoft',
      logo: '🪟',
      industry: 'Technology',
      totalSessions: 10,
      completedSessions: 3,
      averageScore: 82,
      difficulty: 'medium',
      interviewTips: [
        'Emphasize collaboration and growth mindset',
        'Show passion for technology and learning',
        'Demonstrate customer focus',
        'Practice explaining complex concepts simply'
      ],
      commonQuestions: [
        'Reverse a linked list',
        'Design a chat application',
        'How do you stay updated with technology?',
        'Describe a time you learned from failure'
      ],
      sessions: [
        {
          id: '3',
          companyId: '2',
          interviewerName: 'Emily Johnson',
          interviewerRole: 'Principal Engineer',
          duration: 60,
          difficulty: 'medium',
          type: 'mixed',
          description: 'Mixed interview combining technical and behavioral questions',
          questions: [
            {
              id: '4',
              question: 'Implement a function to reverse a linked list iteratively and recursively.',
              type: 'technical',
              difficulty: 'medium',
              category: 'Linked Lists',
              timeLimit: 20,
              evaluationCriteria: [
                'Both implementations provided',
                'Correct logic and syntax',
                'Space complexity understanding',
                'Testing approach'
              ]
            },
            {
              id: '5',
              question: 'How do you handle situations where requirements change frequently?',
              type: 'behavioral',
              difficulty: 'medium',
              category: 'Adaptability',
              timeLimit: 8,
              evaluationCriteria: [
                'Flexibility and adaptability',
                'Communication skills',
                'Problem-solving approach',
                'Stakeholder management'
              ]
            }
          ]
        }
      ]
    },
    {
      id: '3',
      name: 'Amazon',
      logo: '📦',
      industry: 'E-commerce/Cloud',
      totalSessions: 14,
      completedSessions: 2,
      averageScore: 75,
      difficulty: 'hard',
      interviewTips: [
        'Study Amazon\'s 16 Leadership Principles thoroughly',
        'Prepare STAR stories for each principle',
        'Focus on customer obsession in examples',
        'Show ownership and bias for action'
      ],
      commonQuestions: [
        'Design Amazon\'s recommendation system',
        'Tell me about a time you disagreed with your manager',
        'How do you prioritize competing deadlines?',
        'Describe a time you went above and beyond'
      ],
      sessions: [
        {
          id: '4',
          companyId: '3',
          interviewerName: 'David Kim',
          interviewerRole: 'Senior Manager',
          duration: 45,
          difficulty: 'hard',
          type: 'behavioral',
          description: 'Leadership principles focused behavioral interview',
          questions: [
            {
              id: '6',
              question: 'Tell me about a time when you had to make a decision with incomplete information.',
              type: 'behavioral',
              difficulty: 'hard',
              category: 'Bias for Action',
              timeLimit: 12,
              evaluationCriteria: [
                'Decision-making process',
                'Risk assessment',
                'Leadership principle alignment',
                'Impact and results'
              ]
            }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    setCompanies(mockCompanies);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'technical': return 'text-blue-600 bg-blue-100';
      case 'behavioral': return 'text-purple-600 bg-purple-100';
      case 'mixed': return 'text-indigo-600 bg-indigo-100';
      case 'case-study': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const startMockInterview = (session: MockInterviewSession) => {
    setSelectedSession(session);
    setIsInterviewActive(true);
    setCurrentQuestionIndex(0);
    setTimer(0);
    setIsTimerRunning(true);
    setIsRecording(true);
    setCurrentAnswer('');
  };

  const endMockInterview = () => {
    setIsTimerRunning(false);
    setIsRecording(false);
    if (selectedSession) {
      const result: InterviewResult = {
        id: Date.now().toString(),
        sessionId: selectedSession.id,
        companyId: selectedSession.companyId,
        startTime: new Date(Date.now() - timer * 1000),
        endTime: new Date(),
        score: Math.floor(Math.random() * 40) + 60, // Mock score
        feedback: 'Good technical knowledge demonstrated. Work on explaining thought process more clearly.',
        strengths: ['Problem-solving approach', 'Code structure', 'Technical knowledge'],
        improvements: ['Communication clarity', 'Time management', 'Edge case handling']
      };
      setInterviewResults(prev => [...prev, result]);
      setShowFeedback(true);
    }
    setIsInterviewActive(false);
  };

  const nextQuestion = () => {
    if (selectedSession && currentQuestionIndex < selectedSession.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer('');
    } else {
      endMockInterview();
    }
  };

  const toggleCamera = () => setIsCameraOn(!isCameraOn);
  const toggleMic = () => setIsMicOn(!isMicOn);

  if (showFeedback && interviewResults.length > 0) {
    const latestResult = interviewResults[interviewResults.length - 1];
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Completed!</h2>
            <p className="text-gray-600">Here's your performance feedback</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600">{latestResult.score}%</div>
              <div className="text-sm text-blue-600">Overall Score</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600">{formatTime(timer)}</div>
              <div className="text-sm text-green-600">Duration</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-600">{selectedSession?.questions.length}</div>
              <div className="text-sm text-purple-600">Questions</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {latestResult.strengths.map((strength, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {latestResult.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <Lightbulb className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Detailed Feedback</h3>
            <p className="text-sm text-gray-700">{latestResult.feedback}</p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setShowFeedback(false);
                setSelectedSession(null);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Another Interview
            </button>
            <button
              onClick={() => {
                setShowFeedback(false);
                setSelectedCompany(null);
                setSelectedSession(null);
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Back to Companies
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isInterviewActive && selectedSession) {
    const currentQuestion = selectedSession.questions[currentQuestionIndex];
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedSession.interviewerName}
                </h2>
                <p className="text-sm text-gray-600">{selectedSession.interviewerRole}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Timer className="h-5 w-5 text-blue-600" />
                <span className="text-lg font-mono font-semibold text-blue-600">
                  {formatTime(timer)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} of {selectedSession.questions.length}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-4">
                {isCameraOn ? (
                  <div className="text-white text-center">
                    <Camera className="h-12 w-12 mx-auto mb-2" />
                    <p>Your Camera</p>
                  </div>
                ) : (
                  <div className="text-gray-400 text-center">
                    <VideoOff className="h-12 w-12 mx-auto mb-2" />
                    <p>Camera Off</p>
                  </div>
                )}
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={toggleCamera}
                  className={`p-3 rounded-full ${isCameraOn ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}
                >
                  {isCameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </button>
                <button
                  onClick={toggleMic}
                  className={`p-3 rounded-full ${isMicOn ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}
                >
                  {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </button>
                <button
                  onClick={endMockInterview}
                  className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700"
                >
                  <Pause className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(currentQuestion.type)}`}>
                    {currentQuestion.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                    {currentQuestion.difficulty}
                  </span>
                  <span className="text-xs text-gray-500">{currentQuestion.category}</span>
                  <span className="text-xs text-gray-500">⏱️ {currentQuestion.timeLimit}m</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {currentQuestion.question}
                </h3>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Answer:
                </label>
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Speak your answer or take notes here..."
                />
              </div>

              {currentQuestion.followUpQuestions && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <h4 className="font-medium text-yellow-800 mb-2">💡 Potential Follow-ups:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                    {currentQuestion.followUpQuestions.map((followUp, index) => (
                      <li key={index}>{followUp}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={nextQuestion}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <span>
                    {currentQuestionIndex < selectedSession.questions.length - 1 ? 'Next Question' : 'Finish Interview'}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCompany) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setSelectedCompany(null)}
            className="text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back to Companies
          </button>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-4xl">{selectedCompany.logo}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedCompany.name}</h1>
                <p className="text-gray-600">{selectedCompany.industry} • Mock Interviews</p>
              </div>
              <div className="ml-auto">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedCompany.difficulty)}`}>
                  {selectedCompany.difficulty} difficulty
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{selectedCompany.totalSessions}</div>
                <div className="text-sm text-blue-600">Total Sessions</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{selectedCompany.completedSessions}</div>
                <div className="text-sm text-green-600">Completed</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{selectedCompany.averageScore}%</div>
                <div className="text-sm text-purple-600">Avg. Score</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {Math.round((selectedCompany.completedSessions / selectedCompany.totalSessions) * 100)}%
                </div>
                <div className="text-sm text-yellow-600">Progress</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Interview Tips</h3>
                <ul className="space-y-2">
                  {selectedCompany.interviewTips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Common Questions</h3>
                <ul className="space-y-2">
                  {selectedCompany.commonQuestions.map((question, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Mock Interview Sessions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedCompany.sessions.map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(session.type)}`}>
                        {session.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(session.difficulty)}`}>
                        {session.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">⏱️ {session.duration}m</span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">{session.description}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      with {session.interviewerName} • {session.interviewerRole}
                    </p>
                    <p className="text-sm text-gray-500">
                      {session.questions.length} questions
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => startMockInterview(session)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Play className="h-4 w-4" />
                  <span>Start Interview</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mock Interviews</h1>
        <p className="text-gray-600">
          Practice with realistic interview simulations from top companies
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div
            key={company.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedCompany(company)}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-3xl">{company.logo}</div>
              <div>
                <h3 className="font-semibold text-gray-900">{company.name}</h3>
                <p className="text-sm text-gray-600">{company.industry}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Sessions</span>
                <span className="font-medium">{company.totalSessions}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Completed</span>
                <span className="font-medium text-green-600">{company.completedSessions}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Avg. Score</span>
                <span className="font-medium text-blue-600">{company.averageScore}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(company.difficulty)}`}>
                {company.difficulty}
              </span>
              <div className="flex items-center text-blue-600">
                <span className="text-sm font-medium">Start Session</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(company.completedSessions / company.totalSessions) * 100}%`
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {Math.round((company.completedSessions / company.totalSessions) * 100)}% complete
              </p>
            </div>
          </div>
        ))}
      </div>

      {interviewResults.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Interview Results</h2>
          <div className="space-y-3">
            {interviewResults.slice(-5).map((result) => (
              <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {companies.find(c => c.id === result.companyId)?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {result.endTime.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">{result.score}%</p>
                  <p className="text-sm text-gray-500">
                    {formatTime(Math.floor((result.endTime.getTime() - result.startTime.getTime()) / 1000))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterviewsPage;