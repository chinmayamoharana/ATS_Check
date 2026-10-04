import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import HeroHeader from './HeroHeader';
import RealtimeEditor from './RealtimeEditor';
import ScoreDashboard from './ScoreDashboard';
import ExtractedTextInspector from './ExtractedTextInspector';
import ResumeChecksPanel from './ResumeChecksPanel';







const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://127.0.0.1:8001/api/ats' : '/api/ats');

const ATSChecker = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  // Analyze each uploaded resume once, then show the score and evidence-based suggestions.
  useEffect(() => {
    if (!resumeFile) return;
    const controller = new AbortController();
    let active = true;

    const uploadFile = async () => {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      setLoading(true);
      setAnalysisError('');
      setResult(null);

      try {
        const res = await axios.post(`${API_BASE_URL}/check/`, formData, {
          signal: controller.signal,
          timeout: 60000
        });
        if (!active) return;
        setResult(res.data);
        setAnalysisError('');

      } catch (err) {
        if (active && !axios.isCancel(err)) {
          setAnalysisError(err.code === 'ECONNABORTED'
            ? 'Resume analysis took too long. Try a smaller or text-based document.'
            : err.response?.data?.error || 'Could not analyze the resume. Check that the backend is running and try again.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    uploadFile();
    return () => {
      active = false;
      controller.abort();
    };
  }, [resumeFile]);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100">
      
      {/* Top Navbar */}
      <Navbar />


      {/* Main Studio Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* Hero Section */}
        <HeroHeader />

        <RealtimeEditor
          resumeFile={resumeFile}
          isAnalyzing={loading}
          errorMessage={analysisError}
          setResumeFile={setResumeFile}
          onUploadError={setAnalysisError}
        />

        {/* Results Dashboard (Rendered once result is available) */}
        {result && result.ats_score !== undefined && (
          <div className="space-y-8 animate-fadeIn">

            <ScoreDashboard result={result} />
            {!!result.extraction_review?.warnings?.length && (
              <aside role="status" className="rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-sm text-amber-100">
                <p className="font-semibold">Check the extracted text</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-amber-100/80">
                  {result.extraction_review.warnings.map((warning) => <li key={warning}>{warning}</li>)}
                </ul>
              </aside>
            )}
            {!!result.resume_checks?.length && (
              <details className="glass-card rounded-2xl border border-slate-800">
                <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-slate-200">
                  Detailed review <span className="ml-2 text-xs font-normal text-slate-400">{result.resume_checks.length} checks</span>
                </summary>
                <div className="border-t border-slate-800 p-4 sm:p-5">
                  <ResumeChecksPanel checks={result.resume_checks} />
                </div>
              </details>
            )}

            {result.parsed_resume && (
              <details className="text-xs text-slate-400">
                <summary className="cursor-pointer">View extracted resume text</summary>
                <div className="mt-3"><ExtractedTextInspector parsedResume={result.parsed_resume} /></div>
              </details>
            )}

          </div>
        )}

      </main>

    </div>
  );

};

export default ATSChecker;

