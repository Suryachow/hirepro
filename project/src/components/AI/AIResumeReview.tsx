import React, { useState } from 'react';
import { FileText, Check, Loader, AlertCircle } from 'lucide-react';
import { useAI } from '../../contexts/AIContext';

interface AIResumeReviewProps {
  jobTitle?: string;
  onReviewReceived?: (review: string) => void;
}

const AIResumeReview: React.FC<AIResumeReviewProps> = ({ 
  jobTitle = 'Your Target Position',
  onReviewReceived 
}) => {
  const { getResumeReview, isLoading, error } = useAI();
  const [resumeContent, setResumeContent] = useState('');
  const [targetJob, setTargetJob] = useState(jobTitle);
  const [review, setReview] = useState('');
  const [showReview, setShowReview] = useState(false);

  const handleGetReview = async () => {
    if (!resumeContent.trim() || !targetJob.trim()) return;

    try {
      const result = await getResumeReview(resumeContent, targetJob);
      setReview(result);
      setShowReview(true);
      onReviewReceived?.(result);
    } catch (err) {
      console.error('Failed to get review:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Job Title:
        </label>
        <input
          type="text"
          value={targetJob}
          onChange={(e) => setTargetJob(e.target.value)}
          placeholder="e.g., Senior Software Engineer"
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Paste Your Resume Content:
        </label>
        <textarea
          value={resumeContent}
          onChange={(e) => setResumeContent(e.target.value)}
          placeholder="Paste your resume text here for AI review..."
          disabled={isLoading}
          className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 font-mono text-sm"
        />
      </div>

      <button
        onClick={handleGetReview}
        disabled={isLoading || !resumeContent.trim() || !targetJob.trim()}
        className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <Loader className="h-4 w-4 animate-spin" />
            <span>Analyzing Resume...</span>
          </>
        ) : (
          <>
            <FileText className="h-4 w-4" />
            <span>Get AI Review</span>
          </>
        )}
      </button>

      {error && (
        <div className="flex items-start space-x-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {showReview && review && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-2 mb-3">
            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <h4 className="font-semibold text-green-900">AI Resume Review:</h4>
          </div>
          <p className="text-green-800 text-sm whitespace-pre-wrap leading-relaxed">{review}</p>
        </div>
      )}
    </div>
  );
};

export default AIResumeReview;
