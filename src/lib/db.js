/**
 * db.js — Supabase data layer
 * מחליף את base44.entities עם API זהה
 */
import { supabase } from './supabase';

// הטבלאות ב-Supabase משתמשות ב-created_at; שמות base44 (created_date/updated_date) ממופים אליו
const normalizeOrder = (orderBy) => {
  const desc = orderBy.startsWith('-');
  let col = desc ? orderBy.slice(1) : orderBy;
  if (col === 'created_date' || col === 'updated_date' || col === 'updated_at') col = 'created_at';
  return { col, asc: !desc };
};

// אם עמודת המיון לא קיימת בטבלה — מריץ שוב בלי מיון במקום להיכשל
async function runOrdered(build, orderBy, limit) {
  const { col, asc } = normalizeOrder(orderBy);
  let { data, error } = await build().order(col, { ascending: asc }).limit(limit);
  if (error && /column|does not exist/i.test(error.message || '')) {
    ({ data, error } = await build().limit(limit));
  }
  if (error) throw error;
  return data || [];
}

function makeEntity(tableName) {
  return {
    async list(orderBy = '-created_at', limit = 500) {
      return runOrdered(() => supabase.from(tableName).select('*'), orderBy, limit);
    },

    async filter(filters = {}, orderBy = '-created_at', limit = 500) {
      const build = () => {
        let query = supabase.from(tableName).select('*');
        for (const [key, val] of Object.entries(filters)) {
          query = query.eq(key, val);
        }
        return query;
      };
      return runOrdered(build, orderBy, limit);
    },

    async get(id) {
      const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },

    async create(payload) {
      const { data, error } = await supabase.from(tableName).insert([payload]).select().single();
      if (error) throw error;
      return data;
    },

    async update(id, payload) {
      const { data, error } = await supabase.from(tableName).update(payload).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },

    async delete(id) {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
    },
  };
}

export const db = {
  BinuiProject: makeEntity('binui_projects'),
  GenericProject: makeEntity('generic_projects'),
  ProjectAttachment: makeEntity('project_attachments'),
  Tabaot: makeEntity('tabaot'),
  IdeaCard: makeEntity('idea_cards'),
  Permit: makeEntity('permits'),
  Standard: makeEntity('standards'),
};