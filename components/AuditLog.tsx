
import React, { useState } from 'react';
import { useApp } from '../store';
import { Card, Badge, EmptyState, Button } from './UI';
import { Search, Download, Calendar, Filter, Hash, X } from 'lucide-react';

export const AuditLog: React.FC = () => {
  const { auditLogs } = useApp();
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter(log => 
    log.details.toLowerCase().includes(search.toLowerCase()) ||
    log.user.toLowerCase().includes(search.toLowerCase()) ||
    log.requestId?.toLowerCase().includes(search.toLowerCase()) ||
    log.action.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    alert('System generating audit export in secure CSV format...');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">System Ledger</h1>
          <p className="text-slate-500 font-medium text-sm italic">Immutable record of all organizational decision events.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} className="font-black uppercase text-xs">
          <Download size={16} className="mr-2" /> Export CSV
        </Button>
      </div>

      <Card className="shadow-lg border-slate-200/60">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={18} />
            <input 
              type="text" 
              placeholder="Query logs by entity ID, actor or event type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="md" className="font-bold text-[10px] uppercase tracking-widest px-6 rounded-2xl">
              <Calendar size={14} className="mr-2" /> Date Filter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="border-b border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-[0.25em]">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Operational Actor</th>
                <th className="px-6 py-4">Event Classification</th>
                <th className="px-6 py-4">Reference ID</th>
                <th className="px-6 py-4">Event Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-6 whitespace-nowrap text-[10px] font-black text-slate-400">
                    {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center mr-3 text-[10px] font-black border border-slate-700">
                        {log.user.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-xs tracking-tight">{log.user}</span>
                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{log.role}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <Badge className="bg-slate-50 text-slate-500 border-slate-200 text-[9px] font-black uppercase tracking-tight">
                      {log.action}
                    </Badge>
                  </td>
                  <td className="px-6 py-6">
                    {log.requestId ? (
                      <span className="flex items-center text-indigo-600 font-black text-[10px] bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 w-fit group-hover:scale-105 transition-transform">
                        <Hash size={10} className="mr-1" /> {log.requestId}
                      </span>
                    ) : (
                      <span className="text-slate-200 font-black">SYSTEM</span>
                    )}
                  </td>
                  <td className="px-6 py-6 text-slate-600 text-[11px] font-medium leading-relaxed max-w-[300px]">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center opacity-30 text-center">
            <Hash size={48} className="mb-4 text-slate-300" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Zero Matching Events</p>
          </div>
        )}
      </Card>
    </div>
  );
};
