import { useNavigate } from 'react-router-dom';
import { db } from "@/lib/db";
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PermitForm from '../components/permits/PermitForm';

export default function PermitNew() {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    await db.Permit.create(data);
    navigate('/permits');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/permits" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowRight className="w-4 h-4" />
        חזרה להיתרים
      </Link>
      
      <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">יצירת היתר חדש</h1>
        <PermitForm onSubmit={handleCreate} onCancel={() => navigate('/permits')} />
      </div>
    </div>
  );
}