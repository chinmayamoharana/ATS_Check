import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

const FileUploadZone = ({
  resumeFile,
  setResumeFile,
  onAnalyzeFile,
  loading
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.match(/\.(pdf|docx|txt)$/i)) {
        setResumeFile(file);
      } else {
        alert("Please upload a .pdf, .docx, or .txt file");
      }
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 mb-8">
      
      <form onSubmit={onAnalyzeFile} className="space-y-4">
        
        {/* Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition cursor-pointer ${
            dragActive
              ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
              : resumeFile
              ? 'border-emerald-500/40 bg-emerald-500/5'
              : 'border-slate-700/80 hover:border-indigo-500/50 hover:bg-slate-800/40'
          }`}
        >
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => e.target.files[0] && setResumeFile(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition shadow-lg ${
              resumeFile
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
            }`}>
              {resumeFile ? <CheckCircle2 className="w-7 h-7" /> : <Upload className="w-7 h-7 animate-bounce" style={{ animationDuration: '3s' }} />}
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                {resumeFile ? resumeFile.name : "Drag & drop your resume file here, or click to browse"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports <span className="text-indigo-400 font-semibold">.PDF</span>, <span className="text-indigo-400 font-semibold">.DOCX</span>, and <span className="text-indigo-400 font-semibold">.TXT</span> (Max 10MB)
              </p>
            </div>

            {resumeFile && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {(resumeFile.size / 1024).toFixed(1)} KB • File Ready for ATS Scan
              </span>
            )}

          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !resumeFile}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Analyzing Resume File & Matching Job Requirements...</span>
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              <span>Run Comprehensive ATS Compatibility Scan</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default FileUploadZone;
