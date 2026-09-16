import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, FileText, Sparkles } from 'lucide-react';

const LayoutSafetyAuditor = ({ layoutSafety, keywordDensity }) => {
  if (!layoutSafety) return null;

  const {
    parser_safety_score,
    found_bad_symbols,
    canonical_headers_count,
    found_canonical_headers,
    is_contact_clean,
    word_count_status
  } = layoutSafety;

  const overstuffed = keywordDensity?.overstuffed_keywords || [];

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 mb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">ATS Parser Cleanliness & Layout Safety</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                Parser Trap Inspection
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Evaluates non-standard bullet symbols, contact info header safety, and keyword stuffing risk.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-400 block">Parser Cleanliness Index</span>
            <span className={`text-lg font-black ${
              parser_safety_score >= 85 ? 'text-emerald-400' : parser_safety_score >= 70 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {parser_safety_score}% Safe
            </span>
          </div>
        </div>
      </div>

      {/* 4 Health Diagnostics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Diagnostic 1: Symbol Hygiene */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">Symbol & Bullet Hygiene</span>
          {found_bad_symbols.length === 0 ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Standard Bullet Format
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
              <AlertTriangle className="w-4 h-4" /> Bad Symbols: {found_bad_symbols.join(' ')}
            </div>
          )}
        </div>

        {/* Diagnostic 2: Canonical Headers */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">Canonical Headings</span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <FileText className="w-4 h-4 text-indigo-400" /> {canonical_headers_count} Canonical Sections Found
          </div>
        </div>

        {/* Diagnostic 3: Contact Info Hygiene */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">Contact Header Placement</span>
          {is_contact_clean ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Body Text Contact (Clean)
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <AlertTriangle className="w-4 h-4" /> Check Email / Phone
            </div>
          )}
        </div>

        {/* Diagnostic 4: TF-IDF Keyword Density */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">Keyword Stuffing Guard</span>
          {overstuffed.length === 0 ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Sparkles className="w-4 h-4" /> Natural Density (&lt;4.5%)
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
              <AlertTriangle className="w-4 h-4" /> Overstuffed Terms ({overstuffed.length})
            </div>
          )}
        </div>

      </div>

      {/* Canonical Headers List & Density Warnings */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80 text-xs">
        <span className="text-slate-400 font-semibold self-center">Extracted Canonical Headers:</span>
        {found_canonical_headers.map((h, i) => (
          <span key={i} className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700 font-mono text-[11px]">
            ✓ {h}
          </span>
        ))}
      </div>

    </div>
  );
};

export default LayoutSafetyAuditor;
