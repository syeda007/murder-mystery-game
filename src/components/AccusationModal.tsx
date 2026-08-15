import React, { useState } from 'react';
import { Gavel, AlertTriangle, ShieldCheck, User, Skull, Key, FileText, Loader2, Sparkles } from 'lucide-react';
import { Suspect, Clue, AccusationSubmission, MysteryCase } from '../types';
import { soundFx } from '../utils/audio';

interface AccusationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: MysteryCase;
  discoveredClues: Clue[];
  onSubmitAccusation: (submission: AccusationSubmission) => Promise<void>;
  isSubmitting: boolean;
}

export const AccusationModal: React.FC<AccusationModalProps> = ({
  isOpen,
  onClose,
  currentCase,
  discoveredClues,
  onSubmitAccusation,
  isSubmitting
}) => {
  const [suspectId, setSuspectId] = useState('');
  const [weapon, setWeapon] = useState('');
  const [motive, setMotive] = useState('');
  const [keyClueId, setKeyClueId] = useState('');
  const [reasoningNotes, setReasoningNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspectId || !weapon.trim() || !motive.trim()) return;
    soundFx.playGavel();
    await onSubmitAccusation({
      suspectId,
      weapon: weapon.trim(),
      motive: motive.trim(),
      keyClueId,
      reasoningNotes: reasoningNotes.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-950/60 text-red-400 border border-red-800/50 rounded-lg">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif-cinzel text-neutral-100 uppercase tracking-wide">
                FORMAL WRIT OF INDICTMENT
              </h2>
              <p className="text-xs text-neutral-400 font-story">
                Assemble the suspects and present your definitive case before the court.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="p-3.5 bg-red-950/20 border border-red-800/30 rounded-lg text-xs text-red-300 font-story flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>
              <strong>Warning:</strong> Delivering your accusation concludes active forensic investigation. Ensure you have uncovered sufficient evidence to dismantle the killer's alibi.
            </span>
          </div>

          {/* Accused Suspect */}
          <div>
            <label className="block text-xs font-mono font-bold text-neutral-300 mb-1.5 uppercase">
              1. PRIMARY SUSPECT (THE CULPRIT)
            </label>
            <select
              value={suspectId}
              onChange={(e) => setSuspectId(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500 font-story"
              required
            >
              <option value="">-- Name the Murderer --</option>
              {currentCase.suspects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} &bull; {s.role} ({s.occupation})
                </option>
              ))}
            </select>
          </div>

          {/* Murder Weapon */}
          <div>
            <label className="block text-xs font-mono font-bold text-neutral-300 mb-1.5 uppercase">
              2. MURDER WEAPON & METHOD
            </label>
            <input
              type="text"
              value={weapon}
              onChange={(e) => setWeapon(e.target.value)}
              placeholder="e.g. Potassium Cyanide frosted onto the crystal snifter rim..."
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500 font-story"
              required
            />
          </div>

          {/* True Motive */}
          <div>
            <label className="block text-xs font-mono font-bold text-neutral-300 mb-1.5 uppercase">
              3. UNDERLYING MOTIVE
            </label>
            <input
              type="text"
              value={motive}
              onChange={(e) => setMotive(e.target.value)}
              placeholder="e.g. Blackmail over previous fatal medical malpractice in London..."
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500 font-story"
              required
            />
          </div>

          {/* Decisive Clue */}
          <div>
            <label className="block text-xs font-mono font-bold text-neutral-300 mb-1.5 uppercase">
              4. DECISIVE FORENSIC PROOF (OPTIONAL)
            </label>
            <select
              value={keyClueId}
              onChange={(e) => setKeyClueId(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500 font-story"
            >
              <option value="">-- Cite Decisive Clue --</option>
              {discoveredClues.map(c => (
                <option key={c.id} value={c.id}>
                  [{c.category.toUpperCase()}] {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Detective Reasoning */}
          <div>
            <label className="block text-xs font-mono font-bold text-neutral-300 mb-1.5 uppercase">
              5. DETECTIVE DEDUCTION & HOW THE ALIBI WAS BROKEN
            </label>
            <textarea
              value={reasoningNotes}
              onChange={(e) => setReasoningNotes(e.target.value)}
              placeholder="Summarize the chronological chain of events that exposes the suspect's lie..."
              rows={4}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500 font-story leading-relaxed"
            />
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-mono transition"
            >
              Continue Investigating
            </button>

            <button
              type="submit"
              disabled={!suspectId || !weapon.trim() || !motive.trim() || isSubmitting}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs font-mono uppercase tracking-wider transition flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-red-950"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Delivering Indictment...
                </>
              ) : (
                <>
                  <Gavel className="w-4 h-4" />
                  Issue Final Indictment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
