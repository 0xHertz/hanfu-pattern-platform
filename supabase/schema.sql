-- Hanfu Pattern Platform Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- User Profiles
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', '汉服爱好者'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- Measurement Profiles (saved body measurements)
-- ============================================
CREATE TABLE measurement_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '默认方案',
  values JSONB NOT NULL,           -- { height: 1700, bust: 920, ... }
  body_type TEXT CHECK (body_type IN ('A', 'B')) DEFAULT 'A',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_measurement_profiles_user ON measurement_profiles(user_id);

-- ============================================
-- Pattern History (generated patterns)
-- ============================================
CREATE TABLE pattern_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  garment_id TEXT NOT NULL,         -- e.g. "jiaoling-shang-ru"
  garment_name TEXT NOT NULL,       -- e.g. "交领上襦"
  measurements JSONB NOT NULL,      -- measurements used
  options JSONB DEFAULT '{}',       -- ease, sleeve preference, etc.
  svg_data TEXT,                    -- SVG string (optional, can be large)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pattern_history_user ON pattern_history(user_id);
CREATE INDEX idx_pattern_history_user_garment ON pattern_history(user_id, garment_id);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurement_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pattern_history ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all profiles, but only update their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Measurement profiles: users can only access their own
CREATE POLICY "Users manage own measurements" ON measurement_profiles
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Pattern history: users can only access their own
CREATE POLICY "Users manage own patterns" ON pattern_history
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Functions
-- ============================================
-- Set one measurement profile as default (unset others)
CREATE OR REPLACE FUNCTION set_default_measurement(profile_id UUID, user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE measurement_profiles SET is_default = false WHERE user_id = $2;
  UPDATE measurement_profiles SET is_default = true WHERE id = $1 AND user_id = $2;
END;
$$ LANGUAGE plpgsql;
