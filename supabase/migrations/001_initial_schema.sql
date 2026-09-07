-- ═══════════════════════════════════════════════════════════
-- OAK Zimbabwe Partner Gathering — Database Schema
-- Run this in your Supabase SQL Editor (supabase.com → SQL Editor)
-- ═══════════════════════════════════════════════════════════

-- ─── 1. Attendees ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attendees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT NOT NULL,
  sub_partner TEXT,
  role TEXT NOT NULL,
  dietary_requirements TEXT,
  accessibility_needs TEXT,
  travel_needs TEXT,
  consent_given BOOLEAN NOT NULL DEFAULT FALSE,
  qr_code_token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast QR lookups during check-in
CREATE INDEX IF NOT EXISTS idx_attendees_qr_token ON attendees(qr_code_token);
CREATE UNIQUE INDEX IF NOT EXISTS idx_attendees_email ON attendees(email);

-- ─── 2. Check-ins ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attendee_id UUID NOT NULL REFERENCES attendees(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL DEFAULT CURRENT_DATE,
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  -- Prevent double check-in per day
  UNIQUE(attendee_id, check_in_date)
);

CREATE INDEX IF NOT EXISTS idx_check_ins_date ON check_ins(check_in_date);
CREATE INDEX IF NOT EXISTS idx_check_ins_attendee ON check_ins(attendee_id);

-- ─── 3. Partners ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  website_url TEXT,
  logo_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_sub_partner BOOLEAN DEFAULT FALSE,
  parent_partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 4. Programme Sessions ─────────────────────────────────
CREATE TABLE IF NOT EXISTS programme_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 3),
  title TEXT NOT NULL,
  description TEXT,
  speaker TEXT,
  location TEXT,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  session_type TEXT NOT NULL DEFAULT 'other'
    CHECK (session_type IN ('plenary', 'breakout', 'networking', 'meal', 'registration', 'other')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_day ON programme_sessions(day_number, start_time);

-- ─── 5. Documentation Posts ─────────────────────────────────
CREATE TABLE IF NOT EXISTS documentation_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 3),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  photo_urls JSONB DEFAULT '[]'::jsonb,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ═══════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════

-- ─── 6. Row Level Security ──────────────────────────────────
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE programme_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentation_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Allow public registration" ON attendees;
DROP POLICY IF EXISTS "Allow reading attendees" ON attendees;
DROP POLICY IF EXISTS "Admins can update attendees" ON attendees;
DROP POLICY IF EXISTS "Admins can delete attendees" ON attendees;
DROP POLICY IF EXISTS "Allow check-in creation" ON check_ins;
DROP POLICY IF EXISTS "Allow reading check-ins" ON check_ins;
DROP POLICY IF EXISTS "Admins can manage check-ins" ON check_ins;
DROP POLICY IF EXISTS "Public can view partners" ON partners;
DROP POLICY IF EXISTS "Admins can manage partners" ON partners;
DROP POLICY IF EXISTS "Public can view programme" ON programme_sessions;
DROP POLICY IF EXISTS "Admins can manage programme" ON programme_sessions;
DROP POLICY IF EXISTS "Public can view documentation" ON documentation_posts;
DROP POLICY IF EXISTS "Admins can manage documentation" ON documentation_posts;

-- ─── Attendees: allow public registration and pass lookup ──
CREATE POLICY "Allow public registration"
  ON attendees FOR INSERT
  TO anon, authenticated
  WITH CHECK (consent_given = TRUE);

CREATE POLICY "Allow reading attendees"
  ON attendees FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Admins can update attendees"
  ON attendees FOR UPDATE
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "Admins can delete attendees"
  ON attendees FOR DELETE
  TO authenticated
  USING (TRUE);

-- ─── Check-ins: allow scanner check-ins and headcount ──
CREATE POLICY "Allow check-in creation"
  ON check_ins FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

CREATE POLICY "Allow reading check-ins"
  ON check_ins FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Admins can manage check-ins"
  ON check_ins FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- ─── Partners: public read, auth full access ──
CREATE POLICY "Public can view partners"
  ON partners FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Admins can manage partners"
  ON partners FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- ─── Programme Sessions: public read, auth full access ──
CREATE POLICY "Public can view programme"
  ON programme_sessions FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Admins can manage programme"
  ON programme_sessions FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- ─── Documentation Posts: public read, auth full access ──
CREATE POLICY "Public can view documentation"
  ON documentation_posts FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Admins can manage documentation"
  ON documentation_posts FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);


-- ═══════════════════════════════════════════════════════════
-- STORAGE BUCKETS (run separately if needed)
-- ═══════════════════════════════════════════════════════════

-- Create storage buckets for logos and event photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if re-running
DROP POLICY IF EXISTS "Public logo access" ON storage.objects;
DROP POLICY IF EXISTS "Auth upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Auth update logos" ON storage.objects;
DROP POLICY IF EXISTS "Auth delete logos" ON storage.objects;

-- Allow public read access to logo and photo files
CREATE POLICY "Public logo access"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id IN ('logos', 'photos'));

-- Allow authenticated users to upload
CREATE POLICY "Auth upload logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN ('logos', 'photos'));

CREATE POLICY "Auth update logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id IN ('logos', 'photos'));

CREATE POLICY "Auth delete logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id IN ('logos', 'photos'));
