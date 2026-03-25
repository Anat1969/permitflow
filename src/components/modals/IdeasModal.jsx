import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { db } from "@/lib/db";
import { X, Plus, Trash2, Upload, Loader2 } from "lucide-react";

export default function IdeasModal({ onClose }) {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    db.IdeaCard.list().then(setList);
  }, []);

  const add = async (imageUrl) => {
    if (!name) return;
    const item = await db.IdeaCard.create({ name, image_url: imageUrl || "" });
    setList(p => [...p, item]);
    setName("");
  };

  const handleImg = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await add(file_url);
    setUploading(false);
  };

  const del = async (id) => {
    if (!confirm("למחוק?")) return;
    await db.IdeaCard.delete(id);
    setList(p => p.filter(x => x.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" dir="rtl">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">💡 כרטיסי רעיונות</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 border-b flex gap-2">
          <input className="border rounded-lg px-3 py-2 text-sm flex-1" placeholder="שם הרעיון *" value={name} onChange={e => setName(e.target.value)} />
          <button onClick={() => add()} className="px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ background: "#1a3060" }}>
            <Plus className="w-4 h-4" />
          </button>
          <label className="px-4 py-2 rounded-lg text-sm font-bold text-white cursor-pointer flex items-center gap-1" style={{ background: "#2C6E6A" }}>
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            + תמונה
            <input type="file" accept="image/*" className="hidden" onChange={handleImg} disabled={uploading} />
          </label>
        </div>
        <div className="overflow-y-auto flex-1 p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {list.map(item => (
            <div key={item.id} className="relative rounded-xl overflow-hidden border group">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="w-full h-32 object-cover" />
              ) : (
                <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-4xl">💡</div>
              )}
              <div className="p-2 text-sm font-semibold">{item.name}</div>
              <button onClick={() => del(item.id)} className="absolute top-2 left-2 w-6 h-6 bg-red-500 text-white rounded-full hidden group-hover:flex items-center justify-center">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}