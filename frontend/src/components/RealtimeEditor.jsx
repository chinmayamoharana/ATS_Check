import React, { useRef } from 'react';
import { FileText, UploadCloud, LoaderCircle, ShieldCheck } from 'lucide-react';

const RealtimeEditor = ({ resumeFile, isAnalyzing, errorMessage, setResumeFile, onUploadError }) => {
  const inputRef = useRef(null);
  const handleFile = (file) => {
    if (!file || isAnalyzing) return;
    const extension = file.name.toLowerCase().split('.').pop();
    if (!['pdf', 'docx', 'txt'].includes(extension)) {
      onUploadError('Choose a PDF, DOCX, or TXT resume.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      onUploadError('The resume must be 10 MB or smaller.');
      return;
    }
    onUploadError('');
    setResumeFile(file);
  };

  return (
    <section className="mx-auto mb-10 max-w-3xl" aria-label="Upload resume for review">
      <div
        className="group rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 p-6 shadow-2xl shadow-indigo-950/30 sm:p-10"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          if (isAnalyzing) return;
          handleFile(event.dataTransfer.files?.[0]);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          className="hidden"
          disabled={isAnalyzing}
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-300/20 bg-indigo-400/10 text-indigo-300 shadow-inner shadow-indigo-400/10">
          {isAnalyzing ? <LoaderCircle className="h-7 w-7 animate-spin" /> : <UploadCloud className="h-7 w-7" />}
        </div>
        <div className="mt-5 text-center">
          <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {isAnalyzing ? 'Reviewing your resume' : resumeFile ? 'Review another resume' : 'Start with your resume'}
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">
            {isAnalyzing
              ? 'Checking structure, contact details, skills, experience, achievements, and readability.'
              : 'Upload a file to get a clear score and practical suggestions to improve it.'}
          </p>
        </div>
        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isAnalyzing}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/40 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-wait disabled:opacity-70"
          >
            <FileText className="h-4 w-4" />
            {isAnalyzing ? 'Analyzing…' : resumeFile ? 'Choose another resume' : 'Choose resume'}
          </button>
          <span className="text-xs text-slate-500">or drag and drop · PDF, DOCX, or TXT · up to 10 MB</span>
        </div>
        {resumeFile && !isAnalyzing && (
          <div className="mx-auto mt-5 flex max-w-md items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-200">
            <FileText className="h-4 w-4 shrink-0" />
            <span className="truncate">{resumeFile.name}</span>
          </div>
        )}
        <div className="mt-7 flex items-center justify-center gap-2 border-t border-slate-800 pt-5 text-[11px] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
          Resume analysis is based on extracted text and provides guidance, not a hiring guarantee.
        </div>
        {errorMessage && <p role="alert" className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{errorMessage}</p>}
      </div>
    </section>
  );
};

export default RealtimeEditor;
