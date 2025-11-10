# Perplexity AI Integration - Visual Setup & Architecture Guide

## 🎯 5-Minute Setup Flow

```
┌─────────────────────────────────────────────┐
│ STEP 1: Get API Key (2 min)                 │
├─────────────────────────────────────────────┤
│ Go to: https://www.perplexity.ai/api        │
│ Sign Up → Create Account → Get Free Key    │
│ Copy the API key                            │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ STEP 2: Create .env File (1 min)            │
├─────────────────────────────────────────────┤
│ In project root, create .env file:          │
│ ────────────────────────────────────────    │
│ VITE_PERPLEXITY_API_KEY=your_key_here      │
│ ────────────────────────────────────────    │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ STEP 3: Restart Dev Server (1 min)          │
├─────────────────────────────────────────────┤
│ $ npm run dev                               │
│ Server running on localhost:5173            │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ STEP 4: Test Features (1 min)               │
├─────────────────────────────────────────────┤
│ ✅ AI features ready to use!                │
│ ✅ Try interview feedback                   │
│ ✅ Try resume review                        │
│ ✅ Try skill analysis                       │
└─────────────────────────────────────────────┘
                    ↓
              ✨ DONE! ✨
```

---

## 📁 File Structure Overview

```
project/
│
├── 📄 Configuration Files
│   ├── .env ........................... ← ADD YOUR API KEY HERE
│   ├── .env.example ................... Template
│   ├── vite.config.ts ................. (no change)
│   └── tsconfig.json .................. (no change)
│
├── 📚 Documentation (NEW)
│   ├── QUICK_START_AI.md .............. ⭐ START HERE
│   ├── README_AI.md ................... Overview
│   ├── INTEGRATION_GUIDE.md ........... How to use
│   ├── PERPLEXITY_AI_GUIDE.md ......... Complete reference
│   ├── AI_SETUP_SUMMARY.md ............ Setup summary
│   └── CHANGELOG.md ................... What changed
│
└── 📦 Source Code
    └── src/
        ├── App.tsx .................... ✅ Updated (AIProvider)
        │
        ├── services/ (NEW AI SERVICE)
        │   └── perplexityService.ts ... ✨ AI API calls
        │
        ├── contexts/ (NEW AI STATE)
        │   └── AIContext.tsx .......... ✨ Global AI state
        │
        └── components/
            └── AI/ (NEW AI COMPONENTS)
                ├── AIChat.tsx ......................... Chat widget
                ├── AIInterviewFeedback.tsx .......... Interview feedback
                ├── AIResumeReview.tsx .............. Resume review
                └── AISkillAnalysis.tsx ............. Skill analysis
```

---

## 🏗️ Component Architecture

```
                            App.tsx
                              │
                    ┌─────────┴─────────┐
                    │                   │
                AuthProvider      AIProvider ← NEW!
                    │                   │
                    ├─────────┬─────────┤
                    │         │         │
            JobsProvider  PipelineProvider  AppContent
                                │
                            Router
                              │
                    ┌─────────────────────┐
                    │                     │
              Login Pages        Protected Pages
                    │                     │
                    │         ┌───────────┴────────────┐
                    │         │                        │
                Dashboard   Interview Prep        Assessments
                    │         │                        │
            useAI()│   useAI()│  useAI()               │
                    │         │                        │
        ┌───────────┴─────────┴────────────────────────┤
        │                                               │
        └──────────────→ useAI() Hook ←─────────────────┘
                             │
                        AIContext
                             │
                    PerplexityService
                             │
                      Perplexity API
```

---

## 🔄 Data Flow Diagram

### How an AI Request Works

```
1. User clicks "Get AI Feedback" button
   ↓
2. Component calls useAI() hook
   → const { getInterviewFeedback } = useAI()
   ↓
3. Hook calls AI method
   → await getInterviewFeedback(question, answer)
   ↓
4. AIContext updates loading state
   → setIsLoading(true)
   ↓
5. PerplexityService makes API call
   → POST https://api.perplexity.ai/chat/completions
   ↓
6. Request includes:
   ├── Authorization: Bearer YOUR_API_KEY
   ├── Messages: [{role, content}]
   ├── Model: llama-2-70b-chat
   └── Max tokens: 1024
   ↓
7. Perplexity API processes request
   ↓
8. Returns AI response
   ↓
9. Service processes response
   ↓
10. AIContext stores in conversation history
    → conversationHistory.push({role: 'assistant', content})
    ↓
11. Loading state updated
    → setIsLoading(false)
    ↓
12. Component re-renders with response
    ↓
13. User sees AI feedback
```

