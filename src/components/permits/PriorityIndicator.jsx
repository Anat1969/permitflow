import { cn } from '@/lib/utils';

const priorityConfig = {
  'נמוכה': 'bg-slate-300',
  'רגילה': 'bg-blue-400',
  'גבוהה': 'bg-amber-400',
  'דחופה': 'bg-red-500',
};

export default function PriorityIndicator({ priority }) {
  if (!priority) return null;
  
  return (
    <span className={cn("w-2 h-2 rounded-full flex-shrink-0", priorityConfig[priority] || 'bg-slate-300')} 
      title={`עדיפות: ${priority}`} 
    />
  );
}