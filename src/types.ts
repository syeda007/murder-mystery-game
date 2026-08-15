export type Difficulty = 'Novice' | 'Detective' | 'Mastermind';

export type ClueCategory = 'physical' | 'document' | 'toxicology' | 'digital' | 'alibi_break';
export type ClueImportance = 'key' | 'supporting' | 'red_herring';

export interface Clue {
  id: string;
  name: string;
  category: ClueCategory;
  importance: ClueImportance;
  description: string;
  details: string;
  locationId: string;
  locationName: string;
  discovered: boolean;
  relatedSuspectId?: string;
  contradictionHint?: string;
  discoveredAtTurn?: number;
}

export interface DialogueMessage {
  id: string;
  sender: 'detective' | 'suspect' | 'system' | 'gm';
  text: string;
  timestamp: string;
  stressChange?: number;
  clueRevealed?: string;
}

export interface Suspect {
  id: string;
  name: string;
  role: string;
  age: number;
  avatarSeed: string;
  personality: string;
  occupation: string;
  relationToVictim: string;
  publicAlibi: string;
  secret: string;
  secretUnlocked: boolean;
  motive: string;
  stressLevel: number; // 0 to 100
  suspiciousnessRating: number; // 1 to 5 stars
  isCulprit: boolean;
  dialogueHistory: DialogueMessage[];
  keyQuotes: string[];
}

export interface Room {
  id: string;
  name: string;
  description: string;
  atmosphere: string;
  searched: boolean;
  itemsToSearch: {
    id: string;
    name: string;
    description: string;
    clueId?: string;
    searched: boolean;
  }[];
}

export interface TimelineEvent {
  id: string;
  time: string;
  description: string;
  location: string;
  suspectId?: string;
  suspectName?: string;
  isContradiction?: boolean;
  verified: boolean;
}

export interface Victim {
  name: string;
  title: string;
  age: number;
  backstory: string;
  causeOfDeath: string;
  timeOfDeath: string;
  locationFound: string;
  autopsyNotes: string;
}

export interface PartyRound {
  roundNumber: number;
  title: string;
  gmNarration: string;
  objectives: string[];
  publicClueReveal?: string;
  suspectActions: {
    suspectId: string;
    privatePrompt: string;
  }[];
}

export interface MysteryCase {
  id: string;
  title: string;
  subtitle: string;
  era: string;
  setting: string;
  difficulty: Difficulty;
  estimatedTime: string;
  summary: string;
  victim: Victim;
  rooms: Room[];
  suspects: Suspect[];
  clues: Clue[];
  timeline: TimelineEvent[];
  solution: {
    culpritId: string;
    culpritName: string;
    murderWeapon: string;
    trueMotive: string;
    howAlibiWasBroken: string;
    fullEpilogue: string;
  };
  partyRounds: PartyRound[];
}

export interface AccusationSubmission {
  suspectId: string;
  weapon: string;
  motive: string;
  keyClueId: string;
  reasoningNotes: string;
}

export interface AccusationResult {
  isCorrectCulprit: boolean;
  isCorrectWeapon: boolean;
  isCorrectMotive: boolean;
  score: number;
  rank: 'Legendary Sleuth' | 'Senior Inspector' | 'Sharp Investigator' | 'Novice Constable' | 'Misguided Detective';
  breakdown: {
    culpritAccuracy: number;
    evidenceScore: number;
    timeBonus: number;
    deductionAccuracy: number;
  };
  critique: string;
  confessionNarrative: string;
}

export interface GameState {
  currentCaseId: string;
  activeTab: 'crime_scene' | 'suspects' | 'evidence' | 'timeline' | 'accusation' | 'party_gm';
  actionPoints: number;
  maxActionPoints: number;
  pinnedClueIds: string[];
  connectedHypotheses: {
    id: string;
    suspectId: string;
    clueId: string;
    hypothesis: string;
  }[];
  customNotes: string;
  selectedSuspectId: string | null;
  selectedRoomId: string | null;
  gameStatus: 'in_progress' | 'solved' | 'failed';
  accusationResult: AccusationResult | null;
  partyRoundIndex: number;
  isSoundEnabled: boolean;
}
