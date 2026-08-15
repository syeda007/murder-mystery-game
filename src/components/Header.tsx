import React from 'react';
import { Volume2, VolumeX, CloudRain, Sparkles, BookOpen, Clock, FileText, Users, Github, User, ShieldCheck } from 'lucide-react';
import { MysteryCase } from '../types';
import { soundFx } from '../utils/audio';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentCase: MysteryCase;
  actionPoints: number;
  maxActionPoints: number;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onOpenCaseSelector: () => void;
  onOpenVictimDossier: () => void;
  onOpenDocumentation: () => void;
  onOpenGmHint: () => void;
  onOpenAuth: () => void;
  isGmHintLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentCase,
  actionPoints,
  maxActionPoints,
  isSoundEnabled,
  onToggleSound,
  onOpenCaseSelector,
  onOpenVictimDossier,
  onOpenDocumentation,
  onOpenGmHint,
  onOpenAuth,
  isGmHintLoading
}) => {
  const [isRainOn, setIsRainOn] = React.useState(false);
  const { user } = useAuth();

  const handleToggleRain = () => {
    const newState = soundFx.toggleRainAmbience();
    setIsRainOn(newState);
  };

  const actionPercent = (actionPoints / maxActionPoints) * 100;

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Active Case Header */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-serif-cinzel font-bold text-lg shadow-inner">
              GM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-neutral-100 font-serif-cinzel tracking-wide">
                  MURDER MYSTERY GM
                </h1>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono border border-amber-500/30">
                  {currentCase.difficulty}
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-story truncate max-w-[260px] sm:max-w-sm">
                Case File: <span className="text-neutral-200 font-medium">{currentCase.title}</span>
              </p>
            </div>
          </div>

          {/* Switch Case Button */}
          <button
            onClick={onOpenCaseSelector}
            className="text-xs bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white px-3 py-1.5 rounded-md border border-neutral-700 transition flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Cases</span>
          </button>
        </div>

        {/* Action Points / Investigation Clock Tracker */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 rounded-lg px-3 py-1.5 shadow-sm">
            <Clock className="w-4 h-4 text-amber-400" />
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 gap-2">
                <span>INSPECTION HOURS:</span>
                <span className={`font-bold ${actionPoints <= 3 ? 'text-red-400 animate-pulse' : 'text-neutral-200'}`}>
                  {actionPoints} / {maxActionPoints} HRS
                </span>
              </div>
              <div className="w-28 h-1.5 bg-neutral-800 rounded-full overflow-hidden mt-0.5">
                <div
                  className={`h-full transition-all duration-300 ${
                    actionPoints <= 3 ? 'bg-red-500' : actionPoints <= 6 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${actionPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Utility Actions & Auth */}
          <div className="flex items-center gap-1.5">
            {/* User Account / Google Auth & Supabase DB Status */}
            <button
              onClick={onOpenAuth}
              title={user ? `Signed in as ${user.displayName}` : "Sign In with Google / Database Sync"}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono transition flex items-center gap-1.5 ${
                user
                  ? 'bg-neutral-900 text-amber-400 border-amber-500/40 hover:bg-neutral-800'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
              }`}
            >
              {user ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span className="max-w-[80px] sm:max-w-[110px] truncate">{user.displayName}</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="hidden sm:inline">Sign In</span>
                </>
              )}
            </button>

            {/* Victim Dossier Button */}
            <button
              onClick={onOpenVictimDossier}
              title="View Victim Autopsy & Docket"
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 border border-neutral-800 transition"
            >
              <FileText className="w-4 h-4" />
            </button>

            {/* AI GM Consultation / Hint */}
            <button
              onClick={onOpenGmHint}
              disabled={isGmHintLoading}
              title="Consult Game Master AI for subtle forensic hint"
              className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition flex items-center gap-1 text-xs font-mono disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGmHintLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">GM Hint</span>
            </button>

            {/* Rain Ambience Toggle */}
            <button
              onClick={handleToggleRain}
              title={isRainOn ? "Disable Rain Ambiance" : "Enable Rain Ambiance"}
              className={`p-2 rounded-lg border transition ${
                isRainOn
                  ? 'bg-sky-950/60 text-sky-400 border-sky-600/50'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border-neutral-800'
              }`}
            >
              <CloudRain className="w-4 h-4" />
            </button>

            {/* Master Sound Effects Toggle */}
            <button
              onClick={onToggleSound}
              title={isSoundEnabled ? "Mute SFX" : "Unmute SFX"}
              className={`p-2 rounded-lg border transition ${
                isSoundEnabled
                  ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
                  : 'bg-red-950/40 text-red-400 border-red-800/40'
              }`}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* GitHub & Vercel Documentation */}
            <button
              onClick={onOpenDocumentation}
              title="Documentation & Deployment Guide"
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition"
            >
              <Github className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

