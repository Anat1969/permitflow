import { createClient } from 'npm:@supabase/supabase-js@2';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://brvjdkvhhmiefwssjryc.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);