import React from 'react';
import { X, Sparkles, Compass, Lightbulb, CloudRain } from 'lucide-react';

interface GmHintModalProps {
  isOpen: boolean;
  onClose: () => void;
  hint: string;
  atmosphericObservation: string;
  caseTitle: string;
}

export const GmHintModal: React.FC<GmHintModalProps> = ({
  isOpen,
  onClose,
  hint,
  atmosphericObservation,
  caseTitle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif-cinzel text-neutral-100 uppercase tracking-wide">
                Game Master Consultation
              </h2>
              <p className="text-xs text-neutral-400 font-story">
                Case: {caseTitle}
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

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Atmospheric Observation */}
          {atmosphericObservation && (
            <div className="p-3.5 bg-neutral-950 rounded-lg border border-neutral-800 text-xs text-neutral-300 font-story italic leading-relaxed flex items-start gap-2.5">
              <CloudRain className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>"{atmosphericObservation}"</span>
            </div>
          )}

          {/* Deductive Nudge */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" />
              <span>Deductive Nudge</span>
            </div>
            <p className="text-xs text-neutral-200 font-story leading-relaxed">
              {hint || "Cross-reference the timeline timestamps with the travel logs in the station."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-mono transition"
          >
            Back to Case
          </button>
        </div>
      </div>
    </div>
  );
};
