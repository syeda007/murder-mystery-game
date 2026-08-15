import React, { useState, useRef, useEffect } from 'react';
import { Send, User, MessageSquare, AlertTriangle, Key, ShieldCheck, Flame, HelpCircle, Loader2, Sparkles, FolderOpen } from 'lucide-react';
import { Suspect, Clue, MysteryCase } from '../types';
import { soundFx } from '../utils/audio';

interface InterrogationChamberProps {
  suspects: Suspect[];
  selectedSuspectId: string | null;
  onSelectSuspect: (suspectId: string) => void;
  discoveredClues: Clue[];
  onSendMessage: (suspectId: string, question: string, presentedClue?: Clue) => Promise<void>;
  isInterrogating: boolean;
  currentCase: MysteryCase;
}

export const InterrogationChamber: React.FC<InterrogationChamberProps> = ({
  suspects,
  selectedSuspectId,
  onSelectSuspect,
  discoveredClues,
  onSendMessage,
  isInterrogating,
  currentCase
}) => {
  const activeSuspect = suspects.find(s => s.id === selectedSuspectId) || suspects[0];
  const [customQuestion, setCustomQuestion] = useState('');
  const [selectedClueToPresent, setSelectedClueToPresent] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSuspect?.dialogueHistory, isInterrogating]);

  const handleSend = async (questionText: string, clue?: Clue) => {
    if (!questionText.trim() && !clue) return;
    soundFx.playTypewriter();
    await onSendMessage(activeSuspect.id, questionText, clue);
    setCustomQuestion('');
    setSelectedClueToPresent('');
  };

  const getStressColor = (stress: number) => {
    if (stress >= 70) return 'bg-red-500 text-red-400';
    if (stress >= 40) return 'bg-amber-500 text-amber-400';
    return 'bg-emerald-500 text-emerald-400';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Roster: Suspects List */}
      <div className="lg:col-span-4 space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-500" />
            <span>PERSONS OF INTEREST ({suspects.length})</span>
          </h3>
          <span className="text-[11px] font-mono text-neutral-500">
            {suspects.filter(s => s.secretUnlocked).length} Secrets Broken
          </span>
        </div>

        <div className="space-y-2">
          {suspects.map((s) => {
            const isSelected = s.id === activeSuspect?.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  soundFx.playTypewriter();
                  onSelectSuspect(s.id);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-2.5 ${
                  isSelected
                    ? 'bg-neutral-900 border-amber-500/80 shadow-md shadow-amber-500/5'
                    : 'bg-neutral-950/60 hover:bg-neutral-900/80 border-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif-cinzel font-bold text-sm text-neutral-100">
                      {s.name}
                    </h4>
                    <p className="text-xs text-amber-500/90 font-mono">
                      {s.role} &bull; Age {s.age}
                    </p>
                  </div>

                  {s.secretUnlocked ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/50 flex items-center gap-1">
                      <Key className="w-3 h-3" />
                      CRACKED
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-neutral-400">STRESS</span>
                      <div className="w-12 h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getStressColor(s.stressLevel).split(' ')[0]}`}
                          style={{ width: `${Math.min(s.stressLevel, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-xs text-neutral-400 font-story line-clamp-2 italic">
                  "{s.publicAlibi}"
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Area: Active Suspect Interrogation Desk */}
      <div className="lg:col-span-8 space-y-4">
        {activeSuspect ? (
          <div className="bg-neutral-950/90 border border-neutral-800 rounded-xl flex flex-col h-[650px] shadow-xl overflow-hidden">
            {/* Header: Suspect Profile & Stress Bar */}
            <div className="p-4 bg-neutral-900/90 border-b border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-700 flex items-center justify-center font-serif-cinzel font-bold text-amber-400 text-lg shadow-inner">
                  {activeSuspect.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif-cinzel font-bold text-base text-neutral-100">
                      {activeSuspect.name}
                    </h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      {activeSuspect.occupation}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-story">
                    Relation to Victim: <span className="text-neutral-200">{activeSuspect.relationToVictim}</span>
                  </p>
                </div>
              </div>

              {/* Stress Gauge */}
              <div className="w-full sm:w-48 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-400 flex items-center gap-1">
                    <Flame className={`w-3 h-3 ${activeSuspect.stressLevel >= 70 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
                    PSYCHOLOGICAL STRESS:
                  </span>
                  <span className={`font-bold ${getStressColor(activeSuspect.stressLevel).split(' ')[1]}`}>
                    {activeSuspect.stressLevel}%
                  </span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${getStressColor(activeSuspect.stressLevel).split(' ')[0]}`}
                    style={{ width: `${Math.min(activeSuspect.stressLevel, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Secret Unlocked Banner if cracked */}
            {activeSuspect.secretUnlocked && (
              <div className="bg-red-950/30 border-b border-red-800/40 px-4 py-2.5 flex items-center gap-2 text-xs text-red-300 font-story animate-in fade-in">
                <Key className="w-4 h-4 text-red-400 shrink-0" />
                <span>
                  <strong>CRITICAL SECRET UNLOCKED:</strong> {activeSuspect.secret}
                </span>
              </div>
            )}

            {/* Interrogation Dialogue Transcript */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-neutral-950/60">
              {activeSuspect.dialogueHistory.map((msg) => {
                const isDetective = msg.sender === 'detective';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isDetective ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-neutral-500">
                        {isDetective ? 'DETECTIVE' : activeSuspect.name.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-600">
                        {msg.timestamp}
                      </span>
                    </div>

                    <div
                      className={`max-w-[85%] p-3.5 rounded-xl text-xs leading-relaxed font-story ${
                        isDetective
                          ? 'bg-amber-600/20 text-neutral-100 border border-amber-500/40 rounded-tr-none'
                          : 'bg-neutral-900 text-neutral-200 border border-neutral-800 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {isInterrogating && (
                <div className="flex items-center gap-2 text-xs text-amber-400 font-mono italic p-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{activeSuspect.name} is formulating a response under pressure...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Tactical Inquiry Prompts */}
            <div className="p-3 bg-neutral-900/70 border-t border-neutral-800 space-y-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
                <button
                  onClick={() => handleSend(`Can you recount your exact whereabouts and alibi at the time of the murder?`)}
                  disabled={isInterrogating}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 hover:border-amber-500/40 transition flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3 text-amber-400" />
                  Question Alibi
                </button>

                <button
                  onClick={() => handleSend(`What was your true relationship with ${currentCase.victim.name}? Did you have any disputes?`)}
                  disabled={isInterrogating}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 hover:border-amber-500/40 transition flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3 text-sky-400" />
                  Ask About Victim
                </button>

                <button
                  onClick={() => handleSend(`Your statements have contradictions. We know you are hiding something crucial. Tell us the truth now!`)}
                  disabled={isInterrogating}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 transition flex items-center gap-1"
                >
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  Apply Pressure
                </button>
              </div>

              {/* Present Discovered Clue Selector */}
              {discoveredClues.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800">
                    <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <select
                      value={selectedClueToPresent}
                      onChange={(e) => setSelectedClueToPresent(e.target.value)}
                      className="bg-transparent text-xs text-neutral-200 focus:outline-none w-full font-story"
                    >
                      <option value="">-- Present Physical Evidence --</option>
                      {discoveredClues.map((c) => (
                        <option key={c.id} value={c.id}>
                          [{c.category.toUpperCase()}] {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      const clue = discoveredClues.find(c => c.id === selectedClueToPresent);
                      if (clue) {
                        handleSend(`I have this piece of evidence: "${clue.name}". How do you explain this?`, clue);
                      }
                    }}
                    disabled={!selectedClueToPresent || isInterrogating}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs font-mono uppercase tracking-wider transition disabled:opacity-40"
                  >
                    Confront
                  </button>
                </div>
              )}

              {/* Free-form Prompt Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(customQuestion);
                }}
                className="flex items-center gap-2 pt-1"
              >
                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="Pose a custom question to the suspect..."
                  disabled={isInterrogating}
                  className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3.5 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-story"
                />
                <button
                  type="submit"
                  disabled={!customQuestion.trim() || isInterrogating}
                  className="p-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold transition disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
