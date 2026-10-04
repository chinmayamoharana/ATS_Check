import React from 'react';
import { AlertCircle, CheckCircle2, CircleHelp } from 'lucide-react';

const ResumeChecksPanel = ({ checks = [] }) => {
  if (!checks.length) return null;

  const groups = checks.reduce((result, check) => {
    (result[check.category] ||= []).push(check);
    return result;
  }, {});

  return (
    <section className="glass-card rounded-2xl p-6 border border-slate-800 mb-8" aria-labelledby="resume-checks-title">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-4 mb-5 border-b border-slate-800">
        <div>
          <h2 id="resume-checks-title" className="text-base font-extrabold text-white">Resume review, check by check</h2>
          <p className="text-xs text-slate-400 mt-1">Each result is based on text extracted from your resume. Review uncertain extraction before editing.</p>
        </div>
        <span className="text-xs text-slate-400 flex items-center gap-1.5"><CircleHelp className="w-4 h-4" /> Evidence based checks</span>
      </div>

      <div className="space-y-6">
        {Object.entries(groups).map(([category, items]) => {
          const earned = items.reduce((sum, item) => sum + item.earned, 0);
          const max = items.reduce((sum, item) => sum + item.max, 0);
          return (
            <div key={category}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-indigo-200">{category}</h3>
                <span className="text-xs font-mono text-slate-300">{earned} / {max} pts</span>
              </div>
              <div className="space-y-2">
                {items.map((check) => {
                  const good = check.status === 'good';
                  const notScored = check.status === 'not_scored';
                  return (
                    <article key={check.id} className="rounded-xl bg-slate-900/70 border border-slate-800 p-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 min-w-0">
                          {good ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" /> : notScored ? <CircleHelp className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />}
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-white">{check.label}</h4>
                            <p className="text-[11px] leading-relaxed text-slate-400 mt-1">{check.finding}</p>
                            {check.recommendation && <p className="text-[11px] leading-relaxed text-amber-200 mt-1.5"><span className="font-semibold">Next step:</span> {check.recommendation}</p>}
                          </div>
                        </div>
                        <span className={`text-[11px] font-mono font-bold shrink-0 ${notScored ? 'text-slate-500' : good ? 'text-emerald-300' : 'text-amber-300'}`}>{notScored ? 'Not scored' : `${check.earned}/${check.max}`}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default ResumeChecksPanel;
