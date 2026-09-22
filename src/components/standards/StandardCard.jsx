import { ExternalLink, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryColors = {
  'בטיחות אש': 'bg-red-50 text-red-700 border-red-200',
  'נגישות': 'bg-blue-50 text-blue-700 border-blue-200',
  'בידוד תרמי': 'bg-amber-50 text-amber-700 border-amber-200',
  'בטיחות מבנית': 'bg-orange-50 text-orange-700 border-orange-200',
  'אינסטלציה': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'חשמל': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'איכות הסביבה': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'תכנון ובנייה': 'bg-violet-50 text-violet-700 border-violet-200',
  'אחר': 'bg-slate-50 text-slate-700 border-slate-200',
};

export default function StandardCard({ standard }) {
  const colorClass = categoryColors[standard.category] || categoryColors['אחר'];

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {standard.image_url && (
        <div className="h-44 overflow-hidden">
          <img
            src={standard.image_url}
            alt={standard.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", colorClass)}>
                {standard.category}
              </span>
              {standard.is_mandatory && (
                <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  חובה
                </span>
              )}
            </div>
            <h3 className="font-bold text-foreground text-base leading-tight">{standard.title}</h3>
            {standard.standard_number && (
              <p className="text-xs text-muted-foreground mt-1">תקן מס׳ {standard.standard_number}</p>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
          {standard.description}
        </p>

        {standard.link && (
          <a
            href={standard.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            צפייה בתקן המלא
          </a>
        )}
      </div>
    </div>
  );
}