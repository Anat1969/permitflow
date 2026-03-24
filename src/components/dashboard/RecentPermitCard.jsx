import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowLeft } from 'lucide-react';
import moment from 'moment';
import StatusBadge from '../permits/StatusBadge';

export default function RecentPermitCard({ permit }) {
  return (
    <Link
      to={`/permits/${permit.id}`}
      className="group bg-card rounded-xl border border-border p-4 hover:shadow-md hover:border-primary/20 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {permit.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{permit.permit_type}</p>
        </div>
        <StatusBadge status={permit.status} />
      </div>
      
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {permit.city}
        </span>
        {permit.submission_date && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {moment(permit.submission_date).format('DD/MM/YY')}
          </span>
        )}
        <ArrowLeft className="w-3 h-3 mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  );
}