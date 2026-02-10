
import React, { useState } from 'react';
import { useApp } from '../store';
import { RequestStatus, Priority, UserRole, Request } from '../types';
import { Card, Badge, Button, EmptyState } from './UI';
import { motion, AnimatePresence } from 'framer-motion';
import { STATUS_COLORS } from '../constants';
import { Filter, Search, Plus, Eye, Box, Laptop, Users, Megaphone, CheckCircle2, ShieldAlert, Briefcase, Landmark, HardHat, FileLock2, X, DollarSign, FileText } from 'lucide-react';
import { RequestDetails } from './RequestDetails';

export const RequestManagement: React.FC = () => {
  const { requests, currentUser, addRequest, selectedRequestId, setSelectedRequestId, workflows } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Request Form State
  const [newReq, setNewReq] = useState({
    title: '',
    type: 'Professional Services',
    amount: '',
    description: '',
    priority: Priority.MEDIUM
  });

  const getTypeIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('infrastructure')) return <Box className="text-indigo-500" size={16} />;
    if (t.includes('license') || t.includes('saas')) return <Laptop className="text-blue-500" size={16} />;
    if (t.includes('marketing')) return <Megaphone className="text-emerald-500" size={16} />;
    if (t.includes('resources') || t.includes('hr')) return <Users className="text-amber-500" size={16} />;
    if (t.includes('facilities') || t.includes('maintenance')) return <HardHat className="text-orange-500" size={16} />;
    if (t.includes('compliance') || t.includes('security')) return <ShieldAlert className="text-rose-500" size={16} />;
    if (t.includes('legal')) return <FileLock2 className="text-violet-500" size={16} />;
    if (t.includes('professional') || t.includes('consult')) return <Briefcase className="text-slate-600" size={16} />;
    return <FileText className="text-slate-400" size={16} />;
  };

  const filteredRequests = requests.filter(req => {
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    const matchesSearch = 
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `REQ-${Math.floor(Math.random() * 900 + 100)}`;
    const request: Request = {
      id: newId,
      title: newReq.title || 'Untitled Request',
      description: newReq.description || 'No description provided.',
      type: newReq.type,
      status: RequestStatus.PENDING_MANAGER,
      priority: newReq.priority,
      amount: Number(newReq.amount) || 0,
      requester: currentUser.name,
      currentAssigneeRole: workflows[1]?.requiredRole || UserRole.MANAGER,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      history: []
    };
    addRequest(request);
    setIsModalOpen(false);
    setSelectedRequestId(newId);
  };

  if (selectedRequestId) {
    return (
      <RequestDetails 
        requestId={selectedRequestId} 
        onBack={() => setSelectedRequestId(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Operational Pipeline</h1>
          <p className="text-slate-500 font-medium text-sm">Review, authorize, and audit organizational expenditure.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="md:w-auto shadow-xl shadow-indigo-600/30 font-black uppercase text-xs tracking-widest">
          <Plus size={18} className="mr-2" />
          Raise Requisition
        </Button>
      </div>

      <Card className="shadow-lg border-slate-200/60">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Query registry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50/80 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-5 pr-12 py-4 bg-slate-50/80 border border-slate-200 rounded-2xl text-sm appearance-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none cursor-pointer font-black text-slate-700 uppercase tracking-tight min-w-[200px]"
              >
                <option value="all">Lifecycle: All Stages</option>
                {Object.values(RequestStatus).map(s => (
                  <option key={s} value={s}>{s.toUpperCase()}</option>
                ))}
              </select>
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">
                <th className="px-6 py-5">Record</th>
                <th className="px-6 py-5">Classification</th>
                <th className="px-6 py-5 text-right">Commitment (USD)</th>
                <th className="px-6 py-5 text-center">Stage</th>
                <th className="px-6 py-5 text-center">Next Authority</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="group hover:bg-indigo-50/30 transition-all cursor-pointer" onClick={() => setSelectedRequestId(req.id)}>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                         <span className="font-black text-slate-900 text-xs tracking-tight bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{req.id}</span>
                         {req.priority === Priority.CRITICAL && <Badge className="bg-rose-600 text-white text-[8px] font-black border-none px-1.5 rounded-sm animate-pulse">CRITICAL</Badge>}
                      </div>
                      <span className="text-slate-800 font-bold truncate max-w-[280px] mt-2 group-hover:text-indigo-600 transition-colors">{req.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">{getTypeIcon(req.type)}</div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{req.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right font-mono font-black text-slate-900 text-base">
                    ${req.amount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-6 text-center">
                    <Badge className={`${STATUS_COLORS[req.status]} font-black text-[9px] uppercase px-3 py-1 border-2 shadow-sm`}>{req.status}</Badge>
                  </td>
                  <td className="px-6 py-6 text-center">
                    {req.currentAssigneeRole ? (
                      <div className={`inline-flex items-center px-3 py-2 rounded-xl text-[9px] font-black uppercase border-2 transition-all ${req.currentAssigneeRole === currentUser.role ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                        {req.currentAssigneeRole}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center text-emerald-500 bg-emerald-50 w-10 h-10 rounded-full mx-auto border-2 border-emerald-100">
                        <CheckCircle2 size={24} />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => setSelectedRequestId(req.id)}
                      className="p-3.5 text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-90"
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRequests.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center opacity-30 text-center">
             <Landmark size={64} className="mb-6 text-slate-300" />
             <p className="text-xl font-black uppercase tracking-[0.3em] text-slate-500">Record Not Found</p>
          </div>
        )}
      </Card>

      {/* Modal - Simulated Create Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden relative"
            >
              <div className="bg-slate-900 p-6 flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-500 rounded-lg">
                    <Plus size={20} />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight">New Expenditure Requisition</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Requirement Summary</label>
                    <input 
                      required
                      type="text" 
                      value={newReq.title}
                      onChange={(e) => setNewReq({...newReq, title: e.target.value})}
                      placeholder="e.g., Annual Server Renewal - Region East"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Budget Line Class</label>
                    <select 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none"
                      value={newReq.type}
                      onChange={(e) => setNewReq({...newReq, type: e.target.value})}
                    >
                      <option>Infrastructure</option>
                      <option>SaaS License</option>
                      <option>Marketing</option>
                      <option>Human Resources</option>
                      <option>Legal</option>
                      <option>Facilities</option>
                      <option>Professional Services</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Estimated Commitment (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        required
                        type="number" 
                        value={newReq.amount}
                        onChange={(e) => setNewReq({...newReq, amount: e.target.value})}
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Business Justification</label>
                    <textarea 
                      required
                      value={newReq.description}
                      onChange={(e) => setNewReq({...newReq, description: e.target.value})}
                      placeholder="Detail the operational necessity..."
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none h-24 resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-4">
                  <Button variant="outline" className="flex-1 py-4 uppercase text-xs font-black tracking-widest" onClick={() => setIsModalOpen(false)}>
                    Void Creation
                  </Button>
                  <Button type="submit" className="flex-1 py-4 uppercase text-xs font-black tracking-widest shadow-xl shadow-indigo-500/20">
                    Submit for Review
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
