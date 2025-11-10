import React, { useState, useEffect } from 'react';
import {
  Target,
  Building,
  Clock,
  CheckCircle,
  Play,
  RotateCcw,
  Star,
  TrendingUp,
  BookOpen,
  Award,
  Filter,
  Search,
  ChevronRight,
  Timer,
  Lightbulb,
  MessageSquare,
  Zap,
  Loader
} from 'lucide-react';
import { useAI } from '../../contexts/AIContext';

interface InterviewQuestion {
  id: string;
  question: string;
  type: 'technical' | 'behavioral' | 'situational' | 'coding';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  sampleAnswer?: string;
  tips: string[];
  timeLimit?: number; // in minutes
}

interface CompanyPreparation {
  id: string;
  name: string;
  logo: string;
  industry: string;
  difficulty: 'easy' | 'medium' | 'hard';
  totalQuestions: number;
  completedQuestions: number;
  averageTime: number;
  successRate: number;
  questions: InterviewQuestion[];
  interviewProcess: string[];
  tips: string[];
}

interface PracticeSession {
  id: string;
  companyId: string;
  questionId: string;
  startTime: Date;
  endTime?: Date;
  answer: string;
  score?: number;
  feedback?: string;
}

const InterviewPreparationPage: React.FC = () => {
  const { getInterviewFeedback, generateMockInterviewQuestions, isLoading: aiLoading, error: aiError } = useAI();
  
  const [companies, setCompanies] = useState<CompanyPreparation[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyPreparation | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [practiceMode, setPracticeMode] = useState(false);
  const [answer, setAnswer] = useState('');
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [filter, setFilter] = useState<'all' | 'technical' | 'behavioral' | 'coding'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [showTips, setShowTips] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');
  const [showAIFeedback, setShowAIFeedback] = useState(false);

  // Mock data for companies and their interview preparations
  const mockCompanies: CompanyPreparation[] = [
    {
      id: '1',
      name: 'Google',
      logo: '🔍',
      industry: 'Technology',
      difficulty: 'hard',
      totalQuestions: 45,
      completedQuestions: 12,
      averageTime: 25,
      successRate: 78,
      interviewProcess: [
        'Phone/Video Screen (45 min)',
        'Technical Phone Interview (45 min)',
        'Onsite: 4-5 rounds (45 min each)',
        'System Design (Senior roles)',
        'Behavioral Interview'
      ],
      tips: [
        'Focus on data structures and algorithms',
        'Practice system design for senior roles',
        'Prepare for behavioral questions using STAR method',
        'Code on whiteboard or Google Docs'
      ],
      questions: [
        {
          id: '1',
          question: 'Explain the difference between == and === in JavaScript.',
          type: 'technical',
          difficulty: 'easy',
          category: 'JavaScript',
          tips: ['Focus on type coercion', 'Give examples', 'Mention strict equality'],
          timeLimit: 5
        },
        {
          id: '2',
          question: 'Design a URL shortener like bit.ly',
          type: 'technical',
          difficulty: 'hard',
          category: 'System Design',
          tips: ['Consider scalability', 'Database design', 'Caching strategies'],
          timeLimit: 45
        },
        {
          id: '3',
          question: 'Tell me about a time when you had to work with a difficult team member.',
          type: 'behavioral',
          difficulty: 'medium',
          category: 'Teamwork',
          tips: ['Use STAR method', 'Focus on resolution', 'Show empathy'],
          timeLimit: 10
        }
      ]
    },
    {
      id: '2',
      name: 'Microsoft',
      logo: '🪟',
      industry: 'Technology',
      difficulty: 'medium',
      totalQuestions: 38,
      completedQuestions: 8,
      averageTime: 22,
      successRate: 82,
      interviewProcess: [
        'Recruiter Screen (30 min)',
        'Technical Phone Screen (60 min)',
        'Onsite: 4-5 rounds (60 min each)',
        'Coding + Design',
        'Behavioral + Culture Fit'
      ],
      tips: [
        'Emphasize collaboration and growth mindset',
        'Practice coding in your preferred language',
        'Understand Microsoft\'s culture and values',
        'Prepare questions about the role and team'
      ],
      questions: [
        {
          id: '4',
          question: 'Implement a function to reverse a linked list.',
          type: 'coding',
          difficulty: 'medium',
          category: 'Data Structures',
          tips: ['Consider iterative and recursive approaches', 'Handle edge cases', 'Optimize space complexity'],
          timeLimit: 20
        },
        {
          id: '5',
          question: 'How would you handle a situation where your project is behind schedule?',
          type: 'situational',
          difficulty: 'medium',
          category: 'Project Management',
          tips: ['Show problem-solving skills', 'Mention communication', 'Discuss prioritization'],
          timeLimit: 8
        }
      ]
    },
    {
      id: '3',
      name: 'Amazon',
      logo: '📦',
      industry: 'E-commerce/Cloud',
      difficulty: 'hard',
      totalQuestions: 52,
      completedQuestions: 15,
      averageTime: 28,
      successRate: 75,
      interviewProcess: [
        'Online Assessment (90 min)',
        'Phone Screen (45 min)',
        'Onsite: 5-6 rounds (60 min each)',
        'Bar Raiser Interview',
        'Leadership Principles Focus'
      ],
      tips: [
        'Study Amazon\'s 16 Leadership Principles',
        'Prepare STAR stories for each principle',
        'Focus on customer obsession',
        'Practice system design and coding'
      ],
      questions: [
        {
          id: '6',
          question: 'Tell me about a time when you had to make a decision with incomplete information.',
          type: 'behavioral',
          difficulty: 'medium',
          category: 'Leadership Principles',
          tips: ['Relate to "Bias for Action"', 'Show decision-making process', 'Mention risk assessment'],
          timeLimit: 12
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
      case 'situational': return 'text-orange-600 bg-orange-100';
      case 'coding': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const startPractice = (question: InterviewQuestion) => {
    setCurrentQuestion(question);
    setPracticeMode(true);
    setAnswer('');
    setTimer(0);
    setIsTimerRunning(true);
    setShowTips(false);
  };

  const endPractice = () => {
    setIsTimerRunning(false);
    if (currentQuestion) {
      const session: PracticeSession = {
        id: Date.now().toString(),
        companyId: selectedCompany?.id || '',
        questionId: currentQuestion.id,
        startTime: new Date(Date.now() - timer * 1000),
        endTime: new Date(),
        answer,
        score: Math.floor(Math.random() * 40) + 60 // Mock score
      };
      setSessions(prev => [...prev, session]);
    }
    setPracticeMode(false);
    setCurrentQuestion(null);
  };

  const resetPractice = () => {
    setAnswer('');
    setTimer(0);
    setIsTimerRunning(true);
  };

  const filteredQuestions = selectedCompany?.questions.filter(q => {
    const matchesFilter = filter === 'all' || q.type === filter;
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  if (practiceMode && currentQuestion) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setPracticeMode(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back
              </button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedCompany?.name} Interview Practice
                </h2>
                <p className="text-sm text-gray-600">{currentQuestion.category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Timer className="h-5 w-5 text-blue-600" />
                <span className="text-lg font-mono font-semibold text-blue-600">
                  {formatTime(timer)}
                </span>
                {currentQuestion.timeLimit && (
                  <span className="text-sm text-gray-500">
                    / {currentQuestion.timeLimit}m
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowTips(!showTips)}
                className="flex items-center space-x-1 px-3 py-1 text-yellow-600 hover:bg-yellow-50 rounded-md"
              >
                <Lightbulb className="h-4 w-4" />
                <span>Tips</span>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(currentQuestion.type)}`}>
                {currentQuestion.type}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                {currentQuestion.difficulty}
              </span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {currentQuestion.question}
            </h3>

            {showTips && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-yellow-800 mb-2">💡 Tips:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                  {currentQuestion.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Answer:
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type your answer here..."
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={resetPractice}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={async () => {
                  if (!answer.trim() || !currentQuestion) return;
                  try {
                    const feedback = await getInterviewFeedback(
                      currentQuestion.question,
                      answer
                    );
                    setAiFeedback(feedback);
                    setShowAIFeedback(true);
                  } catch (err) {
                    console.error('Failed to get AI feedback:', err);
                  }
                }}
                disabled={aiLoading || !answer.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {aiLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Getting AI Feedback...</span>
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-4 w-4" />
                    <span>Get AI Feedback</span>
                  </>
                )}
              </button>
              <button
                onClick={endPractice}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Complete Practice</span>
              </button>
            </div>
          </div>

          {aiError && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              Error: {aiError}
            </div>
          )}

          {showAIFeedback && aiFeedback && (
            <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">✨ AI Feedback:</h4>
              <p className="text-purple-800 text-sm whitespace-pre-wrap">{aiFeedback}</p>
            </div>
          )}
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
                <p className="text-gray-600">{selectedCompany.industry}</p>
              </div>
              <div className="ml-auto">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedCompany.difficulty)}`}>
                  {selectedCompany.difficulty} difficulty
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{selectedCompany.totalQuestions}</div>
                <div className="text-sm text-blue-600">Total Questions</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{selectedCompany.completedQuestions}</div>
                <div className="text-sm text-green-600">Completed</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{selectedCompany.averageTime}m</div>
                <div className="text-sm text-yellow-600">Avg. Time</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{selectedCompany.successRate}%</div>
                <div className="text-sm text-purple-600">Success Rate</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Interview Process</h3>
                <div className="space-y-2">
                  {selectedCompany.interviewProcess.map((step, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Preparation Tips</h3>
                <ul className="space-y-2">
                  {selectedCompany.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Practice Questions</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="technical">Technical</option>
                <option value="behavioral">Behavioral</option>
                <option value="situational">Situational</option>
                <option value="coding">Coding</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(question.type)}`}>
                        {question.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">{question.category}</span>
                      {question.timeLimit && (
                        <span className="text-xs text-gray-500">⏱️ {question.timeLimit}m</span>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">{question.question}</h3>
                  </div>
                  <button
                    onClick={() => startPractice(question)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    <span>Practice</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Preparation</h1>
        <p className="text-gray-600">
          Practice company-specific interview questions and improve your interview skills
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
                <span className="text-gray-600">Questions</span>
                <span className="font-medium">{company.totalQuestions}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Completed</span>
                <span className="font-medium text-green-600">{company.completedQuestions}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Success Rate</span>
                <span className="font-medium text-blue-600">{company.successRate}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(company.difficulty)}`}>
                {company.difficulty}
              </span>
              <div className="flex items-center text-blue-600">
                <span className="text-sm font-medium">Start Practice</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(company.completedQuestions / company.totalQuestions) * 100}%`
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {Math.round((company.completedQuestions / company.totalQuestions) * 100)}% complete
              </p>
            </div>
          </div>
        ))}
      </div>

      {sessions.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Practice Sessions</h2>
          <div className="space-y-3">
            {sessions.slice(-5).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {companies.find(c => c.id === session.companyId)?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {session.endTime?.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  {session.score && (
                    <p className="font-medium text-green-600">{session.score}%</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {session.endTime && formatTime(Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000))}
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

export default InterviewPreparationPage;