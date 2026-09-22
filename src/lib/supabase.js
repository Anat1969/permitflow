import { createClient } from '@supabase/supabase-js';

// ניתן לדרוס דרך קובץ .env.local (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://brvjdkvhhmiefwssjryc.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJydmpka3ZoaG1pZWZ3c3NqcnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3Mjk5ODMsImV4cCI6MjA4ODMwNTk4M30.kVYsXDdHZ-wY2iVs0r-gKP3u2nvHAx94XivxC5Yi_7c';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
