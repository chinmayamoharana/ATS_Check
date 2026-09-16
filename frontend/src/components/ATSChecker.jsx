import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import HeroHeader from './HeroHeader';
import JobDescriptionPanel from './JobDescriptionPanel';
import RealtimeEditor from './RealtimeEditor';
import ScoreDashboard from './ScoreDashboard';
import KeywordBreakdown from './KeywordBreakdown';
import SectionAuditCard from './SectionAuditCard';
import ImpactAnalyzer from './ImpactAnalyzer';
import BulletOptimizerModal from './BulletOptimizerModal';
import BitByBitInspector from './BitByBitInspector';
import SevenPillarDashboard from './SevenPillarDashboard';
import BooleanSearchSimulator from './BooleanSearchSimulator';
import LayoutSafetyAuditor from './LayoutSafetyAuditor';
import AtsResumePdfModal from './AtsResumePdfModal';
import ExtractedTextInspector from './ExtractedTextInspector';
import ScoreAuditInspector from './ScoreAuditInspector';







const API_BASE_URL = 'http://127.0.0.1:8000/api/ats';

const SAMPLE_RESUME_TEXT = `JOHN DOE
Email: john.doe@example.com | Phone: +1 (555) 234-5678
LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe | Portfolio: johndoe.dev

PROFESSIONAL SUMMARY
Results-driven Senior Full Stack Developer with 5+ years of experience architecting high-throughput microservices and responsive web applications using React, Node.js, Python, and Django. Spearheaded system scalability to handle 1M+ daily active users while reducing API response latency by 45%.

WORK EXPERIENCE
Senior Full Stack Engineer | TechCorp Inc. (2021 – Present)
• Spearheaded the redesign of core React dashboard, accelerating page load speed by 50% and boosting user engagement by 35%.
• Architected and deployed microservices backend using Python, Django, FastAPI, and PostgreSQL on AWS EC2/S3.
• Integrated Docker, Kubernetes, and GitHub Actions CI/CD pipelines, cutting deployment time by 60%.
• Mentored a team of 6 developers and introduced automated testing with Pytest and Jest, achieving 90% test coverage.

Full Stack Developer | CloudSolutions (2018 – 2021)
• Engineered RESTful APIs and GraphQL endpoints for mobile and web clients, serving 500k+ monthly active requests.
• Optimized Redis caching layer, saving $12k annually in infrastructure costs.
• Refactored legacy MySQL database schemas, reducing query latency by 40%.

EDUCATION & DEGREES
B.Tech in Computer Science & Engineering | State University (2014 – 2018)

TECHNICAL SKILLS
• Languages: Python, JavaScript, TypeScript, SQL, HTML5, CSS3, Bash
• Frontend: React, Next.js, Redux, Tailwind CSS, Vite, REST API
• Backend: Django, FastAPI, Node.js, Express, PostgreSQL, Redis, Microservices
• DevOps & Cloud: AWS, Docker, Kubernetes, CI/CD, Git, GitHub Actions, Nginx

KEY PROJECTS
• E-Commerce Microservices Platform: Built fullstack platform with Stripe integration handling $100k+ in transactions.
• AI Resume Scanner: Developed real-time keyword matching tool using Python and React with 95% accuracy.`;

