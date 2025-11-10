import React, { useState } from 'react';
import { Play, BookOpen, Code, Trophy, Clock, Star, ChevronRight, Target, Users, Award } from 'lucide-react';

interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  solved: boolean;
  timeComplexity: string;
}

interface VideoTutorial {
  id: number;
  title: string;
  duration: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
}

interface LearningPath {
  id: number;
  title: string;
  description: string;
  problems: number;
  completed: number;
  icon: React.ReactNode;
  color: string;
}

const PracticePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dsa' | 'videos' | 'contests' | 'interview'>('dsa');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  const learningPaths: LearningPath[] = [
    {
      id: 1,
      title: "Striver's DSA Sheet",
      description: "Your ultimate guide to mastering DSA with curated questions",
      problems: 191,
      completed: 45,
      icon: <Target className="h-6 w-6" />,
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Core DSA Topics",
      description: "Simplify complex concepts with structured approach",
      problems: 150,
      completed: 32,
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-green-500"
    },
    {
      id: 3,
      title: "Problem Solving",
      description: "Solve variety of problems to sharpen your skills",
      problems: 200,
      completed: 78,
      icon: <Code className="h-6 w-6" />,
      color: "bg-purple-500"
    },
    {
      id: 4,
      title: "Interview Preparation",
      description: "Get ready for technical interviews with top companies",
      problems: 120,
      completed: 25,
      icon: <Users className="h-6 w-6" />,
      color: "bg-orange-500"
    }
  ];

  const dsaProblems: Problem[] = [
    { id: 1, title: "Two Sum", difficulty: "Easy", topic: "Arrays", solved: true, timeComplexity: "O(n)" },
    { id: 2, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topic: "Strings", solved: true, timeComplexity: "O(n)" },
    { id: 3, title: "Merge k Sorted Lists", difficulty: "Hard", topic: "Linked Lists", solved: false, timeComplexity: "O(n log k)" },
    { id: 4, title: "Valid Parentheses", difficulty: "Easy", topic: "Stack", solved: true, timeComplexity: "O(n)" },
    { id: 5, title: "Binary Tree Inorder Traversal", difficulty: "Medium", topic: "Trees", solved: false, timeComplexity: "O(n)" },
    { id: 6, title: "Maximum Subarray", difficulty: "Easy", topic: "Dynamic Programming", solved: true, timeComplexity: "O(n)" },
    { id: 7, title: "Word Ladder", difficulty: "Hard", topic: "Graph", solved: false, timeComplexity: "O(n * m)" },
    { id: 8, title: "Implement Queue using Stacks", difficulty: "Easy", topic: "Queue", solved: true, timeComplexity: "O(1)" }
  ];

  const videoTutorials: VideoTutorial[] = [
    { id: 1, title: "Introduction to Arrays and Strings", duration: "45 min", topic: "Arrays", difficulty: "Beginner", thumbnail: "📊" },
    { id: 2, title: "Mastering Recursion and Backtracking", duration: "60 min", topic: "Recursion", difficulty: "Intermediate", thumbnail: "🔄" },
    { id: 3, title: "Dynamic Programming Fundamentals", duration: "75 min", topic: "DP", difficulty: "Advanced", thumbnail: "⚡" },
    { id: 4, title: "Graph Algorithms Deep Dive", duration: "90 min", topic: "Graphs", difficulty: "Advanced", thumbnail: "🕸️" },
    { id: 5, title: "Binary Trees and BST", duration: "55 min", topic: "Trees", difficulty: "Intermediate", thumbnail: "🌳" },
    { id: 6, title: "Sorting and Searching Techniques", duration: "40 min", topic: "Sorting", difficulty: "Beginner", thumbnail: "🔍" }
  ];

  const topics = ['all', 'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Stack', 'Queue'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredProblems = selectedTopic === 'all' 
    ? dsaProblems 
    : dsaProblems.filter(problem => problem.topic === selectedTopic);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Hub</h1>
        <p className="text-gray-600">Master DSA with curated resources and expert guidance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Problems Solved</p>
              <p className="text-2xl font-bold text-gray-900">180</p>
            </div>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Study Hours</p>
              <p className="text-2xl font-bold text-gray-900">45</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div>
            <p className="text-sm text-gray-600">Current Streak</p>
            <p className="text-2xl font-bold text-gray-900">12 days</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div>
            <p className="text-sm text-gray-600">Global Rank</p>
            <p className="text-2xl font-bold text-gray-900">#1,247</p>
          </div>
        </div>
      </div>

      {/* Learning Paths */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Learning Path</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {learningPaths.map((path) => (
            <div key={path.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
              <div className={`w-12 h-12 ${path.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                {path.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{path.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{path.description}</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">{path.completed}/{path.problems} completed</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round((path.completed / path.problems) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${path.color}`}
                  style={{ width: `${(path.completed / path.problems) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dsa', label: 'DSA Problems', icon: <Code className="h-4 w-4" /> },
              { id: 'videos', label: 'Video Tutorials', icon: <Play className="h-4 w-4" /> },
              { id: 'contests', label: 'Contests', icon: <Trophy className="h-4 w-4" /> },
              { id: 'interview', label: 'Interview Prep', icon: <Award className="h-4 w-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* DSA Problems Tab */}
      {activeTab === 'dsa' && (
        <div>
          {/* Topic Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTopic === topic
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {topic === 'all' ? 'All Topics' : topic}
                </button>
              ))}
            </div>
          </div>

          {/* Problems List */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Practice Problems</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredProblems.map((problem) => (
                <div key={problem.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        problem.solved ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {problem.solved && <span className="text-white text-xs">✓</span>}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{problem.title}</h4>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                          <span className="text-sm text-gray-600">{problem.topic}</span>
                          <span className="text-sm text-gray-500">Time: {problem.timeComplexity}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Video Tutorials Tab */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoTutorials.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-4xl">{video.thumbnail}</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span>{video.duration}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    video.difficulty === 'Beginner' ? 'bg-green-100 text-green-600' :
                    video.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {video.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{video.topic}</span>
                  <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
                    <Play className="h-4 w-4" />
                    <span className="text-sm">Watch</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contests Tab */}
      {activeTab === 'contests' && (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Coding Contests</h3>
          <p className="text-gray-600 mb-6">Participate in weekly contests to test your skills and compete with others</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            View Upcoming Contests
          </button>
        </div>
      )}

      {/* Interview Prep Tab */}
      {activeTab === 'interview' && (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <Award className="h-16 w-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Interview Preparation</h3>
          <p className="text-gray-600 mb-6">Comprehensive resources for OS, DBMS, Computer Networks, and System Design</p>
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            Start Interview Prep
          </button>
        </div>
      )}
    </div>
  );
};

export default PracticePage;