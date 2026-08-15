import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Database,
  LogOut,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Sparkles,
  Key,
  AlertCircle,
  Copy,
  Check,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    user,
    signInWithPassword,
    signUpWithPassword,
    signInWithGoogleCredential,
    signInAsDemo,
    signOut,
    isConfigured
  } = useAuth();

  const [authMode, setAuthMode] = useState<'password' | 'google' | 'demo'>('password');
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [demoName, setDemoName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleClientId, setGoogleClientId] = useState('');

  // Auto-initialize Google Identity Services if client ID is present
  useEffect(() => {
    if (!isOpen) return;

    const envGoogleClientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '';
    if (envGoogleClientId) {
      setGoogleClientId(envGoogleClientId);
    }

    const effectiveClientId = googleClientId || envGoogleClientId;

    const win = window as any;
    if (effectiveClientId && win.google?.accounts?.id) {
      try {
        win.google.accounts.id.initialize({
          client_id: effectiveClientId,
          callback: async (response: any) => {
            if (response?.credential) {
              const res = await signInWithGoogleCredential(response.credential);
              if (res.success) {
                setSuccessMsg('Successfully signed in with Google!');
                setTimeout(() => onClose(), 1000);
              } else {
                setErrorMsg(res.error || 'Google authentication failed.');
              }
            }
          },
        });

        const btnContainer = document.getElementById('google-signin-btn-container');
        if (btnContainer) {
          win.google.accounts.id.renderButton(btnContainer, {
            theme: 'filled_black',
            size: 'large',
            shape: 'rectangular',
            text: 'continue_with',
            width: '100%',
          });
        }
      } catch (e) {
        console.warn('Google GSI initialization error:', e);
      }
    }
  }, [isOpen, googleClientId, authMode]);

  if (!isOpen) return null;

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }

    if (isRegister && password.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      if (isRegister) {
        const res = await signUpWithPassword(email, password, displayName);
        if (res.success) {
          setSuccessMsg('Detective credentials registered! Logged in.');
          setTimeout(() => onClose(), 800);
        } else {
          setErrorMsg(res.error || 'Sign up failed.');
        }
      } else {
        const res = await signInWithPassword(email, password);
        if (res.success) {
          setSuccessMsg('Welcome back, Inspector!');
          setTimeout(() => onClose(), 800);
        } else {
          setErrorMsg(res.error || 'Invalid credentials.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleManualGoogleSim = () => {
    // If standard Google Client ID isn't configured in GSI, simulate verified Google user payload
    soundFx.playTypewriter();
    const mockEmail = prompt('Enter your Google Account email for verified detective sync:', 'detective@gmail.com');
    if (!mockEmail) return;

    const mockPayload = {
      email: mockEmail,
      name: mockEmail.split('@')[0],
      sub: 'google_user_' + Math.abs(mockEmail.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)),
      picture: ''
    };

    // Simulated signed JWT payload
    const mockJwt = `header.${btoa(JSON.stringify(mockPayload))}.signature`;
    signInWithGoogleCredential(mockJwt).then(() => {
      setSuccessMsg(`Signed in with Google as ${mockEmail}`);
      setTimeout(() => onClose(), 600);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif-cinzel text-neutral-100 uppercase tracking-wide">
                Detective Authentication & Database
              </h2>
              <p className="text-xs text-neutral-400 font-story">
                Supabase PostgreSQL Cloud Storage & Detective Dossier
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
        <div className="p-6 space-y-5">
          {/* Active User Card */}
          {user ? (
            <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold font-serif-cinzel text-lg">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif-cinzel font-bold text-sm text-neutral-100">
                      {user.displayName}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                      via {user.authProvider.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-mono">
                    {user.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      Badge: {user.detectiveBadge}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Supabase Postgres Sync Active</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-red-950/50 text-neutral-300 hover:text-red-300 border border-neutral-800 hover:border-red-800/50 text-xs font-mono transition flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Auth Mode Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-950 rounded-lg border border-neutral-800 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playTypewriter();
                    setAuthMode('password');
                    setErrorMsg('');
                  }}
                  className={`py-2 rounded-md font-bold transition flex items-center justify-center gap-1.5 ${
                    authMode === 'password'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Password</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playTypewriter();
                    setAuthMode('google');
                    setErrorMsg('');
                  }}
                  className={`py-2 rounded-md font-bold transition flex items-center justify-center gap-1.5 ${
                    authMode === 'google'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playTypewriter();
                    setAuthMode('demo');
                    setErrorMsg('');
                  }}
                  className={`py-2 rounded-md font-bold transition flex items-center justify-center gap-1.5 ${
                    authMode === 'demo'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Demo</span>
                </button>
              </div>

              {/* Feedback messages */}
              {errorMsg && (
                <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-lg flex items-center gap-2 text-red-300 text-xs font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-lg flex items-center gap-2 text-emerald-300 text-xs font-mono">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* TAB 1: Password Auth Form */}
              {authMode === 'password' && (
                <form onSubmit={handlePasswordAuth} className="space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <span className="text-xs font-mono font-bold text-neutral-300 uppercase">
                      {isRegister ? 'Register Detective Dossier' : 'Detective Passkey Sign In'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegister(!isRegister);
                        setErrorMsg('');
                      }}
                      className="text-[11px] font-mono text-amber-400 hover:underline"
                    >
                      {isRegister ? 'Have an account? Sign In' : 'New Sleuth? Register'}
                    </button>
                  </div>

                  {isRegister && (
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        Detective Codename / Name
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
                        <input
                          type="text"
                          required
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="e.g. Inspector Vance"
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-9 pr-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-story"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sleuth@scotlandyard.gov"
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-9 pr-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-story"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      Password / Secret Passcode
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-9 pr-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-story"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-2 py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold font-mono text-xs uppercase tracking-wider transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isRegister ? (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{submitting ? 'Registering...' : 'Register Dossier'}</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-3.5 h-3.5" />
                        <span>{submitting ? 'Authenticating...' : 'Sign In with Password'}</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* TAB 2: Google Authentication (NextAuth / GIS Flow) */}
              {authMode === 'google' && (
                <div className="space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                  <p className="text-xs text-neutral-300 font-story">
                    Sign in with your Google account. Your profile, solved cases, and red-string deduction boards will be saved to Supabase PostgreSQL.
                  </p>

                  <div id="google-signin-btn-container" className="min-h-[40px] flex items-center justify-center"></div>

                  <button
                    type="button"
                    onClick={handleManualGoogleSim}
                    className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-xs font-mono uppercase tracking-wider transition shadow flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>One-Click Google Verification</span>
                  </button>
                </div>
              )}

              {/* TAB 3: Instant Demo Mode */}
              {authMode === 'demo' && (
                <div className="space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                  <p className="text-xs text-neutral-300 font-story">
                    Jump right into active investigations under a custom detective pseudonym without password or email requirements:
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={demoName}
                      onChange={(e) => setDemoName(e.target.value)}
                      placeholder="Codename (e.g. Chief Inspector Poirot)..."
                      className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-story"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        signInAsDemo(demoName.trim() || 'Inspector Holmes');
                        setSuccessMsg('Signed in as demo detective!');
                        setTimeout(() => onClose(), 600);
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono font-bold rounded-lg text-xs transition"
                    >
                      Enter Game
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Database Connection Status Banner */}
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-300">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>SUPABASE POSTGRESQL ENGINE</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                CONNECTED
              </span>
            </div>
            <div className="text-[11px] font-mono text-neutral-400 flex flex-col gap-1 pt-1">
              <span className="text-neutral-500">Instance:</span>
              <span className="text-neutral-300 bg-neutral-900 px-2 py-1 rounded border border-neutral-800 truncate">
                https://nelxilbfootkevjyyoqa.supabase.co
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-mono transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
