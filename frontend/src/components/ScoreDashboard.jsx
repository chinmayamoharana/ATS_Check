import React, { useEffect } from 'react';
import { Award, CheckCircle2, AlertTriangle, ShieldCheck, Zap, TrendingUp, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const ScoreDashboard = ({ result }) => {
  if (!result || result.ats_score === undefined) return null;

  const score = result.ats_score || 0;
  const grade = result.score_grade || 'C';
  const breakdown = result.score_breakdown || { skills_score: 0, structure_score: 0, impact_score: 0, relevance_score: 0 };

  // Trigger celebratory confetti if user scores 85+
  useEffect(() => {
    if (score >= 85) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [score]);

  // Gauge calculations (SVG Circle radius = 54, circumference = 2 * PI * 54 = 339.29)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val) => {
    if (val >= 80) return { text: 'text-emerald-400', stroke: '#10B981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
    if (val >= 65) return { text: 'text-amber-400', stroke: '#F59E0B', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
    return { text: 'text-rose-400', stroke: '#F43F5E', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
  };

  const mainColor = getScoreColor(score);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
      
      {/* Radial Gauge & Overall Score (4 cols desktop) */}
      <div className="lg:col-span-4 glass-card rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none"></div>

        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-indigo-400" />
          Overall ATS Compatibility Score
        </span>

        {/* SVG Radial Progress Gauge */}
        <div className="relative w-44 h-44 flex items-center justify-center mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            {/* Background Track */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="stroke-slate-800"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Progress Stroke */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke={mainColor.stroke}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-4xl font-extrabold ${mainColor.text}`}>
              {score}%
            </span>
            <span className={`mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${mainColor.bg} ${mainColor.text} ${mainColor.border}`}>
              Grade {grade}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 max-w-xs">
          {score >= 80 ? '🎉 Excellent! Your resume is highly optimized to pass ATS filters.' :
           score >= 65 ? '⚡ Good score. Adding 2-3 missing skills will push you to Top 10%.' :
           '⚠️ Below average ATS threshold. Apply recommended fixes below.'}
        </p>
      </div>

      {/* 4-Category Breakdown Progress Bars (8 cols desktop) */}
      <div className="lg:col-span-8 glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
        
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Multi-Dimensional Performance Audit</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Weighted Algorithm v2.0</span>
        </div>

        <div className="space-y-4">
          
          {/* Skill & Keyword Match (35%) */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-semibold text-slate-200">1. Technical & Keyword Match (35% weight)</span>
              <span className={`font-bold ${getScoreColor(breakdown.skills_score).text}`}>
                {breakdown.skills_score}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                style={{ width: `${breakdown.skills_score}%` }}
              ></div>
            </div>
          </div>

          {/* Structure & Contact Audit (20%) */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-semibold text-slate-200">2. Formatting & Section Completeness (20% weight)</span>
              <span className={`font-bold ${getScoreColor(breakdown.structure_score).text}`}>
                {breakdown.structure_score}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                style={{ width: `${breakdown.structure_score}%` }}
              ></div>
            </div>
          </div>

          {/* Action Verbs & Metrics (25%) */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-semibold text-slate-200">3. Impact & Quantified Achievements (25% weight)</span>
              <span className={`font-bold ${getScoreColor(breakdown.impact_score).text}`}>
                {breakdown.impact_score}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-700"
                style={{ width: `${breakdown.impact_score}%` }}
              ></div>
            </div>
          </div>

          {/* Relevance & Length Check (20%) */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-semibold text-slate-200">4. Length & Job Relevance (20% weight)</span>
              <span className={`font-bold ${getScoreColor(breakdown.relevance_score).text}`}>
                {breakdown.relevance_score}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-2.5 bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all duration-700"
                style={{ width: `${breakdown.relevance_score}%` }}
              ></div>
            </div>
          </div>

        </div>

        {/* Strengths, Fixes & Quality Audit */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-800">
          
          {/* Strengths */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Strong Highlights ({result.strengths?.length || 0})
            </h4>
            <ul className="space-y-1.5">
              {result.strengths?.map((str, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Priority Fixes */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Priority Fixes ({result.critical_fixes?.length || 0})
            </h4>
            <ul className="space-y-1.5">
              {result.critical_fixes?.map((fix, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{fix}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quality Audit: Buzzwords & Passive Voice */}
          <div className="space-y-2 bg-rose-500/5 p-3 rounded-xl border border-rose-500/10">
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Buzzwords & Passive Voice
            </h4>

            {result.quality_audit?.buzzwords_found?.length > 0 ? (
              <div className="text-xs text-rose-300 space-y-1">
                <span className="font-semibold text-rose-400">Overused Buzzwords:</span>
                <div className="flex flex-wrap gap-1">
                  {result.quality_audit.buzzwords_found.map((bw, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono">
                      {bw}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Zero overused buzzwords
              </div>
            )}

            {result.quality_audit?.passive_phrases_found?.length > 0 && (
              <div className="text-xs text-amber-300 pt-1 border-t border-rose-500/10">
                <span className="font-semibold text-amber-400">Passive Phrases Detected:</span>
                <div className="text-[11px] text-slate-300 italic">
                  "{result.quality_audit.passive_phrases_found.slice(0, 2).join('", "')}"
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default ScoreDashboard;

