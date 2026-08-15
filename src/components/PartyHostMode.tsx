import React, { useState } from 'react';
import { Users, Sparkles, ChevronRight, ChevronLeft, Volume2, Key, Eye, EyeOff, CheckSquare, Copy, Check } from 'lucide-react';
import { MysteryCase, PartyRound, Suspect } from '../types';
import { soundFx } from '../utils/audio';

interface PartyHostModeProps {
  currentCase: MysteryCase;
  partyRoundIndex: number;
  onSetPartyRoundIndex: (index: number) => void;
}

export const PartyHostMode: React.FC<PartyHostModeProps> = ({
  currentCase,
  partyRoundIndex,
  onSetPartyRoundIndex
}) => {
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});
  const [copiedSuspectId, setCopiedSuspectId] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [isSpeaking, setIsSpeaking] = useState(false);

  const rounds = currentCase.partyRounds || [];
  const currentRound: PartyRound | undefined = rounds[partyRoundIndex] || rounds[0];

  const toggleSecret = (suspectId: string) => {
    soundFx.playTypewriter();
    setRevealedSecrets(prev => ({ ...prev, [suspectId]: !prev[suspectId] }));
  };

  const handleCopyCharacterCard = (suspect: Suspect) => {
    soundFx.playTypewriter();
    const text = `🕵️ MURDER MYSTERY CHARACTER DOSSIER
Case: ${currentCase.title}
Name: ${suspect.name} (${suspect.role}, Age ${suspect.age})
Occupation: ${suspect.occupation}
Relation to Victim: ${suspect.relationToVictim}

📜 PUBLIC ALIBI (Read this aloud):
"${suspect.publicAlibi}"

🤫 TOP SECRET (Do NOT read unless cornered or instructed):
"${suspect.secret}"
Are you the killer? ${suspect.isCulprit ? 'YES (Deflect and frame others!)' : 'NO (You are innocent of murder)'}`;

    navigator.clipboard.writeText(text);
    setCopiedSuspectId(suspect.id);
    setTimeout(() => setCopiedSuspectId(null), 2000);
  };

  const handleCastVote = (suspectId: string) => {
    soundFx.playTypewriter();
    setVotes(prev => ({
      ...prev,
      [suspectId]: (prev[suspectId] || 0) + 1
    }));
  };

  const speakNarration = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;
      utterance.pitch = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-neutral-950/90 border border-neutral-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-serif-cinzel text-neutral-100 uppercase tracking-wide">
              PARTY & LIVING ROOM GAME MASTER MODE
            </h2>
            <p className="text-xs text-neutral-400 font-story">
              Host an interactive murder mystery session for friends at home or over Discord!
            </p>
          </div>
        </div>

        {/* Round Pagination */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => {
              soundFx.playTypewriter();
              onSetPartyRoundIndex(Math.max(0, partyRoundIndex - 1));
            }}
            disabled={partyRoundIndex === 0}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white disabled:opacity-40 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400 font-bold">
            STAGE {partyRoundIndex + 1} OF {rounds.length}
          </span>

          <button
            onClick={() => {
              soundFx.playTypewriter();
              onSetPartyRoundIndex(Math.min(rounds.length - 1, partyRoundIndex + 1));
            }}
            disabled={partyRoundIndex >= rounds.length - 1}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white disabled:opacity-40 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main GM Stage Script */}
      {currentRound && (
        <div className="bg-neutral-950/90 border border-neutral-800 rounded-xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
            <div>
              <span className="text-xs font-mono text-amber-500 font-bold uppercase tracking-wider">
                STAGE {currentRound.roundNumber} &bull; HOST SCRIPT
              </span>
              <h3 className="text-xl font-bold font-serif-cinzel text-neutral-100">
                {currentRound.title}
              </h3>
            </div>

            <button
              onClick={() => speakNarration(currentRound.gmNarration)}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-mono flex items-center gap-1.5 transition"
            >
              <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-amber-400 animate-pulse' : 'text-neutral-400'}`} />
              <span>{isSpeaking ? 'Stop Voice' : 'Read Aloud'}</span>
            </button>
          </div>

          {/* GM Spoken Monologue */}
          <div className="p-4 bg-neutral-900/90 border border-amber-500/20 rounded-xl space-y-2">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider">
              📜 GAME MASTER SCRIPT (Read to the group):
            </span>
            <p className="text-sm text-neutral-200 font-story italic leading-relaxed">
              "{currentRound.gmNarration}"
            </p>
          </div>

          {/* Round Objectives */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
              STAGE OBJECTIVES FOR PLAYERS:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentRound.objectives.map((obj, i) => (
                <div key={i} className="p-3 bg-neutral-900/60 rounded-lg border border-neutral-800 text-xs text-neutral-300 font-story flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Public Clue Reveal if applicable */}
          {currentRound.publicClueReveal && (
            <div className="p-3.5 bg-neutral-900/90 border border-neutral-700 rounded-lg text-xs text-neutral-200 font-story flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-400 font-mono text-[11px] block uppercase">
                  PUBLIC EVIDENCE UNSEALED:
                </strong>
                {currentRound.publicClueReveal}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Suspect Role Assignment Dossiers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-amber-500" />
            <span>PLAYER CHARACTER DOSSIERS & SECRET ENVELOPES</span>
          </h3>
          <span className="text-[11px] font-mono text-neutral-500">
            Hand out or copy each card for your friends!
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentCase.suspects.map((suspect) => {
            const isSecretOpen = revealedSecrets[suspect.id];
            const isCopied = copiedSuspectId === suspect.id;

            return (
              <div
                key={suspect.id}
                className="bg-neutral-950/90 border border-neutral-800 rounded-xl p-5 space-y-4 shadow-md flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-cinzel font-bold text-base text-neutral-100">
                        {suspect.name}
                      </h4>
                      <p className="text-xs text-amber-500 font-mono">
                        {suspect.role} &bull; Age {suspect.age} ({suspect.occupation})
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopyCharacterCard(suspect)}
                      title="Copy Player Character Sheet"
                      className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 text-xs font-mono flex items-center gap-1 transition"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Public Alibi */}
                  <div className="p-3 bg-neutral-900/70 rounded-lg border border-neutral-800 text-xs font-story text-neutral-300 space-y-1">
                    <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase block">
                      PUBLIC ALIBI (Read aloud to other players):
                    </span>
                    <p className="italic">"{suspect.publicAlibi}"</p>
                  </div>

                  {/* Private Secret Envelope */}
                  <div className="p-3 bg-neutral-900/40 rounded-lg border border-red-900/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-red-400 font-bold uppercase flex items-center gap-1">
                        <Key className="w-3 h-3" />
                        SECRET ENVELOPE (CONFIDENTIAL)
                      </span>
                      <button
                        onClick={() => toggleSecret(suspect.id)}
                        className="text-[10px] font-mono text-neutral-400 hover:text-white flex items-center gap-1"
                      >
                        {isSecretOpen ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{isSecretOpen ? 'Hide Secret' : 'Unseal Envelope'}</span>
                      </button>
                    </div>

                    {isSecretOpen ? (
                      <div className="text-xs text-red-300 font-story bg-neutral-950 p-2.5 rounded border border-red-800/40 animate-in fade-in">
                        <p>{suspect.secret}</p>
                        <p className="mt-1 text-[11px] font-mono text-amber-400 font-semibold">
                          Are you the culprit? {suspect.isCulprit ? '🔴 YES (You killed Julian Vance!)' : '🟢 NO (You are innocent of murder)'}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[11px] text-neutral-500 font-story italic">
                        [Envelope Sealed - Only open if playing this character or managing the GM deck]
                      </p>
                    )}
                  </div>
                </div>

                {/* Vote Counter for this suspect */}
                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-400">
                    Group Accusation Votes: <strong className="text-amber-400">{votes[suspect.id] || 0}</strong>
                  </span>
                  <button
                    onClick={() => handleCastVote(suspect.id)}
                    className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 rounded border border-neutral-700 text-xs font-mono transition"
                  >
                    +1 Vote
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
