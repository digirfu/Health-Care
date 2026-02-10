
import React from 'react';
import { useApp } from '../store';
import { RequestStatus, Priority, UserRole } from '../types';
import { Card, Badge } from './UI';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, TrendingUp, Zap, Calendar, Activity, DollarSign, Target, FileText, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, AreaChart, Area, CartesianGrid } from 'recharts';

export const Dashboard: React.FC = () => {
  const { requests, currentUser, auditLogs, setActiveView, setSelectedRequestId } = useApp();

  const isRequester = currentUser.role === UserRole.REQUESTER;
  const isAdmin = currentUser.role === UserRole.ADMIN;

  const stats = [
    { label: 'Action Required', value: requests.filter(r => r.currentAssigneeRole === currentUser.role).length, icon: <Clock className="text-amber-500" />, trend: 'Needs focus', color: '#f59e0b' },
    { label: 'Cycle Velocity', value: '1.4d', icon: <Activity className="text-emerald-500" />, trend: '-12% faster', color: '#10b981' },
    { label: 'Current Exposure', value: `$${(requests.filter(r => r.status.includes('Pending')).reduce((acc, r) => acc + (r.amount || 0), 0) / 1000).toFixed(1)}k`, icon: <DollarSign className="text-indigo-500" />, trend: 'Pending Auth', color: '#6366f1' },
    { label: 'Risk Flags', value: requests.filter(r => r.priority === Priority.CRITICAL).length, icon: <AlertCircle className="text-rose-500" />, trend: 'Audit alert', color: '#f43f5e' },
  ];

  const statusData = [
    { name: 'Approved', value: requests.filter(r => r.status === RequestStatus.APPROVED).length, color: '#10b981' },
    { name: 'Pending', value: requests.filter(r => r.status.includes('Pending')).length, color: '#f59e0b' },
    { name: 'Rejected', value: requests.filter(r => r.status === RequestStatus.REJECTED).length, color: '#f43f5e' },
    { name: 'Draft', value: requests.filter(r => r.status === RequestStatus.DRAFT).length, color: '#94a3b8' },
  ];

  const barData = [
    { name: 'Mon', count: 12, value: 4500 },
    { name: 'Tue', count: 19, value: 8200 },
    { name: 'Wed', count: 15, value: 3100 },
    { name: 'Thu', count: 22, value: 12400 },
    { name: 'Fri', count: 30, value: 15000 },
    { name: 'Sat', count: 5, value: 1200 },
    { name: 'Sun', count: 2, value: 400 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
           <div className="h-12 w-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-xl border border-slate-700 shadow-xl">
             {currentUser.name.charAt(0)}
           </div>
           <div>
             <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Enterprise Command Hub</h1>
             <p className="text-slate-500 text-sm mt-1 font-medium italic">Authorized Access: {currentUser.role} Level • Unit: Global Operations</p>
           </div>
        </div>
        <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Real-time Sync Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="hover:shadow-xl transition-all duration-300 group border-b-4 relative overflow-hidden cursor-pointer" style={{borderBottomColor: stat.color}} onClick={() => setActiveView('requests')}>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 {React.cloneElement(stat.icon as React.ReactElement<any>, { size: 64 })}
              </div>
              <div className="flex items-start justify-between relative">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">{stat.label}</p>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h2>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">{stat.icon}</div>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center text-[10px] font-bold text-emerald-600">
                  <TrendingUp size={12} className="mr-1" />
                  <span>{stat.trend}</span>
                </div>
                <span className="text-[9px] font-black text-slate-300 uppercase">Snapshot</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {(!isRequester || isAdmin) && (
            <motion.div variants={itemVariants}>
              <Card title="Approval Pipeline Throughput">
                <div className="h-80 w-full mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={barData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={10} fontStyle="bold" />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} fontStyle="bold" />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                      />
                      <Area name="Budget Commit (USD)" type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                   <div className="flex items-center space-x-2">
                     <Zap size={14} className="text-amber-500" />
                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">AI Insight: Tuesday saw peak expenditure due to Cloud License renewals.</span>
                   </div>
                   <button onClick={() => setActiveView('audit')} className="text-[10px] font-black text-indigo-600 uppercase border-b border-indigo-200 hover:text-indigo-800">View Detailed Log</button>
                </div>
              </Card>
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <Card title={isRequester ? "My Active Requests" : "Critical Workflow Queue"}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-3 font-bold text-[10px] uppercase text-slate-400 tracking-widest">ID</th>
                      <th className="pb-3 font-bold text-[10px] uppercase text-slate-400 tracking-widest">Title</th>
                      <th className="pb-3 font-bold text-[10px] uppercase text-slate-400 tracking-widest">Status</th>
                      <th className="pb-3 text-right font-bold text-[10px] uppercase text-slate-400 tracking-widest">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {requests
                      .filter(r => isRequester ? r.requester === currentUser.name : (r.priority === Priority.CRITICAL || r.amount! > 10000))
                      .slice(0, 5).map((req) => (
                      <tr key={req.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="py-4 font-bold text-slate-900">{req.id}</td>
                        <td className="py-4">
                          <p className="font-semibold text-slate-700">{req.title}</p>
                          <p className="text-xs text-slate-400">By {req.requester}</p>
                        </td>
                        <td className="py-4">
                           <Badge className="bg-slate-50 border-slate-200 text-slate-600 text-[10px] uppercase font-bold">
                             {req.status}
                           </Badge>
                        </td>
                        <td className="py-4 text-right">
                          <button 
                            onClick={() => { setSelectedRequestId(req.id); setActiveView('requests'); }}
                            className="flex items-center justify-end w-full text-indigo-600 font-bold hover:text-indigo-800 transition-colors text-xs uppercase"
                          >
                            Inspect <ChevronRight size={14} className="ml-1" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <Card title="Executive Announcements">
              <div className="space-y-4">
                <div className="p-4 bg-slate-900 rounded-2xl text-white relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 opacity-10 transform group-hover:scale-110 transition-transform text-white">
                     <Target size={80} />
                  </div>
                  <div className="relative">
                    <Badge className="bg-indigo-500 text-white border-none text-[8px] font-black mb-3 uppercase tracking-widest">Fiscal Cycle End</Badge>
                    <p className="text-xs font-bold leading-snug">FY25 Budgeting cycle starts in 14 days. Ensure all "Draft" requests are finalized or voided by EOM.</p>
                  </div>
                </div>
                
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                   <div className="flex items-center space-x-2 mb-2">
                     <Calendar size={14} className="text-amber-600" />
                     <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Policy Update</span>
                   </div>
                   <p className="text-[11px] text-amber-900 leading-tight">Travel per-diem rates indexed to inflation for EMEA regions. Effective immediately.</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card title="Activity Stream">
              <div className="space-y-6 max-h-[460px] overflow-y-auto pr-3 custom-scrollbar">
                {auditLogs.length > 0 ? auditLogs.slice(0, 10).map(log => (
                  <div key={log.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full before:bg-indigo-500 after:absolute after:left-[3px] after:top-5 after:bottom-[-24px] after:w-[1px] after:bg-slate-200 last:after:hidden group">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tighter group-hover:text-indigo-600 transition-colors">{log.action}</p>
                      <span className="text-[8px] text-slate-400 font-bold">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{log.details}</p>
                  </div>
                )) : (
                  <div className="py-20 flex flex-col items-center justify-center opacity-30 text-center">
                    <Activity size={40} className="mb-4 text-slate-300" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Awaiting Events</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
