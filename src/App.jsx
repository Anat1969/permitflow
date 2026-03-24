import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

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
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    if (authError.type === 'auth_required') { navigateToLogin(); return null; }
  }

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
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;