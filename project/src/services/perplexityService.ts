// Perplexity AI Service
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

export interface PerplexityMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface PerplexityRequest {
  model: string;
  messages: PerplexityMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
}

export interface PerplexityResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class PerplexityService {
  private apiKey: string;
  private model: string = 'sonar-pro'; // Updated: valid models are sonar-pro, sonar, sonar-reasoning

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_PERPLEXITY_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Perplexity API key not found. Please set VITE_PERPLEXITY_API_KEY environment variable.');
    }
  }

  async chat(
    messages: PerplexityMessage[],
    options?: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
      topP?: number;
    }
  ): Promise<string> {
    try {
      const response = await fetch(PERPLEXITY_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: options?.model || this.model,
          messages,
          max_tokens: options?.maxTokens || 1024,
          temperature: options?.temperature || 0.7,
          top_p: options?.topP || 0.9,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Perplexity API Error: ${error.error?.message || response.statusText}`);
      }

      const data: PerplexityResponse = await response.json();
      return data.choices[0]?.message?.content || 'No response received';
    } catch (error) {
      console.error('Perplexity API Error:', error);
      throw error;
    }
  }

  // Small helper: instruction to ask the model to format responses as short, beautiful lines
  private getFormatInstruction(): string {
    return `\n\nPlease format the response as a short, attractive set of lines for display to users:\n` +
      `- Start with a one-line title or summary (prefixed with ✨).\n` +
      `- Then provide concise points (2-8), each on its own line.\n` +
      `- Use short, clear sentences. Prefer bullets or numbered lines.\n` +
      `- Keep each line to one or two short phrases; avoid long paragraphs.\n` +
      `- Use friendly tone and optionally an emoji for emphasis.`;
  }

  // Interview Preparation - Get AI feedback on answers
  async getInterviewFeedback(question: string, userAnswer: string): Promise<string> {
    const messages: PerplexityMessage[] = [
      {
        role: 'system',
        content: 'You are an expert interview coach. Provide constructive feedback on interview answers.',
      },
      {
        role: 'user',
        content: `Question: ${question}\n\nCandidate's Answer: ${userAnswer}\n\nProvide detailed feedback on this answer including: strengths, areas for improvement, and suggestions for a better response.` + this.getFormatInstruction(),
      },
    ];

    return this.chat(messages, { maxTokens: 800 });
  }

  // Assessment - Generate coding challenge explanations
  async generateCodingExplanation(problem: string): Promise<string> {
    const messages: PerplexityMessage[] = [
      {
        role: 'system',
        content: 'You are an expert programming instructor. Explain coding problems clearly with step-by-step solutions.',
      },
      {
        role: 'user',
        content: `Coding Problem: ${problem}\n\nProvide a clear explanation with: problem understanding, approach, algorithm, and code example.` + this.getFormatInstruction(),
      },
    ];

    return this.chat(messages, { maxTokens: 1000 });
  }

  // Job Recommendations - Get AI-powered job matching insights
  async getJobRecommendations(studentProfile: string, jobDescription: string): Promise<string> {
    const messages: PerplexityMessage[] = [
      {
        role: 'system',
        content: 'You are an expert career advisor. Analyze job fit and provide recommendations.',
      },
      {
        role: 'user',
        content: `Student Profile: ${studentProfile}\n\nJob Description: ${jobDescription}\n\nProvide: match percentage, key skill gaps, preparation suggestions, and likelihood of success.` + this.getFormatInstruction(),
      },
    ];

    return this.chat(messages, { maxTokens: 800 });
  }

  // Resume Review - Get AI feedback on resume
  async getResumeReview(resumeContent: string, jobTitle: string): Promise<string> {
    const messages: PerplexityMessage[] = [
      {
        role: 'system',
        content: 'You are an expert resume reviewer. Provide actionable feedback to improve resumes.',
      },
      {
        role: 'user',
        content: `Resume Content:\n${resumeContent}\n\nTarget Job: ${jobTitle}\n\nProvide feedback on: relevance, formatting, impact of achievements, and specific improvements needed.` + this.getFormatInstruction(),
      },
    ];

    return this.chat(messages, { maxTokens: 1000 });
  }

  // Mock Interview Preparation - Generate common interview questions
  async generateMockInterviewQuestions(jobTitle: string, company: string, count: number = 5): Promise<string> {
    const messages: PerplexityMessage[] = [
      {
        role: 'system',
        content: 'You are an expert interview trainer. Generate realistic and challenging interview questions.',
      },
      {
        role: 'user',
        content: `Generate ${count} realistic interview questions for the position of ${jobTitle} at ${company}. Include technical, behavioral, and situational questions appropriate for this role.` + this.getFormatInstruction(),
      },
    ];

    return this.chat(messages, { maxTokens: 1200 });
  }

  // Skill Assessment - Analyze skills and suggest improvements
  async analyzeSkills(skills: string[], targetRole: string): Promise<string> {
    const messages: PerplexityMessage[] = [
      {
        role: 'system',
        content: 'You are a career development expert. Analyze skills and provide learning recommendations.',
      },
      {
        role: 'user',
        content: `Current Skills: ${skills.join(', ')}\n\nTarget Role: ${targetRole}\n\nAnalyze skill fit and suggest: priority skills to learn, learning resources, timeline, and career progression path.` + this.getFormatInstruction(),
      },
    ];

    return this.chat(messages, { maxTokens: 1000 });
  }

  // General Purpose AI Chat
  async askQuestion(question: string, context?: string): Promise<string> {
    const messages: PerplexityMessage[] = [
      {
      role: 'system',
      content: context || 'You are a helpful AI assistant for career and technical guidance.',
      },
      {
      role: 'user',
      content: question + this.getFormatInstruction(),
      },
    ];

    return this.chat(messages);
  }

  // Batch Questions - Get answers for multiple questions
  async askMultipleQuestions(questions: string[]): Promise<string[]> {
    return Promise.all(questions.map(q => this.askQuestion(q)));
  }

  // Set API Key
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  // Set Model
  setModel(model: string): void {
    this.model = model;
  }
}

export const perplexityService = new PerplexityService();
export default PerplexityService;
