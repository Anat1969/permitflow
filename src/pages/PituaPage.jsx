import ProjectListPage from "@/components/projects/ProjectListPage";
import { DOMAIN_CONFIG } from "@/utils/projectConfig";

export default function PituaPage() {
  return <ProjectListPage domainCfg={DOMAIN_CONFIG.pitua} />;
}