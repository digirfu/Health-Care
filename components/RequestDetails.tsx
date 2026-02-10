
import React, { useState } from 'react';
import { useApp } from '../store';
import { RequestStatus, UserRole, Comment } from '../types';
import { Card, Badge, Button } from './UI';
import { motion } from 'framer-motion';
import { STATUS_COLORS, PRIORITY_COLORS } from '../constants';
import { ArrowLeft, Send, Check, X, Clock, MessageSquare, History, FileDown, ShieldAlert, ChevronRight } from 'lucide-react';

interface RequestDetailsProps {
  requestId: string;
  onBack: () => void;
}

export const RequestDetails: React.FC<RequestDetailsProps> = ({ requestId, onBack }) => {
  const { requests, currentUser, advanceWorkflow, addComment, setActiveView, workflows } = useApp();
  const [commentText, setCommentText] = useState('');
  
  const request = requests.find(r => r.id === requestId);

  if (!request) return <div className="p-20 text-center text-slate-500 font-bold uppercase tracking-widest opacity-30">Record Integrity Failure: Not Found</div>;

  const handleAction = (action: 'APPROVE' | 'REJECT' | 'ESCALATE') => {
    advanceWorkflow(requestId, action);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const comment: Comment = {
      id: Math.random().toString(),
      author: currentUser.name,
      role: currentUser.role,
      text: commentText,
      timestamp: new Date().toISOString()
    };
    addComment(requestId, comment);
    setCommentText('');
  };

  const canApprove = request.currentAssigneeRole === currentUser.role;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-900 transition-colors font-black text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} className="mr-2" /> Pipeline Overview
        </button>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="font-bold text-[10px] uppercase px-4" onClick={() => alert('Secure Ledger Export Initiated...')}>
            <FileDown size={14} className="mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-slate-200/60 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>
              
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-6">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter">{request.id}</h1>
                    <Badge className={`${STATUS_COLORS[request.status]} font-black border-2 px-3 py-1 shadow-sm`}>{request.status.toUpperCase()}</Badge>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-700 leading-tight max-w-xl">{request.title}</h2>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 min-w-[140px] text-center">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Impact Priority</p>
                  <span className={`text-xl font-black uppercase tracking-tight ${PRIORITY_COLORS[request.priority]}`}>
                    {request.priority}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-slate-100 mb-10">
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Requested By</p>
                  <div className="flex items-center space-x-2">
                     <div className="w-6 h-6 rounded bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">{request.requester.charAt(0)}</div>
                     <p className="text-sm font-bold text-slate-900">{request.requester}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Category</p>
                  <p className="text-sm font-bold text-slate-900">{request.type}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Log Timestamp</p>
                  <p className="text-sm font-bold text-slate-900">{new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Fiscal Value</p>
                  <p className="text-lg font-black text-indigo-600">${request.amount?.toLocaleString()}</p>
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-5 flex items-center">
                  <ShieldAlert size={14} className="mr-2 text-slate-400" /> Business Justification Statement
                </h3>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-full"></div>
                  <p className="text-slate-600 text-sm leading-relaxed pl-6 italic font-medium">
                    "{request.description}"
                  </p>
                </div>
              </div>

              {canApprove && (
                <div className="bg-slate-950 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute -right-20 -top-20 text-white/5 group-hover:scale-125 transition-transform duration-1000">
                     <ShieldAlert size={300} />
                  </div>
                  <div className="relative">
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-indigo-500 rounded-2xl mr-4 shadow-lg shadow-indigo-500/20">
                        <Check size={24} className="text-white" />
                      </div>
                      <h3 className="font-black text-xl text-white uppercase tracking-tight">Identity Verified: Decision Window Open</h3>
                    </div>
                    <p className="text-slate-400 text-sm mb-10 font-medium leading-relaxed max-w-lg">System credential check passed. You have the required clearance level to authorize this expenditure or escalate for senior board review.</p>
                    <div className="flex flex-wrap gap-4">
                      <Button 
                        onClick={() => handleAction('APPROVE')}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white border-none px-10 font-black uppercase text-[10px] h-14 tracking-[0.2em] shadow-xl shadow-emerald-500/20"
                      >
                        Authorize Stage
                      </Button>
                      <Button 
                        variant="danger"
                        onClick={() => handleAction('REJECT')}
                        className="px-10 font-black uppercase text-[10px] h-14 tracking-[0.2em]"
                      >
                        Decline
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleAction('ESCALATE')}
                        className="bg-white/5 border-white/20 text-white hover:bg-white/10 px-10 font-black uppercase text-[10px] h-14 tracking-[0.2em]"
                      >
                        Escalate
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>

          <Card title="Decision Chain History">
            <div className="space-y-12 relative py-6 before:absolute before:inset-0 before:ml-6 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
              {workflows.map((step, idx) => {
                const isCompleted = workflows.findIndex(w => w.requiredRole === request.currentAssigneeRole) > idx || request.status === RequestStatus.APPROVED;
                const isActive = request.currentAssigneeRole === step.requiredRole;
                const isPending = !isCompleted && !isActive;

                return (
                  <div key={step.id} className="relative flex items-start">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-2xl z-10 shrink-0 shadow-lg transition-all border-4 border-white ${
                      isActive ? 'bg-indigo-600 text-white scale-110' : 
                      isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300'
                    }`}>
                      { isCompleted ? <Check size={22} /> : isActive ? <Clock size={22} className="animate-spin-slow" /> : <ChevronRight size={22} /> }
                    </div>
                    <div className={`flex-1 border p-6 rounded-3xl ml-8 transition-all ${
                      isActive ? 'bg-indigo-50 border-indigo-100 shadow-md ring-4 ring-indigo-50/50' : 'bg-white border-slate-100'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <p className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-indigo-900' : 'text-slate-900'}`}>{step.name}</p>
                        {isCompleted && <span className="text-[9px] font-black text-emerald-600 uppercase">Verified</span>}
                      </div>
                      <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tighter">Authority: {step.requiredRole}</p>
                      {isActive && <div className="mt-4 flex items-center text-[10px] text-indigo-600 font-black uppercase bg-white border border-indigo-100 w-fit px-3 py-1 rounded-full animate-pulse">SLA Tracking Active</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Audited Discussion">
            <div className="space-y-6 max-h-[500px] overflow-y-auto mb-10 pr-3 custom-scrollbar">
              {request.comments.map((comment) => (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} key={comment.id} className="bg-slate-50 border border-slate-100 rounded-3xl p-5 relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 rounded bg-slate-900 text-white text-[8px] flex items-center justify-center font-bold">{comment.author.charAt(0)}</div>
                      <span className="text-[10px] font-black text-slate-900 uppercase">{comment.author}</span>
                    </div>
                    <Badge className="bg-white border-slate-200 text-[8px] font-black uppercase px-2 py-0.5">{comment.role}</Badge>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">"{comment.text}"</p>
                  <p className="text-[9px] text-slate-400 mt-4 font-bold uppercase tracking-widest">{new Date(comment.timestamp).toLocaleTimeString()}</p>
                </motion.div>
              ))}
              {request.comments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
                  <MessageSquare size={32} className="mb-4" />
                  <p className="text-[10px] uppercase font-black tracking-widest">Awaiting Communication</p>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <textarea 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Entry technical memo or decision justification..."
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[2rem] text-xs font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none h-32"
              />
              <Button onClick={handleAddComment} className="w-full h-14 font-black uppercase text-[10px] tracking-[0.25em] shadow-lg" size="sm">
                <Send size={16} className="mr-3" /> Log Technical Memo
              </Button>
            </div>
          </Card>

          <Card title="Security Persistence">
            <div className="space-y-4">
              <div className="flex items-center p-5 bg-indigo-50 rounded-3xl border border-indigo-100 shadow-sm">
                <History size={24} className="text-indigo-600 mr-5" />
                <div className="flex-1">
                  <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">Audit Linkage</p>
                  <p className="text-[10px] text-indigo-700 font-bold uppercase leading-tight">Hash-locked event sequence verified</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full h-12 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:bg-slate-50" 
                size="sm"
                onClick={() => setActiveView('audit')}
              >
                Inspect Ledger Registry
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};
