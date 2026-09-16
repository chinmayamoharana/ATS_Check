import React from 'react';
import { Briefcase, Target, Code, FileText, CheckCircle2 } from 'lucide-react';

const JobDescriptionPanel = ({
  jobRole,
  setJobRole,
  jobDescription,
  setJobDescription,
  jobTemplates,
  onAnalyze
}) => {
  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Job Target & Description Matcher</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Select a target tech role preset or paste a custom Job Description for tailored keyword scoring.
          </p>
        </div>

        {/* Job Role Preset Dropdown */}
        <div className="flex items-center space-x-2">
          <Briefcase className="w-4 h-4 text-purple-400 hidden sm:block" />
          <select
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            className="glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-indigo-500/30 text-indigo-200 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="fullstack" className="bg-slate-900 text-white">Full Stack Developer Preset</option>
            <option value="frontend" className="bg-slate-900 text-white">Frontend React/Next.js Preset</option>
            <option value="backend" className="bg-slate-900 text-white">Backend Python/Django Preset</option>
            <option value="datascience" className="bg-slate-900 text-white">Data Scientist / AI Engineer</option>
            <option value="devops" className="bg-slate-900 text-white">DevOps & Cloud Engineer</option>
            <option value="mobile" className="bg-slate-900 text-white">Mobile App Developer</option>
            <option value="productmanager" className="bg-slate-900 text-white">Product / Project Manager</option>
          </select>
        </div>
      </div>

      {/* Target Skills Pills Preview */}
      {jobTemplates && jobTemplates[jobRole] && (
        <div className="mb-4 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-indigo-400" />
              Target Core Skills for <span className="text-indigo-400 font-bold">{jobTemplates[jobRole].title}</span>:
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {jobTemplates[jobRole].core_skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Custom Job Description Area */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
            <FileText className="w-4 h-4 text-pink-400" />
            <span>Custom Job Description (Optional for 100% Exact Match)</span>
          </label>
          <span className="text-[11px] text-slate-500">
            {jobDescription ? `${jobDescription.split(/\s+/).filter(Boolean).length} words` : 'Empty'}
          </span>
        </div>

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description requirements, responsibilities, and required qualifications here..."
          rows={3}
          className="w-full glass-input p-3 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 transition resize-y min-h-[90px]"
        />
      </div>
    </div>
  );
};

export default JobDescriptionPanel;
