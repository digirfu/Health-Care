
import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './store';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { RequestManagement } from './components/RequestManagement';
import { WorkflowBuilder } from './components/WorkflowBuilder';
import { AuditLog } from './components/AuditLog';
import { Reports } from './components/Reports';

const AppContent: React.FC = () => {
  const { activeView, setActiveView } = useApp();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'requests': return <RequestManagement />;
      case 'workflows': return <WorkflowBuilder />;
      case 'audit': return <AuditLog />;
      case 'reports': return <Reports />;
      default: return <Dashboard />;
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <div className="w-12 h-12 bg-indigo-500 rounded-xl animate-bounce mb-6 flex items-center justify-center font-bold text-2xl italic">O</div>
        <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="bg-indigo-500 h-full animate-[loading_1.5s_ease-in-out_infinite]"></div>
        </div>
        <p className="mt-4 text-slate-500 text-xs font-bold uppercase tracking-widest animate-pulse">OmniFlow Hydrating Systems...</p>
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {renderView()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
