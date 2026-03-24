import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { X, Plus, Trash2 } from "lucide-react";

export default function TabaotModal({ onClose }) {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ quarter: "", plan_name: "", instructions_url: "", note: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Tabaot.list().then(d => { setList(d); setLoading(false); });
  }, []);

  const add = async () => {
    if (!form.plan_name) return;
    const item = await base44.entities.Tabaot.create(form);
    setList(p => [...p, item]);
    setForm({ quarter: "", plan_name: "", instructions_url: "", note: "" });
  };

  const del = async (id) => {
    if (!confirm("למחוק?")) return;
    await base44.entities.Tabaot.delete(id);
    setList(p => p.filter(x => x.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" dir="rtl">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">ניהול תב״עות</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 border-b space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input className="border rounded-lg px-3 py-2 text-sm" placeholder="רובע" value={form.quarter} onChange={e => setForm(p => ({ ...p, quarter: e.target.value }))} />
            <input className="border rounded-lg px-3 py-2 text-sm" placeholder="שם תוכנית *" value={form.plan_name} onChange={e => setForm(p => ({ ...p, plan_name: e.target.value }))} />
            <input className="border rounded-lg px-3 py-2 text-sm col-span-2" placeholder="קישור להוראות" value={form.instructions_url} onChange={e => setForm(p => ({ ...p, instructions_url: e.target.value }))} />
          </div>
          <button onClick={add} className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ background: "#1a3060" }}>
            <Plus className="w-4 h-4" /> הוסף
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {loading ? <p className="text-sm text-gray-400">טוען...</p> : list.map(t => (
            <div key={t.id} className="flex items-center gap-3 p-3 border rounded-xl">
              <div className="flex-1">
                <div className="font-semibold text-sm">{t.plan_name}</div>
                {t.quarter && <div className="text-xs text-gray-500">רובע: {t.quarter}</div>}
                {t.instructions_url && <a href={t.instructions_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">הוראות תוכנית</a>}
              </div>
              <button onClick={() => del(t.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}