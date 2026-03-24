import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { FileText, CheckCircle, Clock, AlertTriangle, Plus, ArrowLeft, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatCard from '../components/dashboard/StatCard';
import RecentPermitCard from '../components/dashboard/RecentPermitCard';

export default function Dashboard() {
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await base44.entities.Permit.list('-updated_date', 50);
      setPermits(data);
      setLoading(false);
    };
    load();
  }, []);

  const stats = {
    total: permits.length,
    approved: permits.filter(p => p.status === 'אושר').length,
    inProgress: permits.filter(p => ['הוגש', 'בבדיקה'].includes(p.status)).length,
    needsFix: permits.filter(p => p.status === 'דרישות תיקון').length,
  };

  const recentPermits = permits.slice(0, 6);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">לוח בקרה</h1>
          <p className="text-muted-foreground mt-1">סקירה כללית של תהליכי הרישוי</p>
        </div>
        <Link to="/permits/new">
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" />
            היתר חדש
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="סה״כ היתרים" value={stats.total} color="primary" />
        <StatCard icon={CheckCircle} label="אושרו" value={stats.approved} color="green" />
        <StatCard icon={Clock} label="בתהליך" value={stats.inProgress} color="yellow" />
        <StatCard icon={AlertTriangle} label="דרישות תיקון" value={stats.needsFix} color="red" />
      </div>

      {/* Recent Permits */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">היתרים אחרונים</h2>
          <Link to="/permits" className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1">
            צפייה בכל
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {recentPermits.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <Building2 className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">אין היתרים עדיין</h3>
            <p className="text-sm text-muted-foreground mb-4">התחל ביצירת היתר בנייה ראשון</p>
            <Link to="/permits/new">
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                יצירת היתר
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPermits.map(permit => (
              <RecentPermitCard key={permit.id} permit={permit} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}