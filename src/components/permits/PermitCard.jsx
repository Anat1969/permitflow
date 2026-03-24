import { Link } from 'react-router-dom';
import { MapPin, Calendar, User, Ruler, ArrowLeft } from 'lucide-react';
import moment from 'moment';
import StatusBadge from './StatusBadge';
import PriorityIndicator from './PriorityIndicator';

export default function PermitCard({ permit }) {
  return (
    <Link
      to={`/permits/${permit.id}`}
      className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300"
    >
      {/* Image strip */}
      {permit.images?.length > 0 && (
        <div className="h-40 overflow-hidden">
          <img
            src={permit.images[0]}
            alt={permit.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <PriorityIndicator priority={permit.priority} />
              <span className="text-xs text-muted-foreground">{permit.permit_type}</span>
            </div>
            <h3 className="font-bold text-foreground text-base truncate group-hover:text-primary transition-colors">
              {permit.title}
            </h3>
          </div>
          <StatusBadge status={permit.status} />
        </div>

        {permit.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{permit.description}</p>
        )}

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {permit.address}, {permit.city}
          </span>
          {permit.applicant_name && (
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {permit.applicant_name}
            </span>
          )}
          {permit.area_sqm && (
            <span className="flex items-center gap-1">
              <Ruler className="w-3.5 h-3.5" />
              {permit.area_sqm} מ"ר
            </span>
          )}
          {permit.submission_date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {moment(permit.submission_date).format('DD/MM/YYYY')}
            </span>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            שלב: {permit.current_stage || 'הכנת מסמכים'}
          </span>
          <ArrowLeft className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </Link>
  );
}