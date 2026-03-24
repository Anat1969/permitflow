import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { Upload, X, Loader2 } from 'lucide-react';

const permitTypes = ["היתר בנייה", "היתר שימוש חורג", 'היתר תמ"א 38', "היתר הריסה", "היתר שינויים", "רישיון עסק"];
const priorities = ["נמוכה", "רגילה", "גבוהה", "דחופה"];
const statuses = ["טיוטה", "הוגש", "בבדיקה", "דרישות תיקון", "אושר", "נדחה"];
const stages = ["הכנת מסמכים", "הגשה לוועדה מקומית", "בדיקת תכנית", "שימוע/דיון", "תנאים מוקדמים", "אישור סופי"];

export default function PermitForm({ permit, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: permit?.title || '',
    description: permit?.description || '',
    permit_type: permit?.permit_type || '',
    status: permit?.status || 'טיוטה',
    address: permit?.address || '',
    city: permit?.city || '',
    applicant_name: permit?.applicant_name || '',
    applicant_phone: permit?.applicant_phone || '',
    architect_name: permit?.architect_name || '',
    submission_date: permit?.submission_date || '',
    expected_approval_date: permit?.expected_approval_date || '',
    current_stage: permit?.current_stage || 'הכנת מסמכים',
    notes: permit?.notes || '',
    priority: permit?.priority || 'רגילה',
    estimated_cost: permit?.estimated_cost || '',
    area_sqm: permit?.area_sqm || '',
    images: permit?.images || [],
    documents: permit?.documents || [],
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e, field) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const urls = [];
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      urls.push(file_url);
    }
    setForm(prev => ({ ...prev, [field]: [...(prev[field] || []), ...urls] }));
    setUploading(false);
  };

  const removeFile = (field, index) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = { ...form };
    if (data.estimated_cost) data.estimated_cost = Number(data.estimated_cost);
    if (data.area_sqm) data.area_sqm = Number(data.area_sqm);
    await onSubmit(data);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">פרטי הפרויקט</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label>שם הפרויקט *</Label>
            <Input value={form.title} onChange={e => handleChange('title', e.target.value)} required />
          </div>
          <div>
            <Label>סוג היתר *</Label>
            <Select value={form.permit_type} onValueChange={v => handleChange('permit_type', v)}>
              <SelectTrigger><SelectValue placeholder="בחר סוג" /></SelectTrigger>
              <SelectContent>
                {permitTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>עדיפות</Label>
            <Select value={form.priority} onValueChange={v => handleChange('priority', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>כתובת *</Label>
            <Input value={form.address} onChange={e => handleChange('address', e.target.value)} required />
          </div>
          <div>
            <Label>עיר *</Label>
            <Input value={form.city} onChange={e => handleChange('city', e.target.value)} required />
          </div>
          <div className="sm:col-span-2">
            <Label>תיאור</Label>
            <Textarea value={form.description} onChange={e => handleChange('description', e.target.value)} rows={3} />
          </div>
        </div>
      </div>

      {/* Contacts */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">אנשי קשר</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label>שם המבקש</Label>
            <Input value={form.applicant_name} onChange={e => handleChange('applicant_name', e.target.value)} />
          </div>
          <div>
            <Label>טלפון</Label>
            <Input value={form.applicant_phone} onChange={e => handleChange('applicant_phone', e.target.value)} />
          </div>
          <div>
            <Label>שם האדריכל</Label>
            <Input value={form.architect_name} onChange={e => handleChange('architect_name', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Status & Dates */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">סטטוס ותאריכים</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>סטטוס</Label>
            <Select value={form.status} onValueChange={v => handleChange('status', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>שלב נוכחי</Label>
            <Select value={form.current_stage} onValueChange={v => handleChange('current_stage', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>תאריך הגשה</Label>
            <Input type="date" value={form.submission_date} onChange={e => handleChange('submission_date', e.target.value)} />
          </div>
          <div>
            <Label>תאריך אישור צפוי</Label>
            <Input type="date" value={form.expected_approval_date} onChange={e => handleChange('expected_approval_date', e.target.value)} />
          </div>
          <div>
            <Label>עלות משוערת (₪)</Label>
            <Input type="number" value={form.estimated_cost} onChange={e => handleChange('estimated_cost', e.target.value)} />
          </div>
          <div>
            <Label>שטח (מ"ר)</Label>
            <Input type="number" value={form.area_sqm} onChange={e => handleChange('area_sqm', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">תמונות</h3>
        <div className="flex flex-wrap gap-3">
          {form.images.map((url, i) => (
            <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-border group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeFile('images', i)}
                className="absolute top-1 left-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <label className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
            {uploading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : (
              <>
                <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">העלאה</span>
              </>
            )}
            <input type="file" accept="image/*" multiple className="hidden" onChange={e => handleFileUpload(e, 'images')} disabled={uploading} />
          </label>
        </div>
      </div>

      {/* Documents */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">מסמכים</h3>
        <div className="space-y-2">
          {form.documents.map((url, i) => (
            <div key={i} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 text-sm">
              <a href={url} target="_blank" rel="noopener noreferrer" className="flex-1 truncate text-primary hover:underline">
                מסמך {i + 1}
              </a>
              <button type="button" onClick={() => removeFile('documents', i)} className="text-muted-foreground hover:text-destructive">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors">
            <Upload className="w-4 h-4" />
            <span>העלאת מסמך</span>
            <input type="file" multiple className="hidden" onChange={e => handleFileUpload(e, 'documents')} disabled={uploading} />
          </label>
        </div>
      </div>

      {/* Notes */}
      <div>
        <Label>הערות</Label>
        <Textarea value={form.notes} onChange={e => handleChange('notes', e.target.value)} rows={3} />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving} className="gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {permit ? 'עדכון' : 'יצירה'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>ביטול</Button>
        )}
      </div>
    </form>
  );
}