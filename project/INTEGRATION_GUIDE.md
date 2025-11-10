# Complete Integration Guide: Adding AI to Your Pages

This guide shows you exactly where and how to add AI features to different pages in your application.

## Table of Contents
1. [Interview Preparation Page](#interview-preparation-page)
2. [Assessments Page](#assessments-page)
3. [Mock Interviews Page](#mock-interviews-page)
4. [Student Dashboard](#student-dashboard)
5. [Jobs Page](#jobs-page)

---

## Interview Preparation Page

**File**: `src/pages/Student/InterviewPreparationPage.tsx`

### What to Add:
- AI feedback on practice answers
- Generate company-specific questions with AI

### Implementation:

1. **Add imports at the top:**
```tsx
import { useAI } from '../../contexts/AIContext';
import AIInterviewFeedback from '../../components/AI/AIInterviewFeedback';
```

2. **Add state in the component:**
```tsx
const InterviewPreparationPage: React.FC = () => {
  // ... existing state
  const { generateMockInterviewQuestions, isLoading: aiLoading } = useAI();
  const [showAIFeedback, setShowAIFeedback] = useState(false);
  
  // ... rest of component
}
```

3. **Add AI button in practice mode (around line 300):**
```tsx
{/* Add this button next to the "Complete Practice" button */}
<button
  onClick={() => setShowAIFeedback(!showAIFeedback)}
  disabled={!answer.trim()}
  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
>
  <Lightbulb className="h-4 w-4" />
  <span>AI Feedback</span>
</button>

{showAIFeedback && (
  <div className="mt-4">
    <AIInterviewFeedback 
      question={currentQuestion?.question || ''}
      onFeedbackReceived={() => {}}
    />
  </div>
)}
```

4. **Add button to generate company questions (around line 350):**
```tsx
<button
  onClick={async () => {
    const questions = await generateMockInterviewQuestions(
      selectedCompany?.name || '',
      selectedCompany?.industry || '',
      3
    );
    alert(questions); // Replace with proper display
  }}
  disabled={aiLoading || !selectedCompany}
  className="mt-4 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
>
  {aiLoading ? 'Generating...' : 'Generate More Questions'}
</button>
```

---

## Assessments Page

**File**: `src/pages/Student/AssessmentsPage.tsx`

### What to Add:
- Explain coding problems with AI
- Provide hints for assessments

### Implementation:

1. **Add imports:**
```tsx
import { useAI } from '../../contexts/AIContext';
```

2. **Add state:**
```tsx
const { generateCodingExplanation, isLoading: aiLoading } = useAI();
const [selectedAssessmentExplanation, setSelectedAssessmentExplanation] = useState<string>('');
```

3. **Add AI explanation button in the assessment details (around line 100):**
```tsx
<button
  onClick={async () => {
    if (selectedAssessment) {
      const explanation = await generateCodingExplanation(
        selectedAssessment.title
      );
      setSelectedAssessmentExplanation(explanation);
    }
  }}
  disabled={aiLoading}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
>
  {aiLoading ? 'Generating Explanation...' : 'Get AI Explanation'}
</button>

{selectedAssessmentExplanation && (
  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
    <h4 className="font-semibold text-blue-900 mb-2">AI Explanation:</h4>
    <p className="text-blue-800 text-sm whitespace-pre-wrap">
      {selectedAssessmentExplanation}
    </p>
  </div>
)}
```

---

## Mock Interviews Page

**File**: `src/pages/Student/MockInterviewsPage.tsx`

### What to Add:
- Generate realistic mock interview questions
- Provide AI feedback on answers

### Implementation:

1. **Add imports:**
```tsx
import { useAI } from '../../contexts/AIContext';
import AIInterviewFeedback from '../../components/AI/AIInterviewFeedback';
```

2. **Add state:**
```tsx
const { generateMockInterviewQuestions, getInterviewFeedback, isLoading: aiLoading } = useAI();
const [mockQuestions, setMockQuestions] = useState<string[]>([]);
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [showAIFeedback, setShowAIFeedback] = useState(false);
```

3. **Add button to generate questions:**
```tsx
<button
  onClick={async () => {
    const questions = await generateMockInterviewQuestions(
      'Software Engineer',
      'Your Target Company',
      5
    );
    // Parse the questions string and convert to array
    setMockQuestions(questions.split('\n').filter(q => q.trim()));
  }}
  disabled={aiLoading}
  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
>
  {aiLoading ? 'Generating Questions...' : 'Generate Mock Questions'}
</button>
```

4. **Display questions and get feedback:**
```tsx
{mockQuestions.length > 0 && (
  <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-xl font-semibold mb-4">
      Question {currentQuestionIndex + 1} of {mockQuestions.length}
    </h3>
    <p className="text-lg mb-6">{mockQuestions[currentQuestionIndex]}</p>
    
    <AIInterviewFeedback 
      question={mockQuestions[currentQuestionIndex]}
      onFeedbackReceived={() => {}}
    />
  </div>
)}
```

---

## Student Dashboard

**File**: `src/components/Dashboard/StudentDashboard.tsx`

### What to Add:
- Quick AI tips for interview prep
- Skill recommendations
- Job matching insights

### Implementation:

1. **Add imports:**
```tsx
import { useAI } from '../../contexts/AIContext';
```

2. **Add AI insights card:**
```tsx
const StudentDashboard: React.FC = () => {
  const { askQuestion, isLoading: aiLoading } = useAI();
  const [aiTip, setAiTip] = useState('');

  useEffect(() => {
    // Get an AI tip on component mount
    const getTip = async () => {
      const tip = await askQuestion(
        'Give me one practical tip for preparing for a technical interview in 2-3 sentences.'
      );
      setAiTip(tip);
    };
    
    getTip();
  }, []);

  return (
    <div className="space-y-6">
      {/* Existing dashboard content */}
      
      {/* AI Insights Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Lightbulb className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">AI Career Tip</h3>
            <p className="text-blue-100">{aiTip || 'Loading tip...'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Jobs Page

**File**: `src/pages/Student/JobsPage.tsx`

### What to Add:
- AI-powered job matching score
- Interview preparation tips for specific job
- Resume optimization suggestions

### Implementation:

1. **Add imports:**
```tsx
import { useAI } from '../../contexts/AIContext';
```

2. **Add state:**
```tsx
const { getJobRecommendations, isLoading: aiLoading } = useAI();
const [jobMatch, setJobMatch] = useState<string>('');
const [selectedJobForAnalysis, setSelectedJobForAnalysis] = useState<string>('');
```

3. **Add AI analysis button to job card:**
```tsx
<button
  onClick={async () => {
    // Assuming you have job and user data
    const studentProfile = 'React Developer with 2 years experience';
    const jobDescription = job.description;
    
    const match = await getJobRecommendations(
      studentProfile,
      jobDescription
    );
    setJobMatch(match);
    setSelectedJobForAnalysis(job.id);
  }}
  disabled={aiLoading}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
>
  {aiLoading ? 'Analyzing...' : 'AI Match Score'}
</button>

{selectedJobForAnalysis === job.id && jobMatch && (
  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
    <h4 className="font-semibold text-green-900 mb-2">AI Analysis:</h4>
    <p className="text-green-800 text-sm whitespace-pre-wrap">{jobMatch}</p>
  </div>
)}
```

---

## Global AI Chat Widget

The AI chat is already integrated in `App.tsx`. To make it accessible:

1. **Create a floating button** in `Header.tsx` or `Sidebar.tsx`:

```tsx
import { MessageCircle } from 'lucide-react';

// In your header/sidebar component:
<button
  onClick={() => setIsAIChatOpen(true)}
  className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
  title="Open AI Chat"
>
  <MessageCircle className="h-6 w-6" />
</button>
```

2. **Pass the state through context** if needed or use a callback pattern.

---

## Testing Your Integration

After adding AI features to a page:

1. **Check if API key is set:**
   ```bash
   echo $env:VITE_PERPLEXITY_API_KEY  # PowerShell
   ```

2. **Restart dev server:**
   ```bash
   npm run dev
   ```

3. **Test the feature** by clicking the AI button

4. **Check browser console** for errors

---

## Common Patterns

### Pattern 1: Button + Loading + Result
```tsx
const [response, setResponse] = useState('');
const [isLoading, setIsLoading] = useState(false);

const handleClick = async () => {
  setIsLoading(true);
  try {
    const result = await aiFunction();
    setResponse(result);
  } finally {
    setIsLoading(false);
  }
};

return (
  <>
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Get AI Response'}
    </button>
    {response && <div>{response}</div>}
  </>
);
```

### Pattern 2: Form + AI Analysis
```tsx
const [input, setInput] = useState('');
const [analysis, setAnalysis] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await aiFunction(input);
  setAnalysis(result);
};

return (
  <form onSubmit={handleSubmit}>
    <textarea 
      value={input} 
      onChange={(e) => setInput(e.target.value)} 
    />
    <button type="submit">Analyze</button>
    {analysis && <div>{analysis}</div>}
  </form>
);
```

---

## Performance Tips

1. **Debounce requests:**
   ```tsx
   import { useCallback } from 'react';
   
   const debouncedRequest = useCallback(
     debounce(async (query) => {
       const result = await aiFunction(query);
     }, 500),
     []
   );
   ```

2. **Cache results:**
   ```tsx
   const cache = useRef<Map<string, string>>(new Map());
   
   const getOrFetch = async (key: string) => {
     if (cache.current.has(key)) {
       return cache.current.get(key);
     }
     const result = await aiFunction(key);
     cache.current.set(key, result);
     return result;
   };
   ```

3. **Batch requests:**
   ```tsx
   const { askMultipleQuestions } = useAI();
   const answers = await askMultipleQuestions([q1, q2, q3]);
   ```

---

## Troubleshooting Integration Issues

| Issue | Solution |
|-------|----------|
| Component not found | Check import paths |
| API key error | Verify `.env` file and restart server |
| TypeScript errors | Add proper types to state variables |
| Slow rendering | Move AI call to useEffect with cleanup |
| Context not found | Ensure AIProvider wraps your component |

---

## Next Steps

1. Choose a page to add AI features to
2. Follow the implementation steps above
3. Test the feature works
4. Customize prompts for your use case
5. Deploy when ready

See [PERPLEXITY_AI_GUIDE.md](./PERPLEXITY_AI_GUIDE.md) for more details!
