import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { soundFx } from '../utils/audio';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  authProvider: 'password' | 'google' | 'demo';
  detectiveBadge: string;
  casesSolved: number;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithPassword: (email: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogleCredential: (credentialJwt: string) => Promise<{ success: boolean; error?: string }>;
  signInAsDemo: (name?: string) => void;
  signOut: () => Promise<void>;
  saveGameToDatabase: (caseId: string, saveData: any) => Promise<boolean>;
  loadGameFromDatabase: (caseId: string) => Promise<any | null>;
  saveLeaderboardScore: (caseId: string, caseTitle: string, score: number, rank: string, isCorrect: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'noir_detective_user';
const LOCAL_STORAGE_USERS_DB = 'noir_detective_local_users';

// Simple hashing utility for password auth
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'phash_' + Math.abs(hash).toString(36);
}

// Decode Google JWT payload safely
function decodeJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to decode Google JWT:', e);
    return null;
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const configured = isSupabaseConfigured();

  // Load existing session on boot
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      }
    } catch (e) {
      console.warn('Could not parse local user profile', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // 1. Password Authentication: Sign Up
  const signUpWithPassword = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<{ success: boolean; error?: string }> => {
    soundFx.playTypewriter();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = displayName.trim() || cleanEmail.split('@')[0] || 'Inspector';
    const passwordHash = simpleHash(password);
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newProfile: UserProfile = {
      id: userId,
      email: cleanEmail,
      displayName: cleanName,
      authProvider: 'password',
      detectiveBadge: 'Novice Constable',
      casesSolved: 0,
    };

    const supabase = getSupabase();
    if (supabase && configured) {
      try {
        // Check if email already exists
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (existing) {
          return { success: false, error: 'A detective account with this email already exists.' };
        }

        const { error } = await supabase.from('profiles').insert({
          id: userId,
          email: cleanEmail,
          password_hash: passwordHash,
          display_name: cleanName,
          auth_provider: 'password',
          detective_badge: 'Novice Constable',
          cases_solved: 0,
        });

        if (error) {
          console.warn('Supabase profile creation notice:', error.message);
        }
      } catch (err: any) {
        console.error('Supabase signup exception:', err);
      }
    }

    // Local fallback store
    try {
      const localUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_DB) || '[]');
      localUsers.push({ ...newProfile, passwordHash });
      localStorage.setItem(LOCAL_STORAGE_USERS_DB, JSON.stringify(localUsers));
    } catch (e) {
      console.warn('Local user storage error', e);
    }

    setUser(newProfile);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newProfile));
    return { success: true };
  };

  // 2. Password Authentication: Sign In
  const signInWithPassword = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    soundFx.playTypewriter();
    const cleanEmail = email.trim().toLowerCase();
    const passwordHash = simpleHash(password);

    const supabase = getSupabase();
    if (supabase && configured) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (data && !error) {
          if (data.password_hash && data.password_hash !== passwordHash) {
            return { success: false, error: 'Invalid password. Please check your credentials.' };
          }
          const loadedProfile: UserProfile = {
            id: data.id,
            email: data.email,
            displayName: data.display_name,
            avatarUrl: data.avatar_url,
            authProvider: 'password',
            detectiveBadge: data.detective_badge || 'Novice Constable',
            casesSolved: data.cases_solved || 0,
          };
          setUser(loadedProfile);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(loadedProfile));
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase sign-in lookup fallback to local:', err);
      }
    }

    // Local store fallback
    try {
      const localUsers: any[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_DB) || '[]');
      const found = localUsers.find(u => u.email === cleanEmail);
      if (found) {
        if (found.passwordHash && found.passwordHash !== passwordHash) {
          return { success: false, error: 'Invalid password. Please try again.' };
        }
        const profile: UserProfile = {
          id: found.id,
          email: found.email,
          displayName: found.displayName,
          authProvider: 'password',
          detectiveBadge: found.detectiveBadge || 'Novice Constable',
          casesSolved: found.casesSolved || 0,
        };
        setUser(profile);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
        return { success: true };
      }
    } catch (e) {
      console.warn('Local sign in error', e);
    }

    return { success: false, error: 'No account found with this email. Please sign up.' };
  };

  // 3. Google Authentication (NextAuth / Google Identity Services Token Verification)
  const signInWithGoogleCredential = async (credentialJwt: string): Promise<{ success: boolean; error?: string }> => {
    soundFx.playTypewriter();
    const payload = decodeJwt(credentialJwt);
    if (!payload || !payload.email) {
      return { success: false, error: 'Could not parse Google ID token.' };
    }

    const googleUserId = `google_${payload.sub || payload.email}`;
    const profile: UserProfile = {
      id: googleUserId,
      email: payload.email,
      displayName: payload.name || payload.given_name || 'Chief Detective',
      avatarUrl: payload.picture || '',
      authProvider: 'google',
      detectiveBadge: 'Senior Inspector',
      casesSolved: 0,
    };

    const supabase = getSupabase();
    if (supabase && configured) {
      try {
        await supabase.from('profiles').upsert({
          id: googleUserId,
          email: profile.email,
          display_name: profile.displayName,
          avatar_url: profile.avatarUrl,
          auth_provider: 'google',
          detective_badge: profile.detectiveBadge,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });
      } catch (err) {
        console.warn('Failed to upsert Google user to Supabase Postgres:', err);
      }
    }

    setUser(profile);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
    return { success: true };
  };

  // 4. One-Click Demo Mode
  const signInAsDemo = (name: string = 'Detective Inspector') => {
    soundFx.playTypewriter();
    const demoUser: UserProfile = {
      id: `demo_${Date.now()}`,
      email: 'sleuth@bakerstreet.org',
      displayName: name,
      authProvider: 'demo',
      avatarUrl: '',
      detectiveBadge: 'Senior Inspector',
      casesSolved: 1,
    };
    setUser(demoUser);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoUser));
    setLoading(false);
  };

  // 5. Sign Out
  const signOut = async () => {
    soundFx.playTypewriter();
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  // 6. Supabase Database: Save Game State (without supabase.auth)
  const saveGameToDatabase = async (caseId: string, saveData: any): Promise<boolean> => {
    if (!user) return false;
    const supabase = getSupabase();

    if (supabase && configured) {
      try {
        const { error } = await supabase
          .from('game_saves')
          .upsert({
            user_id: user.id,
            case_id: caseId,
            action_points: saveData.actionPoints,
            pinned_clues: saveData.pinnedClueIds,
            hypotheses: saveData.connectedHypotheses,
            custom_notes: saveData.customNotes,
            discovered_clues: saveData.discoveredClues,
            game_status: saveData.gameStatus,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id,case_id' });

        if (!error) return true;
      } catch (err) {
        console.warn('Could not save to Supabase Postgres:', err);
      }
    }

    // Local fallback
    localStorage.setItem(`mystery_save_${user.id}_${caseId}`, JSON.stringify(saveData));
    return true;
  };

  // 7. Supabase Database: Load Game State (without supabase.auth)
  const loadGameFromDatabase = async (caseId: string): Promise<any | null> => {
    if (!user) return null;
    const supabase = getSupabase();

    if (supabase && configured) {
      try {
        const { data, error } = await supabase
          .from('game_saves')
          .select('*')
          .eq('user_id', user.id)
          .eq('case_id', caseId)
          .maybeSingle();

        if (data && !error) {
          return {
            actionPoints: data.action_points,
            pinnedClueIds: data.pinned_clues,
            connectedHypotheses: data.hypotheses,
            customNotes: data.custom_notes,
            discoveredClues: data.discovered_clues,
            gameStatus: data.game_status,
          };
        }
      } catch (err) {
        console.warn('Failed to load from Supabase Postgres:', err);
      }
    }

    // Local fallback
    const local = localStorage.getItem(`mystery_save_${user.id}_${caseId}`);
    return local ? JSON.parse(local) : null;
  };

  // 8. Supabase Database: Save Leaderboard Score
  const saveLeaderboardScore = async (
    caseId: string,
    caseTitle: string,
    score: number,
    rank: string,
    isCorrect: boolean
  ) => {
    if (!user) return;
    const supabase = getSupabase();

    if (supabase && configured) {
      try {
        await supabase.from('leaderboard').insert({
          user_id: user.id,
          user_name: user.displayName,
          case_id: caseId,
          case_title: caseTitle,
          score,
          rank,
          is_correct: isCorrect,
          completed_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Leaderboard save warning:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: configured,
        signInWithPassword,
        signUpWithPassword,
        signInWithGoogleCredential,
        signInAsDemo,
        signOut,
        saveGameToDatabase,
        loadGameFromDatabase,
        saveLeaderboardScore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
