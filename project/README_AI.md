# 🤖 Perplexity AI Integration for Career Platform

Complete AI integration using the Perplexity API for your career platform application.

## 🎯 Overview

This integration adds powerful AI capabilities to your platform:
- Interview preparation with AI feedback
- Resume optimization with AI suggestions
- Skill analysis and recommendations
- Mock interview generation
- Coding problem explanations
- Job matching intelligence
- 24/7 AI career assistant chat

---

## ⚡ Quick Start

### 1. Get API Key (2 minutes)
```bash
# Visit: https://www.perplexity.ai/api
# Create free account
# Generate API key
```

### 2. Setup (1 minute)
```bash
# Create .env file in project root
VITE_PERPLEXITY_API_KEY=your_key_here
```

### 3. Test (2 minutes)
```bash
npm run dev
# Look for AI features in your app
```

**Total: 5 minutes!** ✅

---

## 📦 What Was Added

### 1. Core Service Layer
```
src/services/perplexityService.ts
├── Chat API interface
├── Interview feedback
├── Resume review
├── Skill analysis
├── Mock questions generation
├── Job matching
└── General Q&A
```

### 2. State Management
```
src/contexts/AIContext.tsx
├── Global AI state
├── Conversation history
├── useAI() hook for components
└── Error handling
```

### 3. Ready-Made Components
```
src/components/AI/
├── AIChat.tsx              (Floating chat widget)
├── AIInterviewFeedback.tsx (Answer feedback)
├── AIResumeReview.tsx      (Resume optimization)
└── AISkillAnalysis.tsx     (Skill gap analysis)
```

### 4. Documentation
```
├── QUICK_START_AI.md       (👈 Start here)
├── INTEGRATION_GUIDE.md    (How to use)
├── PERPLEXITY_AI_GUIDE.md  (Complete reference)
└── AI_SETUP_SUMMARY.md     (Overview)
```

---

## 🚀 Usage Examples

### Example 1: Get Interview Feedback
```tsx
import { useAI } from './contexts/AIContext';

function InterviewComponent() {
  const { getInterviewFeedback, isLoading } = useAI();
  
  const handleFeedback = async () => {
    const feedback = await getInterviewFeedback(
      "Tell me about your experience",
      "I worked on React projects for 2 years..."
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

### Example 2: Review Resume
```tsx
import AIResumeReview from './components/AI/AIResumeReview';

function ProfilePage() {
  return (
    <AIResumeReview 
      jobTitle="Senior Developer"
      onReviewReceived={(review) => alert(review)}
    />
  );
}
```

### Example 3: Analyze Skills
```tsx
import AISkillAnalysis from './components/AI/AISkillAnalysis';

function CareerPage() {
  return (
    <AISkillAnalysis 
      initialSkills={['React', 'TypeScript']}
      onAnalysisReceived={(analysis) => console.log(analysis)}
    />
  );
}
```

### Example 4: Chat Widget
```tsx
import AIChat from './components/AI/AIChat';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        💬 Ask AI
      </button>
      <AIChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
```

---

## 📋 Implementation Checklist

### Setup
- [ ] Get Perplexity API key
- [ ] Create `.env` file
- [ ] Add API key to `.env`
- [ ] Restart dev server
- [ ] Test basic functionality

### Integration
- [ ] Add AI to Interview Prep page
- [ ] Add AI to Assessments page
- [ ] Add AI to Mock Interviews page
- [ ] Add AI Chat widget to Header/Sidebar
- [ ] Add AI to Job Recommendations

### Enhancement
- [ ] Customize AI prompts
- [ ] Add response caching
- [ ] Track AI usage
- [ ] Optimize performance
- [ ] Deploy to production

---

## 🏗️ Architecture

### Component Hierarchy
```
App
├── AIProvider (wraps entire app)
├── AuthProvider
├── JobsProvider
├── PipelineProvider
├── AppContent
│   ├── Router
│   │   └── Routes
│   │       ├── Login pages
│   │       ├── Dashboard (with AI)
│   │       ├── Interview Prep (with AI)
│   │       ├── Assessments (with AI)
│   │       └── etc.
│   └── AIChat (floating widget)
```

### Data Flow
```
Component
  ↓
useAI() hook
  ↓
AIContext
  ↓
PerplexityService
  ↓
Perplexity API
  ↓
(same path reversed back to Component)
```

---

## 🔧 Configuration

### Environment Variables
```bash
# Required
VITE_PERPLEXITY_API_KEY=your_api_key

# Optional (defaults shown)
VITE_API_URL=http://localhost:3001/api
VITE_PERPLEXITY_MODEL=llama-2-70b-chat
VITE_AI_MAX_TOKENS=1024
VITE_AI_TEMPERATURE=0.7
```

### Model Selection
| Model | Speed | Quality | Use Case |
|-------|-------|---------|----------|
| pplx-7b-chat | ⚡ Fast | Good | Quick responses |
| llama-2-70b-chat | ⚙️ Balanced | Excellent | Default |
| pplx-70b-chat | 🐢 Slow | Best | Detailed answers |

---

## 📚 Documentation Guide

### For Getting Started
1. **QUICK_START_AI.md** ← Start here
2. Read setup section
3. Create `.env` file
4. Test one feature

### For Integration
1. **INTEGRATION_GUIDE.md**
2. Pick a page
3. Follow integration steps
4. Add AI components

### For Reference
1. **PERPLEXITY_AI_GUIDE.md**
2. API reference
3. Component props
4. Advanced usage

### For Overview
1. **AI_SETUP_SUMMARY.md**
2. Architecture
3. File structure
4. Troubleshooting

---

## 🎨 Available AI Components

### AIChat
**Type**: Widget Component
**Purpose**: General conversation with AI
**Props**: 
- `isOpen: boolean`
- `onClose: () => void`
- `title?: string`
- `initialPrompt?: string`

```tsx
<AIChat 
  isOpen={showChat}
  onClose={() => setShowChat(false)}
  title="Career AI Assistant"
