# 🚀 SETUP INSTRUCTIONS - GET STARTED IN 5 MINUTES

## What You Have
Your job seeker application now has **4 fully integrated AI features** ready to use!

---

## Step 1: Get Your API Key (2 minutes)

### Option A: Perplexity AI Free Tier
1. Go to https://www.perplexity.ai
2. Click **Sign Up** (top right)
3. Create account (email or Google login)
4. Navigate to **Settings** (left sidebar or profile menu)
5. Click **API** section
6. Click **Create New API Key**
7. Copy the key (looks like: `pplx_xxxxxxxxxxxxx`)
8. Keep it safe!

### Option B: Other AI Providers
You can modify `perplexityService.ts` to use other providers, but Perplexity is recommended for this setup.

---

## Step 2: Add API Key to Your Project (1 minute)

### 2a. Create `.env.local` File

In your project root folder (`c:\Users\patib\OneDrive\Desktop\222\project\`), create a new file named:

```
.env.local
```

**Important**: This file should be in the **root folder**, NOT in `src/`

### 2b. Add Your API Key

Open `.env.local` and add:

```
VITE_PERPLEXITY_API_KEY=your_actual_key_here
```

**Example**:
```
VITE_PERPLEXITY_API_KEY=pplx_abc123xyz789
```

**Note**: Replace `your_actual_key_here` with your actual Perplexity API key

### 2c. Save the File

Save the file (Ctrl+S in VS Code)

---

## Step 3: Start the Development Server (1 minute)

### 3a. Open Terminal

In VS Code:
- Press `Ctrl + ~` (backtick) to open terminal
- Or: Terminal → New Terminal

### 3b. Run Development Server

In terminal, run:
```bash
npm run dev
```

**Expected output**:
```
  VITE v... ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### 3c. Open in Browser

Click the link or go to: http://localhost:5173/

---

## Step 4: Test the AI Features (1 minute)

### Test #1: Interview Feedback
1. **Navigate**: Dashboard → Student → Interview Preparation
2. **Action**: Select a category and a practice question
3. **Write**: Type an answer in the text area
4. **Click**: Purple "Get AI Feedback" button
5. **Wait**: 2-5 seconds for response
6. **See**: Feedback in purple box ✅

### Test #2: Code Explanation
1. **Navigate**: Dashboard → Student → Assessments
2. **Find**: Any assessment (coding preferred)
3. **Click**: "View Details" button
4. **In Modal**: Click purple "AI Explanation" button
5. **Wait**: 2-5 seconds for response
6. **See**: Explanation in blue box ✅

### Test #3: Career Tips
1. **Navigate**: Dashboard (home)
2. **Look**: "Career Tip from AI" section (under Quick Actions)
3. **See**: A career tip displayed
4. **Click**: Sparkle (✨) icon to refresh
5. **Wait**: 2-3 seconds for new tip
6. **See**: New tip appears ✅

### Test #4: Job Matching
1. **Navigate**: Dashboard → Student → Jobs
2. **Browse**: Job listings
3. **Click**: Purple "AI Match" button on any job
4. **Wait**: 2-5 seconds for analysis
5. **See**: Match analysis in blue box ✅

---

## ✅ All Tests Passed?

Congratulations! Your AI features are working! 🎉

If all 4 tests show AI responses, you're ready to go.

---

## ❌ Troubleshooting

### Problem: Getting errors in terminal
**Solution**: 
1. Make sure you ran `npm install` first
2. Check that Node.js is installed: `node --version`
3. Update npm: `npm install -g npm@latest`

### Problem: API key error (401 Unauthorized)
**Solution**:
1. Check your API key is correct in `.env.local`
2. Copy-paste it again from Perplexity
3. Make sure there are no extra spaces: `VITE_PERPLEXITY_API_KEY=pplx_xxx` (no spaces around =)
4. Restart the dev server: Stop it (Ctrl+C) and run `npm run dev` again

### Problem: "Loading..." spinner never stops
**Solution**:
1. Open browser console: Press F12 → Console tab
2. Look for red error messages
3. Check if error is about API key or network
4. Try getting a new API key from Perplexity

### Problem: `.env.local` file not working
**Solution**:
1. Make sure file is named exactly `.env.local` (with the dot)
2. Make sure it's in the **root folder** (not in `src/`)
3. Make sure it's not named `.env.local.txt` (no .txt)
4. Restart dev server after creating file: Ctrl+C then `npm run dev`

### Problem: Buttons don't appear
**Solution**:
1. Make sure you're on the right pages (Interview Prep, Assessments, Dashboard, Jobs)
2. Refresh the browser: Press F5
3. Check browser console for JavaScript errors: Press F12
4. Restart dev server

### Problem: Styling looks wrong
**Solution**:
1. Make sure dev server is running: Check terminal
2. Tailwind CSS should be active automatically
3. Refresh browser: Press F5 or Ctrl+Shift+R
4. Clear browser cache if needed

---

## 🔑 Environment File Checklist

Your `.env.local` file should:

- [ ] Be named exactly `.env.local` (with dot, not `.txt`)
- [ ] Be in the **root folder** of the project
- [ ] Contain: `VITE_PERPLEXITY_API_KEY=your_key`
- [ ] Have no extra spaces or quotes
- [ ] Be created before running `npm run dev`
- [ ] Not be committed to Git (usually ignored automatically)

**Example of correct file**:
```
VITE_PERPLEXITY_API_KEY=pplx_1234567890abcdefghijk
```

**Example of WRONG files**:
```
❌ VITE_PERPLEXITY_API_KEY = pplx_xxx (spaces around =)
❌ VITE_PERPLEXITY_API_KEY="pplx_xxx" (quotes)
❌ .env (wrong filename)
❌ .env.local.txt (has .txt extension)
```

---

## 📂 File Locations for Reference

If you need to modify AI features later, here's where they are:

### AI Service (where API calls happen)
```
src/services/perplexityService.ts
```

### AI Context (where global state is)
```
src/contexts/AIContext.tsx
```

### Modified Pages (where buttons are)
```
src/pages/Student/InterviewPreparationPage.tsx  → Get AI Feedback button
src/pages/Student/AssessmentsPage.tsx           → AI Explanation button
src/pages/Student/JobsPage.tsx                  → AI Match button
src/components/Dashboard/StudentDashboard.tsx   → Career Tips section
```

### AI Components (optional features)
```
src/components/AI/AIChat.tsx                    → Floating chat
src/components/AI/AIInterviewFeedback.tsx       → Interview form
src/components/AI/AIResumeReview.tsx            → Resume form
src/components/AI/AISkillAnalysis.tsx           → Skill analysis
```

---

## 🎯 Quick Commands Reference

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Run Linting (Check for errors)
```bash
npm run lint
```

### Type Check (Check TypeScript)
```bash
npm run type-check
```

---

## 📊 Feature Availability

After setup, you'll have access to:

| Feature | Available | Location |
|---------|-----------|----------|
| Interview Feedback | ✅ Yes | Interview Prep page |
| Code Explanation | ✅ Yes | Assessments page |
| Career Tips | ✅ Yes | Dashboard |
| Job Matching | ✅ Yes | Jobs page |
| Floating Chat | ✅ Yes | Bottom right (floating) |
| Resume Review | 🟡 Available | (add button to use) |
| Skill Analysis | 🟡 Available | (add button to use) |
| Interview Questions | 🟡 Available | (add button to use) |

---

## 🎨 What You'll See

### Interview Feedback Button
```
Purple button with light bulb icon
Label: "Get AI Feedback"
Location: Next to "Complete Practice" button
Color when hover: Darker purple
```

### AI Explanation Button
```
Purple button with light bulb icon
Label: "AI Explanation"
Location: In assessment details modal
Color when hover: Darker purple
Only shows for: Coding assessments
```

### Career Tips Section
```
Purple/gradient box with sparkle icon
Title: "Career Tip from AI"
Location: Dashboard, under Quick Actions
Has: Refresh button (sparkle icon)
```

### Job Match Button
```
Purple button with lightning bolt icon
Label: "AI Match"
Location: Top right of each job card
Color when hover: Darker purple
```

---

## 🆘 Need Help?

### Check These Files First
1. `.env.local` - Is your API key there?
2. Terminal - Are there error messages?
3. Browser Console - Press F12, check Console tab
4. Network tab - Press F12, click Network, try AI feature

### Common Issues Reference
- **No response from AI**: Check API key is correct
- **Error 401**: API key wrong or expired
- **"Loading..." forever**: Check browser console for errors
- **Button missing**: Refresh page or restart dev server
- **Wrong styling**: Restart dev server

### Documentation Files
- `QUICKSTART_AI_FEATURES.md` - Quick overview
- `AI_FEATURES_MAP.md` - Where to find each feature
- `VERIFICATION_REPORT.md` - Complete technical details

---

## ✨ You're All Set!

Follow these 4 steps:

1. ✅ Get API key from Perplexity
2. ✅ Create `.env.local` with key
3. ✅ Run `npm run dev`
4. ✅ Test all 4 features

Then you're ready to use your AI-powered job seeker app!

---

## 🚀 Next Steps

After setup works:

1. **Explore**: Try each AI feature to see what it can do
2. **Customize**: Modify prompts in `perplexityService.ts` if needed
3. **Deploy**: Add `.env` variables to your hosting platform
4. **Extend**: Add more AI features to other pages

---

## 📞 Final Checklist

Before claiming victory:

- [ ] `.env.local` file created in root folder
- [ ] API key added to `.env.local`
- [ ] Dev server running (`npm run dev`)
- [ ] Can see Interview Feedback button
- [ ] Can see AI Explanation button
- [ ] Can see Career Tips on Dashboard
- [ ] Can see AI Match button on Jobs page
- [ ] Clicked each button and got response
- [ ] No console errors (F12 to check)
- [ ] All buttons are purple
- [ ] Loading states show correctly

---

## 🎉 Success!

When all checkboxes are done, you're ready! Your AI features are live and working.

Now go build something amazing! 🚀

---

**Time to Complete**: 5 minutes  
**Difficulty**: Easy  
**Result**: 4 AI features live in your app  

Enjoy your AI-powered job seeker platform! 🤖✨
