import React from 'react';
import { Sparkles, FileText, Download, Zap, Moon, Sun } from 'lucide-react';

const Navbar = ({ onLoadSample, isDark, setIsDark, onExportReport, onOpenPdfModal }) => {
  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                ATS RealTime <span className="text-indigo-400 font-light">Studio</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v2.0 Realtime Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              AI-Powered Resume Optimization & Realtime Job Matcher
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Realtime Active Indicator */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Live Analysis Active</span>
          </div>

          {/* Sample Resume Loader */}
          <button
            onClick={onLoadSample}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs sm:text-sm font-medium transition cursor-pointer"
            title="Load an impressive sample developer resume"
          >
            <FileText className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Load Sample</span>
          </button>

          {/* 1-Click ATS PDF Exporter */}
          <button
            onClick={onOpenPdfModal}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
            title="Export clean 100% ATS parser-safe PDF"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download ATS PDF</span>
          </button>

          {/* Export Full Report */}
          <button
            onClick={onExportReport}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs sm:text-sm font-medium transition cursor-pointer"
          >
            <span className="hidden sm:inline">Export Report</span>
          </button>


          {/* Dark / Light Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 transition cursor-pointer"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
