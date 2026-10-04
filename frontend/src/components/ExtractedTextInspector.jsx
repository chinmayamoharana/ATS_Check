import React, { useState } from 'react';
import { FileText, Copy, Check, Eye, Database, ShieldCheck } from 'lucide-react';

const ExtractedTextInspector = ({ parsedResume }) => {
  const [copied, setCopied] = useState(false);
  const [showFullText, setShowFullText] = useState(true);

  if (!parsedResume) return null;

  const fullText = parsedResume.full_extracted_text || '';
  const wordCount = parsedResume?.word_count || fullText.split(/\s+/).filter(Boolean).length;
  const charCount = parsedResume?.character_count || fullText.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 mb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">Full Extracted Resume Content Inspector</h3>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Extracted text
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Review the text the analyzer received ({wordCount} words • {charCount} characters). PDF extraction can miss content from scans or complex layouts.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFullText(!showFullText)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <Eye className="w-4 h-4 text-indigo-400" />
            <span>{showFullText ? 'Hide Raw Text' : 'View Raw Text'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Raw Text'}</span>
          </button>
        </div>
      </div>

      {/* Raw Extracted Text Viewer Box */}
      {showFullText && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 max-h-72 overflow-y-auto whitespace-pre-wrap leading-relaxed">
          {fullText || "No text extracted yet."}
        </div>
      )}

    </div>
  );
};

export default ExtractedTextInspector;
