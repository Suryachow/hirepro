import React, { useState, useEffect } from 'react';
import { Code, Clock, CheckCircle, XCircle, Play, Eye, Calendar, Trophy, Star, Users, Timer } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { applicationService } from '../../services/applicationService';

interface CodingChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'algorithms' | 'data-structures' | 'frontend' | 'backend' | 'fullstack' | 'database';
  language: string[];
  timeLimit: number; // in minutes
  maxScore: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'expired';
  startDate: string;
  endDate: string;
  participants: number;
  myScore?: number;
  myRank?: number;
  totalParticipants?: number;
  tags: string[];
  problemStatement?: string;
  constraints?: string[];
  examples?: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  submittedAt?: string;
  executionTime?: number;
  memoryUsed?: number;
}

const CodingChallengesPage: React.FC = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<CodingChallenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<CodingChallenge | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    setLoading(true);
    try {
      const response = await applicationService.getMyCodingChallenges();
      if (response.success && response.data) {
        setChallenges(response.data);
      } else {
        setChallenges(getMockChallenges());
      }
    } catch (error) {
      console.warn('Failed to load coding challenges from API, using fallback data:', error);
      setChallenges(getMockChallenges());
    } finally {
      setLoading(false);
    }
  };

  const getMockChallenges = (): CodingChallenge[] => [
    {
      id: '1',
      title: 'Two Sum Problem',
      description: 'Given an array of integers and a target sum, return indices of two numbers that add up to the target.',
      difficulty: 'easy',
      category: 'algorithms',
      language: ['JavaScript', 'Python', 'Java', 'C++'],
      timeLimit: 30,
      maxScore: 100,
      status: 'completed',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      participants: 1250,
      myScore: 95,
      myRank: 42,
      totalParticipants: 1250,
      tags: ['arrays', 'hash-table', 'two-pointers'],
      submittedAt: '2024-01-16T10:30:00Z',
      executionTime: 12,
      memoryUsed: 8.5
    },
    {
      id: '2',
      title: 'Binary Tree Traversal',
      description: 'Implement inorder, preorder, and postorder traversal of a binary tree.',
      difficulty: 'medium',
      category: 'data-structures',
      language: ['Python', 'Java', 'C++'],
      timeLimit: 45,
      maxScore: 150,
      status: 'in_progress',
      startDate: '2024-02-01',
      endDate: '2024-03-01',
      participants: 890,
      tags: ['binary-tree', 'recursion', 'dfs']
    },
    {
      id: '3',
      title: 'React Component Optimization',
      description: 'Optimize a React component for better performance using memoization and lazy loading.',
      difficulty: 'hard',
      category: 'frontend',
      language: ['React', 'TypeScript'],
      timeLimit: 90,
      maxScore: 200,
      status: 'not_started',
      startDate: '2024-02-10',
      endDate: '2024-03-10',
      participants: 456,
      tags: ['react', 'performance', 'memoization']
    },
    {
      id: '4',
      title: 'API Rate Limiting',
      description: 'Implement a rate limiting system for a REST API using Redis.',
      difficulty: 'hard',
      category: 'backend',
      language: ['Node.js', 'Python', 'Go'],
      timeLimit: 120,
      maxScore: 250,
      status: 'expired',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      participants: 234,
      tags: ['api', 'redis', 'rate-limiting']
    },
    {
      id: '5',
      title: 'Database Query Optimization',
      description: 'Optimize complex SQL queries for better performance on large datasets.',
      difficulty: 'medium',
      category: 'database',
      language: ['SQL', 'PostgreSQL', 'MySQL'],
      timeLimit: 60,
      maxScore: 175,
      status: 'not_started',
      startDate: '2024-02-15',
      endDate: '2024-03-15',
      participants: 678,
      tags: ['sql', 'optimization', 'indexing']
    },
    {
      id: '6',
      title: 'Full Stack E-commerce Feature',
      description: 'Build a complete shopping cart feature with frontend and backend integration.',
      difficulty: 'hard',
      category: 'fullstack',
      language: ['React', 'Node.js', 'TypeScript'],
      timeLimit: 180,
      maxScore: 250,
      status: 'not_started',
      startDate: '2024-02-20',
      endDate: '2024-03-20',
      participants: 156,
      tags: ['react', 'nodejs', 'mongodb', 'payment-integration']
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'algorithms':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'data-structures':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'frontend':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'backend':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'fullstack':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'database':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not_started':
        return <Clock className="w-5 h-5 text-gray-500" />;
      case 'in_progress':
        return <Play className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'expired':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (challenge: CodingChallenge) => {
    setSelectedChallenge(challenge);
    setShowDetailsModal(true);
  };

  const handleStartChallenge = (challengeId: string) => {
    alert(`Starting challenge ${challengeId}. This would redirect to the coding interface.`);
  };

  const filteredChallenges = challenges.filter(challenge => {
    const difficultyMatch = filterDifficulty === 'all' || challenge.difficulty === filterDifficulty;
    const categoryMatch = filterCategory === 'all' || challenge.category === filterCategory;
    const statusMatch = filterStatus === 'all' || challenge.status === filterStatus;
    return difficultyMatch && categoryMatch && statusMatch;
  });

  const statusCounts = {
    all: challenges.length,
    not_started: challenges.filter(c => c.status === 'not_started').length,
    in_progress: challenges.filter(c => c.status === 'in_progress').length,
    completed: challenges.filter(c => c.status === 'completed').length,
    expired: challenges.filter(c => c.status === 'expired').length
  };

  const isActive = (endDate: string) => {
    return new Date(endDate) > new Date();
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading coding challenges...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <Code className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Coding Challenges</h1>
        </div>
        <p className="text-gray-600 mt-2">Participate in coding challenges and improve your programming skills</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Code className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Clock className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Not Started</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.not_started}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Play className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-900">{statusCounts.in_progress}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-900">{statusCounts.completed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-red-900">{statusCounts.expired}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="algorithms">Algorithms</option>
              <option value="data-structures">Data Structures</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="fullstack">Full Stack</option>
              <option value="database">Database</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        {filteredChallenges.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No coding challenges found matching your filters</p>
          </div>
        ) : (
          filteredChallenges.map(challenge => (
            <div key={challenge.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{challenge.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(challenge.category)}`}>
                      {challenge.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{challenge.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Timer className="h-4 w-4" />
                      <span>{challenge.timeLimit} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Trophy className="h-4 w-4" />
                      <span>{challenge.maxScore} pts</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{challenge.participants} participants</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Until {new Date(challenge.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(challenge.status)}`}>
                    {getStatusIcon(challenge.status)}
                    <span className="text-sm font-medium capitalize">{challenge.status.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              {challenge.myScore && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Your Score: {challenge.myScore}/{challenge.maxScore}</span>
                    </div>
                    <div className="text-sm text-green-600">
                      Rank #{challenge.myRank} of {challenge.totalParticipants}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {challenge.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewDetails(challenge)}
                    className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  {challenge.status === 'not_started' && isActive(challenge.endDate) && (
                    <button
                      onClick={() => handleStartChallenge(challenge.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Play className="h-4 w-4" />
                      <span>Start Challenge</span>
                    </button>
                  )}
                  {challenge.status === 'in_progress' && isActive(challenge.endDate) && (
                    <button
                      onClick={() => handleStartChallenge(challenge.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Play className="h-4 w-4" />
                      <span>Continue</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Challenge Details Modal */}
      {showDetailsModal && selectedChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedChallenge.title}</h2>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(selectedChallenge.difficulty)}`}>
                      {selectedChallenge.difficulty}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(selectedChallenge.category)}`}>
                      {selectedChallenge.category}
                    </span>
                    <span className={`flex items-center space-x-1 px-2 py-1 rounded-full ${getStatusColor(selectedChallenge.status)}`}>
                      {getStatusIcon(selectedChallenge.status)}
                      <span className="text-xs font-medium capitalize">{selectedChallenge.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Challenge Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Limit:</span>
                      <span className="font-medium">{selectedChallenge.timeLimit} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Score:</span>
                      <span className="font-medium">{selectedChallenge.maxScore} points</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Participants:</span>
                      <span className="font-medium">{selectedChallenge.participants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium">{new Date(selectedChallenge.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedChallenge.language.map(lang => (
                      <span key={lang} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedChallenge.description}</p>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedChallenge.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              {selectedChallenge.myScore && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Your Performance</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-green-600">Score:</span>
                      <div className="font-bold text-green-800">{selectedChallenge.myScore}/{selectedChallenge.maxScore}</div>
                    </div>
                    <div>
                      <span className="text-green-600">Rank:</span>
                      <div className="font-bold text-green-800">#{selectedChallenge.myRank}</div>
                    </div>
                    <div>
                      <span className="text-green-600">Execution Time:</span>
                      <div className="font-bold text-green-800">{selectedChallenge.executionTime}ms</div>
                    </div>
                    <div>
                      <span className="text-green-600">Memory Used:</span>
                      <div className="font-bold text-green-800">{selectedChallenge.memoryUsed}MB</div>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {selectedChallenge.status === 'not_started' && isActive(selectedChallenge.endDate) && (
                  <button
                    onClick={() => {
                      handleStartChallenge(selectedChallenge.id);
                      setShowDetailsModal(false);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    <span>Start Challenge</span>
                  </button>
                )}
                {selectedChallenge.status === 'in_progress' && isActive(selectedChallenge.endDate) && (
                  <button
                    onClick={() => {
                      handleStartChallenge(selectedChallenge.id);
                      setShowDetailsModal(false);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    <span>Continue</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingChallengesPage;