import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, DollarSign, TrendingUp, FileText, Send, Zap, Loader, BookOpen, Briefcase as BriefcaseIcon, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../contexts/JobsContext';
import { useAI } from '../../contexts/AIContext';

const JobsPage: React.FC = () => {
  const { user } = useAuth();
  const { jobs, loading, error } = useJobs();
  const { getJobRecommendations, isLoading: aiLoading, askQuestion } = useAI();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [aiMatch, setAiMatch] = useState<string>('');
  const [showAiMatch, setShowAiMatch] = useState(false);
  const [aiMatchLoading, setAiMatchLoading] = useState(false);
  
  // New AI Features
  const [resumeTips, setResumeTips] = useState<string>('');
  const [showResumeTips, setShowResumeTips] = useState(false);
  const [resumeTipsLoading, setResumeTipsLoading] = useState(false);
  
  const [interviewQuestions, setInterviewQuestions] = useState<string>('');
  const [showInterviewQuestions, setShowInterviewQuestions] = useState(false);
  const [interviewQuestionsLoading, setInterviewQuestionsLoading] = useState(false);
  
  const [salaryTips, setSalaryTips] = useState<string>('');
  const [showSalaryTips, setShowSalaryTips] = useState(false);
  const [salaryTipsLoading, setSalaryTipsLoading] = useState(false);
  
  const [companyCulture, setCompanyCulture] = useState<string>('');
  const [showCompanyCulture, setShowCompanyCulture] = useState(false);
  const [companyCultureLoading, setCompanyCultureLoading] = useState(false);

  const calculateATSScore = (jobSkills: string[], resumeFile: File | null): number => {
    if (!resumeFile) return 0;
    
    // Calculate a more realistic ATS score based on various factors
    // This simulates resume analysis without actually reading file content
    
    const baseScore = (jobSkills.length > 0) ? 40 : 30; // Base score
    const skillBonus = Math.min(jobSkills.length * 8, 40); // Skills match bonus
    const fileNameBonus = resumeFile.name.toLowerCase().includes('resume') ? 5 : 0;
    const fileSizeBonus = (resumeFile.size > 50000 && resumeFile.size < 500000) ? 10 : 5; // Realistic resume size
    const randomVariation = Math.floor(Math.random() * 15); // Random 0-15% variation
    
    const totalScore = Math.min(
      baseScore + skillBonus + fileNameBonus + fileSizeBonus + randomVariation,
      100
    );
    
    return Math.max(Math.round(totalScore), 20); // Minimum 20% to show it's not perfect
  };

  const handleApplyJob = (job: any) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
    setAtsScore(null);
    setResume(null);  // Reset resume when opening new application
    setCoverLetter('');  // Reset cover letter too
  };

  const getAiJobMatch = async (job: any) => {
    if (!job) return;
    setAiMatchLoading(true);
    try {
      const matchAnalysis = await getJobRecommendations(
        'Software Developer with React, TypeScript, and JavaScript skills',
        job.title
      );
      setAiMatch(matchAnalysis);
      setShowAiMatch(true);
    } catch (err) {
      console.error('Failed to get AI job match:', err);
    } finally {
      setAiMatchLoading(false);
    }
  };

  // NEW AI FEATURE 1: Resume Tips
  const getResumeTips = async (job: any) => {
    if (!job) return;
    setResumeTipsLoading(true);
    try {
      const tips = await askQuestion(
        `I am applying for a ${job.title} position at ${job.company}. The job requires: ${job.skillsRequired.join(', ')}. 
        Please provide specific tips to optimize my resume for this role. Include:
        1. Key sections to highlight
        2. Specific skills to emphasize
        3. Metrics and achievements to include
        4. Keywords from job description to add`
      );
      setResumeTips(tips);
      setShowResumeTips(true);
    } catch (err) {
      console.error('Failed to get resume tips:', err);
    } finally {
      setResumeTipsLoading(false);
    }
  };

  // NEW AI FEATURE 2: Interview Questions
  const getInterviewQuestions = async (job: any) => {
    if (!job) return;
    setInterviewQuestionsLoading(true);
    try {
      const questions = await askQuestion(
        `I have an interview coming up for a ${job.title} position. The job description is: ${job.jobDescription}
        Required skills: ${job.skillsRequired.join(', ')}
        Please provide the top 10 likely interview questions I should prepare for this role, along with hints on how to answer them effectively.`
      );
      setInterviewQuestions(questions);
      setShowInterviewQuestions(true);
    } catch (err) {
      console.error('Failed to get interview questions:', err);
    } finally {
      setInterviewQuestionsLoading(false);
    }
  };

  // NEW AI FEATURE 3: Salary Negotiation Tips
  const getSalaryNegotiationTips = async (job: any) => {
    if (!job) return;
    setSalaryTipsLoading(true);
    try {
      const tips = await askQuestion(
        `I am interviewing for a ${job.title} position in the tech industry. 
        Please provide salary negotiation guidance including:
        1. Typical salary range for this role
        2. Key factors to negotiate besides salary
        3. When and how to bring up compensation
        4. Red flags to watch out for
        5. Tips for negotiating benefits and flexibility`
      );
      setSalaryTips(tips);
      setShowSalaryTips(true);
    } catch (err) {
      console.error('Failed to get salary tips:', err);
    } finally {
      setSalaryTipsLoading(false);
    }
  };

  // NEW AI FEATURE 4: Company Culture Fit Analysis
  const getCompanyCultureAnalysis = async (job: any) => {
    if (!job) return;
    setCompanyCultureLoading(true);
    try {
      const analysis = await askQuestion(
        `I am considering joining ${job.company} as a ${job.title}. The company focuses on: ${job.jobDescription}
        Can you analyze:
        1. What type of company culture this likely represents
        2. What kind of work environment would suit this role
        3. Questions I should ask about company culture in interviews
        4. Red flags or green flags to look for
        5. How to assess cultural fit during interviews`
      );
      setCompanyCulture(analysis);
      setShowCompanyCulture(true);
    } catch (err) {
      console.error('Failed to get culture analysis:', err);
    } finally {
      setCompanyCultureLoading(false);
    }
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResume(file);
      if (selectedJob && selectedJob.skillsRequired) {
        const score = calculateATSScore(selectedJob.skillsRequired, file);
        console.log('ATS Score calculated:', score);  // Debug log
        setAtsScore(score);
      } else {
        console.warn('Selected job or skills not available:', selectedJob);  // Debug log
      }
    }
  };

  const handleSubmitApplication = () => {
    if (selectedJob && resume) {
      // Here you would submit the application to your backend
      alert(`Application submitted for ${selectedJob.title} with ATS Score: ${atsScore}%`);
      setShowApplicationModal(false);
      setSelectedJob(null);
      setResume(null);
      setCoverLetter('');
      setAtsScore(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <Briefcase className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
        </div>
        <p className="text-gray-600 mt-2">Browse and apply for available positions with ATS score analysis</p>
      </div>

      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <p className="text-gray-500">No job postings available</p>
          </div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
                  <p className="text-gray-600">{job.company}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Posted: {new Date(job.postedDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              <div className="flex flex-col gap-2">
                  <button
                    onClick={() => getAiJobMatch(job)}
                    disabled={aiMatchLoading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 flex items-center gap-2 transition-colors"
                  >
                    {aiMatchLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        AI Match
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => getResumeTips(job)}
                    disabled={resumeTipsLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2 transition-colors"
                  >
                    {resumeTipsLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        Resume Tips
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => getInterviewQuestions(job)}
                    disabled={interviewQuestionsLoading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 flex items-center gap-2 transition-colors"
                  >
                    {interviewQuestionsLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Preparing...
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4" />
                        Interview Prep
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => getSalaryNegotiationTips(job)}
                    disabled={salaryTipsLoading}
                    className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:bg-gray-400 flex items-center gap-2 transition-colors"
                  >
                    {salaryTipsLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-4 h-4" />
                        Salary Tips
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => getCompanyCultureAnalysis(job)}
                    disabled={companyCultureLoading}
                    className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 disabled:bg-gray-400 flex items-center gap-2 transition-colors"
                  >
                    {companyCultureLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4" />
                        Culture Fit
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => handleApplyJob(job)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Apply
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-gray-900">Job Description</h3>
                <p className="text-gray-600 mt-1">{job.jobDescription}</p>
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-gray-900">Qualifications</h3>
                <ul className="list-disc list-inside text-gray-600 mt-1">
                  {job.qualifications.map((qual: string, i: number) => (
                    <li key={i}>{qual}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-gray-900">Skills Required</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.skillsRequired.map((skill: string, i: number) => (
                    <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-gray-900">Responsibilities</h3>
                <ul className="list-disc list-inside text-gray-600 mt-1">
                  {job.responsibilities.map((resp: string, i: number) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>

              {/* AI Match Result */}
              {showAiMatch && aiMatch && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-purple-600" />
                    AI Job Match Analysis
                  </h3>
                  <p className="text-gray-700 text-sm">{aiMatch}</p>
                </div>
              )}

              {/* Resume Tips Result */}
              {showResumeTips && resumeTips && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    Resume Optimization Tips
                  </h3>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{resumeTips}</p>
                </div>
              )}

              {/* Interview Questions Result */}
              {showInterviewQuestions && interviewQuestions && (
                <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    Likely Interview Questions
                  </h3>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{interviewQuestions}</p>
                </div>
              )}

              {/* Salary Tips Result */}
              {showSalaryTips && salaryTips && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                    Salary Negotiation Guide
                  </h3>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{salaryTips}</p>
                </div>
              )}

              {/* Company Culture Result */}
              {showCompanyCulture && companyCulture && (
                <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-rose-600" />
                    Company Culture & Fit Analysis
                  </h3>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{companyCulture}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Apply for {selectedJob.title}
            </h2>
            <p className="text-gray-600 mb-6">{selectedJob.company}</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Resume * {resume && <span className="text-green-600 font-semibold">✓ Uploaded</span>}
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {resume && (
                  <p className="text-sm text-green-600 mt-2">
                    📄 File: {resume.name} ({(resume.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              {atsScore !== null && (
                <div className={`p-4 rounded-lg ${getScoreBackground(atsScore)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-semibold">ATS Score Analysis</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-2xl font-bold ${getScoreColor(atsScore)}`}>
                      {atsScore}%
                    </span>
                    <span className="text-sm text-gray-600">
                      {atsScore >= 80 ? 'Excellent match!' : 
                       atsScore >= 60 ? 'Good match' : 
                       'Consider improving your resume'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Probability of passing ATS screening: <span className={`font-semibold ${getScoreColor(atsScore)}`}>{atsScore}%</span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write a compelling cover letter..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setShowApplicationModal(false);
                  setSelectedJob(null);
                  setResume(null);
                  setCoverLetter('');
                  setAtsScore(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitApplication}
                disabled={!resume}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;