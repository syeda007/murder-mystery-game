import React, { useState } from 'react';
import { Pin, AlertCircle, Link2, Plus, Trash2, Edit3, ShieldAlert, Sparkles, Filter, Search, Tag } from 'lucide-react';
import { Clue, Suspect, ClueCategory } from '../types';
import { soundFx } from '../utils/audio';

interface EvidenceBoardProps {
  clues: Clue[];
  suspects: Suspect[];
  pinnedClueIds: string[];
  onTogglePinClue: (clueId: string) => void;
  connectedHypotheses: {
    id: string;
    suspectId: string;
    clueId: string;
    hypothesis: string;
  }[];
  onAddHypothesis: (suspectId: string, clueId: string, hypothesis: string) => void;
  onRemoveHypothesis: (hypothesisId: string) => void;
  customNotes: string;
  onChangeCustomNotes: (notes: string) => void;
}

export const EvidenceBoard: React.FC<EvidenceBoardProps> = ({
  clues,
  suspects,
  pinnedClueIds,
  onTogglePinClue,
  connectedHypotheses,
  onAddHypothesis,
  onRemoveHypothesis,
  customNotes,
  onChangeCustomNotes
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newHypothesisSuspect, setNewHypothesisSuspect] = useState<string>('');
  const [newHypothesisClue, setNewHypothesisClue] = useState<string>('');
  const [newHypothesisText, setNewHypothesisText] = useState<string>('');

  const discoveredClues = clues.filter(c => c.discovered);

  const filteredClues = discoveredClues.filter(c => {
    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreateHypothesis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHypothesisSuspect || !newHypothesisClue || !newHypothesisText.trim()) return;
    soundFx.playTypewriter();
    onAddHypothesis(newHypothesisSuspect, newHypothesisClue, newHypothesisText.trim());
    setNewHypothesisText('');
  };

  const getSuspectName = (id: string) => suspects.find(s => s.id === id)?.name || 'Unknown Suspect';
  const getClueName = (id: string) => clues.find(c => c.id === id)?.name || 'Unknown Evidence';

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-neutral-950/90 border border-neutral-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discovered forensic clues..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-story"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
          {['all', 'physical', 'document', 'toxicology', 'digital', 'alibi_break'].map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  soundFx.playTypewriter();
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition shrink-0 ${
                  isSelected
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clue Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-amber-500" />
            <span>COLLECTED EVIDENCE LOG ({filteredClues.length}/{clues.length})</span>
          </h3>
          <span className="text-[11px] font-mono text-neutral-500">
            {pinnedClueIds.length} Pinned on Corkboard
          </span>
        </div>

        {filteredClues.length === 0 ? (
          <div className="p-12 text-center bg-neutral-950/60 border border-neutral-800/80 rounded-xl space-y-3">
            <ShieldAlert className="w-10 h-10 text-neutral-600 mx-auto" />
            <p className="text-sm font-serif-cinzel text-neutral-300">
              No clues discovered in this category yet.
            </p>
            <p className="text-xs text-neutral-500 font-story max-w-sm mx-auto">
              Explore the Crime Scene sectors and examine points of interest to uncover physical, toxicological, and documentary evidence.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClues.map((clue) => {
              const isPinned = pinnedClueIds.includes(clue.id);

              return (
                <div
                  key={clue.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 relative ${
                    isPinned
                      ? 'bg-neutral-900/90 border-amber-500/80 shadow-md shadow-amber-500/5'
                      : 'bg-neutral-950/80 hover:bg-neutral-900/60 border-neutral-800'
                  }`}
                >
                  {/* Pin Button */}
                  <button
                    onClick={() => {
                      soundFx.playTypewriter();
                      onTogglePinClue(clue.id);
                    }}
                    title={isPinned ? "Unpin clue" : "Pin clue to corkboard"}
                    className={`absolute top-3.5 right-3.5 p-1.5 rounded-lg border transition ${
                      isPinned
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-neutral-900 text-neutral-500 hover:text-neutral-300 border-neutral-800'
                    }`}
                  >
                    <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-amber-400' : ''}`} />
                  </button>

                  <div className="space-y-2 pr-7">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                        {clue.category}
                      </span>
                      {clue.importance === 'key' && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/40">
                          KEY EVIDENCE
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif-cinzel font-bold text-sm text-neutral-100 leading-snug">
                      {clue.name}
                    </h4>

                    <p className="text-xs text-neutral-400 font-story leading-relaxed">
                      {clue.description}
                    </p>

                    <div className="p-2 bg-neutral-900/80 rounded-lg border border-neutral-800/80 text-[11px] text-neutral-300 font-story">
                      <span className="font-bold text-neutral-400 font-mono">Analysis: </span>
                      {clue.details}
                    </div>

                    {clue.contradictionHint && (
                      <div className="p-2 bg-red-950/20 border border-red-800/30 rounded-lg text-[11px] text-red-300 font-story flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                        <span>{clue.contradictionHint}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-neutral-800/60 text-[10px] font-mono text-neutral-500 flex items-center justify-between">
                    <span>Found in: {clue.locationName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Red-String Deduction Hypothesis Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-neutral-800">
        {/* Left: Deductive Hypothesis Builder */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-neutral-950/90 border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-red-500" />
              <h3 className="font-serif-cinzel font-bold text-sm text-neutral-100 uppercase tracking-wider">
                Red-String Hypothesis Linker
              </h3>
            </div>
            <p className="text-xs text-neutral-400 font-story">
              Connect a suspect with discovered evidence and formalize your deductive theory.
            </p>

            <form onSubmit={handleCreateHypothesis} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 mb-1">SUSPECT</label>
                  <select
                    value={newHypothesisSuspect}
                    onChange={(e) => setNewHypothesisSuspect(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 font-story"
                    required
                  >
                    <option value="">-- Select Suspect --</option>
                    {suspects.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 mb-1">LINKED EVIDENCE</label>
                  <select
                    value={newHypothesisClue}
                    onChange={(e) => setNewHypothesisClue(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 font-story"
                    required
                  >
                    <option value="">-- Select Discovered Clue --</option>
                    {discoveredClues.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-neutral-400 mb-1">DEDUCTIVE THEORY</label>
                <input
                  type="text"
                  value={newHypothesisText}
                  onChange={(e) => setNewHypothesisText(e.target.value)}
                  placeholder="e.g. This proves Dr. Sterling was in the compartment before the avalanche..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 font-story"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!newHypothesisSuspect || !newHypothesisClue || !newHypothesisText.trim()}
                className="w-full py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold font-mono uppercase tracking-wider transition disabled:opacity-40 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Pin Hypothesis to Board
              </button>
            </form>

            {/* List of active pinned hypotheses */}
            <div className="space-y-2 pt-2">
              {connectedHypotheses.length === 0 ? (
                <p className="text-xs text-neutral-500 font-story italic text-center py-2">
                  No deductive links established yet. Formulate connections above.
                </p>
              ) : (
                connectedHypotheses.map((hyp) => (
                  <div
                    key={hyp.id}
                    className="p-3 bg-neutral-900/90 rounded-lg border border-red-900/40 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono">
                        <span className="text-amber-400 font-bold">{getSuspectName(hyp.suspectId)}</span>
                        <span className="text-neutral-500">&rarr;</span>
                        <span className="text-neutral-300 font-semibold">{getClueName(hyp.clueId)}</span>
                      </div>
                      <p className="text-neutral-300 font-story italic">
                        "{hyp.hypothesis}"
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveHypothesis(hyp.id)}
                      className="p-1 text-neutral-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Private Detective Notepad */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-neutral-950/90 border border-neutral-800 rounded-xl p-5 space-y-3 flex flex-col h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif-cinzel font-bold text-sm text-neutral-100 uppercase tracking-wider">
                  Detective Case Journal
                </h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-500">Auto-saved</span>
            </div>

            <p className="text-xs text-neutral-400 font-story">
              Record alibi contradictions, timeline anomalies, and suspect behavioral cues.
            </p>

            <textarea
              value={customNotes}
              onChange={(e) => onChangeCustomNotes(e.target.value)}
              placeholder="Record your working deductions and motive observations here..."
              rows={8}
              className="flex-1 w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500 font-story leading-relaxed resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
