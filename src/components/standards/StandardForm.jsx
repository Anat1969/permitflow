import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { base44 } from '@/api/base44Client';
import { Upload, X, Loader2 } from 'lucide-react';

const categories = ["בטיחות אש", "נגישות", "בידוד תרמי", "בטיחות מבנית", "אינסטלציה", "חשמל", "איכות הסביבה", "תכנון ובנייה", "אחר"];

export default function StandardForm({ standard, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: standard?.title || '',
    standard_number: standard?.standard_number || '',
    category: standard?.category || '',
    description: standard?.description || '',
    link: standard?.link || '',
    image_url: standard?.image_url || '',
    is_mandatory: standard?.is_mandatory ?? true,
    last_updated: standard?.last_updated || '',
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(prev => ({ ...prev, image_url: file_url }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Label>שם התקן *</Label>
          <Input value={form.title} onChange={e => handleChange('title', e.target.value)} required />
        </div>
        <div>
          <Label>מספר תקן</Label>
          <Input value={form.standard_number} onChange={e => handleChange('standard_number', e.target.value)} placeholder="לדוגמה: ת״י 1142" />
        </div>
        <div>
          <Label>קטגוריה *</Label>
          <Select value={form.category} onValueChange={v => handleChange('category', v)}>
            <SelectTrigger><SelectValue placeholder="בחר קטגוריה" /></SelectTrigger>
            <SelectContent>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label>תיאור *</Label>
          <Textarea value={form.description} onChange={e => handleChange('description', e.target.value)} rows={4} required />
        </div>
        <div>
          <Label>קישור לתקן</Label>
          <Input type="url" value={form.link} onChange={e => handleChange('link', e.target.value)} placeholder="https://..." dir="ltr" />
        </div>
        <div>
          <Label>תאריך עדכון אחרון</Label>
          <Input type="date" value={form.last_updated} onChange={e => handleChange('last_updated', e.target.value)} />
        </div>
      </div>

      {/* Image */}
      <div>
        <Label>תמונה</Label>
        {form.image_url ? (
          <div className="relative w-full h-40 rounded-xl overflow-hidden border border-border mt-2">
            <img src={form.image_url} alt="" className="w-full h-full object-cover" />
            <button type="button" onClick={() => handleChange('image_url', '')}
              className="absolute top-2 left-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="mt-2 flex items-center justify-center h-32 rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
            {uploading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : (
              <div className="text-center">
                <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                <span className="text-sm text-muted-foreground">העלאת תמונה</span>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
          </label>
        )}
      </div>

      {/* Mandatory */}
      <div className="flex items-center gap-3">
        <Switch checked={form.is_mandatory} onCheckedChange={v => handleChange('is_mandatory', v)} />
        <Label className="cursor-pointer">תקן חובה</Label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving} className="gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {standard ? 'עדכון' : 'הוספה'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>ביטול</Button>
        )}
      </div>
    </form>
  );
}