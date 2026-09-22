import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { uploadFile } from "@/lib/storage";
import { db } from "@/lib/db";
import TopNav from "@/components/layout/TopNav";
import { STATUS_CONFIG, addHistoryEntry } from "@/utils/projectConfig";
import { ArrowRight, Save, Upload, Trash2, Loader2, ExternalLink } from "lucide-react";
import EmailModal from "@/components/modals/EmailModal";

function InfoInput({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-xs text-gray-500 font-medium">{label}</label>
      <input type={type} className="w-full border rounded-lg px-3 py-1.5 text-sm mt-0.5" value={value || ""} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

export default function BinuiDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proj, setProj] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [emailModal, setEmailModal] = useState(false);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    Promise.all([
      db.BinuiProject.filter({ id }),
      db.ProjectAttachment.filter({ project_type: "binui", project_id: id }),
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
    await db.BinuiProject.update(id, { ...proj, history });
    setProj(p => ({ ...p, history }));
    setSaving(false);
  };

  const uploadImage = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(field);
    const { file_url } = await uploadFile({ file });
    update(field, file_url);
    setUploading(null);
  };

  const uploadAttachment = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await uploadFile({ file });
    const att = await db.ProjectAttachment.create({ project_type: "binui", project_id: id, name: file.name, file_url });
    setAttachments(p => [...p, att]);
  };

  const deleteAtt = async (attId) => {
    if (!confirm("למחוק?")) return;
    await db.ProjectAttachment.delete(attId);
    setAttachments(p => p.filter(a => a.id !== attId));
  };

  const changeStatus = async (status) => {
    const history = addHistoryEntry(proj.history || [], `סטטוס שונה ל: ${STATUS_CONFIG[status]?.label}`);
    await db.BinuiProject.update(id, { status, history });
    setProj(p => ({ ...p, status, history }));
  };

  const deleteProject = async () => {
    if (!confirm("למחוק פרויקט זה לצמיתות?")) return;
    await db.BinuiProject.delete(id);
    navigate("/binui");
  };

  if (loading) return <div dir="rtl" className="min-h-screen flex items-center justify-center" style={{ background: "#F4F1EB" }}><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  if (!proj) return <div dir="rtl" className="min-h-screen flex items-center justify-center" style={{ background: "#F4F1EB" }}>פרויקט לא נמצא</div>;

  const imageSlots = [
    { key: "image_tashrit", label: "תשריט" },
    { key: "image_tza", label: 'צ"א' },
    { key: "image_hadmaya", label: "הדמייה" },
  ];

  return (
    <div dir="rtl" className="min-h-screen flex flex-col" style={{ background: "#F4F1EB" }}>
      <TopNav />
      {/* Banner */}
      <div className="text-white px-6 py-4" style={{ background: "linear-gradient(135deg, #1a3060 0%, #2a5090CC 100%)" }}>
        <div className="flex items-center gap-2 text-sm opacity-70 mb-1">
          <Link to="/" className="hover:underline">דשבורד</Link>
          <ArrowRight className="w-3 h-3" />
          <Link to="/binui" className="hover:underline">מבנים</Link>
          <ArrowRight className="w-3 h-3" />
          <span className="truncate max-w-xs">{proj.name}</span>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-xl font-black" style={{ fontFamily: "'Frank Ruhl Libre', serif" }}>{proj.name}</h1>
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
        {/* Left column — Details */}
        <div className="space-y-4">
          {/* פרטים */}
          {[
            { title: "אדריכל", fields: ["architect", "architect_phone", "architect_email", "architect_address"], labels: ["שם", "טלפון", "מייל", "כתובת"] },
            { title: "מנהל פרויקט", fields: ["manager", "manager_phone", "manager_email", "manager_address"], labels: ["שם", "טלפון", "מייל", "כתובת"] },
            { title: "יזם", fields: ["developer", "developer_phone", "developer_email", "developer_address"], labels: ["שם", "טלפון", "מייל", "כתובת"] },
          ].map(section => (
            <div key={section.title} className="bg-white rounded-2xl border p-4">
              <h3 className="font-bold mb-3">{section.title}</h3>
              <div className="grid grid-cols-2 gap-2">
                {section.fields.map((f, i) => (
                  <InfoInput key={f} label={section.labels[i]} value={proj[f]} onChange={v => update(f, v)} />
                ))}
              </div>
            </div>
          ))}

          {/* מיקום */}
          <div className="bg-white rounded-2xl border p-4">
            <h3 className="font-bold mb-3">📍 מיקום</h3>
            <div className="grid grid-cols-2 gap-2">
              <InfoInput label="רובע" value={proj.quarter} onChange={v => update("quarter", v)} />
              <InfoInput label="כתובת" value={proj.street} onChange={v => update("street", v)} />
              <InfoInput label="גוש" value={proj.block} onChange={v => update("block", v)} />
              <InfoInput label="חלקה" value={proj.parcel} onChange={v => update("parcel", v)} />
            </div>
          </div>

          {/* תב"ע */}
          <div className="bg-white rounded-2xl border p-4">
            <h3 className="font-bold mb-3">📄 נתוני תב״ע</h3>
            <div className="grid grid-cols-2 gap-2">
              <InfoInput label="מספר תוכנית" value={proj.plan_overall} onChange={v => update("plan_overall", v)} />
              <InfoInput label="מספר תוכנית בינוי" value={proj.plan_detail} onChange={v => update("plan_detail", v)} />
            </div>
          </div>

          {/* חוות דעת */}
          <div className="bg-white rounded-2xl border p-4">
            <h3 className="font-bold mb-2">💬 חוות דעת</h3>
            <textarea
              className="w-full border rounded-xl px-3 py-2 text-sm"
              rows={4}
              value={proj.note || ""}
              onChange={e => update("note", e.target.value)}
              onBlur={save}
              placeholder="הוסף חוות דעת..."
            />
          </div>

          {/* היסטוריה */}
          <div className="bg-white rounded-2xl border p-4">
            <h3 className="font-bold mb-3">📜 היסטוריה</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {(proj.history || []).slice().reverse().map((h, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="text-gray-400 whitespace-nowrap text-xs">{h.date}</span>
                  <span>{h.note}</span>
                </div>
              ))}
              {(!proj.history || proj.history.length === 0) && <p className="text-sm text-gray-400">אין היסטוריה</p>}
            </div>
          </div>
        </div>

        {/* Right column — Media */}
        <div className="space-y-4">
          {/* תמונות */}
          <div className="bg-white rounded-2xl border p-4">
            <h3 className="font-bold mb-3">🖼 מדיה</h3>
            <div className="grid grid-cols-3 gap-3">
              {imageSlots.map(slot => (
                <div key={slot.key} className="space-y-1">
                  <div className="text-xs text-gray-500 font-medium">{slot.label}</div>
                  {proj[slot.key] ? (
                    <div className="relative group rounded-xl overflow-hidden border">
                      <img src={proj[slot.key]} alt={slot.label} className="w-full h-28 object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <a href={proj[slot.key]} target="_blank" rel="noreferrer" className="p-1 bg-white rounded-full"><ExternalLink className="w-4 h-4 text-gray-700" /></a>
                        <button onClick={() => update(slot.key, null)} className="p-1 bg-white rounded-full"><Trash2 className="w-4 h-4 text-red-500" /></button>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed rounded-xl h-28 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                      {uploading === slot.key ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : <>
                        <Upload className="w-5 h-5 text-gray-300 mb-1" />
                        <span className="text-xs text-gray-400">העלה</span>
                      </>}
                      <input type="file" accept="image/*" className="hidden" onChange={e => uploadImage(e, slot.key)} disabled={uploading === slot.key} />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* קבצים מצורפים */}
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

          {/* Actions */}
          <div className="bg-white rounded-2xl border p-4 space-y-2">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-white font-bold justify-center" style={{ background: "#1a3060" }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              שמור שינויים
            </button>
            <button onClick={() => setEmailModal(true)} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl font-bold justify-center border hover:bg-gray-50">
              ✉️ שלח מייל
            </button>
            <button onClick={deleteProject} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl font-bold justify-center border border-red-200 text-red-500 hover:bg-red-50">
              <Trash2 className="w-4 h-4" /> מחק פרויקט
            </button>
          </div>
        </div>
      </div>

      {emailModal && (
        <EmailModal
          onClose={() => setEmailModal(false)}
          subject={`פרויקט: ${proj.name}`}
          body={`פרויקט: ${proj.name}\nסטטוס: ${STATUS_CONFIG[proj.status]?.label}\nכתובת: ${proj.street || ""}, ${proj.quarter || ""}\nאדריכל: ${proj.architect || ""}`}
        />
      )}
    </div>
  );
}