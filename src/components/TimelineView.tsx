import React from 'react';
import { Clock, CheckCircle, AlertOctagon, MapPin, User, ShieldCheck } from 'lucide-react';
import { TimelineEvent, Suspect } from '../types';

interface TimelineViewProps {
  timeline: TimelineEvent[];
  suspects: Suspect[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ timeline, suspects }) => {
  const getSuspect = (id?: string) => suspects.find(s => s.id === id);

  return (
    <div className="bg-neutral-950/90 border border-neutral-800 rounded-xl p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="border-b border-neutral-800/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold font-serif-cinzel text-neutral-100 uppercase tracking-wide">
              Chronological Incident Timeline
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-story mt-0.5">
            Reconstruct the sequence of events on the night of the murder and pinpoint alibi breakdowns.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Verified Record</span>
          </div>
          <div className="flex items-center gap-1.5 text-red-400">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Contradiction Link</span>
          </div>
        </div>
      </div>

      {/* Timeline Tree */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-800">
        {timeline.map((event) => {
          const suspect = getSuspect(event.suspectId);
          const isContradiction = event.isContradiction;

          return (
            <div key={event.id} className="relative group">
              {/* Timeline Pin Dot */}
              <div
                className={`absolute -left-[27px] sm:-left-[35px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isContradiction
                    ? 'bg-red-950 border-red-500 text-red-400 shadow-md shadow-red-500/20'
                    : 'bg-neutral-900 border-neutral-600 text-neutral-400'
                }`}
              >
                {isContradiction ? (
                  <AlertOctagon className="w-3 h-3 text-red-400 animate-pulse" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-neutral-400" />
                )}
              </div>

              {/* Event Card */}
              <div
                className={`p-4 rounded-xl border transition-all space-y-2 ${
                  isContradiction
                    ? 'bg-red-950/20 border-red-800/50 shadow-md shadow-red-900/10'
                    : 'bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-neutral-800 text-amber-400 font-mono text-xs font-bold border border-neutral-700">
                      {event.time}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-500" />
                      {event.location}
                    </span>
                  </div>

                  {isContradiction ? (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-900/60 text-red-300 border border-red-700/50 flex items-center gap-1 uppercase">
                      <AlertOctagon className="w-3 h-3" />
                      ALIBI CONTRADICTION
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      CONFIRMED
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-200 font-story leading-relaxed">
                  {event.description}
                </p>

                {suspect && (
                  <div className="pt-2 border-t border-neutral-800/80 flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                    <User className="w-3 h-3 text-amber-500" />
                    <span>Involved: <strong className="text-neutral-200">{suspect.name}</strong> ({suspect.role})</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
