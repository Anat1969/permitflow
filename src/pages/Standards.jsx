import { useState, useEffect } from 'react';
import { db } from "@/lib/db";
import { Search, Plus, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StandardCard from '../components/standards/StandardCard';
import StandardForm from '../components/standards/StandardForm';

const categories = ["הכל", "בטיחות אש", "נגישות", "בידוד תרמי", "בטיחות מבנית", "אינסטלציה", "חשמל", "איכות הסביבה", "תכנון ובנייה", "אחר"];

export default function Standards() {
  const [standards, setStandards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('הכל');
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const data = await db.Standard.list('-updated_date', 100);
    setStandards(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = standards.filter(s => {
    const matchesSearch = !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase()) ||
      s.standard_number?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'הכל' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreate = async (data) => {
    await db.Standard.create(data);
    setShowForm(false);
    load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">תקנים ותקנות</h1>
          <p className="text-muted-foreground mt-1">מאגר תקנים ותקנות רלוונטיות לתהליכי בנייה ורישוי</p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />
          הוספת תקן
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="חיפוש תקנים..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">לא נמצאו תקנים</h3>
          <p className="text-sm text-muted-foreground mb-4">הוסף תקנים ותקנות למאגר</p>
          <Button variant="outline" className="gap-2" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" />
            הוספת תקן
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(standard => (
            <StandardCard key={standard.id} standard={standard} />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>הוספת תקן חדש</DialogTitle>
          </DialogHeader>
          <StandardForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}