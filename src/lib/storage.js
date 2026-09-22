/**
 * storage.js — העלאת קבצים ל-Supabase Storage
 * מחליף את base44.integrations.Core.UploadFile עם API זהה: מחזיר { file_url }
 */
import { supabase } from './supabase';

const BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || 'project-files';

export async function uploadFile({ file }) {
  const ext = file.name.includes('.') ? file.name.split('.').pop() : '';
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext ? `.${ext}` : ''}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) {
    alert(`העלאת הקובץ נכשלה: ${error.message}`);
    throw error;
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { file_url: data.publicUrl };
}
