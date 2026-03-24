import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import TopNav from "@/components/layout/TopNav";
import StatsBar from "@/components/dashboard/StatsBar";
import DomainCard from "@/components/dashboard/DomainCard";
import DashboardFooter from "@/components/dashboard/DashboardFooter";
import ProjectPanel from "@/components/dashboard/ProjectPanel";
import { DOMAIN_LIST } from "@/utils/projectConfig";

export default function Dashboard() {
  const [binuiProjects, setBinuiProjects] = useState([]);
  const [genericProjects, setGenericProjects] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [panel, setPanel] = useState(null); // { domainCfg, category, sub }

  const load = useCallback(async () => {
    const [bp, gp] = await Promise.all([
      base44.entities.BinuiProject.list(),
      base44.entities.GenericProject.list(),
    ]);
    setBinuiProjects(bp);
    setGenericProjects(gp);
  }, []);

  useEffect(() => { load(); }, [refreshKey]);

  const getProjects = (domainCfg) => {
    if (domainCfg.id === "binui") return binuiProjects;
    return genericProjects.filter(p => p.domain === domainCfg.domain);
  };

  const allProjects = [...binuiProjects, ...genericProjects];

  const projectsByDomain = DOMAIN_LIST.reduce((a, d) => ({ ...a, [d.id]: getProjects(d) }), {});

  const [binui, pitua, meyadim, peulot, ai] = DOMAIN_LIST;

  return (
    <div dir="rtl" className="min-h-screen flex flex-col" style={{ background: "#F4F1EB" }}>
      <TopNav />
      <StatsBar projects={allProjects} />

      <main className="flex-1 p-3 grid gap-3" style={{ gridTemplateRows: "1fr 1fr" }}>
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <DomainCard domainCfg={binui} projects={getProjects(binui)} onSubClick={(d, c, s) => setPanel({ domainCfg: d, category: c, sub: s })} />
          <DomainCard domainCfg={pitua} projects={getProjects(pitua)} onSubClick={(d, c, s) => setPanel({ domainCfg: d, category: c, sub: s })} />
        </div>
        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <DomainCard domainCfg={meyadim} projects={getProjects(meyadim)} onSubClick={(d, c, s) => setPanel({ domainCfg: d, category: c, sub: s })} />
          <DomainCard domainCfg={peulot} projects={getProjects(peulot)} onSubClick={(d, c, s) => setPanel({ domainCfg: d, category: c, sub: s })} />
          <DomainCard domainCfg={ai} projects={getProjects(ai)} onSubClick={(d, c, s) => setPanel({ domainCfg: d, category: c, sub: s })} />
        </div>
      </main>

      <DashboardFooter allProjects={allProjects} projectsByDomain={projectsByDomain} />

      {panel && (
        <ProjectPanel
          domainCfg={panel.domainCfg}
          category={panel.category}
          sub={panel.sub}
          onClose={() => setPanel(null)}
          onRefresh={() => setRefreshKey(k => k + 1)}
        />
      )}
    </div>
  );
}