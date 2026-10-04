import React, { useState } from 'react';
import { Sparkles, Copy, Check, X, Lightbulb } from 'lucide-react';

const BulletOptimizerModal = ({ isOpen, onClose, bulletSuggestions = [] }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl glass-card rounded-2xl border border-indigo-500/30 p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                Bullet Point Writing Templates
              </h3>
              <p className="text-xs text-slate-400">
                Draft templates that use a relevant keyword and leave room for your real work and results.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 space-y-4 pr-1">
          
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 flex items-start space-x-2">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Replace every bracketed placeholder with accurate details from your own experience. Do not claim a skill, action, or result unless it is true.
            </span>
          </div>

          {!bulletSuggestions.length && (
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300">
              No target terms are missing right now. You can still use the template below when you have a specific, truthful achievement to describe:
              <div className="font-mono text-slate-200 mt-2">• Delivered [specific work] using [relevant tools], improving [measured outcome] by [verified result].</div>
            </div>
          )}

          {bulletSuggestions.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Target Keyword: {item.keyword}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">{item.category}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed">
                {item.suggested_bullet}
              </div>

              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={() => handleCopy(item.suggested_bullet, idx)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                >
                  {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                </button>

              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default BulletOptimizerModal;
