import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "@/lib/db";
import TopNav from "@/components/layout/TopNav";
import { Plus, Search, Trash2, ExternalLink, ArrowRight } from "lucide-react";

export default function PlanInstructions() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterQ, setFilterQ] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ quarter: "", plan_name: "", instructions_url: "", note: "" });

  useEffect(() => {
    db.Tabaot.list().then(d => { setList(d); setLoading(false); });
  }, []);

  const add = async () => {
    if (!form.plan_name) return;
    const item = await db.Tabaot.create(form);
    setList(p => [...p, item]);
    setForm({ quarter: "", plan_name: "", instructions_url: "", note: "" });
    setShowForm(false);
  };

  const del = async (id) => {
    if (!confirm("למחוק?")) return;
    await db.Tabaot.delete(id);
    setList(p => p.filter(x => x.id !== id));
  };

  const quarters = [...new Set(list.map(t => t.quarter).filter(Boolean))];
  const filtered = list
    .filter(t => !filterQ || t.quarter === filterQ)
    .filter(t => !search || t.plan_name?.includes(search) || t.quarter?.includes(search));

  return (
    <div dir="rtl" className="min-h-screen flex flex-col" style={{ background: "#F4F1EB" }}>
      <TopNav />
      <div className="text-white px-6 py-5" style={{ background: "linear-gradient(135deg, #1a3060 0%, #2a5090CC 100%)" }}>
        <div className="flex items-center gap-2 text-sm opacity-70 mb-1">
          <Link to="/" className="hover:underline">דשבורד</Link>
          <ArrowRight className="w-3 h-3" />
          <span>הוראות תוכנית</span>
        </div>
        <h1 className="text-2xl font-black" style={{ fontFamily: "'Frank Ruhl Libre', serif" }}>📋 הוראות תוכנית (תב״עות)</h1>
      </div>

      <div className="max-w-screen-lg mx-auto w-full px-4 py-4 space-y-4">
        {/* Search + Filter */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white flex-1 min-w-48">
            <Search className="w-4 h-4 text-gray-400" />
            <input className="flex-1 text-sm outline-none" placeholder="חפש..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="border rounded-xl px-3 py-2 text-sm bg-white" value={filterQ} onChange={e => setFilterQ(e.target.value)}>
            <option value="">כל הרבעים</option>
            {quarters.map(q => <option key={q} value={q}>{q}</option>)}
          </select>
          <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background: "#1a3060" }}>
            <Plus className="w-4 h-4" /> הוסף תב״ע
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl border p-4 space-y-3">
            <h3 className="font-bold">הוספת תב״ע חדשה</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">רובע</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.quarter} onChange={e => setForm(p => ({ ...p, quarter: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-gray-500">שם תוכנית *</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.plan_name} onChange={e => setForm(p => ({ ...p, plan_name: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-500">קישור להוראות</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.instructions_url} onChange={e => setForm(p => ({ ...p, instructions_url: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-500">הערות</label>
                <textarea className="w-full border rounded-lg px-3 py-2 text-sm" rows={2} value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={add} className="px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ background: "#1a3060" }}>שמור</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm border hover:bg-gray-50">ביטול</button>
            </div>
          </div>
        )}

        {loading ? <div className="text-center py-12 text-gray-400">טוען...</div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(t => (
              <div key={t.id} className="bg-white rounded-2xl border p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base">{t.plan_name}</h3>
                    {t.quarter && <div className="text-xs text-gray-500 mt-0.5">רובע: {t.quarter}</div>}
                  </div>
                  <button onClick={() => del(t.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
                {t.instructions_url && (
                  <a href={t.instructions_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:underline mt-2">
                    <ExternalLink className="w-3 h-3" /> הוראות תוכנית
                  </a>
                )}
                {t.note && <p className="text-xs text-gray-500 mt-2">{t.note}</p>}
              </div>
            ))}
            {filtered.length === 0 && <div className="col-span-3 text-center py-12 text-gray-400">לא נמצאו תב״עות</div>}
          </div>
        )}
      </div>
    </div>
  );
}