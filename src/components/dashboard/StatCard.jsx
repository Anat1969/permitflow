import { cn } from '@/lib/utils';

export default function StatCard({ icon: Icon, label, value, color = "primary", trend }) {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    green: "bg-emerald-50 text-emerald-600",
    yellow: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className="text-xs text-muted-foreground mt-2">{trend}</p>
          )}
        </div>
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", colorMap[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}