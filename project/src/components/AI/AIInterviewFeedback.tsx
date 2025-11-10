import React, { useState } from 'react';
import { Lightbulb, Loader } from 'lucide-react';
import { useAI } from '../../contexts/AIContext';

interface AIInterviewFeedbackProps {
  question: string;
  onFeedbackReceived?: (feedback: string) => void;
}

const AIInterviewFeedback: React.FC<AIInterviewFeedbackProps> = ({ 
  question, 
  onFeedbackReceived 
}) => {
  const { getInterviewFeedback, isLoading, error } = useAI();
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const handleGetFeedback = async () => {
    if (!answer.trim()) return;

    try {
      const result = await getInterviewFeedback(question, answer);
      setFeedback(result);
      setShowFeedback(true);
      onFeedbackReceived?.(result);
    } catch (err) {
      console.error('Failed to get feedback:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Answer:
        </label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          disabled={isLoading}
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        />
      </div>

      <button
        onClick={handleGetFeedback}
        disabled={isLoading || !answer.trim()}
        className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {showFeedback && feedback && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">AI Feedback:</h4>
          <p className="text-blue-800 text-sm whitespace-pre-wrap">{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default AIInterviewFeedback;
