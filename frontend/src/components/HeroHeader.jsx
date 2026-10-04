import React from 'react';
import { Check, FileText, ScanText, Sparkles } from 'lucide-react';

const HeroHeader = () => (
  <div id="top" className="mx-auto max-w-3xl px-4 pb-8 pt-12 text-center sm:pt-16">
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/5 px-3 py-1.5 text-xs font-medium text-indigo-200">
      <Sparkles className="h-3.5 w-3.5 text-indigo-300" /> Clear, practical resume feedback
    </div>
    <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
      Make your resume <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">stronger.</span>
    </h1>
    <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
      Get a transparent resume quality score and specific, evidence-based suggestions in seconds.
    </p>
    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-400">
      <span className="inline-flex items-center gap-1.5"><ScanText className="h-3.5 w-3.5 text-indigo-300" />Structure and readability</span>
      <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-300" />Skills and achievements</span>
      <span className="inline-flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-violet-300" />PDF, DOCX, or TXT</span>
    </div>
  </div>
);

export default HeroHeader;
