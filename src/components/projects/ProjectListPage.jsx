import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import TopNav from "@/components/layout/TopNav";
import StatusBadge from "@/components/common/StatusBadge";
import { STATUS_CONFIG, getToday, addHistoryEntry } from "@/utils/projectConfig";
import { Plus, Search, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

export default function ProjectListPage({ domainCfg }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterSub, setFilterSub] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortField, setSortField] = useState("created");
  const [sortAsc, setSortAsc] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCat, setNewCat] = useState("");
  const [newSub, setNewSub] = useState("");
  const navigate = useNavigate();
  const isBinui = domainCfg.id === "binui";

  const load = useCallback(async () => {
    setLoading(true);
    let data;
    if (isBinui) { data = await base44.entities.BinuiProject.list(); }
    else { data = await base44.entities.GenericProject.filter({ domain: domainCfg.domain }); }
    setProjects(data);
    setLoading(false);
  }, [domainCfg]);

  useEffect(() => { load(); }, [load]);

  const addProject = async () => {
    if (!newName.trim() || !newCat || !newSub) return;
    const fullName = isBinui ? `${newCat}:${newSub} - ${newName.trim()}` : newName.trim();
    const today = getToday();
    const history = addHistoryEntry([], "נוצר");
    let item;
    if (isBinui) {
      item = await base44.entities.BinuiProject.create({ name: fullName, category: newCat, sub: newSub, status: "planning", created: today, history });
    } else {
      item = await base44.entities.GenericProject.create({ name: fullName, domain: domainCfg.domain, category: newCat, sub: newSub, status: "planning", created: today, history });
    }
    navigate(isBinui ? `/binui/${item.id}` : `/${domainCfg.route.slice(1)}/${item.id}`);
  };

  const filtered = projects
    .filter(p => !search || p.name?.includes(search))
    .filter(p => !filterCat || p.category === filterCat)
    .filter(p => !filterSub || p.sub === filterSub)
    .filter(p => !filterStatus || p.status === filterStatus)
    .sort((a, b) => {
      const va = a[sortField] || ""; const vb = b[sortField] || "";
      return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const toggleSort = (field) => {
    if (sortField === field) setSortAsc(a => !a);
    else { setSortField(field); setSortAsc(true); }
  };

  const SortBtn = ({ field, label }) => (
    <button onClick={() => toggleSort(field)} className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900">
      {label}
      {sortField === field ? (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : null}
    </button>
  );

  const cats = domainCfg.categories;
  const subs = newCat ? (cats.find(c => c.label === newCat)?.subs || []) : [];
  const filterSubs = filterCat ? (cats.find(c => c.label === filterCat)?.subs || []) : [];

  return (
    <div dir="rtl" className="min-h-screen flex flex-col" style={{ background: "#F4F1EB" }}>
      <TopNav />
      {/* Banner */}
      <div className="text-white px-6 py-5" style={{ background: `linear-gradient(135deg, ${domainCfg.color} 0%, ${domainCfg.color}CC 100%)` }}>
        <div className="flex items-center gap-2 text-sm opacity-70 mb-1">
          <Link to="/" className="hover:underline">דשבורד</Link>
          <ArrowRight className="w-3 h-3" />
          <span>{domainCfg.label}</span>
        </div>
        <h1 className="text-2xl font-black" style={{ fontFamily: "'Frank Ruhl Libre', serif" }}>
          {domainCfg.icon} {domainCfg.label}
          <span className="text-lg font-normal mr-2 opacity-70">({projects.length})</span>
        </h1>
      </div>

      <div className="max-w-screen-xl mx-auto w-full px-4 py-4 space-y-4">
        {/* Search + Add */}
        <div className="bg-white rounded-2xl border p-4 space-y-3">
          <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input className="flex-1 text-sm outline-none" placeholder="חיפוש חופשי..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2 items-end">
            <select className="border rounded-lg px-3 py-2 text-sm" value={newCat} onChange={e => { setNewCat(e.target.value); setNewSub(""); }}>
              <option value="">קטגוריה</option>
              {cats.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
            </select>
            <select className="border rounded-lg px-3 py-2 text-sm" value={newSub} onChange={e => setNewSub(e.target.value)} disabled={!newCat}>
              <option value="">תת-קטגוריה</option>
              {subs.map(s => <option key={s} value={s}>{s}</option>)}
              {subs.length === 0 && newCat && <option value={newCat}>{newCat}</option>}
            </select>
            <input className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-32" placeholder="שם הפרויקט..." value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && addProject()} />
            <button onClick={addProject} disabled={!newName || !newCat || !newSub} className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-40" style={{ background: domainCfg.color }}>
              <Plus className="w-4 h-4" /> הוסף
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <select className="border rounded-lg px-3 py-1.5 text-sm bg-white" value={filterCat} onChange={e => { setFilterCat(e.target.value); setFilterSub(""); }}>
            <option value="">כל הקטגוריות</option>
            {cats.map(c => <option key={c.label} value={c.label}>{c.label} ({projects.filter(p => p.category === c.label).length})</option>)}
          </select>
          {filterCat && (
            <select className="border rounded-lg px-3 py-1.5 text-sm bg-white" value={filterSub} onChange={e => setFilterSub(e.target.value)}>
              <option value="">כל תת-הקטגוריות</option>
              {filterSubs.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
          <select className="border rounded-lg px-3 py-1.5 text-sm bg-white" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">כל הסטטוסים</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <div className="flex items-center gap-3 mr-auto text-sm text-gray-500 bg-white border rounded-lg px-3 py-1.5">
            מיון:
            <SortBtn field="name" label="שם" />
            <SortBtn field="created" label="תאריך" />
            <SortBtn field="status" label="סטטוס" />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">טוען...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(proj => {
              const href = isBinui ? `/binui/${proj.id}` : `/${domainCfg.route.slice(1)}/${proj.id}`;
              return (
                <Link key={proj.id} to={href} className="bg-white rounded-2xl border hover:shadow-md transition-all">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-base leading-tight line-clamp-2">{proj.name}</h3>
                      <StatusBadge status={proj.status} />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500">
                      {proj.category && <span className="px-2 py-0.5 rounded-full bg-gray-100">{proj.category}</span>}
                      {proj.sub && <span className="px-2 py-0.5 rounded-full bg-gray-100">{proj.sub}</span>}
                      {proj.created && <span className="mr-auto">{proj.created}</span>}
                    </div>
                    {proj.note && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{proj.note}</p>}
                  </div>
                </Link>
              );
            })}
            {filtered.length === 0 && <div className="col-span-3 text-center py-12 text-gray-400">לא נמצאו פרויקטים</div>}
          </div>
        )}
      </div>
    </div>
  );
}