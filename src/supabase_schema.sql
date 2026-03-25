-- ===================================================
-- Merhav Midbar - Supabase Schema
-- הרץ את זה ב-Supabase SQL Editor
-- ===================================================

-- BinuiProject
CREATE TABLE IF NOT EXISTS binui_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by TEXT,
  name TEXT NOT NULL,
  category TEXT,
  sub TEXT,
  status TEXT DEFAULT 'planning',
  created TEXT,
  note TEXT,
  history JSONB DEFAULT '[]',
  architect TEXT,
  architect_phone TEXT,
  architect_email TEXT,
  architect_address TEXT,
  manager TEXT,
  manager_phone TEXT,
  manager_email TEXT,
  manager_address TEXT,
  developer TEXT,
  developer_phone TEXT,
  developer_email TEXT,
  developer_address TEXT,
  project_date TEXT,
  quarter TEXT,
  street TEXT,
  block TEXT,
  parcel TEXT,
  plan_overall TEXT,
  plan_detail TEXT,
  image_tashrit TEXT,
  image_tza TEXT,
  image_hadmaya TEXT,
  consultant_notes TEXT
);

-- GenericProject
CREATE TABLE IF NOT EXISTS generic_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by TEXT,
  domain TEXT NOT NULL,
  name TEXT NOT NULL,
  poetic_name TEXT,
  poem TEXT,
  category TEXT,
  sub TEXT,
  status TEXT DEFAULT 'planning',
  created TEXT,
  note TEXT,
  description TEXT,
  document TEXT,
  task TEXT,
  decision TEXT,
  history JSONB DEFAULT '[]',
  tracking TEXT,
  initiator TEXT,
  image TEXT,
  link TEXT,
  view_link TEXT
);

-- ProjectAttachment
CREATE TABLE IF NOT EXISTS project_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by TEXT,
  project_type TEXT NOT NULL,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL
);

-- Tabaot
CREATE TABLE IF NOT EXISTS tabaot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by TEXT,
  quarter TEXT,
  plan_name TEXT NOT NULL,
  instructions_url TEXT,
  tashrit_url TEXT,
  note TEXT,
  consultant_notes TEXT
);

-- IdeaCard
CREATE TABLE IF NOT EXISTS idea_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by TEXT,
  name TEXT NOT NULL,
  image_url TEXT
);

-- Permit
CREATE TABLE IF NOT EXISTS permits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by TEXT,
  title TEXT NOT NULL,
  description TEXT,
  permit_type TEXT,
  status TEXT DEFAULT 'טיוטה',
  address TEXT,
  city TEXT,
  applicant_name TEXT,
  applicant_phone TEXT,
  architect_name TEXT,
  submission_date DATE,
  expected_approval_date DATE,
  current_stage TEXT DEFAULT 'הכנת מסמכים',
  notes TEXT,
  documents JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  priority TEXT DEFAULT 'רגילה',
  estimated_cost NUMERIC,
  area_sqm NUMERIC
);

-- Standard
CREATE TABLE IF NOT EXISTS standards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by TEXT,
  title TEXT NOT NULL,
  standard_number TEXT,
  category TEXT,
  description TEXT,
  link TEXT,
  image_url TEXT,
  is_mandatory BOOLEAN DEFAULT true,
  last_updated DATE,
  relevant_permit_types JSONB DEFAULT '[]'
);

-- Auto-update updated_date on row change
CREATE OR REPLACE FUNCTION update_updated_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_date = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_binui_projects_updated BEFORE UPDATE ON binui_projects FOR EACH ROW EXECUTE FUNCTION update_updated_date();
CREATE OR REPLACE TRIGGER trg_generic_projects_updated BEFORE UPDATE ON generic_projects FOR EACH ROW EXECUTE FUNCTION update_updated_date();
CREATE OR REPLACE TRIGGER trg_project_attachments_updated BEFORE UPDATE ON project_attachments FOR EACH ROW EXECUTE FUNCTION update_updated_date();
CREATE OR REPLACE TRIGGER trg_tabaot_updated BEFORE UPDATE ON tabaot FOR EACH ROW EXECUTE FUNCTION update_updated_date();
CREATE OR REPLACE TRIGGER trg_idea_cards_updated BEFORE UPDATE ON idea_cards FOR EACH ROW EXECUTE FUNCTION update_updated_date();
CREATE OR REPLACE TRIGGER trg_permits_updated BEFORE UPDATE ON permits FOR EACH ROW EXECUTE FUNCTION update_updated_date();
CREATE OR REPLACE TRIGGER trg_standards_updated BEFORE UPDATE ON standards FOR EACH ROW EXECUTE FUNCTION update_updated_date();