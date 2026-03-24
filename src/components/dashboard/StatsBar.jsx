import { STATUS_CONFIG } from "@/utils/projectConfig";

export default function StatsBar({ projects }) {
  const total = projects.length;
  const counts = Object.keys(STATUS_CONFIG).reduce((a, k) => ({ ...a, [k]: projects.filter(p => p.status === k).length }), {});

  return (
    <div dir="rtl" className="bg-white border-b flex items-center px-4 gap-4 no-print" style={{ height: 48, minHeight: 48 }}>
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500">סה״כ פרויקטים:</span>
        <span className="font-black text-blue-600" style={{ fontSize: 22, fontFamily: "'Frank Ruhl Libre', serif" }}>{total}</span>
      </div>
      <div className="w-px h-6 bg-gray-200" />
      <div className="flex items-center gap-2 flex-wrap">
        {Object.entries(STATUS_CONFIG).map(([k, v]) => counts[k] > 0 && (
          <span key={k} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ color: v.color, background: v.bg }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: v.color }} />
            {v.label}: {counts[k]}
          </span>
        ))}
      </div>
    </div>
  );
}