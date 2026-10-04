import React from 'react';
import { Award, Briefcase, Code, FolderGit2, GraduationCap, Users, ContactRound, Layout } from 'lucide-react';

const SevenPillarDashboard = ({ sevenPillarMatrix }) => {
  if (!sevenPillarMatrix) return null;

  const pillars = [
    {
      key: 'pillar1_career',
      icon: Briefcase,
      color: 'indigo',
      badge: 'Weight 20 Pts',
      details: (p) => `${p.score} of ${p.max} experience evidence points`
    },
    {
      key: 'pillar2_skills',
      icon: Code,
      color: 'purple',
      badge: 'Weight 35 Pts',
      details: (p) => `${p.score} / ${p.max} points from target terms detected in the resume`
    },
    {
      key: 'pillar3_projects',
      icon: FolderGit2,
      color: 'emerald',
      badge: 'Weight 15 Pts',
      details: (p) => p.has_projects ? 'Dedicated Projects Section Found' : 'Add Key Projects Section'
    },
    {
      key: 'pillar4_education_certs',
      icon: GraduationCap,
      color: 'amber',
      badge: 'Weight 5 Pts',
      details: (p) => `${p.has_degree ? 'Education entry found' : 'No degree entry found'} • ${p.certs?.length ? `${p.certs.length} certification(s)` : 'No named certification detected'}`
    },
    {
      key: 'pillar5_soft_skills',
      icon: Users,
      color: 'pink',
      badge: 'Weight 10 Pts',
      details: (p) => `${p.action_verbs_count || 0} action verbs found in extracted text`
    },
    {
      key: 'pillar6_hobbies_culture',
      icon: ContactRound,
      color: 'rose',
      badge: 'Weight 5 Pts',
      details: (p) => `${p.has_email ? 'Email found' : 'Email missing'} • ${p.has_phone ? 'Phone found' : 'Phone missing'}`
    },
    {
      key: 'pillar7_formatting',
      icon: Layout,
      color: 'teal',
      badge: 'Weight 10 Pts',
      details: (p) => `${p.word_count || 0} words • readability checks`
    }
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 mb-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/20">
            <Award className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              Weighted Resume Review
            </h3>
            <p className="text-xs text-slate-400">
              Score across job match, resume evidence, section coverage, contact details, and text readability.
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
          100-point score
        </span>
      </div>

      {/* Weighted review categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars.map((item) => {
          const pData = sevenPillarMatrix[item.key] || { name: 'Pillar', score: 0, max: 10 };
          const Icon = item.icon;
          const percentage = Math.round((pData.score / pData.max) * 100);

          return (
            <div
              key={item.key}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/30 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-slate-800 text-indigo-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white mb-1">{pData.name}</h4>
                <p className="text-[11px] text-slate-400 mb-3 truncate" title={item.details(pData)}>
                  {item.details(pData)}
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-lg font-extrabold text-white">
                    {pData.score} <span className="text-xs font-normal text-slate-400">/ {pData.max} pts</span>
                  </span>
                  <span className={`text-xs font-bold ${percentage >= 80 ? 'text-emerald-400' : percentage >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {percentage}%
                  </span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-700 ${
                      percentage >= 80 ? 'bg-emerald-500' : percentage >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default SevenPillarDashboard;
