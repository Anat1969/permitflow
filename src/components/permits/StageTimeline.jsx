import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const stages = [
  'הכנת מסמכים',
  'הגשה לוועדה מקומית',
  'בדיקת תכנית',
  'שימוע/דיון',
  'תנאים מוקדמים',
  'אישור סופי',
];

export default function StageTimeline({ currentStage }) {
  const currentIndex = stages.indexOf(currentStage);

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={stage} className="flex flex-col items-center relative flex-1">
              {/* Connector line */}
              {index < stages.length - 1 && (
                <div className={cn(
                  "absolute top-4 right-1/2 w-full h-0.5",
                  "transform -translate-x-1/2",
                  isCompleted ? "bg-primary" : "bg-border"
                )} style={{ right: '50%', width: 'calc(100%)' }} />
              )}
              
              {/* Circle */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center relative z-10 text-xs font-bold transition-all duration-300",
                isCompleted && "bg-primary text-primary-foreground shadow-md",
                isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-lg",
                !isCompleted && !isCurrent && "bg-muted text-muted-foreground border-2 border-border"
              )}>
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              
              {/* Label */}
              <span className={cn(
                "text-xs mt-2 text-center max-w-[80px] leading-tight",
                isCurrent ? "font-semibold text-foreground" : "text-muted-foreground"
              )}>
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}