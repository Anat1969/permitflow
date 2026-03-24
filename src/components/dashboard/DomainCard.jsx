import { Link } from "react-router-dom";
import { STATUS_CONFIG } from "@/utils/projectConfig";

export default function DomainCard({ domainCfg, projects, onSubClick }) {
  const total = projects.length;

  const getSubCount = (category, sub) => {
    if (domainCfg.id === "binui") {
      return projects.filter(p => p.category === category && p.sub === sub).length;
    }
    return projects.filter(p => p.category === category && p.sub === sub).length;
  };

  const getCatCount = (category) => projects.filter(p => p.category === category).length;

  return (
    <div className="rounded-2xl border overflow-hidden flex flex-col h-full" style={{ borderColor: `${domainCfg.color}30` }}>
      {/* Header */}
      <Link to={domainCfg.route}>
        <div className="p-3 flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity" style={{ background: domainCfg.color }}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{domainCfg.icon}</span>
            <div>
              <div className="text-white font-extrabold text-base" style={{ fontFamily: "'Frank Ruhl Libre', serif" }}>
                {domainCfg.label}
              </div>
              <div className="text-white/60 text-xs">{domainCfg.description}</div>
            </div>
          </div>
          <div className="font-black text-white/20 text-4xl leading-none" style={{ fontFamily: "'Frank Ruhl Libre', serif" }}>
            {total}
          </div>
        </div>
      </Link>

      {/* Categories */}
      <div className="flex-1 p-2 space-y-2 bg-white">
        {domainCfg.categories.map(cat => (
          <div key={cat.label}>
            <div className="flex items-center gap-2 px-1 mb-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{cat.label}</span>
              <span className="text-xs text-gray-400">({getCatCount(cat.label)})</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {cat.subs.length > 0 ? cat.subs.map(sub => {
                const count = getSubCount(cat.label, sub);
                return (
                  <button
                    key={sub}
                    onClick={() => onSubClick(domainCfg, cat.label, sub)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border transition-all hover:shadow-sm"
                    style={{
                      borderColor: `${domainCfg.color}40`,
                      color: domainCfg.color,
                      background: count > 0 ? `${domainCfg.color}10` : "transparent"
                    }}
                  >
                    {sub}
                    {count > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-white text-xs font-black" style={{ background: domainCfg.color }}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              }) : (
                <button
                  onClick={() => onSubClick(domainCfg, cat.label, cat.label)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border transition-all hover:shadow-sm"
                  style={{
                    borderColor: `${domainCfg.color}40`,
                    color: domainCfg.color,
                    background: getCatCount(cat.label) > 0 ? `${domainCfg.color}10` : "transparent"
                  }}
                >
                  {cat.label}
                  {getCatCount(cat.label) > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-white text-xs font-black" style={{ background: domainCfg.color }}>
                      {getCatCount(cat.label)}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}