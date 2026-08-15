import React, { useState } from 'react';
import { Search, Eye, CheckCircle2, MapPin, Compass, AlertCircle, Sparkles, Key } from 'lucide-react';
import { Room, Clue } from '../types';
import { soundFx } from '../utils/audio';

interface RoomExplorerProps {
  rooms: Room[];
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  onSearchItem: (roomId: string, itemId: string, clueId?: string) => void;
  clues: Clue[];
  actionPoints: number;
}

export const RoomExplorer: React.FC<RoomExplorerProps> = ({
  rooms,
  selectedRoomId,
  onSelectRoom,
  onSearchItem,
  clues,
  actionPoints
}) => {
  const activeRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];
  const [inspectingItemId, setInspectingItemId] = useState<string | null>(null);

  const handleSearch = (roomId: string, itemId: string, clueId?: string) => {
    if (actionPoints <= 0) return;
    setInspectingItemId(itemId);
    soundFx.playTypewriter();

    setTimeout(() => {
      onSearchItem(roomId, itemId, clueId);
      if (clueId) {
        soundFx.playClueFound();
      }
      setInspectingItemId(null);
    }, 600);
  };

  const getClueForSearch = (clueId?: string) => {
    if (!clueId) return null;
    return clues.find(c => c.id === clueId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Sidebar: Room Directory */}
      <div className="lg:col-span-4 space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            <span>CRIME SCENE SECTORS</span>
          </h3>
          <span className="text-[11px] font-mono text-neutral-500">
            {rooms.filter(r => r.itemsToSearch.every(i => i.searched)).length}/{rooms.length} Cleared
          </span>
        </div>

        <div className="space-y-2">
          {rooms.map((room) => {
            const isSelected = room.id === activeRoom?.id;
            const itemsSearchedCount = room.itemsToSearch.filter(i => i.searched).length;
            const allCleared = itemsSearchedCount === room.itemsToSearch.length;

            return (
              <button
                key={room.id}
                onClick={() => {
                  soundFx.playTypewriter();
                  onSelectRoom(room.id);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-2 ${
                  isSelected
                    ? 'bg-neutral-900 border-amber-500/80 shadow-md shadow-amber-500/5'
                    : 'bg-neutral-950/60 hover:bg-neutral-900/80 border-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-neutral-500'}`} />
                    <span className="font-serif-cinzel font-bold text-sm text-neutral-100">
                      {room.name}
                    </span>
                  </div>
                  {allCleared ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                      {itemsSearchedCount}/{room.itemsToSearch.length}
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-400 font-story line-clamp-2">
                  {room.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Area: Selected Sector Deep Inspection */}
      <div className="lg:col-span-8 space-y-5">
        {activeRoom ? (
          <div className="bg-neutral-950/90 border border-neutral-800 rounded-xl p-6 space-y-6 shadow-xl relative overflow-hidden">
            {/* Header info */}
            <div className="border-b border-neutral-800/80 pb-4 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono text-amber-500 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 uppercase tracking-wider">
                  Active Crime Location
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  Cost: <strong className="text-neutral-200">1 Inspection Hour</strong> per search
                </span>
              </div>

              <h2 className="text-2xl font-bold font-serif-cinzel text-neutral-100">
                {activeRoom.name}
              </h2>

              <p className="text-sm text-neutral-300 font-story leading-relaxed">
                {activeRoom.description}
              </p>

              <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800/80 text-xs text-amber-300/80 font-story italic flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>"{activeRoom.atmosphere}"</span>
              </div>
            </div>

            {/* Searchable Points of Interest */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span>FORENSIC SEARCH POINTS ({activeRoom.itemsToSearch.length})</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeRoom.itemsToSearch.map((item) => {
                  const isSearched = item.searched;
                  const isInspecting = inspectingItemId === item.id;
                  const foundClue = isSearched ? getClueForSearch(item.clueId) : null;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                        isSearched
                          ? 'bg-neutral-900/90 border-neutral-700/80'
                          : 'bg-neutral-900/40 hover:bg-neutral-900 border-neutral-800 hover:border-amber-500/40'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <h5 className="font-serif-cinzel font-bold text-sm text-neutral-100 flex items-center gap-2">
                            {item.name}
                          </h5>
                          {isSearched && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              EXAMINED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400 font-story leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Clue Discovery Card if searched */}
                      {foundClue ? (
                        <div className="p-3 bg-neutral-950 rounded-lg border border-amber-500/30 space-y-1.5 animate-in fade-in duration-300">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-amber-400 font-bold uppercase tracking-wide">
                              [CLUE DISCOVERED]
                            </span>
                            <span className="text-neutral-400 uppercase">
                              {foundClue.category}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-neutral-100 font-serif-cinzel">
                            {foundClue.name}
                          </p>
                          <p className="text-[11px] text-neutral-300 font-story">
                            {foundClue.description}
                          </p>
                          {foundClue.contradictionHint && (
                            <div className="mt-1 pt-1.5 border-t border-neutral-800/80 text-[11px] text-red-300 font-story flex items-start gap-1">
                              <AlertCircle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                              <span>{foundClue.contradictionHint}</span>
                            </div>
                          )}
                        </div>
                      ) : isSearched ? (
                        <div className="p-2.5 bg-neutral-950/50 rounded-lg border border-neutral-800 text-[11px] text-neutral-500 font-story italic">
                          Thoroughly examined. No hidden contraband or forensic traces found here.
                        </div>
                      ) : null}

                      {/* Search Action Trigger */}
                      {!isSearched && (
                        <button
                          onClick={() => handleSearch(activeRoom.id, item.id, item.clueId)}
                          disabled={actionPoints <= 0 || isInspecting}
                          className="w-full py-2 px-3 rounded-lg bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-200 text-xs font-bold font-mono uppercase tracking-wider transition border border-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isInspecting ? (
                            <>
                              <Search className="w-3.5 h-3.5 animate-spin text-amber-400" />
                              Examining Scene...
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              Search Location (-1 Hr)
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
