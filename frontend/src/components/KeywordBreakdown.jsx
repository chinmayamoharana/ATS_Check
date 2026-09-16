import React, { useState } from 'react';
import { Tag, CheckCircle2, XCircle, Search, Plus, Copy, Check } from 'lucide-react';

const KeywordBreakdown = ({ matchedSkills = [], missingKeywords = [], onAddKeyword }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedKw, setCopiedKw] = useState(null);

  const handleCopy = (kwName) => {
    navigator.clipboard.writeText(kwName);
    setCopiedKw(kwName);
    setTimeout(() => setCopiedKw(null), 1500);
  };

  const filteredMatched = matchedSkills.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMissing = missingKeywords.filter(k =>
    k.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 mb-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Tag className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Keyword Intelligence & Skill Taxonomy</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare detected tech skills vs high-priority target role keywords.
          </p>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input pl-8 pr-3 py-1.5 rounded-xl text-xs w-36 sm:w-44 focus:w-48 transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({matchedSkills.length + missingKeywords.length})
            </button>

            <button
              onClick={() => setFilter('matched')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filter === 'matched' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Matched ({matchedSkills.length})
            </button>

            <button
              onClick={() => setFilter('missing')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filter === 'missing' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Missing ({missingKeywords.length})
            </button>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Matched Skills Column */}
        {(filter === 'all' || filter === 'matched') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Detected Core Skills ({filteredMatched.length})
              </h4>
            </div>

            {filteredMatched.length > 0 ? (
              <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto pr-1">
                {filteredMatched.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium"
                  >
                    <span>{skill.name}</span>
                    <span className="text-[10px] text-emerald-400/70 bg-emerald-500/20 px-1.5 py-0.2 rounded-md">
                      {skill.category}
                    </span>
                  </span>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/50 text-xs text-slate-500 text-center">
                No matched skills found matching query.
              </div>
            )}
          </div>
        )}

        {/* Missing Keywords Column */}
        {(filter === 'all' || filter === 'missing') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> Recommended Target Keywords ({filteredMissing.length})
              </h4>
              <span className="text-[11px] text-slate-500">1-click insert available</span>
            </div>

            {filteredMissing.length > 0 ? (
              <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto pr-1">
                {filteredMissing.map((kw, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-medium"
                  >
                    <span>{kw.name}</span>
                    <button
                      onClick={() => onAddKeyword(kw.name)}
                      className="p-1 hover:bg-amber-500/30 rounded-md text-amber-400 transition cursor-pointer"
                      title="Add to live resume editor"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleCopy(kw.name)}
                      className="p-1 hover:bg-amber-500/30 rounded-md text-amber-400 transition cursor-pointer"
                      title="Copy keyword"
                    >
                      {copiedKw === kw.name ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/50 text-xs text-emerald-400 text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> No missing high-priority keywords detected!
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};

export default KeywordBreakdown;
