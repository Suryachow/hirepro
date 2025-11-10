import React, { createContext, useContext, useState, useCallback } from 'react';
import { perplexityService } from '../services/perplexityService';

export interface AIContextType {
  // State
  isLoading: boolean;
  error: string | null;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;

  // Interview Feedback
  getInterviewFeedback: (question: string, answer: string) => Promise<string>;

  // Coding Help
  generateCodingExplanation: (problem: string) => Promise<string>;

  // Job Recommendations
  getJobRecommendations: (studentProfile: string, jobDescription: string) => Promise<string>;

  // Resume Review
  getResumeReview: (resumeContent: string, jobTitle: string) => Promise<string>;

  // Mock Interviews
  generateMockInterviewQuestions: (jobTitle: string, company: string, count?: number) => Promise<string>;

  // Skill Analysis
  analyzeSkills: (skills: string[], targetRole: string) => Promise<string>;

  // General Chat
  askQuestion: (question: string) => Promise<string>;

  // Clear History
  clearHistory: () => void;

  // Set API Key
  setApiKey: (key: string) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  const addToHistory = useCallback((role: 'user' | 'assistant', content: string) => {
    setConversationHistory(prev => [...prev, { role, content }]);
  }, []);

  const getInterviewFeedback = useCallback(
    async (question: string, answer: string): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        const feedback = await perplexityService.getInterviewFeedback(question, answer);
        addToHistory('assistant', feedback);
        return feedback;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to get interview feedback';
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [addToHistory]
  );

  const generateCodingExplanation = useCallback(
    async (problem: string): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        addToHistory('user', `Coding Problem: ${problem}`);
        const explanation = await perplexityService.generateCodingExplanation(problem);
        addToHistory('assistant', explanation);
        return explanation;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to generate coding explanation';
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [addToHistory]
  );

  const getJobRecommendations = useCallback(
    async (studentProfile: string, jobDescription: string): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        addToHistory('user', `Profile: ${studentProfile} - Job: ${jobDescription}`);
        const recommendations = await perplexityService.getJobRecommendations(studentProfile, jobDescription);
        addToHistory('assistant', recommendations);
        return recommendations;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to get job recommendations';
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [addToHistory]
  );

  const getResumeReview = useCallback(
    async (resumeContent: string, jobTitle: string): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        addToHistory('user', `Resume review for: ${jobTitle}`);
        const review = await perplexityService.getResumeReview(resumeContent, jobTitle);
        addToHistory('assistant', review);
        return review;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to review resume';
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [addToHistory]
  );

  const generateMockInterviewQuestions = useCallback(
    async (jobTitle: string, company: string, count: number = 5): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        addToHistory('user', `Generate mock interview questions for: ${jobTitle} at ${company}`);
        const questions = await perplexityService.generateMockInterviewQuestions(jobTitle, company, count);
        addToHistory('assistant', questions);
        return questions;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to generate mock interview questions';
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [addToHistory]
  );

  const analyzeSkills = useCallback(
    async (skills: string[], targetRole: string): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        addToHistory('user', `Analyze skills for role: ${targetRole}`);
        const analysis = await perplexityService.analyzeSkills(skills, targetRole);
        addToHistory('assistant', analysis);
        return analysis;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to analyze skills';
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [addToHistory]
  );

  const askQuestion = useCallback(
    async (question: string): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        addToHistory('user', question);
        const response = await perplexityService.askQuestion(question);
        addToHistory('assistant', response);
        return response;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to get response';
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [addToHistory]
  );

  const clearHistory = useCallback(() => {
    setConversationHistory([]);
    setError(null);
  }, []);

  const setApiKey = useCallback((key: string) => {
    perplexityService.setApiKey(key);
  }, []);

  const value: AIContextType = {
    isLoading,
    error,
    conversationHistory,
    getInterviewFeedback,
    generateCodingExplanation,
    getJobRecommendations,
    getResumeReview,
    generateMockInterviewQuestions,
    analyzeSkills,
    askQuestion,
    clearHistory,
    setApiKey,
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export const useAI = (): AIContextType => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

export default AIContext;
