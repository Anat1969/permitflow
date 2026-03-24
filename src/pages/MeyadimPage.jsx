import ProjectListPage from "@/components/projects/ProjectListPage";
import { DOMAIN_CONFIG } from "@/utils/projectConfig";

export default function MeyadimPage() {
  return <ProjectListPage domainCfg={DOMAIN_CONFIG.meyadim} />;
}