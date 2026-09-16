import React, { useState, useEffect } from 'react';
import { Edit3, Zap, Copy, Check, Sparkles, Plus, AlertCircle, RefreshCw } from 'lucide-react';

const RealtimeEditor = ({
  resumeText,
  setResumeText,
  result,
  isAnalyzing,
  onAddKeyword,
  onOpenBulletOptimizer,
  setResumeFile
}) => {
  const [copied, setCopied] = useState(false);

  const wordCount = resumeText ? resumeText.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = resumeText ? resumeText.length : 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
      
      {/* Left Column: Live Textarea Editor (7 cols on desktop) */}
      <div className="lg:col-span-7 flex flex-col glass-card rounded-2xl p-5 border border-slate-800 shadow-xl">
        
        {/* Editor Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Edit3 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Interactive Realtime Resume Studio
              {isAnalyzing && (
                <span className="flex items-center text-[11px] font-normal text-indigo-400 animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin mr-1" /> Auto-evaluating...
                </span>
              )}
            </h3>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            {/* Upload File Quick Button */}
            <label className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold cursor-pointer transition">
              <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} className="hidden" />
              <span>Import File</span>
            </label>

            {/* AI Bullet Point Generator Launch Button */}
            <button
              onClick={onOpenBulletOptimizer}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Bullets</span>
            </button>

            <span className="text-slate-500 font-mono">{wordCount}w</span>

            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="Copy resume text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>


        {/* Text Area */}
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Type or paste your complete resume text here... Score updates live as you type!"
          rows={16}
          className="w-full glass-input p-4 rounded-xl text-xs sm:text-sm font-mono leading-relaxed text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 transition resize-y min-h-[360px]"
        />

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <Zap className="w-3 h-3" /> Realtime calculation active
          </span>
          <span>Tip: Add missing keywords from the right panel to boost your score instantly</span>
        </div>
      </div>

      {/* Right Column: Live Instant Score & Quick Keywords (5 cols on desktop) */}
      <div className="lg:col-span-5 flex flex-col space-y-4">
        
        {/* Quick Score Card */}
        <div className="glass-card rounded-2xl p-5 border border-indigo-500/20 bg-gradient-to-br from-slate-900/90 via-indigo-950/20 to-slate-900/90">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Live ATS Compatibility Score
            </span>
            {result && result.score_grade && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                result.ats_score >= 80 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                result.ats_score >= 65 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                Grade {result.score_grade}
              </span>
            )}
          </div>

          <div className="flex items-baseline space-x-3 mb-2">
            <span className={`text-4xl font-extrabold ${
              !result ? 'text-slate-500' :
              result.ats_score >= 80 ? 'text-emerald-400' :
              result.ats_score >= 65 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {result ? `${result.ats_score}%` : '0%'}
            </span>
            <span className="text-xs text-slate-400">
              {result?.ats_score >= 80 ? 'Excellent candidate match' :
               result?.ats_score >= 65 ? 'Good match - minor improvements needed' :
               'Needs skill optimization'}
            </span>
          </div>

          {/* Quick Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-3">
            <div
              className={`h-2 transition-all duration-500 ${
                !result ? 'bg-slate-700' :
                result.ats_score >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                result.ats_score >= 65 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                'bg-gradient-to-r from-rose-500 to-red-400'
              }`}
              style={{ width: `${result ? result.ats_score : 0}%` }}
            ></div>
          </div>
        </div>

        {/* Missing Keywords Injection Panel */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex-1">
          <h4 className="text-xs font-bold text-slate-200 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-amber-400">
              <AlertCircle className="w-4 h-4" />
              1-Click Missing Keywords Injector
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              Click to insert into resume
            </span>
          </h4>

          {result && result.missing_keywords && result.missing_keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto pr-1">
              {result.missing_keywords.map((kw, idx) => (
                <button
                  key={idx}
                  onClick={() => onAddKeyword(kw.name)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-xs font-medium transition cursor-pointer group"
                  title={`Click to add "${kw.name}" to your resume`}
                >
                  <Plus className="w-3 h-3 text-amber-400 group-hover:scale-125 transition" />
                  <span>{kw.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-400">
              {result?.ats_score >= 85 ? (
                <span className="text-emerald-400 flex items-center justify-center gap-1">
                  <Check className="w-4 h-4" /> All major target keywords matched!
                </span>
              ) : (
                'Start typing or paste resume text to discover missing keywords.'
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default RealtimeEditor;
