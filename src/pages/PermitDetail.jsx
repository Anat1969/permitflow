import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from "@/lib/db";
import { ArrowRight, Edit2, Trash2, MapPin, User, Phone, Calendar, Ruler, Wallet, Building, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import moment from 'moment';
import StatusBadge from '../components/permits/StatusBadge';
import PriorityIndicator from '../components/permits/PriorityIndicator';
import StageTimeline from '../components/permits/StageTimeline';
import PermitForm from '../components/permits/PermitForm';

export default function PermitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [permit, setPermit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const loadPermit = async () => {
    const permits = await db.Permit.filter({ id });
    if (permits.length > 0) {
      setPermit(permits[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPermit();
  }, [id]);

  const handleUpdate = async (data) => {
    await db.Permit.update(id, data);
    setEditing(false);
    loadPermit();
  };

  const handleDelete = async () => {
    await db.Permit.delete(id);
    navigate('/permits');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!permit) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">היתר לא נמצא</p>
        <Link to="/permits" className="text-primary mt-2 inline-block">חזרה להיתרים</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <Link to="/permits" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowRight className="w-4 h-4" />
        חזרה להיתרים
      </Link>

      {/* Header Card */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {permit.images?.length > 0 && (
          <div className="h-56 sm:h-72 overflow-hidden">
            <img src={permit.images[0]} alt={permit.title} className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge status={permit.status} size="md" />
                <PriorityIndicator priority={permit.priority} />
                <span className="text-sm text-muted-foreground">{permit.permit_type}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{permit.title}</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => setEditing(true)}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>מחיקת היתר</AlertDialogTitle>
                    <AlertDialogDescription>האם אתה בטוח שברצונך למחוק את ההיתר? פעולה זו לא ניתנת לביטול.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-row-reverse gap-2">
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">מחק</AlertDialogAction>
                    <AlertDialogCancel>ביטול</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {permit.description && (
            <p className="text-muted-foreground leading-relaxed mb-6">{permit.description}</p>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <InfoItem icon={MapPin} label="כתובת" value={`${permit.address}, ${permit.city}`} />
            {permit.applicant_name && <InfoItem icon={User} label="מבקש" value={permit.applicant_name} />}
            {permit.applicant_phone && <InfoItem icon={Phone} label="טלפון" value={permit.applicant_phone} />}
            {permit.architect_name && <InfoItem icon={Building} label="אדריכל" value={permit.architect_name} />}
            {permit.submission_date && <InfoItem icon={Calendar} label="תאריך הגשה" value={moment(permit.submission_date).format('DD/MM/YYYY')} />}
            {permit.expected_approval_date && <InfoItem icon={Calendar} label="אישור צפוי" value={moment(permit.expected_approval_date).format('DD/MM/YYYY')} />}
            {permit.area_sqm && <InfoItem icon={Ruler} label="שטח" value={`${permit.area_sqm} מ"ר`} />}
            {permit.estimated_cost && <InfoItem icon={Wallet} label="עלות משוערת" value={`₪${permit.estimated_cost.toLocaleString()}`} />}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
        <h2 className="text-lg font-bold text-foreground mb-6">מעקב שלבים</h2>
        <StageTimeline currentStage={permit.current_stage || 'הכנת מסמכים'} />
      </div>

      {/* Images Gallery */}
      {permit.images?.length > 1 && (
        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
          <h2 className="text-lg font-bold text-foreground mb-4">תמונות</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {permit.images.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="rounded-xl overflow-hidden aspect-video hover:opacity-90 transition-opacity">
                <img src={url} alt={`תמונה ${i + 1}`} className="w-full h-full object-cover" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Documents */}
      {permit.documents?.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
          <h2 className="text-lg font-bold text-foreground mb-4">מסמכים</h2>
          <div className="space-y-2">
            {permit.documents.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-xl bg-muted hover:bg-accent transition-colors text-sm">
                <ExternalLink className="w-4 h-4 text-primary" />
                <span>מסמך {i + 1}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {permit.notes && (
        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
          <h2 className="text-lg font-bold text-foreground mb-3">הערות</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{permit.notes}</p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>עריכת היתר</DialogTitle>
          </DialogHeader>
          <PermitForm permit={permit} onSubmit={handleUpdate} onCancel={() => setEditing(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}