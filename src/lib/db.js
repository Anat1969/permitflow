/**
 * db.js — Supabase data layer
 * מחליף את base44.entities עם API זהה
 */
import { supabase } from './supabase';

function makeEntity(tableName) {
  return {
    async list(orderBy = '-created_at', limit = 500) {
      const col = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
      const asc = !orderBy.startsWith('-');
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order(col, { ascending: asc })
        .limit(limit);
      if (error) throw error;
      return data || [];
    },

    async filter(filters = {}, orderBy = '-created_at', limit = 500) {
      const col = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
      const asc = !orderBy.startsWith('-');
      let query = supabase.from(tableName).select('*');
      for (const [key, val] of Object.entries(filters)) {
        query = query.eq(key, val);
      }
      const { data, error } = await query.order(col, { ascending: asc }).limit(limit);
      if (error) throw error;
      return data || [];
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