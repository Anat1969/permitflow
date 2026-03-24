import { useState, useEffect } from "react";
import { X, Plus, Trash2, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import StatusBadge from "@/components/common/StatusBadge";
import { STATUS_CONFIG, getToday, addHistoryEntry } from "@/utils/projectConfig";

export default function ProjectPanel({ domainCfg, category, sub, onClose, onRefresh }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [search, setSearch] = useState("");

  const isBinui = domainCfg.id === "binui";

  const load = async () => {
    setLoading(true);
    let data;
    if (isBinui) {
      data = await base44.entities.BinuiProject.filter({ category, sub });
    } else {
      data = await base44.entities.GenericProject.filter({ domain: domainCfg.domain, category, sub });
    }
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [category, sub]);

  const addProject = async () => {
    if (!newName.trim()) return;
    const fullName = isBinui ? `${category}:${sub} - ${newName.trim()}` : newName.trim();
    const today = getToday();
    const history = addHistoryEntry([], "נוצר");
    let item;
    if (isBinui) {
      item = await base44.entities.BinuiProject.create({ name: fullName, category, sub, status: "planning", created: today, history });
    } else {
      item = await base44.entities.GenericProject.create({ name: fullName, domain: domainCfg.domain, category, sub, status: "planning", created: today, history });
    }
    setProjects(p => [...p, item]);
    setNewName("");
    onRefresh?.();
  };

  const deleteProject = async (id) => {
    if (!confirm("למחוק פרויקט זה?")) return;
    if (isBinui) { await base44.entities.BinuiProject.delete(id); }
    else { await base44.entities.GenericProject.delete(id); }
    setProjects(p => p.filter(x => x.id !== id));
    onRefresh?.();
  };

  const changeStatus = async (id, status) => {
    const proj = projects.find(p => p.id === id);
    const history = addHistoryEntry(proj?.history || [], `סטטוס שונה ל: ${STATUS_CONFIG[status]?.label}`);
    if (isBinui) { await base44.entities.BinuiProject.update(id, { status, history }); }
    else { await base44.entities.GenericProject.update(id, { status, history }); }
    setProjects(p => p.map(x => x.id === id ? { ...x, status, history } : x));
    onRefresh?.();
  };

  const filtered = projects.filter(p => !search || p.name?.includes(search));
  const counts = Object.keys(STATUS_CONFIG).reduce((a, k) => ({ ...a, [k]: projects.filter(p => p.status === k).length }), {});

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div
        dir="rtl"
        className="fixed top-0 right-0 h-full z-50 flex flex-col shadow-2xl"
        style={{ width: 420, maxWidth: "100vw", background: "#fff", animation: "slideInPanel 0.35s ease-out" }}
      >
        {/* Header */}
        <div className="p-4 text-white flex items-center justify-between" style={{ background: domainCfg.color }}>
          <div>
            <div className="text-xs opacity-75">{domainCfg.label} / {category}</div>
            <div className="font-bold text-lg">{sub}</div>
            <div className="text-xs opacity-75">{projects.length} פרויקטים</div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/20"><X className="w-5 h-5" /></button>
        </div>

        {/* Add */}
        <div className="p-3 border-b flex gap-2">
          <input
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
            placeholder="שם פרויקט חדש..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addProject()}
          />
          <button onClick={addProject} className="px-3 py-2 rounded-lg text-white text-sm font-bold flex items-center gap-1" style={{ background: domainCfg.color }}>
            <Plus className="w-4 h-4" /> הוסף
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b">
          <div className="flex items-center gap-2 border rounded-lg px-3 py-1.5">
            <Search className="w-4 h-4 text-gray-400" />
            <input className="flex-1 text-sm outline-none" placeholder="חפש..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading && <p className="text-sm text-gray-400 text-center py-4">טוען...</p>}
          {!loading && filtered.length === 0 && <p className="text-sm text-gray-400 text-center py-4">אין פרויקטים</p>}
          {filtered.map(proj => (
            <div key={proj.id} className="border rounded-xl p-3 flex items-start gap-2 hover:shadow-sm transition-shadow">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{proj.name}</div>
                {proj.created && <div className="text-xs text-gray-400">{proj.created}</div>}
              </div>
              <select
                className="text-xs border rounded-lg px-2 py-1"
                value={proj.status}
                onChange={e => changeStatus(proj.id, e.target.value)}
              >
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <button onClick={() => deleteProject(proj.id)} className="text-red-400 hover:text-red-600 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t p-3 grid grid-cols-4 gap-2">
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <div key={k} className="text-center rounded-lg p-1" style={{ background: v.bg }}>
              <div className="font-black text-base" style={{ color: v.color }}>{counts[k] || 0}</div>
              <div className="text-xs" style={{ color: v.color }}>{v.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideInPanel {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}