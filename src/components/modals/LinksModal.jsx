import { useState, useEffect } from "react";
import { X, Plus, Trash2, ExternalLink } from "lucide-react";

const KEY = "merhav_links";

export default function LinksModal({ onClose }) {
  const [links, setLinks] = useState([]);
  const [form, setForm] = useState({ title: "", url: "", note: "" });

  useEffect(() => {
    try { setLinks(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch { setLinks([]); }
  }, []);

  const save = (updated) => { setLinks(updated); localStorage.setItem(KEY, JSON.stringify(updated)); };

  const add = () => {
    if (!form.title || !form.url) return;
    save([...links, { ...form, id: Date.now() }]);
    setForm({ title: "", url: "", note: "" });
  };

  const del = (id) => { if (confirm("למחוק?")) save(links.filter(l => l.id !== id)); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" dir="rtl">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">ניהול קישורים</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 border-b space-y-2">
          <input className="border rounded-lg px-3 py-2 text-sm w-full" placeholder="כותרת *" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          <input className="border rounded-lg px-3 py-2 text-sm w-full" placeholder="URL *" value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} />
          <input className="border rounded-lg px-3 py-2 text-sm w-full" placeholder="הערה" value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} />
          <button onClick={add} className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ background: "#1a3060" }}>
            <Plus className="w-4 h-4" /> הוסף
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {links.map(l => (
            <div key={l.id} className="flex items-center gap-3 p-3 border rounded-xl">
              <div className="flex-1">
                <div className="font-semibold text-sm">{l.title}</div>
                <a href={l.url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />{l.url}
                </a>
                {l.note && <div className="text-xs text-gray-500">{l.note}</div>}
              </div>
              <button onClick={() => del(l.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}