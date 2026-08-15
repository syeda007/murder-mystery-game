import React, { useState } from 'react';
import { X, Github, Terminal, Copy, Check, ExternalLink, Globe, Layers, BookOpen, ShieldCheck } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    soundFx.playTypewriter();
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const gitSnippet = `# 1. Initialize Git repository
git init
git add .
git commit -m "feat: Initial commit of Murder Mystery Game Master"

# 2. Add your GitHub repository remote
git remote add origin https://github.com/YOUR_USERNAME/murder-mystery-game-master.git
git branch -M main

# 3. Push to GitHub
git push -u origin main`;

  const vercelSnippet = `# 1. Install Vercel CLI (or connect via GitHub on vercel.com)
npm i -g vercel

# 2. Deploy to production
vercel --prod

# 3. Add Environment Variable in Vercel Dashboard:
# GEMINI_API_KEY = your_gemini_api_key_here`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-neutral-800 text-neutral-200 rounded-lg">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif-cinzel text-neutral-100 uppercase tracking-wide">
                Repository Documentation & Deployment Guide
              </h2>
              <p className="text-xs text-neutral-400 font-story">
                Instructions for pushing to GitHub, deploying to Vercel, and project architecture.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs leading-relaxed font-story text-neutral-300">
          {/* Overview */}
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
            <h3 className="font-serif-cinzel font-bold text-sm text-neutral-100 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Project Architecture & Stack</span>
            </h3>
            <p className="text-neutral-300">
              <strong>Murder Mystery Game Master</strong> is a noir detective game engine and interactive party Game Master simulator. Built with:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-400 font-mono text-[11px]">
              <li><strong>Frontend:</strong> React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, Canvas Confetti.</li>
              <li><strong>Backend Engine:</strong> Node.js Express server + Google GenAI SDK (<code className="text-amber-400">@google/genai</code>) powered by <code className="text-amber-400">gemini-3.7-flash</code>.</li>
              <li><strong>Audio:</strong> Native Web Audio API procedural synthesizer for rain ambience and noir SFX.</li>
            </ul>
          </div>

          {/* GitHub Push Instructions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-cinzel font-bold text-sm text-neutral-100 uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>1. Push Repository to GitHub</span>
              </h3>
              <button
                onClick={() => copyToClipboard(gitSnippet, 'git')}
                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[11px] font-mono flex items-center gap-1 transition"
              >
                {copiedCode === 'git' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode === 'git' ? 'Copied' : 'Copy Commands'}</span>
              </button>
            </div>
            <pre className="p-3.5 bg-neutral-950 rounded-lg border border-neutral-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
              {gitSnippet}
            </pre>
          </div>

          {/* Vercel Deployment Guide */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-cinzel font-bold text-sm text-neutral-100 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-400" />
                <span>2. Deploy to Vercel</span>
              </h3>
              <button
                onClick={() => copyToClipboard(vercelSnippet, 'vercel')}
                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[11px] font-mono flex items-center gap-1 transition"
              >
                {copiedCode === 'vercel' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode === 'vercel' ? 'Copied' : 'Copy Commands'}</span>
              </button>
            </div>
            <pre className="p-3.5 bg-neutral-950 rounded-lg border border-neutral-800 font-mono text-[11px] text-sky-400 overflow-x-auto">
              {vercelSnippet}
            </pre>
            <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
              <p><strong>Deployment Options on Vercel:</strong></p>
              <p>1. Import your GitHub repository on <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">vercel.com</a>.</p>
              <p>2. Set Framework Preset to <strong>Vite</strong> or <strong>Other</strong>.</p>
              <p>3. In Project Settings &gt; Environment Variables, add <code className="text-amber-400">GEMINI_API_KEY</code>, <code className="text-amber-400">VITE_SUPABASE_URL</code>, and <code className="text-amber-400">VITE_SUPABASE_ANON_KEY</code>.</p>
            </div>
          </div>

          {/* Supabase & Google Auth Setup */}
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2.5">
            <h3 className="font-serif-cinzel font-bold text-sm text-neutral-100 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>3. Supabase PostgreSQL & Detective Auth Setup</span>
            </h3>
            <p className="text-neutral-300">
              The application uses <strong>Supabase PostgreSQL</strong> for durable database storage (game saves, AI dockets, custom cases, leaderboard) and <strong>Password / Google Authentication</strong> (independent of Supabase Auth):
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-neutral-400 text-[11px]">
              <li>Create or open your Supabase project (e.g. <code className="text-amber-400">nelxilbfootkevjyyoqa.supabase.co</code>).</li>
              <li>Go to the <strong>SQL Editor</strong> in Supabase and run the standalone schema script located in <code className="text-amber-400">supabase/schema.sql</code>.</li>
              <li>Your database tables (<code className="text-amber-400">profiles</code>, <code className="text-amber-400">game_saves</code>, <code className="text-amber-400">custom_cases</code>, <code className="text-amber-400">leaderboard</code>) are now live and synced.</li>
              <li>Detectives can sign in with <strong>Password</strong> or <strong>Google Account</strong> (via Google Identity Services / NextAuth standard token).</li>
            </ol>
          </div>


          {/* Game Rules & Mechanics */}
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
            <h3 className="font-serif-cinzel font-bold text-sm text-neutral-100 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Core Detective Mechanics</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-300">
              <li><strong>Inspection Hours:</strong> Each room search costs 1 inspection hour. Manage time wisely.</li>
              <li><strong>Psychological Stress Meter:</strong> Suspects experience rising stress when asked probing questions or confronted with key evidence. Exceeding 60% stress cracks their secret!</li>
              <li><strong>Red-String Deduction Matrix:</strong> Pin evidence and link suspects to motives on the Evidence corkboard.</li>
              <li><strong>Party GM Mode:</strong> Hand out character dossiers to friends in person or over Discord, manage round prompts, and tally votes.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-mono transition"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