const ATSChecker = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME_TEXT);
  const [jobRole, setJobRole] = useState('fullstack');
  const [jobDescription, setJobDescription] = useState('');
  const [jobTemplates, setJobTemplates] = useState(null);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAnalyzingRealtime, setIsAnalyzingRealtime] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isBulletModalOpen, setIsBulletModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);


  const debounceTimer = useRef(null);

  // 1. Fetch Job Preset Templates on mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/job-templates/`);
        setJobTemplates(res.data);
      } catch (err) {
        console.error("Error fetching job templates:", err);
      }
    };
    fetchTemplates();
  }, []);

  // 2. Realtime Debounced Auto-Analysis when resumeText, jobRole, or jobDescription changes
  useEffect(() => {
    if (!resumeText || resumeText.trim().length < 10) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      setIsAnalyzingRealtime(true);
      try {
        const res = await axios.post(`${API_BASE_URL}/realtime-analyze/`, {
          resume_text: resumeText,
          job_description: jobDescription,
          job_role: jobRole
        });
        setResult(res.data);
      } catch (err) {
        console.error("Realtime analysis error:", err);
      } finally {
        setIsAnalyzingRealtime(false);
      }
    }, 350);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [resumeText, jobRole, jobDescription]);

  // 3. Handle File Upload Extraction
  useEffect(() => {
    if (!resumeFile) return;

    const uploadFile = async () => {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("job_role", jobRole);
      if (jobDescription) formData.append("job_description", jobDescription);

      setLoading(true);

      try {
        const res = await axios.post(`${API_BASE_URL}/check/`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setResult(res.data);
        const extractedFullText = res.data.parsed_resume?.full_extracted_text || res.data.parsed_resume?.preview_text;
        if (extractedFullText) {
          setResumeText(extractedFullText);
        }

      } catch (err) {
        console.error(err);
        alert("Could not extract text from file. Please make sure the file contains selectable text.");
      } finally {
        setLoading(false);
      }
    };

    uploadFile();
  }, [resumeFile]);

  // 4. Load Sample Resume
  const handleLoadSample = () => {
    setResumeText(SAMPLE_RESUME_TEXT);
  };

  // 5. Inject Missing Keyword into Live Editor
  const handleAddKeyword = (keywordName) => {
    if (!resumeText.includes(keywordName)) {
      setResumeText((prev) => {
        if (prev.includes("TECHNICAL SKILLS")) {
          return prev.replace("TECHNICAL SKILLS", `TECHNICAL SKILLS\n• Additional Skill: ${keywordName}`);
        } else {
          return prev + `\n\nTECHNICAL SKILLS\n• ${keywordName}`;
        }
      });
    }
  };

  // 6. Insert AI Bullet Suggestion into Live Editor
  const handleInsertBullet = (bulletText) => {
    setResumeText((prev) => {
      if (prev.includes("WORK EXPERIENCE")) {
        return prev.replace("WORK EXPERIENCE", `WORK EXPERIENCE\n${bulletText}`);
      } else {
        return prev + `\n\nWORK EXPERIENCE\n${bulletText}`;
      }
    });
  };

  // 7. Print / Export Report
  const handleExportReport = () => {
    window.print();
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0B0F19] text-slate-100' : 'bg-slate-100 text-slate-900'} transition-colors duration-300`}>
      
      {/* Top Navbar */}
      <Navbar
        onLoadSample={handleLoadSample}
        isDark={isDark}
        setIsDark={setIsDark}
        onExportReport={handleExportReport}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
      />


      {/* Main Studio Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* Hero Section */}
        <HeroHeader />

        {/* Target Job Role & Description Configurator */}
        <JobDescriptionPanel
          jobRole={jobRole}
          setJobRole={setJobRole}
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          jobTemplates={jobTemplates}
        />

        {/* Unified Realtime Studio (Live Editor + Quick Score) */}
        <RealtimeEditor
          resumeText={resumeText}
          setResumeText={setResumeText}
          result={result}
          isAnalyzing={isAnalyzingRealtime || loading}
          onAddKeyword={handleAddKeyword}
          onOpenBulletOptimizer={() => setIsBulletModalOpen(true)}
          setResumeFile={setResumeFile}
        />

        {/* Results Dashboard (Rendered once result is available) */}
        {result && result.ats_score !== undefined && (
          <div className="space-y-8 animate-fadeIn">

            {/* 100% Extracted Content Inspector */}
            <ExtractedTextInspector
              parsedResume={result.parsed_resume}
              resumeText={resumeText}
            />

            {/* Main Score Dashboard */}
            <ScoreDashboard result={result} />

            {/* Transparent Score Calculation Audit Log */}
            <ScoreAuditInspector
              scoreAuditLog={result.score_audit_log}
              totalScore={result.ats_score}
              scoreGrade={result.score_grade}
            />



            {/* 7-Pillar Enterprise Scoring Matrix */}
            <SevenPillarDashboard sevenPillarMatrix={result.seven_pillar_matrix} />

            {/* Recruiter Boolean Query Simulator */}
            <BooleanSearchSimulator booleanSearch={result.boolean_search} />

            {/* ATS Layout Cleanliness & Parser Safety Auditor */}
            <LayoutSafetyAuditor
              layoutSafety={result.layout_safety}
              keywordDensity={result.keyword_density}
            />



            {/* Bit-by-Bit Deep Resume Parser & Entity Auditor */}
            <BitByBitInspector bitByBitData={result.bit_by_bit_parsed} />

            {/* Keyword Intelligence & Taxonomy */}
            <KeywordBreakdown
              matchedSkills={result.skills_matched}
              missingKeywords={result.missing_keywords}
              onAddKeyword={handleAddKeyword}
            />

            {/* Section & Formatting Checklist */}
            <SectionAuditCard
              sectionAudit={result.section_audit}
              contactInfo={result.parsed_resume?.contact_info}
            />

            {/* Action Verbs & Metrics Audit */}
            <ImpactAnalyzer
              impactMetrics={result.impact_metrics}
            />

          </div>
        )}

      </main>

      {/* AI Bullet Point Optimizer Modal */}
      <BulletOptimizerModal
        isOpen={isBulletModalOpen}
        onClose={() => setIsBulletModalOpen(false)}
        bulletSuggestions={result?.bullet_suggestions || []}
        onInsertBullet={handleInsertBullet}
      />

      {/* 1-Click ATS Clean PDF Exporter Modal */}
      <AtsResumePdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        result={result}
        resumeText={resumeText}
      />
    </div>
  );

};

export default ATSChecker;