/>
```

### AIInterviewFeedback
**Type**: Form Component
**Purpose**: Get feedback on interview answers
**Props**:
- `question: string`
- `onFeedbackReceived?: (feedback: string) => void`

```tsx
<AIInterviewFeedback 
  question="Tell me about a challenge you overcame"
  onFeedbackReceived={(feedback) => console.log(feedback)}
/>
```

### AIResumeReview
**Type**: Form Component
**Purpose**: Get resume improvement suggestions
**Props**:
- `jobTitle?: string`
- `onReviewReceived?: (review: string) => void`

```tsx
<AIResumeReview 
  jobTitle="Senior Software Engineer"
  onReviewReceived={(review) => console.log(review)}
/>
```

### AISkillAnalysis
**Type**: Form Component
**Purpose**: Analyze skills vs target role
**Props**:
- `initialSkills?: string[]`
- `onAnalysisReceived?: (analysis: string) => void`

```tsx
<AISkillAnalysis 
  initialSkills={['React', 'Node.js']}
  onAnalysisReceived={(analysis) => console.log(analysis)}
/>
```

---

## 🔌 useAI Hook API

### Available Methods
```typescript
const {
  // State
  isLoading: boolean,
  error: string | null,
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}>,
  
  // Methods
  getInterviewFeedback(question, answer) => Promise<string>,
  generateCodingExplanation(problem) => Promise<string>,
  getJobRecommendations(profile, jobDesc) => Promise<string>,
  getResumeReview(resumeContent, jobTitle) => Promise<string>,
  generateMockInterviewQuestions(jobTitle, company, count) => Promise<string>,
  analyzeSkills(skills, targetRole) => Promise<string>,
  askQuestion(question) => Promise<string>,
  clearHistory() => void,
  setApiKey(key: string) => void,
} = useAI();
```

---

## ⚙️ System Requirements

- Node.js 18+
- React 18.3.1+
- TypeScript 5.5.3+
- Modern browser with fetch API

### Peer Dependencies (Already Installed)
- react
- react-dom
- react-router-dom
- lucide-react

---

## 🐛 Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| "API key not found" | `.env` not configured | Create `.env` with key, restart |
| "Cannot find module" | Wrong import path | Check relative path (../../) |
| Slow responses | Large model selected | Use `pplx-7b-chat` |
| TypeScript errors | Missing types | Ensure imports are correct |
| No API response | Invalid API key | Verify at perplexity.ai/api |

### Debug Tips
```javascript
// In browser console
localStorage.getItem('authToken') // Check auth
window.location.pathname           // Check route
console.log('Debug:', variable)    // Check values
```

---

## 🚀 Performance Tips

1. **Cache Results** - Store AI responses locally
2. **Debounce Requests** - Avoid duplicate API calls
3. **Use Smaller Model** - For faster responses
4. **Reduce Tokens** - Shorter responses = faster
5. **Batch Questions** - Ask multiple at once

```typescript
// Example: Caching
const cache = useRef<Map<string, string>>(new Map());

const getCached = async (key: string) => {
  if (cache.current.has(key)) {
    return cache.current.get(key);
  }
  const result = await aiFunction(key);
  cache.current.set(key, result);
  return result;
};
```

---

## 🔐 Security Best Practices

✅ API key in `.env` file (never in code)
✅ `.env` added to `.gitignore`
✅ No secrets committed to version control
✅ Use environment variable management for production
✅ Validate and sanitize user inputs
✅ Monitor API usage for abuse

---

## 📊 Monitoring & Analytics

Track AI feature usage:
```typescript
const trackAIUsage = (feature: string, duration: number) => {
  // Log to analytics
  console.log(`Feature: ${feature}, Duration: ${duration}ms`);
};

// Use with AI calls
const start = Date.now();
const result = await getInterviewFeedback(q, a);
const duration = Date.now() - start;
trackAIUsage('interview-feedback', duration);
```

---

## 🎓 Learning Resources

### Official Docs
- [Perplexity API](https://docs.perplexity.ai/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Project Documentation
- QUICK_START_AI.md - Setup guide
- INTEGRATION_GUIDE.md - Implementation
- PERPLEXITY_AI_GUIDE.md - API Reference

---

## 🎉 You're Ready!

Everything is set up and ready to use. 

**Next Steps:**
1. Read `QUICK_START_AI.md` (5 min)
2. Set up your API key (1 min)
3. Test a component (5 min)
4. Integrate into your pages (10+ min)

**Total: ~20 minutes to full integration!**

---

## 📞 Support

- **API Issues**: Check [Perplexity API Status](https://www.perplexity.ai/api)
- **Integration Issues**: See INTEGRATION_GUIDE.md
- **TypeScript Issues**: Check type definitions in source files
- **Performance Issues**: See performance tips above

---

## 📝 License

Perplexity API - Follow their terms of service
Project code - Your project license

---

**Built with ❤️ for Career Success**

Happy learning and building! 🚀
