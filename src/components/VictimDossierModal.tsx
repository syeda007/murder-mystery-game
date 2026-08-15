import React from 'react';
import { X, User, Skull, MapPin, Clock, FileSpreadsheet, ShieldAlert } from 'lucide-react';
import { Victim } from '../types';

interface VictimDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  victim: Victim;
  caseTitle: string;
}

export const VictimDossierModal: React.FC<VictimDossierModalProps> = ({
  isOpen,
  onClose,
  victim,
  caseTitle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-950/50 text-red-400 border border-red-800/40 rounded-lg">
              <Skull className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif-cinzel text-neutral-100 uppercase tracking-wide">
                Victim Forensic Dossier
              </h2>
              <p className="text-xs text-neutral-400 font-story">
                Case File: {caseTitle}
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Identity Card */}
          <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-20 h-20 rounded-xl bg-neutral-900 border border-neutral-700 flex flex-col items-center justify-center text-neutral-400 shrink-0">
              <User className="w-10 h-10 text-neutral-500" />
              <span className="text-[10px] font-mono text-red-400 font-bold mt-1">DECEASED</span>
            </div>

            <div className="space-y-2 flex-1">
              <div>
                <h3 className="text-xl font-bold font-serif-cinzel text-neutral-100">
                  {victim.name}
                </h3>
                <p className="text-xs text-amber-500 font-mono font-medium">
                  {victim.title} &bull; Age {victim.age}
                </p>
              </div>

              <p className="text-xs text-neutral-300 font-story leading-relaxed">
                {victim.backstory}
              </p>
            </div>
          </div>

          {/* Preliminary Autopsy & Crime Scene Findings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800/80 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-mono text-red-400 font-semibold">
                <Skull className="w-3.5 h-3.5" />
                <span>CAUSE OF DEATH</span>
              </div>
              <p className="text-xs text-neutral-200 font-story">
                {victim.causeOfDeath}
              </p>
            </div>

            <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800/80 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>TIME OF DEATH</span>
              </div>
              <p className="text-xs text-neutral-200 font-story">
                {victim.timeOfDeath}
              </p>
            </div>
          </div>

          <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono text-sky-400 font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>LOCATION FOUND</span>
            </div>
            <p className="text-xs text-neutral-200 font-story">
              {victim.locationFound}
            </p>
          </div>

          {/* Coroner's Official Pathology Notes */}
          <div className="bg-neutral-950/90 border border-neutral-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 font-semibold uppercase tracking-wider">
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span>Chief Coroner's Pathology Report</span>
            </div>
            <div className="p-3 bg-neutral-900/80 rounded-lg border border-neutral-800 text-xs text-neutral-300 font-story italic leading-relaxed">
              "{victim.autopsyNotes}"
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-mono transition"
          >
            Return to Investigation
          </button>
        </div>
      </div>
    </div>
  );
};
