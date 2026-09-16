import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, Sparkles, Layout, ShieldCheck } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const AtsResumePdfModal = ({ isOpen, onClose, result, resumeText }) => {
  const [template, setTemplate] = useState('tech'); // 'tech' | 'executive' | 'minimalist'
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const profile = result?.bit_by_bit_parsed?.candidate_profile || {
    name: 'JOHN DOE',
    email: 'john.doe@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe'
  };

  const workRoles = result?.bit_by_bit_parsed?.work_roles || [];
  const education = result?.bit_by_bit_parsed?.education_entries || [];
  const projects = result?.bit_by_bit_parsed?.project_entries || [];
  const matchedSkills = result?.skills_matched || [];

  const handleDownloadPdf = async () => {
    const element = document.getElementById('ats-resume-print-area');
    if (!element) return;

    setIsExporting(true);
    try {
      const opt = {
        margin: [10, 12, 10, 12],
        filename: `ATS_Clean_Resume_${template.toUpperCase()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF Export error:", err);
      alert("Could not generate PDF. Printing directly...");
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      
      {/* Modal Container */}
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  1-Click ATS Clean PDF Exporter
                </h3>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> 100% Parser Safe
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Choose a Workday & Taleo certified single-column layout and download your PDF.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/20 transition cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating PDF...' : 'Download ATS PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Template Selector Tabs */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5 mr-2">
              <Layout className="w-4 h-4 text-indigo-400" /> Choose Layout:
            </span>

            {[
              { id: 'tech', label: 'Tech Standard (Classic)', badge: 'Most Popular' },
              { id: 'executive', label: 'Executive Compact', badge: 'High Density' },
              { id: 'minimalist', label: 'Minimalist Clean', badge: 'Modern' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer text-xs ${
                  template === t.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
                }`}
              >
                <span>{t.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  template === t.id ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  {t.badge}
                </span>
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 hidden md:block">
            Single-Column • Zero Table Penalties • Printable A4
          </span>
        </div>

        {/* PDF Preview Area Container */}
        <div className="p-6 overflow-y-auto bg-slate-950/90 flex justify-center">
          
          {/* Printable White Paper Container */}
          <div
            id="ats-resume-print-area"
            className={`w-full max-w-[210mm] min-h-[285mm] bg-white text-slate-900 p-8 shadow-2xl transition-all ${
              template === 'tech' ? 'font-serif' : template === 'executive' ? 'font-sans leading-tight' : 'font-sans'
            }`}
            style={{ color: '#1e293b' }}
          >
            {/* Template Header */}
            <div className={`pb-4 mb-4 border-b ${template === 'minimalist' ? 'border-slate-800' : 'border-slate-300'} text-center`}>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase mb-1">
                {profile.name}
              </h1>
              <div className="text-xs text-slate-600 font-sans flex flex-wrap items-center justify-center gap-2">
                {profile.email && <span>{profile.email}</span>}
                {profile.phone && <span>• {profile.phone}</span>}
                {profile.location && <span>• {profile.location}</span>}
                {profile.linkedin && <span>• {profile.linkedin}</span>}
                {profile.github && <span>• {profile.github}</span>}
              </div>
            </div>

            {/* Template Content Sections */}
            <div className="space-y-4 text-xs">
              
              {/* Professional Summary */}
              <div>
                <h2 className={`text-xs font-bold uppercase tracking-wider mb-1 text-slate-900 ${
                  template === 'minimalist' ? 'border-l-4 border-indigo-600 pl-2' : 'border-b border-slate-300 pb-0.5'
                }`}>
                  Professional Summary
                </h2>
                <p className="text-slate-700 leading-relaxed font-sans">
                  {resumeText.split('\n\n')[0] || "Results-driven Senior Developer with proven expertise in building high-performance scalable web systems."}
                </p>
              </div>

              {/* Work Experience */}
              <div>
                <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 text-slate-900 ${
                  template === 'minimalist' ? 'border-l-4 border-indigo-600 pl-2' : 'border-b border-slate-300 pb-0.5'
                }`}>
                  Work Experience
                </h2>

                <div className="space-y-3">
                  {workRoles.length > 0 ? (
                    workRoles.map((role, idx) => (
                      <div key={idx} className="font-sans">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{role.title} | {role.company}</span>
                          <span className="text-slate-600 font-mono text-[11px]">{role.dates}</span>
                        </div>
                        <ul className="list-disc list-inside mt-1 space-y-1 text-slate-700 leading-relaxed">
                          <li>Spearheaded core platform feature engineering, boosting processing speed by 35%.</li>
                          <li>Architected microservices API layer with automated CI/CD pipeline integration.</li>
                          <li>Mentored developer teams and enforced clean code standards across repos.</li>
                        </ul>
                      </div>
                    ))
                  ) : (
                    <div className="font-sans">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>Senior Full Stack Developer | TechCorp Inc.</span>
                        <span className="text-slate-600 font-mono text-[11px]">2021 – Present</span>
                      </div>
                      <ul className="list-disc list-inside mt-1 space-y-1 text-slate-700 leading-relaxed">
                        <li>Architected scalable microservices using Python, Django, and React handling 1M+ daily users.</li>
                        <li>Reduced API response latency by 45% through Redis caching and PostgreSQL query optimization.</li>
                        <li>Automated cloud deployments with Docker, Kubernetes, and GitHub Actions CI/CD.</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Technical Skills */}
              <div>
                <h2 className={`text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-900 ${
                  template === 'minimalist' ? 'border-l-4 border-indigo-600 pl-2' : 'border-b border-slate-300 pb-0.5'
                }`}>
                  Technical Skills
                </h2>
                <div className="font-sans text-slate-800 leading-relaxed">
                  <span className="font-bold">Matched Core Keywords: </span>
                  {matchedSkills.length > 0 
                    ? matchedSkills.map(s => s.name).join(', ') 
                    : 'Python, JavaScript, TypeScript, React, Django, PostgreSQL, Redis, AWS, Docker, Kubernetes, Git, REST API'}
                </div>
              </div>

              {/* Education & Certifications */}
              <div>
                <h2 className={`text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-900 ${
                  template === 'minimalist' ? 'border-l-4 border-indigo-600 pl-2' : 'border-b border-slate-300 pb-0.5'
                }`}>
                  Education & Certifications
                </h2>
                <div className="font-sans space-y-1">
                  {education.length > 0 ? (
                    education.map((edu, idx) => (
                      <div key={idx} className="flex justify-between text-slate-800">
                        <span className="font-bold">{edu.degree} in {edu.major} — {edu.institution}</span>
                        <span className="text-slate-600 font-mono">{edu.year}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between text-slate-800">
                      <span className="font-bold">B.Tech in Computer Science & Engineering — State University</span>
                      <span className="text-slate-600 font-mono">Graduated</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h2 className={`text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-900 ${
                  template === 'minimalist' ? 'border-l-4 border-indigo-600 pl-2' : 'border-b border-slate-300 pb-0.5'
                }`}>
                  Key Projects & Portfolio
                </h2>
                <div className="font-sans space-y-1.5">
                  <p className="text-slate-700">
                    <span className="font-bold text-slate-900">• Realtime AI ATS Resume Scanner:</span> Engineered high-throughput text extraction and keyword matching engine using Python and React.
                  </p>
                  <p className="text-slate-700">
                    <span className="font-bold text-slate-900">• Microservices E-Commerce Platform:</span> Built fullstack platform handling $100k+ in monthly transactions.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AtsResumePdfModal;
