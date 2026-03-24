import ProjectListPage from "@/components/projects/ProjectListPage";
import { DOMAIN_CONFIG } from "@/utils/projectConfig";

export default function BinuiPage() {
  return <ProjectListPage domainCfg={DOMAIN_CONFIG.binui} />;
}