import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, XCircle, RotateCcw, BookOpen, ShieldCheck, Sparkles, User, Gavel } from 'lucide-react';
import { AccusationResult, MysteryCase } from '../types';
import { soundFx } from '../utils/audio';

interface VerdictScreenProps {
  result: AccusationResult;
  currentCase: MysteryCase;
  onRestartCase: () => void;
  onChooseNewCase: () => void;
}

export const VerdictScreen: React.FC<VerdictScreenProps> = ({
  result,
  currentCase,
  onRestartCase,
  onChooseNewCase
}) => {
  useEffect(() => {
    if (result.isCorrectCulprit) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [result.isCorrectCulprit]);

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Legendary Sleuth': return 'text-amber-400 border-amber-500/50 bg-amber-500/10';
      case 'Senior Inspector': return 'text-sky-400 border-sky-500/50 bg-sky-500/10';
      case 'Sharp Investigator': return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10';
      case 'Novice Constable': return 'text-neutral-300 border-neutral-600 bg-neutral-800';
      default: return 'text-red-400 border-red-500/50 bg-red-950/30';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Verdict Header Banner */}
      <div className={`p-6 rounded-2xl border text-center space-y-3 ${
        result.isCorrectCulprit
          ? 'bg-gradient-to-b from-neutral-900 to-neutral-950 border-amber-500/60 shadow-2xl shadow-amber-500/10'
          : 'bg-gradient-to-b from-neutral-900 to-neutral-950 border-red-800/60 shadow-2xl shadow-red-950/30'
      }`}>
        <div className="inline-flex p-3 rounded-2xl bg-neutral-950 border border-neutral-800 mb-1">
          {result.isCorrectCulprit ? (
            <Award className="w-10 h-10 text-amber-400 animate-bounce" />
          ) : (
            <XCircle className="w-10 h-10 text-red-400" />
          )}
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            OFFICIAL CORONER & JUDICIAL VERDICT
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-cinzel text-neutral-100">
            {result.isCorrectCulprit ? 'CASE SOLVED: JUSTICE PREVAILS' : 'INCORRECT INDICTMENT: PERPETRATOR AT LARGE'}
          </h2>
        </div>

        <div className="inline-block">
          <span className={`px-4 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${getRankColor(result.rank)}`}>
            RANK: {result.rank} &bull; {result.score} / 100 PTS
          </span>
        </div>
      </div>

      {/* Dramatic Narrative / Critique */}
      <div className="bg-neutral-950/90 border border-neutral-800 rounded-xl p-6 space-y-4 shadow-xl">
        <h3 className="font-serif-cinzel font-bold text-sm text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>The Grand Confrontation</span>
        </h3>

        <div className="p-4 bg-neutral-900/80 rounded-xl border border-neutral-800/80 text-sm text-neutral-200 font-story leading-relaxed space-y-3">
          <p>{result.critique}</p>
        </div>

        {/* The Confession / True Epilogue */}
        <div className="p-5 bg-neutral-900/40 rounded-xl border border-neutral-800 space-y-2">
          <h4 className="font-serif-cinzel font-bold text-xs text-neutral-400 uppercase tracking-wider">
            Official Case Resolution & Confession
          </h4>
          <p className="text-xs text-neutral-300 font-story italic leading-relaxed">
            "{result.confessionNarrative}"
          </p>
        </div>
      </div>

      {/* Deduction Accuracy Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex flex-col justify-between space-y-2">
          <span className="text-[11px] font-mono text-neutral-400">CULPRIT IDENTIFICATION</span>
          <div className="flex items-center justify-between">
            <span className="font-serif-cinzel font-bold text-base text-neutral-100">
              {result.isCorrectCulprit ? 'CORRECT' : 'INCORRECT'}
            </span>
            {result.isCorrectCulprit ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
          </div>
          <span className="text-[10px] font-mono text-neutral-500">
            {result.breakdown.culpritAccuracy}/50 Points
          </span>
        </div>

        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex flex-col justify-between space-y-2">
          <span className="text-[11px] font-mono text-neutral-400">WEAPON & METHOD</span>
          <div className="flex items-center justify-between">
            <span className="font-serif-cinzel font-bold text-base text-neutral-100">
              {result.isCorrectWeapon ? 'MATCHED' : 'INACCURATE'}
            </span>
            {result.isCorrectWeapon ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <XCircle className="w-5 h-5 text-amber-400" />
            )}
          </div>
          <span className="text-[10px] font-mono text-neutral-500">
            {result.breakdown.deductionAccuracy}/25 Points
          </span>
        </div>

        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex flex-col justify-between space-y-2">
          <span className="text-[11px] font-mono text-neutral-400">DECISIVE EVIDENCE</span>
          <div className="flex items-center justify-between">
            <span className="font-serif-cinzel font-bold text-base text-neutral-100">
              {result.breakdown.evidenceScore > 0 ? 'SUBMITTED' : 'OMITTED'}
            </span>
            <ShieldCheck className="w-5 h-5 text-sky-400" />
          </div>
          <span className="text-[10px] font-mono text-neutral-500">
            {result.breakdown.evidenceScore}/10 Points
          </span>
        </div>

        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex flex-col justify-between space-y-2">
          <span className="text-[11px] font-mono text-neutral-400">INVESTIGATION SPEED</span>
          <div className="flex items-center justify-between">
            <span className="font-serif-cinzel font-bold text-base text-emerald-400">
              +15 BONUS
            </span>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-[10px] font-mono text-neutral-500">
            Completed in Time
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={() => {
            soundFx.playTypewriter();
            onRestartCase();
          }}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 font-mono text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Replay Case
        </button>

        <button
          onClick={() => {
            soundFx.playTypewriter();
            onChooseNewCase();
          }}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold font-mono text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          Select Another Mystery Case
        </button>
      </div>
    </div>
  );
};
