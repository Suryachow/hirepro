# Quick Start: Perplexity AI Integration

## Installation & Setup (5 minutes)

### Step 1: Get API Key
1. Go to https://www.perplexity.ai/api
2. Sign up and get your free API key
3. Copy the API key

### Step 2: Set Environment Variable
Create a `.env` file in the project root:

```bash
# .env
VITE_PERPLEXITY_API_KEY=your_api_key_here
VITE_API_URL=http://localhost:3001/api
```

### Step 3: Done!
The AI features are ready to use. Just restart your dev server.

---

## Usage Examples

### 1. Get AI Feedback on Interview Answer
```tsx
import { useAI } from './contexts/AIContext';

function InterviewComponent() {
  const { getInterviewFeedback, isLoading } = useAI();
  
  const handleFeedback = async () => {
    const feedback = await getInterviewFeedback(
      "Tell me about your leadership experience",
      "I led a team of developers and delivered the project on time"
    );
    console.log(feedback);
  };
  
  return (
    <button onClick={handleFeedback} disabled={isLoading}>
      Get AI Feedback
    </button>
  );
}
```

### 2. Review Resume
```tsx
import AIResumeReview from './components/AI/AIResumeReview';

function ProfilePage() {
  return (
    <AIResumeReview 
      jobTitle="Senior React Developer"
      onReviewReceived={(review) => console.log(review)}
    />
  );
}
```

### 3. Analyze Skills
```tsx
import AISkillAnalysis from './components/AI/AISkillAnalysis';

function CareerPage() {
  return (
    <AISkillAnalysis 
      initialSkills={['React', 'TypeScript', 'Node.js']}
      onAnalysisReceived={(analysis) => console.log(analysis)}
    />
  );
}
```

### 4. Get Interview Questions
```tsx
import { useAI } from './contexts/AIContext';

function MockInterviewPage() {
  const { generateMockInterviewQuestions, isLoading } = useAI();
  
  const handleGenerateQuestions = async () => {
    const questions = await generateMockInterviewQuestions(
      "Frontend Engineer",
      "Google",
      5
    );
    console.log(questions);
  };
  
  return (
    <button onClick={handleGenerateQuestions} disabled={isLoading}>
      Generate Questions
    </button>
  );
}
```

### 5. Chat with AI
```tsx
import { useAI } from './contexts/AIContext';

function AIChatComponent() {
  const { askQuestion, isLoading, conversationHistory } = useAI();
  
  const handleAsk = async (question: string) => {
    const answer = await askQuestion(question);
    console.log(answer);
  };
  
  return (
    <div>
      <button onClick={() => handleAsk("How do I prepare for a technical interview?")}>
        Ask Question
      </button>
      <div>
        {conversationHistory.map((msg, i) => (
          <p key={i}><strong>{msg.role}:</strong> {msg.content}</p>
        ))}
      </div>
    </div>
  );
}
```

---

## Where to Add AI Features

### Interview Preparation Page
- Add AI feedback button to practice answers
- Generate company-specific questions
- Location: `/src/pages/Student/InterviewPreparationPage.tsx`

### Assessments Page
- Explain coding problems with AI
- Provide solution hints
- Location: `/src/pages/Student/AssessmentsPage.tsx`

### Mock Interviews Page
- Generate realistic questions
- Provide answer feedback
- Location: `/src/pages/Student/MockInterviewsPage.tsx`

### Job Search/Recommendations
- Match student skills with jobs
- Provide interview preparation tips
- Location: `/src/pages/Student/JobsPage.tsx`

### User Profile/Dashboard
- Resume review tool
- Skill analysis
- Career path recommendations
- Location: `/src/components/Dashboard/StudentDashboard.tsx`

---

## Component Reference

### AIChat (Floating Chat Widget)
```tsx
<AIChat 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Career AI Assistant"
  initialPrompt="How can I improve my resume?"
/>
```

### AIInterviewFeedback
```tsx
<AIInterviewFeedback 
  question="What is your biggest strength?"
  onFeedbackReceived={(feedback) => console.log(feedback)}
/>
```

### AIResumeReview
```tsx
<AIResumeReview 
  jobTitle="Software Engineer"
  onReviewReceived={(review) => console.log(review)}
/>
```

### AISkillAnalysis
```tsx
<AISkillAnalysis 
  initialSkills={['React', 'Python']}
  onAnalysisReceived={(analysis) => console.log(analysis)}
/>
```

---

## Configuration Options

Edit your `.env` file to customize:

```bash
# Model selection (default: llama-2-70b-chat)
VITE_PERPLEXITY_MODEL=llama-2-70b-chat

# Response length (default: 1024)
VITE_AI_MAX_TOKENS=1024

# Creativity (0.0 to 1.0, default: 0.7)
VITE_AI_TEMPERATURE=0.7
```

---

## Available Models

| Model | Speed | Quality | Best For |
|-------|-------|---------|----------|
| pplx-7b-chat | ⚡ Fast | Good | Quick responses |
| llama-2-70b-chat | Medium | Excellent | Default choice |
| pplx-70b-chat | Slow | Excellent | Detailed responses |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "API key not found" | Check `.env` file, restart dev server |
| Slow responses | Switch to `pplx-7b-chat` model |
| No output | Check API quota at perplexity.ai/api |
| Build errors | Ensure all imports are correct paths |

---

## Next Steps

1. ✅ Set up API key
2. ✅ Test one component
3. ✅ Integrate into your pages
4. ✅ Customize prompts for your use case
5. ✅ Monitor usage and costs

---

## Resources

- 📚 [Full Guide](./PERPLEXITY_AI_GUIDE.md)
- 🔗 [Perplexity API Docs](https://docs.perplexity.ai/)
- 💬 [AI Context API](./src/contexts/AIContext.tsx)
- 🎨 [AI Components](./src/components/AI/)
