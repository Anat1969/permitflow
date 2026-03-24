import { cn } from '@/lib/utils';

const statusConfig = {
  'טיוטה': { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400' },
  'הוגש': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  'בבדיקה': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'דרישות תיקון': { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
  'אושר': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'נדחה': { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
};

export default function StatusBadge({ status, size = "sm" }) {
  const config = statusConfig[status] || statusConfig['טיוטה'];
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full font-medium",
      config.bg, config.text,
      size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {status}
    </span>
  );
}