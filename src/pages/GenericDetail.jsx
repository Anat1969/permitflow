import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import TopNav from "@/components/layout/TopNav";
import { STATUS_CONFIG, DOMAIN_CONFIG, getToday, addHistoryEntry } from "@/utils/projectConfig";
import { ArrowRight, Save, Trash2, Loader2, Upload, ExternalLink } from "lucide-react";
import EmailModal from "@/components/modals/EmailModal";

export default function GenericDetail({ domainId }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const domainCfg = DOMAIN_CONFIG[domainId];
  const [proj, setProj] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [emailModal, setEmailModal] = useState(false);

  useEffect(() => {
    Promise.all([
      base44.entities.GenericProject.filter({ id }),
      base44.entities.ProjectAttachment.filter({ project_type: "generic", project_id: id }),
    ]).then(([projs, atts]) => {
      setProj(projs[0] || null);
      setAttachments(atts);
      setLoading(false);
    });
  }, [id]);

  const update = (field, value) => setProj(p => ({ ...p, [field]: value }));

  const save = async () => {
    setSaving(true);
    const history = addHistoryEntry(proj.history || [], "עודכן");
    await base44.entities.GenericProject.update(id, { ...proj, history });
    setProj(p => ({ ...p, history }));
    setSaving(false);
  };

  const changeStatus = async (status) => {
    const history = addHistoryEntry(proj.history || [], `סטטוס שונה ל: ${STATUS_CONFIG[status]?.label}`);
    await base44.entities.GenericProject.update(id, { status, history });
    setProj(p => ({ ...p, status, history }));
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    update("image", file_url);
  };

  const uploadAttachment = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const att = await base44.entities.ProjectAttachment.create({ project_type: "generic", project_id: id, name: file.name, file_url });
    setAttachments(p => [...p, att]);
  };

  const deleteAtt = async (attId) => {
    if (!confirm("למחוק?")) return;
    await base44.entities.ProjectAttachment.delete(attId);
    setAttachments(p => p.filter(a => a.id !== attId));
  };

  const deleteProject = async () => {
    if (!confirm("למחוק?")) return;
    await base44.entities.GenericProject.delete(id);
    navigate(domainCfg.route);
  };

  if (loading) return <div dir="rtl" className="min-h-screen flex items-center justify-center" style={{ background: "#F4F1EB" }}><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  if (!proj) return <div dir="rtl" className="min-h-screen flex items-center justify-center">לא נמצא</div>;

  const textFields = [
    { key: "description", label: "תיאור", rows: 3 },
    { key: "task", label: "משימה", rows: 2 },
    { key: "decision", label: "החלטה", rows: 2 },
    { key: "document", label: "מסמך", rows: 3 },
    { key: "note", label: "הערה", rows: 2 },
  ];

  return (
    <div dir="rtl" className="min-h-screen flex flex-col" style={{ background: "#F4F1EB" }}>
      <TopNav />
      <div className="text-white px-6 py-4" style={{ background: `linear-gradient(135deg, ${domainCfg.color} 0%, ${domainCfg.color}CC 100%)` }}>
        <div className="flex items-center gap-2 text-sm opacity-70 mb-1">
          <Link to="/" className="hover:underline">דשבורד</Link>
          <ArrowRight className="w-3 h-3" />
          <Link to={domainCfg.route} className="hover:underline">{domainCfg.label}</Link>
          <ArrowRight className="w-3 h-3" />
          <span className="truncate max-w-xs">{proj.name}</span>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-xl font-black" style={{ fontFamily: "'Frank Ruhl Libre', serif" }}>{proj.name}</h1>
          {proj.poetic_name && <span className="text-sm opacity-70 italic">"{proj.poetic_name}"</span>}
          <select
            className="text-sm font-bold rounded-full px-3 py-1 border-0 cursor-pointer"
            style={{ color: STATUS_CONFIG[proj.status]?.color, background: STATUS_CONFIG[proj.status]?.bg }}
            value={proj.status}
            onChange={e => changeStatus(e.target.value)}
          >
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto w-full px-4 py-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          {/* שדות */}
          <div className="bg-white rounded-2xl border p-4 space-y-3">
            <h3 className="font-bold">פרטי הפרויקט</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500">שם פואטי</label>
                <input className="w-full border rounded-lg px-3 py-1.5 text-sm" value={proj.poetic_name || ""} onChange={e => update("poetic_name", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500">יוזם</label>
                <input className="w-full border rounded-lg px-3 py-1.5 text-sm" value={proj.initiator || ""} onChange={e => update("initiator", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500">קישור חיצוני</label>
                <input className="w-full border rounded-lg px-3 py-1.5 text-sm" value={proj.link || ""} onChange={e => update("link", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500">קישור לצפייה</label>
                <input className="w-full border rounded-lg px-3 py-1.5 text-sm" value={proj.view_link || ""} onChange={e => update("view_link", e.target.value)} />
              </div>
            </div>
          </div>

          {textFields.map(f => (
            <div key={f.key} className="bg-white rounded-2xl border p-4">
              <h3 className="font-bold mb-2">{f.label}</h3>
              <textarea
                className="w-full border rounded-xl px-3 py-2 text-sm"
                rows={f.rows}
                value={proj[f.key] || ""}
                onChange={e => update(f.key, e.target.value)}
                onBlur={save}
              />
            </div>
          ))}

          {/* שיר */}
          {proj.poem !== undefined && (
            <div className="bg-white rounded-2xl border p-4">
              <h3 className="font-bold mb-2">📜 שיר / ציטוט</h3>
              <textarea className="w-full border rounded-xl px-3 py-2 text-sm" rows={3} value={proj.poem || ""} onChange={e => update("poem", e.target.value)} onBlur={save} />
            </div>
          )}

          {/* היסטוריה */}
          <div className="bg-white rounded-2xl border p-4">
            <h3 className="font-bold mb-3">📜 היסטוריה</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {(proj.history || []).slice().reverse().map((h, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="text-gray-400 whitespace-nowrap text-xs">{h.date}</span>
                  <span>{h.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* תמונה */}
          <div className="bg-white rounded-2xl border p-4">
            <h3 className="font-bold mb-3">🖼 תמונה</h3>
            {proj.image ? (
              <div className="relative group rounded-xl overflow-hidden border">
                <img src={proj.image} alt="" className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <a href={proj.image} target="_blank" rel="noreferrer" className="p-2 bg-white rounded-full"><ExternalLink className="w-4 h-4" /></a>
                  <button onClick={() => update("image", null)} className="p-2 bg-white rounded-full"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                <Upload className="w-6 h-6 text-gray-300 mb-1" />
                <span className="text-xs text-gray-400">העלה תמונה</span>
                <input type="file" accept="image/*" className="hidden" onChange={uploadImage} />
              </label>
            )}
          </div>

          {/* קבצים */}
          <div className="bg-white rounded-2xl border p-4">
            <h3 className="font-bold mb-3">📎 קבצים מצורפים</h3>
            <div className="space-y-2 mb-3">
              {attachments.map(att => (
                <div key={att.id} className="flex items-center gap-2 p-2 border rounded-lg text-sm">
                  <a href={att.file_url} target="_blank" rel="noreferrer" className="flex-1 text-blue-600 hover:underline truncate">{att.name}</a>
                  <button onClick={() => deleteAtt(att.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-500 hover:text-gray-800">
              <Upload className="w-4 h-4" /> העלה קובץ
              <input type="file" className="hidden" onChange={uploadAttachment} />
            </label>
          </div>

          {/* קישורים */}
          <div className="bg-white rounded-2xl border p-4 space-y-2">
            {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 text-sm hover:underline"><ExternalLink className="w-4 h-4" /> קישור חיצוני</a>}
            {proj.view_link && <a href={proj.view_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 text-sm hover:underline"><ExternalLink className="w-4 h-4" /> צפייה</a>}
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl border p-4 space-y-2">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-white font-bold justify-center" style={{ background: domainCfg.color }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              שמור שינויים
            </button>
            <button onClick={() => setEmailModal(true)} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl font-bold justify-center border hover:bg-gray-50">
              ✉️ שלח מייל
            </button>
            <button onClick={deleteProject} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl font-bold justify-center border border-red-200 text-red-500 hover:bg-red-50">
              <Trash2 className="w-4 h-4" /> מחק
            </button>
          </div>
        </div>
      </div>

      {emailModal && <EmailModal onClose={() => setEmailModal(false)} subject={`פרויקט: ${proj.name}`} body={`פרויקט: ${proj.name}\nסטטוס: ${STATUS_CONFIG[proj.status]?.label}`} />}
    </div>
  );
}