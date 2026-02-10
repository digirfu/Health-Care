
import React, { useState } from 'react';
import { useApp } from '../store';
import { UserRole } from '../types';
import { Card, Button, Badge } from './UI';
import { Plus, GripVertical, Settings, Trash2, Play, Save, RotateCcw, ShieldCheck } from 'lucide-react';

export const WorkflowBuilder: React.FC = () => {
  const { workflows, currentUser, updateWorkflow } = useApp();
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [localWorkflows, setLocalWorkflows] = useState(workflows);

  if (currentUser.role !== UserRole.ADMIN) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-24">
        <div className="p-6 bg-rose-50 rounded-full mb-6 border border-rose-100">
          <ShieldCheck size={48} className="text-rose-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Security Alert: Access Denied</h2>
        <p className="text-slate-500 mt-2 text-center max-w-sm font-medium">System Architect privileges are required to modify organizational decision trees.</p>
        <Button variant="outline" className="mt-8 font-black uppercase text-xs" onClick={() => window.location.reload()}>
           Request Elevated Access
        </Button>
      </div>
    );
  }

  const handleCommit = () => {
    updateWorkflow(localWorkflows);
    alert('Organizational schema successfully committed to the global registry.');
  };

  const handleRevert = () => {
    setLocalWorkflows(workflows);
    alert('Local changes reverted to last committed snapshot.');
  };

  const handleRemoveStep = (id: string) => {
    setLocalWorkflows(prev => prev.filter(s => s.id !== id));
    if (activeStepId === id) setActiveStepId(null);
  };

  const handleAddStep = () => {
    const newId = (localWorkflows.length + 1).toString();
    const newStep = {
      id: newId,
      name: `New Logic Step ${newId}`,
      requiredRole: UserRole.FINANCE,
      order: localWorkflows.length + 1
    };
    setLocalWorkflows(prev => [...prev, newStep]);
    setActiveStepId(newId);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Workflow Architect</h1>
          <p className="text-slate-500 font-medium text-sm">Design and deploy high-integrity decision protocols.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="md" className="font-black uppercase text-xs tracking-widest" onClick={handleRevert}>
            <RotateCcw size={16} className="mr-2" /> Revert
          </Button>
          <Button size="md" className="font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/20" onClick={handleCommit}>
            <Save size={16} className="mr-2" /> Commit Schema
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Pipeline Configuration</h3>
            <button onClick={handleAddStep} className="text-indigo-600 text-[10px] font-black flex items-center hover:bg-indigo-50 px-3 py-2 rounded-xl transition-all uppercase tracking-widest">
              <Plus size={14} className="mr-2" /> Add Decision Point
            </button>
          </div>

          <div className="space-y-4">
            {localWorkflows.map((step, idx) => (
              <div 
                key={step.id}
                onClick={() => setActiveStepId(step.id)}
                className={`group flex items-center p-6 rounded-3xl border-2 transition-all cursor-pointer ${
                  activeStepId === step.id ? 'bg-white border-indigo-600 shadow-2xl ring-8 ring-indigo-50' : 'bg-white border-slate-100 hover:border-indigo-200'
                }`}
              >
                <div className="mr-6 text-slate-200 group-hover:text-indigo-300 transition-colors">
                  <GripVertical size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 uppercase tracking-widest">PHASE 0{idx + 1}</span>
                    <h4 className="font-black text-slate-900 uppercase text-xs tracking-tight">{step.name}</h4>
                  </div>
                  <div className="flex items-center mt-3 space-x-4">
                    <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 text-[9px] font-black uppercase tracking-tighter">
                      AUTHORIZED: {step.requiredRole}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all" onClick={(e) => { e.stopPropagation(); handleRemoveStep(step.id); }}>
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <Card title="Node Attributes">
            {activeStepId ? (
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Label Identifier</label>
                  <input 
                    type="text" 
                    value={localWorkflows.find(w => w.id === activeStepId)?.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLocalWorkflows(prev => prev.map(s => s.id === activeStepId ? { ...s, name: val } : s));
                    }}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Signing Authority</label>
                  <select 
                    value={localWorkflows.find(w => w.id === activeStepId)?.requiredRole}
                    onChange={(e) => {
                      const val = e.target.value as UserRole;
                      setLocalWorkflows(prev => prev.map(s => s.id === activeStepId ? { ...s, requiredRole: val } : s));
                    }}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-slate-900 appearance-none outline-none focus:ring-4 focus:ring-indigo-500/10"
                  >
                    {Object.values(UserRole).map(role => (
                      <option key={role} value={role}>{role} Delegation</option>
                    ))}
                  </select>
                </div>
                <Button className="w-full h-12 uppercase text-xs font-black tracking-[0.2em]" onClick={() => setActiveStepId(null)}>Apply Parameters</Button>
              </div>
            ) : (
              <div className="py-24 text-center">
                <Settings size={40} className="mx-auto text-slate-200 mb-6 animate-spin-slow" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Select Segment to Architect</p>
                <style>{`
                  @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                  .animate-spin-slow {
                    animation: spin-slow 15s linear infinite;
                  }
                `}</style>
              </div>
            )}
          </Card>

          <Card title="Logic Flow Preview">
            <div className="space-y-8 mt-2">
              <div className="flex items-center justify-between text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">
                <div className="flex items-center"><Play size={12} className="mr-2 fill-indigo-600" /> Active Schema</div>
                <Badge className="bg-emerald-50 text-emerald-600 border-none">VERIFIED</Badge>
              </div>
              <div className="relative pl-8 space-y-6">
                <div className="absolute left-[3px] top-1.5 bottom-1.5 w-[2px] bg-slate-100"></div>
                {localWorkflows.map((step) => (
                  <div key={step.id} className="relative flex items-center">
                    <div className="absolute left-[-32px] w-4 h-4 rounded-full bg-white border-4 border-indigo-500 shadow-sm"></div>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{step.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
