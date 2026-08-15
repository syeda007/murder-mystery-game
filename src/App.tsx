import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  User,
  FolderOpen,
  Clock,
  Users,
  Gavel,
  AlertCircle,
  FileText,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import { DEFAULT_CASES } from './data/cases';
import {
  MysteryCase,
  Clue,
  Suspect,
  AccusationSubmission,
  AccusationResult,
  Difficulty
} from './types';
import { Header } from './components/Header';
import { CaseSelectorModal } from './components/CaseSelectorModal';
import { VictimDossierModal } from './components/VictimDossierModal';
import { RoomExplorer } from './components/RoomExplorer';
import { InterrogationChamber } from './components/InterrogationChamber';
import { EvidenceBoard } from './components/EvidenceBoard';
import { TimelineView } from './components/TimelineView';
import { AccusationModal } from './components/AccusationModal';
import { VerdictScreen } from './components/VerdictScreen';
import { PartyHostMode } from './components/PartyHostMode';
import { GmHintModal } from './components/GmHintModal';
import { DocumentationModal } from './components/DocumentationModal';
import { AuthModal } from './components/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { soundFx } from './utils/audio';

function MysteryGameApp() {
  const { user, saveGameToDatabase, loadGameFromDatabase, saveLeaderboardScore } = useAuth();
  const [cases, setCases] = useState<MysteryCase[]>(DEFAULT_CASES);
  const [currentCaseId, setCurrentCaseId] = useState<string>(DEFAULT_CASES[0].id);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'crime_scene' | 'suspects' | 'evidence' | 'timeline' | 'party_gm'
  >('crime_scene');

  // Gameplay State
  const [actionPoints, setActionPoints] = useState<number>(12);
  const [maxActionPoints] = useState<number>(12);
  const [pinnedClueIds, setPinnedClueIds] = useState<string[]>([]);
  const [connectedHypotheses, setConnectedHypotheses] = useState<
    { id: string; suspectId: string; clueId: string; hypothesis: string }[]
  >([]);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [partyRoundIndex, setPartyRoundIndex] = useState<number>(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);

  // Game Resolution
  const [gameStatus, setGameStatus] = useState<'in_progress' | 'solved' | 'failed'>('in_progress');
  const [accusationResult, setAccusationResult] = useState<AccusationResult | null>(null);

  // Modals
  const [isCaseSelectorOpen, setIsCaseSelectorOpen] = useState(false);
  const [isVictimDossierOpen, setIsVictimDossierOpen] = useState(false);
  const [isAccusationModalOpen, setIsAccusationModalOpen] = useState(false);
  const [isDocumentationOpen, setIsDocumentationOpen] = useState(false);
  const [isGmHintOpen, setIsGmHintOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // GM Hint Data
  const [gmHintText, setGmHintText] = useState('');
  const [gmHintAtmosphere, setGmHintAtmosphere] = useState('');
  const [isGmHintLoading, setIsGmHintLoading] = useState(false);

  // Loading flags
  const [isInterrogating, setIsInterrogating] = useState(false);
  const [isSubmittingAccusation, setIsSubmittingAccusation] = useState(false);
  const [isGeneratingCase, setIsGeneratingCase] = useState(false);

  const currentCase = cases.find(c => c.id === currentCaseId) || cases[0];

  // Set default selection when current case changes and check for cloud/local saves
  useEffect(() => {
    if (currentCase) {
      if (currentCase.rooms.length > 0) {
        setSelectedRoomId(currentCase.rooms[0].id);
      }
      if (currentCase.suspects.length > 0) {
        setSelectedSuspectId(currentCase.suspects[0].id);
      }

      // Check for saved progress in Supabase / Local storage
      loadGameFromDatabase(currentCase.id).then(saved => {
        if (saved) {
          if (typeof saved.actionPoints === 'number') setActionPoints(saved.actionPoints);
          if (Array.isArray(saved.pinnedClueIds)) setPinnedClueIds(saved.pinnedClueIds);
          if (Array.isArray(saved.connectedHypotheses)) setConnectedHypotheses(saved.connectedHypotheses);
          if (typeof saved.customNotes === 'string') setCustomNotes(saved.customNotes);
          if (saved.gameStatus) setGameStatus(saved.gameStatus);
        }
      });
    }
  }, [currentCaseId, user?.id]);

  // Auto-sync game state to database
  const triggerAutoSave = useCallback((updatedActionPoints: number, updatedClues: Clue[]) => {
    if (user) {
      saveGameToDatabase(currentCaseId, {
        actionPoints: updatedActionPoints,
        pinnedClueIds,
        connectedHypotheses,
        customNotes,
        discoveredClues: updatedClues.filter(c => c.discovered),
        gameStatus,
      });
    }
  }, [user, currentCaseId, pinnedClueIds, connectedHypotheses, customNotes, gameStatus, saveGameToDatabase]);

  // Restart Current Case
  const handleRestartCase = () => {
    setActionPoints(12);
    setPinnedClueIds([]);
    setConnectedHypotheses([]);
    setCustomNotes('');
    setGameStatus('in_progress');
    setAccusationResult(null);
    setPartyRoundIndex(0);

    // Reset current case rooms and clues
    setCases(prev =>
      prev.map(c => {
        if (c.id !== currentCaseId) return c;
        return {
          ...c,
          rooms: c.rooms.map(r => ({
            ...r,
            searched: false,
            itemsToSearch: r.itemsToSearch.map(i => ({ ...i, searched: false }))
          })),
          clues: c.clues.map(clue => ({ ...clue, discovered: false })),
          suspects: c.suspects.map(s => ({
            ...s,
            stressLevel: 20,
            secretUnlocked: false,
            dialogueHistory: s.dialogueHistory.slice(0, 1)
          }))
        };
      })
    );
  };

  // Switch Case
  const handleSelectCase = (caseId: string) => {
    setCurrentCaseId(caseId);
    setActionPoints(12);
    setPinnedClueIds([]);
    setConnectedHypotheses([]);
    setCustomNotes('');
    setGameStatus('in_progress');
    setAccusationResult(null);
    setPartyRoundIndex(0);
    setActiveTab('crime_scene');
  };

  // Sound Toggle
  const handleToggleSound = () => {
    const nextState = !isSoundEnabled;
    setIsSoundEnabled(nextState);
    soundFx.enabled = nextState;
  };

  // Search Room Item Handler
  const handleSearchItem = (roomId: string, itemId: string, clueId?: string) => {
    if (actionPoints <= 0) return;

    const newPoints = Math.max(0, actionPoints - 1);
    setActionPoints(newPoints);

    let updatedCluesList: Clue[] = currentCase.clues;

    setCases(prevCases =>
      prevCases.map(c => {
        if (c.id !== currentCaseId) return c;

        const updatedRooms = c.rooms.map(r => {
          if (r.id !== roomId) return r;
          const updatedItems = r.itemsToSearch.map(item => {
            if (item.id !== itemId) return item;
            return { ...item, searched: true };
          });
          const allSearched = updatedItems.every(i => i.searched);
          return { ...r, itemsToSearch: updatedItems, searched: allSearched };
        });

        const updatedClues = c.clues.map(clue => {
          if (clue.id === clueId) {
            return { ...clue, discovered: true, discoveredAtTurn: 12 - actionPoints + 1 };
          }
          return clue;
        });

        updatedCluesList = updatedClues;

        return {
          ...c,
          rooms: updatedRooms,
          clues: updatedClues
        };
      })
    );

    triggerAutoSave(newPoints, updatedCluesList);
  };

  // Interrogate Suspect Handler
  const handleSendMessage = async (suspectId: string, question: string, presentedClue?: Clue) => {
    const suspect = currentCase.suspects.find(s => s.id === suspectId);
    if (!suspect) return;

    const userMessageId = `msg-${Date.now()}`;
    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedDialogue = [
      ...suspect.dialogueHistory,
      {
        id: userMessageId,
        sender: 'detective' as const,
        text: presentedClue ? `[Presented Clue: ${presentedClue.name}] ${question}` : question,
        timestamp: userTimestamp
      }
    ];

    // Optimistically update suspect dialogue
    setCases(prevCases =>
      prevCases.map(c => {
        if (c.id !== currentCaseId) return c;
        return {
          ...c,
          suspects: c.suspects.map(s => {
            if (s.id !== suspectId) return s;
            return { ...s, dialogueHistory: updatedDialogue };
          })
        };
      })
    );

    setIsInterrogating(true);

    try {
      const response = await fetch('/api/interrogate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseContext: currentCase,
          suspect,
          question,
          presentedClue,
          history: updatedDialogue
        })
      });

      const data = await response.json();
      const stressDelta = data.stressChange || 0;
      const newStress = Math.min(100, Math.max(0, suspect.stressLevel + stressDelta));

      if (data.secretUnlocked || (newStress >= 70 && !suspect.secretUnlocked)) {
        soundFx.playTensionSting();
      }

      setCases(prevCases =>
        prevCases.map(c => {
          if (c.id !== currentCaseId) return c;
          return {
            ...c,
            suspects: c.suspects.map(s => {
              if (s.id !== suspectId) return s;
              return {
                ...s,
                stressLevel: newStress,
                secretUnlocked: s.secretUnlocked || data.secretUnlocked || (newStress >= 75),
                dialogueHistory: [
                  ...updatedDialogue,
                  {
                    id: `resp-${Date.now()}`,
                    sender: 'suspect' as const,
                    text: data.text || 'I have nothing further to state.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    stressChange: stressDelta
                  }
                ]
              };
            })
          };
        })
      );
    } catch (err) {
      console.error('Interrogation error:', err);
    } finally {
      setIsInterrogating(false);
    }
  };

  // Clue Pinning
  const handleTogglePinClue = (clueId: string) => {
    const updated = pinnedClueIds.includes(clueId)
      ? pinnedClueIds.filter(id => id !== clueId)
      : [...pinnedClueIds, clueId];
    setPinnedClueIds(updated);
  };

  // Red-String Hypothesis
  const handleAddHypothesis = (suspectId: string, clueId: string, hypothesis: string) => {
    const updated = [
      ...connectedHypotheses,
      {
        id: `hyp-${Date.now()}`,
        suspectId,
        clueId,
        hypothesis
      }
    ];
    setConnectedHypotheses(updated);
  };

  const handleRemoveHypothesis = (hypothesisId: string) => {
    soundFx.playTypewriter();
    setConnectedHypotheses(prev => prev.filter(h => h.id !== hypothesisId));
  };

  // Request GM Hint
  const handleRequestGmHint = async () => {
    setIsGmHintLoading(true);
    soundFx.playTypewriter();
    try {
      const response = await fetch('/api/gm-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseContext: currentCase,
          discoveredClues: currentCase.clues.filter(c => c.discovered),
          interrogatedSuspects: currentCase.suspects.map(s => ({
            name: s.name,
            stress: s.stressLevel,
            secretUnlocked: s.secretUnlocked
          }))
        })
      });
      const data = await response.json();
      setGmHintText(data.hint);
      setGmHintAtmosphere(data.atmosphericObservation);
      setIsGmHintOpen(true);
    } catch (error) {
      console.error('Error fetching GM hint:', error);
      setGmHintText('Cross-reference the timeline timestamps with the travel logs.');
      setGmHintAtmosphere('The silence in the room is heavy as the clock ticks closer to dawn.');
      setIsGmHintOpen(true);
    } finally {
      setIsGmHintLoading(false);
    }
  };

  // Submit Accusation
  const handleSubmitAccusation = async (submission: AccusationSubmission) => {
    setIsSubmittingAccusation(true);
    try {
      const response = await fetch('/api/evaluate-accusation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseContext: currentCase,
          submission
        })
      });
      const result: AccusationResult = await response.json();
      setAccusationResult(result);
      const finalStatus = result.isCorrectCulprit ? 'solved' : 'failed';
      setGameStatus(finalStatus);
      setIsAccusationModalOpen(false);

      // Save score to Supabase PostgreSQL Leaderboard
      await saveLeaderboardScore(currentCase.id, currentCase.title, result.score, result.rank, result.isCorrectCulprit);
    } catch (err) {
      console.error('Accusation submission error:', err);
    } finally {
      setIsSubmittingAccusation(false);
    }
  };

  // Generate Custom AI Case
  const handleGenerateCustomCase = async (
    theme: string,
    era: string,
    difficulty: Difficulty,
    customPrompt: string
  ) => {
    setIsGeneratingCase(true);
    try {
      const response = await fetch('/api/generate-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme, era, difficulty, customPrompt })
      });

      if (!response.ok) {
        throw new Error('Case generation failed.');
      }

      const newCase: MysteryCase = await response.json();
      setCases(prev => [newCase, ...prev]);
      handleSelectCase(newCase.id);
    } catch (err) {
      console.error('Custom case generation error:', err);
    } finally {
      setIsGeneratingCase(false);
    }
  };

  const discoveredClues = currentCase.clues.filter(c => c.discovered);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-story selection:bg-amber-600 selection:text-white">
      {/* Header */}
      <Header
        currentCase={currentCase}
        actionPoints={actionPoints}
        maxActionPoints={maxActionPoints}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
        onOpenCaseSelector={() => setIsCaseSelectorOpen(true)}
        onOpenVictimDossier={() => setIsVictimDossierOpen(true)}
        onOpenDocumentation={() => setIsDocumentationOpen(true)}
        onOpenGmHint={handleRequestGmHint}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isGmHintLoading={isGmHintLoading}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Game is resolved? Display Verdict Screen */}
        {accusationResult ? (
          <VerdictScreen
            result={accusationResult}
            currentCase={currentCase}
            onRestartCase={handleRestartCase}
            onChooseNewCase={() => setIsCaseSelectorOpen(true)}
          />
        ) : (
          <>
            {/* Navigation Tabs Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-900/90 p-1.5 rounded-xl border border-neutral-800 backdrop-blur-sm">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => {
                    soundFx.playTypewriter();
                    setActiveTab('crime_scene');
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition flex items-center gap-2 shrink-0 ${
                    activeTab === 'crime_scene'
                      ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Crime Scene</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playTypewriter();
                    setActiveTab('suspects');
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition flex items-center gap-2 shrink-0 ${
                    activeTab === 'suspects'
                      ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Interrogate</span>
                  {currentCase.suspects.filter(s => s.secretUnlocked).length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                  )}
                </button>

                <button
                  onClick={() => {
                    soundFx.playTypewriter();
                    setActiveTab('evidence');
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition flex items-center gap-2 shrink-0 ${
                    activeTab === 'evidence'
                      ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                  }`}
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Evidence Board ({discoveredClues.length})</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playTypewriter();
                    setActiveTab('timeline');
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition flex items-center gap-2 shrink-0 ${
                    activeTab === 'timeline'
                      ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Timeline</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playTypewriter();
                    setActiveTab('party_gm');
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition flex items-center gap-2 shrink-0 ${
                    activeTab === 'party_gm'
                      ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Party Host Mode</span>
                </button>
              </div>

              {/* Final Indictment Call to Action */}
              <button
                onClick={() => {
                  soundFx.playTypewriter();
                  setIsAccusationModalOpen(true);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-red-950 flex items-center justify-center gap-2 shrink-0"
              >
                <Gavel className="w-3.5 h-3.5" />
                <span>Deliver Accusation</span>
              </button>
            </div>

            {/* Active Tab View */}
            {activeTab === 'crime_scene' && (
              <RoomExplorer
                rooms={currentCase.rooms}
                selectedRoomId={selectedRoomId}
                onSelectRoom={(roomId) => setSelectedRoomId(roomId)}
                onSearchItem={handleSearchItem}
                clues={currentCase.clues}
                actionPoints={actionPoints}
              />
            )}

            {activeTab === 'suspects' && (
              <InterrogationChamber
                suspects={currentCase.suspects}
                selectedSuspectId={selectedSuspectId}
                onSelectSuspect={(id) => setSelectedSuspectId(id)}
                discoveredClues={discoveredClues}
                onSendMessage={handleSendMessage}
                isInterrogating={isInterrogating}
                currentCase={currentCase}
              />
            )}

            {activeTab === 'evidence' && (
              <EvidenceBoard
                clues={currentCase.clues}
                suspects={currentCase.suspects}
                pinnedClueIds={pinnedClueIds}
                onTogglePinClue={handleTogglePinClue}
                connectedHypotheses={connectedHypotheses}
                onAddHypothesis={handleAddHypothesis}
                onRemoveHypothesis={handleRemoveHypothesis}
                customNotes={customNotes}
                onChangeCustomNotes={(notes) => setCustomNotes(notes)}
              />
            )}

            {activeTab === 'timeline' && (
              <TimelineView
                timeline={currentCase.timeline}
                suspects={currentCase.suspects}
              />
            )}

            {activeTab === 'party_gm' && (
              <PartyHostMode
                currentCase={currentCase}
                partyRoundIndex={partyRoundIndex}
                onSetPartyRoundIndex={(idx) => setPartyRoundIndex(idx)}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950/80 px-6 py-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="font-serif-cinzel font-bold text-neutral-300">
              MURDER MYSTERY GAME MASTER
            </span>
            <span>&bull;</span>
            <span>AI Narrative Engine & Supabase DB</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hover:text-amber-400 transition"
            >
              Auth & Cloud Sync
            </button>
            <button
              onClick={() => setIsVictimDossierOpen(true)}
              className="hover:text-amber-400 transition"
            >
              Victim Docket
            </button>
            <button
              onClick={() => setIsCaseSelectorOpen(true)}
              className="hover:text-amber-400 transition"
            >
              Cases Archive
            </button>
            <button
              onClick={() => setIsDocumentationOpen(true)}
              className="hover:text-amber-400 transition"
            >
              Docs & Deployment
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CaseSelectorModal
        isOpen={isCaseSelectorOpen}
        onClose={() => setIsCaseSelectorOpen(false)}
        cases={cases}
        currentCaseId={currentCaseId}
        onSelectCase={handleSelectCase}
        onGenerateCustomCase={handleGenerateCustomCase}
        isGeneratingCase={isGeneratingCase}
      />

      <VictimDossierModal
        isOpen={isVictimDossierOpen}
        onClose={() => setIsVictimDossierOpen(false)}
        victim={currentCase.victim}
        caseTitle={currentCase.title}
      />

      <AccusationModal
        isOpen={isAccusationModalOpen}
        onClose={() => setIsAccusationModalOpen(false)}
        currentCase={currentCase}
        discoveredClues={discoveredClues}
        onSubmitAccusation={handleSubmitAccusation}
        isSubmitting={isSubmittingAccusation}
      />

      <GmHintModal
        isOpen={isGmHintOpen}
        onClose={() => setIsGmHintOpen(false)}
        hint={gmHintText}
        atmosphericObservation={gmHintAtmosphere}
        caseTitle={currentCase.title}
      />

      <DocumentationModal
        isOpen={isDocumentationOpen}
        onClose={() => setIsDocumentationOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MysteryGameApp />
    </AuthProvider>
  );
}

