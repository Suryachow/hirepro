import React, { useState } from 'react';
import { Brain, Plus, X, Loader } from 'lucide-react';
import { useAI } from '../../contexts/AIContext';

interface AISkillAnalysisProps {
  initialSkills?: string[];
  onAnalysisReceived?: (analysis: string) => void;
}

const AISkillAnalysis: React.FC<AISkillAnalysisProps> = ({ 
  initialSkills = [],
  onAnalysisReceived 
}) => {
  const { analyzeSkills, isLoading, error } = useAI();
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [newSkill, setNewSkill] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleAnalyze = async () => {
    if (skills.length === 0 || !targetRole.trim()) return;

    try {
      const result = await analyzeSkills(skills, targetRole);
      setAnalysis(result);
      setShowAnalysis(true);
      onAnalysisReceived?.(result);
    } catch (err) {
      console.error('Failed to analyze skills:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Role/Position:
        </label>
        <input
          type="text"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="e.g., Full Stack Developer"
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Skills:
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
            placeholder="Add a skill and press Enter"
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
          <button
            onClick={handleAddSkill}
            disabled={isLoading || !newSkill.trim()}
            className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 transition-colors flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((skill) => (
              <div
                key={skill}
                className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-blue-900 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        {skills.length === 0 && (
          <p className="text-sm text-gray-500 mb-3">No skills added yet. Add at least one skill to analyze.</p>
        )}
      </div>

      <button
        onClick={handleAnalyze}
        disabled={isLoading || skills.length === 0 || !targetRole.trim()}
        className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <Loader className="h-4 w-4 animate-spin" />
            <span>Analyzing Skills...</span>
          </>
        ) : (
          <>
            <Brain className="h-4 w-4" />
            <span>Analyze Skills</span>
          </>
        )}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {showAnalysis && analysis && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-purple-900 mb-2">📊 Skill Analysis:</h4>
          <p className="text-purple-800 text-sm whitespace-pre-wrap leading-relaxed">{analysis}</p>
        </div>
      )}
    </div>
  );
};

export default AISkillAnalysis;
