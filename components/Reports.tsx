
import React from 'react';
import { Card, Badge } from './UI';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend } from 'recharts';
import { Zap, Clock, UserCheck, ShieldCheck, Sparkles, TrendingDown, AlertTriangle, Target, Globe, Landmark, TrendingUp, Info } from 'lucide-react';

export const Reports: React.FC = () => {
  const chartData = [
    { month: 'Jul', approvals: 45, rejections: 5, pending: 10, value: 120000 },
    { month: 'Aug', approvals: 52, rejections: 8, pending: 15, value: 154000 },
    { month: 'Sep', approvals: 48, rejections: 12, pending: 22, value: 142000 },
    { month: 'Oct', approvals: 61, rejections: 6, pending: 18, value: 210000 },
    { month: 'Nov', approvals: 55, rejections: 9, pending: 25, value: 188000 },
    { month: 'Dec', approvals: 67, rejections: 4, pending: 12, value: 245000 },
  ];

  const bottleneckData = [
    { name: 'Legal MSA Review', hours: 72, color: '#f43f5e', count: 12 },
    { name: 'Dept Manager', hours: 42, color: '#4f46e5', count: 45 },
    { name: 'Finance Verification', hours: 18, color: '#10b981', count: 32 },
    { name: 'C-Suite Exec Review', hours: 12, color: '#f59e0b', count: 8 },
  ];

  const slaPerformance = [
    { dept: 'IT Ops', met: 98, color: '#4f46e5' },
    { dept: 'Marketing', met: 82, color: '#10b981' },
    { dept: 'HR & Legal', met: 91, color: '#f59e0b' },
    { dept: 'Facilities', met: 94, color: '#ec4899' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Global Intelligence & Analytics</h1>
          <p className="text-slate-500 font-bold text-sm mt-2 flex items-center">
            <Globe size={16} className="mr-2 text-indigo-500" />
            Consolidated Financial Performance • Fiscal Year 2024 (Q1-Q4)
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-xl">
             Export Executive Summary (PDF)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Ops Velocity', val: '94.8%', icon: <Zap size={20} className="text-emerald-500" />, desc: 'System Throughput vs Target', trend: '+2.4%' },
          { label: 'Decision Latency', val: '1.2 days', icon: <Clock size={20} className="text-indigo-500" />, desc: 'Median Stage Duration', trend: '-0.3d' },
          { label: 'Audit Compliance', val: '99.9%', icon: <ShieldCheck size={20} className="text-amber-500" />, desc: 'Integrity Sign-off Rate', trend: 'Stable' },
          { label: 'Avoided Leakage', val: '$142k', icon: <Landmark size={20} className="text-rose-500" />, desc: 'Recovered Overspend', trend: 'Monthly' },
        ].map((kpi, i) => (
          <Card key={i} className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-t-2 hover:border-indigo-500">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">{kpi.label}</span>
              <div className="p-2.5 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors">{kpi.icon}</div>
            </div>
            <div className="flex items-baseline space-x-2">
              <p className="text-4xl font-black text-slate-900 tracking-tighter">{kpi.val}</p>
              <span className={`text-[10px] font-black ${kpi.trend.includes('+') || kpi.trend === 'Stable' ? 'text-emerald-600' : 'text-rose-600'}`}>{kpi.trend}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-black mt-3 uppercase tracking-tight">{kpi.desc}</p>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-50 rounded-full opacity-0 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"></div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card title="Monthly Budget Commit Pipeline (Enterprise-wide)">
            <div className="h-[450px] w-full mt-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 900}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 900}} />
                  <Tooltip 
                     contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 30px 60px -12px rgb(0 0 0 / 0.2)', padding: '24px' }}
                  />
                  <Legend verticalAlign="top" align="right" iconType="diamond" wrapperStyle={{ paddingBottom: '40px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }} />
                  <Area name="Capital Expenditure (CAPEX)" type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={6} fillOpacity={1} fill="url(#colorVal)" dot={{ r: 6, strokeWidth: 3, fill: 'white', stroke: '#4f46e5' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
               <div className="flex space-x-4">
                  <TrendingUp className="text-indigo-600 shrink-0" size={24} />
                  <div>
                    <p className="text-xs font-black text-slate-900 uppercase">Growth Trajectory</p>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">Year-over-year operational volume has increased by 18%. Automation rules for Tier-1 approvals are recommended to maintain velocity.</p>
                  </div>
               </div>
               <div className="flex space-x-4">
                  <Target className="text-emerald-600 shrink-0" size={24} />
                  <div>
                    <p className="text-xs font-black text-slate-900 uppercase">Efficiency Target</p>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">Current median turnaround (1.2 days) is 15% better than the industry benchmark for Fortune 500 logistics firms.</p>
                  </div>
               </div>
            </div>
          </Card>

          <Card title="Departmental SLA Adherence (On-Time Decisions)">
             <div className="h-80 w-full mt-10">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={slaPerformance}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 900}} />
                   <YAxis hide />
                   <Tooltip cursor={{fill: 'transparent'}} />
                   <Bar dataKey="met" radius={[12, 12, 0, 0]} barSize={40}>
                     {slaPerformance.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
             <div className="mt-6 flex flex-wrap gap-4 justify-center">
                {slaPerformance.map(item => (
                  <div key={item.dept} className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></span>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{item.dept}: {item.met}%</span>
                  </div>
                ))}
             </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card title="AI Intelligence Core">
            <div className="space-y-10 mt-6">
               <div className="flex gap-6 group">
                  <div className="shrink-0 p-4 bg-indigo-50 rounded-3xl h-fit text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm"><Sparkles size={24} /></div>
                  <div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Anomaly detected in Infrastructure spend</p>
                    <p className="text-[11px] text-slate-600 mt-2 leading-relaxed italic border-l-4 border-indigo-200 pl-4 py-1">"Cloud usage in 'AP-South-1' is trending 45% above budget. Correlates with REQ-882 scaling events. Suggest reviewing auto-shutdown policies."</p>
                  </div>
               </div>
               
               <div className="flex gap-6 group">
                  <div className="shrink-0 p-4 bg-rose-50 rounded-3xl h-fit text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300 shadow-sm"><AlertTriangle size={24} /></div>
                  <div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Legal Bottleneck Mitigation</p>
                    <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">Contract reviews are averaging 3.4 days. Recommended: Implement Standard MSA templates for SaaS renewals under $10k to bypass manual Legal review.</p>
                  </div>
               </div>

               <div className="flex gap-6 group">
                  <div className="shrink-0 p-4 bg-emerald-50 rounded-3xl h-fit text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm"><Target size={24} /></div>
                  <div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Consolidation Opportunity</p>
                    <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">Analysis of 12 pending marketing SaaS requests shows 45% overlap in tool functionality. Suggesting consolidation under a Unified Creative Bundle.</p>
                  </div>
               </div>
            </div>
          </Card>

          <Card title="Approval Bottlenecks (Median Latency)">
            <div className="h-[320px] w-full mt-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={bottleneckData} margin={{ left: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#64748b', fontWeight: 900}} width={130} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="hours" radius={[0, 12, 12, 0]} barSize={28}>
                    {bottleneckData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 p-6 bg-slate-950 rounded-3xl text-center shadow-2xl">
               <div className="flex items-center justify-center space-x-2 mb-2 text-indigo-400">
                  <Info size={14} />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">Live Registry Feed</p>
               </div>
               <p className="text-[9px] font-bold text-slate-400">Next data refresh in 04m 12s • Global Cluster: Sync-1</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
