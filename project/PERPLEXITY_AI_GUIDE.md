# Perplexity AI Integration Guide

This document explains how to use the Perplexity AI features integrated into the Career Platform.

## Overview

The application now includes AI-powered features using the Perplexity API to help students with:

- **Interview Preparation**: Get AI feedback on your interview answers
- **Resume Review**: Get AI suggestions to improve your resume
- **Skill Analysis**: Analyze your skills and get learning recommendations
- **Mock Interview Questions**: Generate company-specific interview questions
- **Coding Help**: Get explanations for coding challenges
- **Job Recommendations**: Get AI-powered job matching insights
- **General Chat**: Ask any career-related questions

## Setup

### 1. Get Your Perplexity API Key

1. Visit [https://www.perplexity.ai/api](https://www.perplexity.ai/api)
2. Sign up for a Perplexity account
3. Create an API key
4. Copy your API key

### 2. Configure Environment Variables

1. Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

2. Add your Perplexity API key:

```
VITE_PERPLEXITY_API_KEY=your_api_key_here
```

### 3. Optional Configuration

You can customize the AI behavior by adding these variables to your `.env`:

```
# Choose your preferred Perplexity model
VITE_PERPLEXITY_MODEL=llama-2-70b-chat

# Customize AI response generation
VITE_AI_MAX_TOKENS=1024
VITE_AI_TEMPERATURE=0.7
```

## Available Models

- **llama-2-70b-chat** (default): Balanced, good for most tasks
- **pplx-7b-chat**: Smaller, faster responses
- **pplx-70b-chat**: Larger, more detailed responses
- **sonar-small-chat**: Latest Sonar model (smaller)
- **sonar-medium-chat**: Latest Sonar model (medium)

## Usage in Components

### 1. Using the AI Chat Widget

The AI chat widget is automatically available in the app. Users can click to open it and ask questions:

```tsx
import AIChat from './components/AI/AIChat';

// Already integrated in App.tsx
<AIChat 
  isOpen={isAIChatOpen} 
  onClose={() => setIsAIChatOpen(false)}
  title="Career AI Assistant"
/>
```

### 2. Interview Feedback Component

Add AI feedback to interview practice:

```tsx
import AIInterviewFeedback from './components/AI/AIInterviewFeedback';

<AIInterviewFeedback 
  question="Tell me about your experience with React"
  onFeedbackReceived={(feedback) => console.log(feedback)}
/>
```

### 3. Resume Review Component

Get AI feedback on your resume:

```tsx
import AIResumeReview from './components/AI/AIResumeReview';

<AIResumeReview 
  jobTitle="Senior Software Engineer"
  onResumeReceived={(review) => console.log(review)}
/>
```

### 4. Skill Analysis Component

Analyze skills for a target role:

```tsx
import AISkillAnalysis from './components/AI/AISkillAnalysis';

<AISkillAnalysis 
  initialSkills={['React', 'TypeScript', 'Node.js']}
  onAnalysisReceived={(analysis) => console.log(analysis)}
/>
```

### 5. Using the AI Context Hook

Use the `useAI` hook to access AI functions directly:

```tsx
import { useAI } from './contexts/AIContext';

const MyComponent = () => {
  const { 
    isLoading, 
    error, 
    getInterviewFeedback,
    generateCodingExplanation,
    getJobRecommendations,
    analyzeSkills,
    askQuestion
  } = useAI();

  const handleGetFeedback = async () => {
    try {
      const feedback = await getInterviewFeedback(
        "What is your biggest strength?",
        "My biggest strength is problem-solving..."
      );
      console.log(feedback);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={handleGetFeedback} disabled={isLoading}>
      Get Feedback
    </button>
  );
};
```

## API Reference

### PerplexityService Methods

#### chat(messages, options?)
Send a raw chat request to Perplexity API.

```typescript
const response = await perplexityService.chat([
  { role: 'system', content: 'You are a helpful assistant' },
  { role: 'user', content: 'Hello!' }
]);
```

#### getInterviewFeedback(question, userAnswer)
Get feedback on an interview answer.

```typescript
const feedback = await perplexityService.getInterviewFeedback(
  "Tell me about your leadership experience",
  "I led a team of 5 engineers..."
);
```

#### generateCodingExplanation(problem)
Get explanation for a coding problem.

```typescript
const explanation = await perplexityService.generateCodingExplanation(
  "Write a function to reverse a linked list"
);
```

#### getJobRecommendations(studentProfile, jobDescription)
Get job matching insights.

```typescript
const recommendations = await perplexityService.getJobRecommendations(
  "Skills: React, Node.js, 2 years experience",
  "Senior Frontend Developer at TechCorp..."
);
```

#### getResumeReview(resumeContent, jobTitle)
Get feedback on a resume.

```typescript
const review = await perplexityService.getResumeReview(
  "John Doe\nSoftware Engineer...",
  "Senior Software Engineer"
);
```

#### generateMockInterviewQuestions(jobTitle, company, count)
Generate interview questions for a specific role.

```typescript
const questions = await perplexityService.generateMockInterviewQuestions(
  "Senior Software Engineer",
  "Google",
  5
);
```

#### analyzeSkills(skills, targetRole)
Analyze skills for a target role.

```typescript
const analysis = await perplexityService.analyzeSkills(
  ['React', 'Node.js', 'Python'],
  'Full Stack Developer'
);
```

#### askQuestion(question, context?)
Ask a general question.

```typescript
const answer = await perplexityService.askQuestion(
  "How do I prepare for a technical interview?"
);
```

## Error Handling

The AI service includes built-in error handling. Errors are caught and passed through the context:

```tsx
const { error, isLoading } = useAI();

if (error) {
  return <div>Error: {error}</div>;
}

if (isLoading) {
  return <div>Loading...</div>;
}
```

## Features by Page

### Interview Preparation Page (`/dashboard/interview-preparation`)
- AI-powered interview feedback
- Mock interview question generation
- Practice session tracking with AI analysis

### Assessments Page (`/dashboard/assessments`)
- AI coding problem explanations
- Assessment preparation assistance

### Mock Interviews Page (`/dashboard/mock-interviews`)
- AI-generated interview questions
- Practice and feedback

### Skill Analysis (Can be added to Dashboard/Profile)
- Current skill assessment
- Gap analysis for target roles
- Learning recommendations

### Resume Review (Can be added to Profile)
- Resume improvement suggestions
- Job-specific optimization tips

## Performance Tips

1. **Cache Results**: Store AI responses locally when possible
2. **Batch Requests**: Use `askMultipleQuestions()` for efficiency
3. **Control Tokens**: Adjust `VITE_AI_MAX_TOKENS` based on needs
4. **Use Smaller Model**: Use `pplx-7b-chat` for faster responses with lower latency

## Troubleshooting

### "Perplexity API key not found"
- Ensure `.env` file exists in the project root
- Verify `VITE_PERPLEXITY_API_KEY` is set correctly
- Restart the development server after adding the key

### API Rate Limiting
- Perplexity has rate limits. Monitor your usage.
- Implement request throttling if needed
- Cache results to reduce duplicate requests

### Slow Responses
- Choose a smaller model: `VITE_PERPLEXITY_MODEL=pplx-7b-chat`
- Reduce `VITE_AI_MAX_TOKENS` for shorter responses
- Check your internet connection

## Security Notes

⚠️ **IMPORTANT**: Never commit your `.env` file or API keys to version control.

- Add `.env` to `.gitignore` (already done in most projects)
- API keys should only be in local environment files
- For production, use proper secret management (e.g., environment variables in hosting platform)

## Future Enhancements

Possible improvements:

1. **Streaming Responses**: Stream long responses for better UX
2. **Response Caching**: Cache AI responses to reduce API calls
3. **Custom Models**: Support for custom fine-tuned models
4. **Conversation Memory**: Maintain longer conversation history
5. **Feedback Loop**: Allow users to rate AI responses for improvement
6. **Analytics**: Track which AI features are most used
7. **Multi-language**: Support for multiple languages

## Support

For issues with:
- **Perplexity API**: Visit [https://www.perplexity.ai/api](https://www.perplexity.ai/api)
- **Integration**: Check the component examples above
- **General Questions**: Open an issue in the project repository

## Resources

- [Perplexity API Documentation](https://docs.perplexity.ai/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
