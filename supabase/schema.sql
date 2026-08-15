-- ====================================================================
-- MURDER MYSTERY DETECTIVE GAME - SUPABASE POSTGRESQL SCHEMA
-- (Standalone schema - independent of Supabase Auth / auth.users)
-- ====================================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Detective User Profiles (Supports Google Auth & Password Authentication)
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    display_name TEXT NOT NULL,
    avatar_url TEXT DEFAULT '',
    auth_provider TEXT DEFAULT 'password', -- 'password', 'google', 'demo'
    detective_badge TEXT DEFAULT 'Novice Constable',
    cases_solved INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Game Saves Table (Store real-time investigation docket & red-string board state)
CREATE TABLE IF NOT EXISTS public.game_saves (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    case_id TEXT NOT NULL,
    action_points INTEGER DEFAULT 12,
    pinned_clues JSONB DEFAULT '[]'::jsonb,
    hypotheses JSONB DEFAULT '[]'::jsonb,
    custom_notes TEXT DEFAULT '',
    discovered_clues JSONB DEFAULT '[]'::jsonb,
    suspect_stress JSONB DEFAULT '{}'::jsonb,
    game_status TEXT DEFAULT 'in_progress',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, case_id)
);

-- 3. Custom AI-Generated Mystery Cases
CREATE TABLE IF NOT EXISTS public.custom_cases (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    creator_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    era TEXT NOT NULL,
    setting TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    case_data JSONB NOT NULL,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Sleuth Leaderboard / Accusation Records
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    case_id TEXT NOT NULL,
    case_title TEXT NOT NULL,
    score INTEGER NOT NULL,
    rank TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and grant anon access for direct Supabase anon key queries
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow anon and authenticated clients to read and write profiles
CREATE POLICY "Allow public read on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert on profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on profiles" ON public.profiles FOR UPDATE USING (true);

-- Allow public read and write on game saves
CREATE POLICY "Allow public read on game_saves" ON public.game_saves FOR SELECT USING (true);
CREATE POLICY "Allow public insert on game_saves" ON public.game_saves FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on game_saves" ON public.game_saves FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on game_saves" ON public.game_saves FOR DELETE USING (true);

-- Allow public read and write on custom cases
CREATE POLICY "Allow public read on custom_cases" ON public.custom_cases FOR SELECT USING (true);
CREATE POLICY "Allow public insert on custom_cases" ON public.custom_cases FOR INSERT WITH CHECK (true);

-- Allow public read and write on leaderboard
CREATE POLICY "Allow public read on leaderboard" ON public.leaderboard FOR SELECT USING (true);
CREATE POLICY "Allow public insert on leaderboard" ON public.leaderboard FOR INSERT WITH CHECK (true);
