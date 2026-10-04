import React from 'react';
import { UserCheck, Briefcase, GraduationCap, FolderGit2, CheckCircle2, AlertCircle, Sparkles, Layers, ShieldCheck } from 'lucide-react';

const BitByBitInspector = ({ bitByBitData }) => {
  if (!bitByBitData) return null;

  const {
    candidate_profile = {},
    work_roles = [],
    education_entries = [],
    project_entries = [],
    bit_by_bit_section_scores = {}
  } = bitByBitData;

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 mb-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/20">
            <Layers className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              Bit-by-Bit Deep Resume Parser & Section Auditor
            </h3>
            <p className="text-xs text-slate-400">
              Shows only details detected in the extracted text; missing fields are left unfilled rather than guessed.
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          Bit-by-Bit Engine Active
        </span>
      </div>

      {/* Bit-by-Bit Section Score Meters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { label: 'Contact Details', score: bit_by_bit_section_scores.contact_score || 0 },
          { label: 'Summary', score: bit_by_bit_section_scores.summary_score || 0 },
          { label: 'Work History', score: bit_by_bit_section_scores.experience_score || 0 },
          { label: 'Education', score: bit_by_bit_section_scores.education_score || 0 },
          { label: 'Skills Density', score: bit_by_bit_section_scores.skills_score || 0 },
          { label: 'Projects', score: bit_by_bit_section_scores.projects_score || 0 }
        ].map((sec, idx) => (
          <div key={idx} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1 truncate">{sec.label}</span>
            <div className="flex items-center justify-center space-x-1">
              <span className={`text-xl font-extrabold ${sec.score >= 80 ? 'text-emerald-400' : sec.score >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                {sec.score}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className={`h-1.5 rounded-full ${sec.score >= 80 ? 'bg-emerald-500' : sec.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                style={{ width: `${sec.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Parsed Candidate Profile & Contact (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-indigo-400" /> Extracted Profile & Contact Bits
          </h4>

          <div className="space-y-3 text-xs">
            
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Extracted Candidate Name</span>
              <span className="font-bold text-white text-sm">{candidate_profile.name || 'Candidate Profile'}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Email Address:</span>
                <span className="font-mono text-emerald-400 font-semibold">{candidate_profile.email || 'Not Extracted'}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Phone Number:</span>
                <span className="font-mono text-emerald-400 font-semibold">{candidate_profile.phone || 'Not Extracted'}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">LinkedIn:</span>
                <span className="font-mono text-indigo-400 truncate max-w-[160px]">{candidate_profile.linkedin || 'Not Extracted'}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">GitHub:</span>
                <span className="font-mono text-purple-400 truncate max-w-[160px]">{candidate_profile.github || 'Not Extracted'}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Portfolio:</span>
                <span className="font-mono text-cyan-400 truncate max-w-[160px]">{candidate_profile.portfolio || 'Not Extracted'}</span>
              </div>
            </div>


          </div>
        </div>

        {/* Right Column: Work Roles & Education Bit-by-Bit (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Work Experience Roles */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-purple-400" /> Extracted Work Roles ({work_roles.length})
            </h4>

            {work_roles.length > 0 ? (
              <div className="space-y-2.5">
                {work_roles.map((role, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-xs block">{role.title}</span>
                      <span className="text-[11px] text-indigo-400 font-medium">{role.company}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{role.dates} • {role.bullet_count} bullets detected for this role</span>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      Text extracted
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-900/50 text-xs text-slate-400 text-center">
                No work roles recognized bit-by-bit. Add clear role headers like <i>"Senior Developer | Tech Corp (2021-Present)"</i>.
              </div>
            )}
          </div>

          {/* Education Entries */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-amber-400" /> Extracted Education Entries ({education_entries.length})
            </h4>

            {education_entries.length > 0 ? (
              <div className="space-y-2.5">
                {education_entries.map((edu, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-xs block">{edu.degree}</span>
                      <span className="text-[11px] text-slate-400">{edu.details}</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-900/50 text-xs text-slate-400 text-center">
                No education degree entries detected. Include degree titles like <i>"B.Tech Computer Science"</i>.
              </div>
            )}
          </div>

          {/* Project Entries */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <FolderGit2 className="w-4 h-4 text-emerald-400" /> Project Entries ({project_entries.length})
            </h4>
            {project_entries.length ? (
              <div className="space-y-2">
                {project_entries.map((project, idx) => (
                  <div key={`${project.title}-${idx}`} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200">{project.title}</div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-900/50 text-xs text-slate-400 text-center">No project bullet entries were extracted from the Projects section.</div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default BitByBitInspector;