---

## 🎮 Usage Pattern Examples

### Pattern 1: Simple Button + Response
```
┌─────────────────────────┐
│  User Interface         │
├─────────────────────────┤
│ [Get AI Feedback Button]│ ← Click
└────────────┬────────────┘
             │
             ↓
┌─────────────────────────┐
│  Component State        │
├─────────────────────────┤
│ isLoading: false → true │
│ feedback: '' → 'AI text'│
└─────────────────────────┘
             ↓
┌─────────────────────────┐
│  Result Display         │
├─────────────────────────┤
│ "Great answer! Here..." │
└─────────────────────────┘
```

### Pattern 2: Form + Analysis
```
┌──────────────────────────────┐
│  Resume Form                 │
├──────────────────────────────┤
│ [Text Area]                  │
│ [Job Title Input]            │
│ [Analyze Button]             │ ← Click
└──────────────────────────────┘
             │
             ↓
┌──────────────────────────────┐
│  Validation Check            │
├──────────────────────────────┤
│ Content not empty? ✓         │
│ Job title provided? ✓        │
└──────────────────────────────┘
             │
             ↓
┌──────────────────────────────┐
│  AI Analysis                 │
├──────────────────────────────┤
│ API Call → Processing        │
│ Loading... (spinner)         │
└──────────────────────────────┘
             │
             ↓
┌──────────────────────────────┐
│  Results Displayed           │
├──────────────────────────────┤
│ ✅ Here's your review...     │
│ 📝 Improvements suggested    │
│ 🎯 Action items              │
└──────────────────────────────┘
```

---

## 🔑 Key Concepts

### 1. Context (Global State)
```
AIContext provides:
├── isLoading: boolean
├── error: string | null
├── conversationHistory: Message[]
└── AI methods: function
    ├── getInterviewFeedback()
    ├── generateCodingExplanation()
    ├── getJobRecommendations()
    ├── getResumeReview()
    ├── generateMockInterviewQuestions()
    ├── analyzeSkills()
    └── askQuestion()

Access anywhere:
const { isLoading, error } = useAI();
```

### 2. Service Layer (API Calls)
```
PerplexityService handles:
├── API authentication
├── Request formatting
├── Response parsing
├── Error handling
└── All AI functionality

Used by AIContext
Not directly used by components
```

### 3. Components (UI)
```
AIChat ..................... General chat
AIInterviewFeedback ......... Answer feedback
AIResumeReview ............. Resume optimization
AISkillAnalysis ............ Skill gap analysis

All use:
├── useAI() hook
├── Local state
└── Tailwind styling
```

---

## 🔗 Integration Checklist

### Phase 1: Setup ✅
- [ ] Create .env file
- [ ] Add API key
- [ ] Restart server
- [ ] Verify no errors

### Phase 2: Test ✅
- [ ] Test AIChat component
- [ ] Test AIInterviewFeedback
- [ ] Test AIResumeReview
- [ ] Test AISkillAnalysis

### Phase 3: Integrate
- [ ] Add to Interview Prep page
- [ ] Add to Assessments page
- [ ] Add to Mock Interviews
- [ ] Add to Job Search
- [ ] Add to Dashboard

### Phase 4: Enhance
- [ ] Customize prompts
- [ ] Add response caching
- [ ] Implement analytics
- [ ] Optimize performance
- [ ] Deploy

---

## 📊 API Call Anatomy

```
Perplexity API Request:
┌────────────────────────────────────────┐
│ POST /chat/completions                 │
├────────────────────────────────────────┤
│ Headers:                               │
│ ├── Authorization: Bearer YOUR_KEY     │
│ ├── Content-Type: application/json     │
│ └── Accept: application/json           │
│                                        │
│ Body:                                  │
│ {                                      │
│   "model": "llama-2-70b-chat",        │
│   "messages": [                        │
│     {                                  │
│       "role": "system",               │
│       "content": "You are..."          │
│     },                                 │
│     {                                  │
│       "role": "user",                 │
│       "content": "Question..."        │
│     }                                  │
│   ],                                   │
│   "max_tokens": 1024,                 │
│   "temperature": 0.7,                 │
│   "top_p": 0.9                        │
│ }                                      │
└────────────────────────────────────────┘

Response:
┌────────────────────────────────────────┐
│ {                                      │
│   "id": "...",                         │
│   "choices": [{                        │
│     "message": {                       │
│       "role": "assistant",             │
│       "content": "AI Response..."      │
│     },                                 │
│     "finish_reason": "stop"            │
│   }],                                  │
│   "usage": {                           │
│     "prompt_tokens": 50,               │
│     "completion_tokens": 100,          │
│     "total_tokens": 150                │
│   }                                    │
│ }                                      │
└────────────────────────────────────────┘
```

