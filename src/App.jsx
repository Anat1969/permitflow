import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';

import Dashboard from './pages/Dashboard';
import BinuiPage from './pages/BinuiPage';
import BinuiDetail from './pages/BinuiDetail';
import PituaPage from './pages/PituaPage';
import MeyadimPage from './pages/MeyadimPage';
import PeulotPage from './pages/PeulotPage';
import AIPage from './pages/AIPage';
import GenericDetail from './pages/GenericDetail';
import PlanInstructions from './pages/PlanInstructions';

const AuthenticatedApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/binui" element={<BinuiPage />} />
      <Route path="/binui/:id" element={<BinuiDetail />} />
      <Route path="/pitua" element={<PituaPage />} />
      <Route path="/pitua/:id" element={<GenericDetail domainId="pitua" />} />
      <Route path="/meyadim" element={<MeyadimPage />} />
      <Route path="/meyadim/:id" element={<GenericDetail domainId="meyadim" />} />
      <Route path="/peulot" element={<PeulotPage />} />
      <Route path="/peulot/:id" element={<GenericDetail domainId="peulot" />} />
      <Route path="/apps" element={<AIPage />} />
      <Route path="/apps/:id" element={<GenericDetail domainId="ai" />} />
      <Route path="/agents" element={<AIPage />} />
      <Route path="/agents/:id" element={<GenericDetail domainId="ai" />} />
      <Route path="/plan-instructions" element={<PlanInstructions />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;