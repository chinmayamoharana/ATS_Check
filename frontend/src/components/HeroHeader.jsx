import React from 'react';
import { Sparkles, Zap, ShieldCheck, Target, FileText } from 'lucide-react';

const HeroHeader = () => {
  return (
    <div className="text-center pt-8 pb-6 px-4">
      {/* Top Pill Badge */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30 mb-4">
        <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
        <span className="text-xs font-semibold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
          Realtime ATS Compatibility Audit & Keyword Optimizer
        </span>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
        Perfect Your Resume for <br className="hidden sm:block" />
        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Applicant Tracking Systems (ATS)
        </span>
      </h1>

      <p className="max-w-2xl mx-auto text-slate-400 text-sm sm:text-base mb-6">
        Edit live text or import files, compare against target job descriptions, eliminate overused buzzwords, and generate AI bullet points for shortlist success.
      </p>

      {/* Feature Highlights Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
        <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Realtime Scoring</span>
        </span>

        <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
          <Target className="w-3.5 h-3.5 text-indigo-400" />
          <span>Job Target Matcher</span>
        </span>

        <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>AI Bullet Optimizer</span>
        </span>

        <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>Buzzword & Passive Auditor</span>
        </span>
      </div>
    </div>
  );
};

export default HeroHeader;

