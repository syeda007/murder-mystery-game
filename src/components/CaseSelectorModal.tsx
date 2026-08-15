import React, { useState } from 'react';
import { X, Sparkles, Shield, Clock, MapPin, Play, Loader2 } from 'lucide-react';
import { MysteryCase, Difficulty } from '../types';
import { soundFx } from '../utils/audio';

interface CaseSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  cases: MysteryCase[];
  currentCaseId: string;
  onSelectCase: (caseId: string) => void;
  onGenerateCustomCase: (theme: string, era: string, difficulty: Difficulty, customPrompt: string) => Promise<void>;
  isGeneratingCase: boolean;
}

export const CaseSelectorModal: React.FC<CaseSelectorModalProps> = ({
  isOpen,
  onClose,
  cases,
  currentCaseId,
  onSelectCase,
  onGenerateCustomCase,
  isGeneratingCase
}) => {
  const [showAiCreator, setShowAiCreator] = useState(false);
  const [theme, setTheme] = useState('Gothic Victorian Estate');
  const [era, setEra] = useState('1895 London Fog');
  const [difficulty, setDifficulty] = useState<Difficulty>('Detective');
  const [customPrompt, setCustomPrompt] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playTypewriter();
    await onGenerateCustomCase(theme, era, difficulty, customPrompt);
    setShowAiCreator(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div>
            <h2 className="text-xl font-bold font-serif-cinzel text-neutral-100 flex items-center gap-2">
              <span>CASE ARCHIVES & DOCKET SELECTOR</span>
            </h2>
            <p className="text-xs text-neutral-400 font-story">
              Choose an active crime file or summon the AI Game Master to forge a new scenario.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Action Bar */}
          <div className="flex items-center justify-between bg-neutral-950 p-4 rounded-lg border border-neutral-800/80">
            <div>
              <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-1.5 font-serif-cinzel">
                <Sparkles className="w-4 h-4 text-amber-400" />
                AI Mystery Forge
              </h3>
              <p className="text-xs text-neutral-400 font-story">
                Create a completely unique mystery case with custom rooms, suspects, and clues.
              </p>
            </div>
            <button
              onClick={() => setShowAiCreator(!showAiCreator)}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-neutral-950 font-medium text-xs tracking-wide uppercase transition shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {showAiCreator ? 'View Archives' : 'Forge New Case'}
            </button>
          </div>

          {/* AI Custom Case Generator Form */}
          {showAiCreator ? (
            <form onSubmit={handleGenerate} className="bg-neutral-950/80 border border-amber-500/20 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-amber-400 font-serif-cinzel tracking-wider uppercase">
                Case Generation Parameters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">THEME / SETTING</label>
                  <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g. Submarine deep sea dive"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">ERA / TIME PERIOD</label>
                  <input
                    type="text"
                    value={era}
                    onChange={(e) => setEra(e.target.value)}
                    placeholder="e.g. 1920s Speakeasy or 2049 Sci-Fi"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">DIFFICULTY</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Novice">Novice (Clear trail)</option>
                    <option value="Detective">Detective (Balanced)</option>
                    <option value="Mastermind">Mastermind (Locked-room)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">CUSTOM STORY DIRECTIVES (OPTIONAL)</label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. A museum heist gone wrong with an ancient mummy curse and 4 quarreling archaeologists..."
                  rows={3}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAiCreator(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingCase}
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isGeneratingCase ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Forging Mystery Storyline...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate Case Docket
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : null}

          {/* List of Cases */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cases.map((c) => {
              const isSelected = c.id === currentCaseId;
              return (
                <div
                  key={c.id}
                  className={`rounded-xl border transition-all flex flex-col justify-between p-5 relative overflow-hidden ${
                    isSelected
                      ? 'bg-neutral-950 border-amber-500/80 shadow-lg shadow-amber-500/10'
                      : 'bg-neutral-950/60 hover:bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-neutral-950 text-[10px] font-bold px-2 py-0.5 rounded-bl uppercase font-mono">
                      ACTIVE
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono border border-neutral-700">
                        {c.era}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono border border-amber-500/30">
                        {c.difficulty}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif-cinzel font-bold text-neutral-100 text-base leading-tight">
                        {c.title}
                      </h3>
                      <p className="text-xs text-amber-500/90 font-story italic mt-0.5">
                        {c.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-neutral-400 font-story line-clamp-3 leading-relaxed">
                      {c.summary}
                    </p>

                    <div className="pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400 space-y-1 font-mono">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="truncate">{c.setting}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{c.estimatedTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3">
                    <button
                      onClick={() => {
                        soundFx.playTypewriter();
                        onSelectCase(c.id);
                        onClose();
                      }}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-neutral-800 text-amber-400 border border-neutral-700 cursor-default'
                          : 'bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-200 border border-neutral-700'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5" />
                      {isSelected ? 'Currently Investigating' : 'Open Crime Docket'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
