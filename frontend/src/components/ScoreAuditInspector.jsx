import React from 'react';
import { Calculator, CheckCircle2, AlertTriangle, MinusCircle } from 'lucide-react';

const ScoreAuditInspector = ({ scoreAuditLog, totalScore, scoreGrade }) => {
  if (!scoreAuditLog || !Array.isArray(scoreAuditLog)) return null;

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 mb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">Score points by check</h3>
            </div>
            <p className="text-xs text-slate-400">
              Earned points from the text checks below add up to {totalScore} / 100 ({scoreGrade}).
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-400 block">Total review score</span>
            <span className="text-xl font-black text-indigo-400">
              {totalScore} <span className="text-xs font-normal text-slate-400">/ 100 Pts</span>
            </span>
          </div>
        </div>
      </div>

      {/* Itemized Audit Log Table */}
      <div className="space-y-3">
        {scoreAuditLog.map((item, idx) => {
          const isDeduction = item.status === 'Deduction' || item.earned < 0;
          const isPass = item.status === 'Pass';

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition ${
                isDeduction
                  ? 'bg-rose-500/5 border-rose-500/20 text-rose-300'
                  : isPass
                  ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                  : 'bg-slate-900/50 border-amber-500/20 text-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {isDeduction ? (
                    <MinusCircle className="w-4 h-4 text-rose-400" />
                  ) : isPass ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <div>
                  <span className="font-bold text-white block text-xs">{item.category}</span>
                  <span className="text-slate-400 text-[11px] leading-relaxed block mt-0.5">{item.details}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end sm:self-center">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                  isDeduction
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : isPass
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {isDeduction ? `${item.earned} Pts Penalty` : `+${item.earned} / ${item.max} Pts`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default ScoreAuditInspector;
