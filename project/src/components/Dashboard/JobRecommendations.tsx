import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  Target,
  Award,
  Briefcase,
  Filter,
  ChevronRight
} from 'lucide-react';

interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedAt: string;
  atsScore: number;
  matchPercentage: number;
  skills: string[];
  description: string;
  requirements: string[];
  benefits: string[];
}

const JobRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium'>('all');
  const [loading, setLoading] = useState(true);

  // Mock data for job recommendations
  const mockRecommendations: JobRecommendation[] = [
    {
      id: '1',
      title: 'Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$80,000 - $120,000',
      type: 'Full-time',
      postedAt: '2 days ago',
      atsScore: 92,
      matchPercentage: 95,
      skills: ['React', 'TypeScript', 'CSS', 'JavaScript'],
      description: 'Join our dynamic team to build cutting-edge web applications using modern technologies.',
      requirements: ['3+ years React experience', 'TypeScript proficiency', 'CSS expertise'],
      benefits: ['Health insurance', 'Remote work', '401k matching']
    },
    {
      id: '2',
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'New York, NY',
      salary: '$90,000 - $130,000',
      type: 'Full-time',
      postedAt: '1 day ago',
      atsScore: 88,
      matchPercentage: 87,
      skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
      description: 'Build scalable applications from frontend to backend in a fast-paced startup environment.',
      requirements: ['Full stack experience', 'Node.js proficiency', 'Database knowledge'],
      benefits: ['Equity options', 'Flexible hours', 'Learning budget']
    },
    {
      id: '3',
      title: 'React Developer',
      company: 'Digital Solutions',
      location: 'Austin, TX',
      salary: '$75,000 - $110,000',
      type: 'Full-time',
      postedAt: '3 days ago',
      atsScore: 85,
      matchPercentage: 82,
      skills: ['React', 'Redux', 'JavaScript', 'HTML/CSS'],
      description: 'Create responsive and interactive user interfaces for enterprise applications.',
      requirements: ['React expertise', 'State management', 'Responsive design'],
      benefits: ['Health insurance', 'Paid time off', 'Professional development']
    },
    {
      id: '4',
      title: 'Software Engineer',
      company: 'InnovateTech',
      location: 'Seattle, WA',
      salary: '$85,000 - $125,000',
      type: 'Full-time',
      postedAt: '4 days ago',
      atsScore: 78,
      matchPercentage: 75,
      skills: ['JavaScript', 'Python', 'React', 'Docker'],
      description: 'Work on innovative projects using cutting-edge technologies in a collaborative environment.',
      requirements: ['Programming experience', 'Problem-solving skills', 'Team collaboration'],
      benefits: ['Stock options', 'Gym membership', 'Catered meals']
    },
    {
      id: '5',
      title: 'Junior Frontend Developer',
      company: 'WebCraft Studios',
      location: 'Remote',
      salary: '$60,000 - $85,000',
      type: 'Full-time',
      postedAt: '5 days ago',
      atsScore: 72,
      matchPercentage: 68,
      skills: ['HTML', 'CSS', 'JavaScript', 'React'],
      description: 'Perfect opportunity for a junior developer to grow their skills in a supportive environment.',
      requirements: ['Basic web development', 'Willingness to learn', 'Portfolio projects'],
      benefits: ['Remote work', 'Mentorship program', 'Career growth']
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 1000);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMatchColor = (match: number) => {
    if (match >= 85) return 'text-green-600';
    if (match >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredRecommendations = recommendations.filter(job => {
    if (filter === 'high') return job.atsScore >= 85;
    if (filter === 'medium') return job.atsScore >= 70 && job.atsScore < 85;
    return true;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Target className="h-5 w-5 text-blue-600 mr-2" />
            Job Recommendations
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Personalized matches based on your resume and ATS score
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'high' | 'medium')}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Matches</option>
            <option value="high">High Match (85%+)</option>
            <option value="medium">Medium Match (70-84%)</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRecommendations.slice(0, 5).map((job) => (
          <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(job.atsScore)}`}>
                    ATS: {job.atsScore}%
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <span className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {job.company}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                  </span>
                  <span className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {job.salary}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {job.postedAt}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className={`flex items-center ${getMatchColor(job.matchPercentage)} font-semibold`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {job.matchPercentage}% Match
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-3">{job.description}</p>

            <div className="flex flex-wrap gap-2 mb-3">
              {job.skills.slice(0, 4).map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                  {skill}
                </span>
              ))}
              {job.skills.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                  +{job.skills.length - 4} more
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <Award className="h-3 w-3 mr-1" />
                  {job.requirements.length} requirements
                </span>
                <span className="flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  {job.benefits.length} benefits
                </span>
              </div>
              <Link
                to={`/dashboard/jobs/${job.id}`}
                className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                View Details
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredRecommendations.length > 5 && (
        <div className="mt-4 text-center">
          <Link
            to="/dashboard/jobs?recommended=true"
            className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            View All {filteredRecommendations.length} Recommendations
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      )}

      {filteredRecommendations.length === 0 && (
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations found</h3>
          <p className="text-gray-600">Try adjusting your filter or update your resume for better matches.</p>
        </div>
      )}
    </div>
  );
};

export default JobRecommendations;