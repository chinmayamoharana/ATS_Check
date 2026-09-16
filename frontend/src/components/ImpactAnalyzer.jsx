import React from 'react';
import { Zap, Hash, Award, HelpCircle, CheckCircle2 } from 'lucide-react';

const ImpactAnalyzer = ({ impactMetrics }) => {
  if (!impactMetrics) return null;

  const { action_verbs = [], verb_count = 0, quantified_metrics = [], metric_count = 0 } = impactMetrics;

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 mb-8">
      
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-800">
        <Zap className="w-5 h-5 text-indigo-400" />
        <h3 className="text-base font-bold text-white">Action Verb & Quantified Metric Audit</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Action Verbs Section */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-400" /> Power Action Verbs Found ({verb_count})
            </h4>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              verb_count >= 5 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {verb_count >= 5 ? 'Strong Impact' : 'Needs Action Words'}
            </span>
          </div>

          {action_verbs.length > 0 ? (
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {action_verbs.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-200 border border-indigo-500/20 text-xs font-semibold flex items-center gap-1"
                >
                  <span>{item.verb}</span>
                  {item.count > 1 && (
                    <span className="text-[10px] bg-indigo-500/30 px-1 rounded-full text-indigo-100">
                      x{item.count}
                    </span>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              No strong action verbs detected. Use words like <i>Architected, Spearheaded, Scaled, Automated, Optimized</i> to begin bullet points.
            </p>
          )}
        </div>

        {/* Quantified Metrics Section */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-emerald-400" /> Quantified Metrics Detected ({metric_count})
            </h4>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              metric_count >= 3 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {metric_count >= 3 ? 'High Credibility' : 'Add Numbers/Metrics'}
            </span>
          </div>

          {quantified_metrics.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {quantified_metrics.map((m, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-xs flex items-center justify-between">
                  <span className="font-bold text-emerald-400 font-mono">{m.metric}</span>
                  <span className="text-[11px] text-slate-400 truncate max-w-[200px]" title={m.context}>
                    {m.context}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              No quantified metrics found. Add numbers like <i>"Accelerated page speed by 45%", "Managed team of 6", "Reduced costs by $10k"</i>.
            </p>
          )}
        </div>

      </div>

      {/* Google X-Y-Z Bullet Formula Tip Box */}
      <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/40 to-slate-900 border border-indigo-500/20 flex items-start space-x-3">
        <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-amber-300">Pro Tip: Google's X-Y-Z Bullet Formula</span>
          <p className="text-slate-300 mt-0.5">
            Format bullet points as: <span className="font-semibold text-white">"Accomplished [X] as measured by [Y], by doing [Z]"</span>.
            <br />
            <span className="text-slate-400 italic">Example: "Accelerated API response time by 45% (Y) by refactoring Django queries with Redis caching (Z)."</span>
          </p>
        </div>
      </div>

    </div>
  );
};

export default ImpactAnalyzer;