---

## 🎯 Component Usage Tree

```
App.tsx (AIProvider)
│
├── Header
│   └── [AI Chat Button] → AIChat
│
├── Sidebar
│   └── Navigation links
│
├── Dashboard
│   ├── [AI Insights Card] → useAI()
│   └── useAI() → askQuestion()
│
├── Interview Prep Page
│   ├── [Get AI Feedback] → AIInterviewFeedback
│   ├── [Generate Questions] → useAI()
│   └── useAI() → generateMockInterviewQuestions()
│
├── Assessments Page
│   ├── [Explain Problem] → useAI()
│   └── useAI() → generateCodingExplanation()
│
├── Jobs Page
│   ├── [AI Match Score] → useAI()
│   └── useAI() → getJobRecommendations()
│
└── Profile Page
    ├── [Review Resume] → AIResumeReview
    └── [Analyze Skills] → AISkillAnalysis
```

---

## 🚦 State Management Flow

```
Component State Changes:

Initial State:
├── isLoading: false
├── error: null
├── feedback: ''
└── showResult: false

User Clicks Button:
├── isLoading: true ← Component disabled
├── error: null
├── feedback: '' ← Cleared
└── showResult: false

API Responds:
├── isLoading: false ← Component enabled
├── error: null (or error message)
├── feedback: 'AI response...' ← Show content
└── showResult: true ← Display result

User Interactions:
├── Copy button → Feedback copied
├── Clear button → Clear history
├── New question → Repeat cycle
```

---

## ⚙️ Configuration Customization

```
Environment Variables:

VITE_PERPLEXITY_API_KEY=xxx
├── Purpose: API authentication
├── Required: Yes
├── Type: String
└── Where: perplexity.ai/api

VITE_PERPLEXITY_MODEL=llama-2-70b-chat
├── Purpose: Choose AI model
├── Default: llama-2-70b-chat
├── Options:
│   ├── pplx-7b-chat (fastest)
│   ├── llama-2-70b-chat (balanced)
│   └── pplx-70b-chat (most detailed)
└── Impact: Speed & quality tradeoff

VITE_AI_MAX_TOKENS=1024
├── Purpose: Max response length
├── Default: 1024
├── Range: 100-4000
└── Impact: Response detail & cost

VITE_AI_TEMPERATURE=0.7
├── Purpose: Response creativity
├── Default: 0.7
├── Range: 0.0-1.0
│   ├── 0.0: Very focused
│   ├── 0.7: Balanced (default)
│   └── 1.0: Very creative
└── Impact: Response variation
```

---

## 🎓 Learning Path

```
Day 1: Setup
├── Read: QUICK_START_AI.md (5 min)
├── Do: Create .env file (1 min)
├── Do: Restart server (1 min)
├── Test: Check no errors (2 min)
└── Total: ~10 minutes

Day 2: Testing
├── Read: Component examples (10 min)
├── Do: Use AIChat component (10 min)
├── Do: Try AIInterviewFeedback (10 min)
├── Do: Try AIResumeReview (10 min)
└── Total: ~40 minutes

Day 3: Integration
├── Read: INTEGRATION_GUIDE.md (15 min)
├── Do: Add AI to one page (30 min)
├── Test: Verify functionality (15 min)
├── Do: Customize prompts (20 min)
└── Total: ~1.5 hours

Day 4+: Enhancement
├── Add AI to all pages
├── Implement caching
├── Add analytics
├── Performance optimization
└── Deploy to production
```

---

**Happy integrating! 🚀**

For detailed setup, see `QUICK_START_AI.md`
For implementation details, see `INTEGRATION_GUIDE.md`
For API reference, see `PERPLEXITY_AI_GUIDE.md`
