import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const ScoreDashboard = ({ result }) => {
  if (!result || result.ats_score === undefined) return null;

  const score = Math.round(Number(result.ats_score) || 0);
  const recommendations = (result.recommendations || []).slice(0, 3);
  const scoreColor = score >= 80 ? 'text-emerald-400' : score >= 65 ? 'text-amber-400' : 'text-rose-400';
  const barColor = score >= 80 ? 'bg-emerald-500' : score >= 65 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <section className="glass-card rounded-2xl border border-slate-800 p-5 sm:p-6" aria-labelledby="review-summary-title">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr] md:items-center">
        <div>
          <h2 id="review-summary-title" className="text-xs font-semibold uppercase tracking-wide text-slate-400">Resume review score</h2>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-4xl font-bold ${scoreColor}`}>{score}%</span>
            <span className="text-sm text-slate-400">Grade {result.score_grade || '—'}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
            <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(100, Math.max(0, score))}%` }} />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{result.score_disclaimer || 'Guidance based on extracted resume text; screening systems use different criteria.'}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Top improvements</h3>
          {recommendations.length ? (
            <ol className="mt-3 space-y-2">
              {recommendations.map((item, index) => (
                <li key={item.check_id || `${item.title}-${index}`} className="flex gap-2.5 text-xs leading-relaxed text-slate-300">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-[10px] font-bold text-indigo-300">{index + 1}</span>
                  <span><strong className="text-slate-100">{item.title}:</strong> {item.action}{item.evidence && <span className="mt-0.5 block text-[11px] text-slate-500">{item.evidence}</span>}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 flex items-center gap-2 text-xs text-emerald-300"><CheckCircle2 className="h-4 w-4" />No priority improvements found.</p>
          )}
          {result.resume_checks?.length > 0 && recommendations.length === 0 && (
            <p className="mt-2 flex items-center gap-2 text-[11px] text-slate-500"><AlertCircle className="h-3.5 w-3.5" />Open detailed review for every check.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ScoreDashboard;
