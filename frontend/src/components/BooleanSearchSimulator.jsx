import React from 'react';
import { Search, CheckCircle2, XCircle, ShieldCheck, Filter } from 'lucide-react';

const BooleanSearchSimulator = ({ booleanSearch }) => {
  if (!booleanSearch) return null;

  const { pass_rate, is_qualified, full_boolean_query, matched_clauses, missing_clauses } = booleanSearch;

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 mb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">Recruiter Boolean Search Simulator</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                Workday / Taleo Algorithm
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Simulates automated recruiter query filters. Candidates passing &ge;75% appear in top applicant pools.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-400 block">Recruiter Match Qualification</span>
            <span className={`text-lg font-black ${is_qualified ? 'text-emerald-400' : 'text-rose-400'}`}>
              {pass_rate}% Qualified
            </span>
          </div>
          <div className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
            is_qualified 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {is_qualified ? <ShieldCheck className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
            {is_qualified ? 'SEARCH VISIBLE' : 'KNOCKOUT RISK'}
          </div>
        </div>
      </div>

      {/* Boolean Query Preview Box */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 mb-6 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
        <span className="text-slate-400 select-none">// Simulated Recruiter Boolean String:</span>
        <div className="mt-1 text-cyan-300 font-semibold break-all">
          {full_boolean_query}
        </div>
      </div>

      {/* Matched vs Missing Clauses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Passed Clauses */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Passed Boolean Filters ({matched_clauses.length})
            </h4>
          </div>
          <div className="space-y-2.5">
            {matched_clauses.map((c, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{c.label}</span>
                  <span className="text-[11px] font-mono text-slate-400">{c.boolean}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Found: {c.matched_term}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Knockout Clauses */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-rose-400 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400" />
              Missing Boolean Clauses ({missing_clauses.length})
            </h4>
          </div>
          {missing_clauses.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400 bg-slate-800/30 rounded-lg">
              🎉 Perfect! No missing Boolean clauses detected.
            </div>
          ) : (
            <div className="space-y-2.5">
              {missing_clauses.map((c, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/20 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{c.label}</span>
                    <span className="text-[11px] font-mono text-slate-400">{c.boolean}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    Missing Clause
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default BooleanSearchSimulator;
