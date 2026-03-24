import { DOMAIN_LIST } from "@/utils/projectConfig";

export default function DashboardFooter({ allProjects, projectsByDomain }) {
  const total = allProjects.length;

  return (
    <footer dir="rtl" className="no-print text-white px-4 py-2 flex items-center justify-between flex-wrap gap-2 text-xs" style={{ background: "#1a3060" }}>
      <span className="opacity-70">דשבורד אדריכלית העיר — אגף הנדסה עיריית אשדוד © 2025</span>
      <div className="flex items-center gap-3">
        <span className="font-black text-white">{total} פרויקטים</span>
        {DOMAIN_LIST.map(d => {
          const count = (projectsByDomain[d.id] || []).length;
          return count > 0 ? (
            <span key={d.id} className="opacity-75">{d.icon} {d.label}: {count}</span>
          ) : null;
        })}
      </div>
    </footer>
  );
}