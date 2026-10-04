import React from 'react';
import { Sparkles } from 'lucide-react';

const Navbar = () => (
  <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0B0F19]/85 backdrop-blur-xl">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
      <a href="#top" className="flex items-center gap-3" aria-label="Resume Review home">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-950/40">
          <Sparkles className="h-4 w-4" />
        </span>
        <span className="text-sm font-semibold tracking-tight text-white sm:text-base">ClearCV <span className="font-normal text-slate-400">Resume Review</span></span>
      </a>
    </div>
  </header>
);

export default Navbar;
