import React from 'react';
import { Layout, CheckCircle2, AlertCircle, XCircle, Mail, Phone, Globe, Link2 } from 'lucide-react';


const SectionAuditCard = ({ sectionAudit, contactInfo }) => {
  if (!sectionAudit) return null;

  const sectionsList = Object.entries(sectionAudit);

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 mb-8">
      
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-800">
        <Layout className="w-5 h-5 text-indigo-400" />
        <h3 className="text-base font-bold text-white">Section & Formatting Audit</h3>
      </div>

      {/* Grid: Left Section Audit, Right Contact Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sections Checklist (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Essential Resume Structure Checklist
          </h4>

          <div className="space-y-2">
            {sectionsList.map(([key, sec]) => (
              <div
                key={key}
                className={`p-3 rounded-xl border flex items-center justify-between transition ${
                  sec.present
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-rose-500/5 border-rose-500/20'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {sec.present ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <span className="text-xs font-semibold text-slate-200">{sec.title}</span>
                    <p className="text-[11px] text-slate-400">
                      {sec.present ? 'Section header detected' : 'Section heading missing or unrecognized'}
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  sec.present
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {sec.present ? 'Passed' : 'Missing'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info Verification (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Recruiter Contact Details Audit
            </h4>

            <div className="space-y-2.5 text-xs">
              
              {/* Email */}
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Email Address</span>
                </span>
                {contactInfo?.has_email ? (
                  <span className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Found
                  </span>
                ) : (
                  <span className="text-rose-400 font-medium text-[11px]">Missing</span>
                )}
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Phone Number</span>
                </span>
                {contactInfo?.has_phone ? (
                  <span className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Found
                  </span>
                ) : (
                  <span className="text-rose-400 font-medium text-[11px]">Missing</span>
                )}
              </div>

              {/* LinkedIn */}
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2 text-slate-300">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  <span>LinkedIn Profile</span>
                </span>
                {contactInfo?.has_linkedin ? (
                  <span className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="text-amber-400 font-medium text-[11px]">Recommended</span>
                )}
              </div>

              {/* GitHub */}
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2 text-slate-300">
                  <Link2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>GitHub / Portfolio</span>
                </span>
                {contactInfo?.has_github ? (
                  <span className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="text-slate-400 font-medium text-[11px]">Optional</span>
                )}
              </div>

            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Ensure contact details are in plain text header without embedding inside images or custom tables.
          </div>
        </div>

      </div>

    </div>
  );
};

export default SectionAuditCard;
