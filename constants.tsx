
import React from 'react';
import { UserRole, RequestStatus, Priority, WorkflowStep, Request, AuditEntry } from './types';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  ShieldCheck, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: 'dashboard', roles: Object.values(UserRole) },
  { name: 'Requests', icon: <FileText size={20} />, path: 'requests', roles: Object.values(UserRole) },
  { name: 'Workflow Builder', icon: <Settings size={20} />, path: 'workflows', roles: [UserRole.ADMIN] },
  { name: 'Audit Logs', icon: <ShieldCheck size={20} />, path: 'audit', roles: [UserRole.ADMIN, UserRole.AUDITOR] },
  { name: 'Reports', icon: <BarChart3 size={20} />, path: 'reports', roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.FINANCE, UserRole.AUDITOR] },
];

export const INITIAL_WORKFLOWS: WorkflowStep[] = [
  { id: '1', name: 'Draft', requiredRole: UserRole.REQUESTER, order: 1 },
  { id: '2', name: 'Manager Review', requiredRole: UserRole.MANAGER, order: 2 },
  { id: '3', name: 'Finance Verification', requiredRole: UserRole.FINANCE, order: 3 },
  { id: '4', name: 'Compliance Check', requiredRole: UserRole.AUDITOR, order: 4 },
  { id: '5', name: 'Final Approval', requiredRole: UserRole.ADMIN, order: 5 },
];

export const MOCK_REQUESTS: Request[] = [
  {
    id: 'REQ-882',
    title: 'AWS Production Cluster Auto-Scaling (Q4 Peak)',
    description: 'Immediate increase in reserve capacity for US-East-1 and EU-West-1 clusters. Required to prevent latency spikes during the global Black Friday event. Projections suggest a 400% traffic increase.',
    type: 'Infrastructure',
    status: RequestStatus.PENDING_MANAGER,
    priority: Priority.CRITICAL,
    amount: 12500,
    requester: 'David Miller',
    currentAssigneeRole: UserRole.MANAGER,
    createdAt: new Date(Date.now() - 86400000 * 0.2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 0.1).toISOString(),
    comments: [
      { id: 'c1', author: 'David Miller', role: UserRole.REQUESTER, text: 'The scaling window closes in 6 hours. Urgency is high.', timestamp: new Date().toISOString() }
    ],
    history: []
  },
  {
    id: 'REQ-754',
    title: 'Global Cybersecurity Awareness Training (Annual)',
    description: 'Mandatory phishing simulation and compliance training for all 5,000 employees. Vendor: KnowBe4. Contract includes 24/7 support and custom modular content.',
    type: 'IT Security',
    status: RequestStatus.PENDING_FINANCE,
    priority: Priority.HIGH,
    amount: 32400,
    requester: 'Alice Vance',
    currentAssigneeRole: UserRole.FINANCE,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    comments: [
      { id: 'c2', author: 'CISO Office', role: UserRole.MANAGER, text: 'Security budget approved. Passing to Finance for final verification.', timestamp: new Date(Date.now() - 86400000 * 1).toISOString() }
    ],
    history: []
  },
  {
    id: 'REQ-912',
    title: 'Office Relocation: Singapore Tech Hub',
    description: 'Logistics and professional moving services for the new office in Marina Bay. Includes specialized transport for server racks and UPS units.',
    type: 'Facilities',
    status: RequestStatus.PENDING_MANAGER,
    priority: Priority.MEDIUM,
    amount: 15800,
    requester: 'Li Wei',
    currentAssigneeRole: UserRole.MANAGER,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    comments: [],
    history: []
  },
  {
    id: 'REQ-441',
    title: 'Recruitment Fees: Senior ML Architect',
    description: 'Placement fee for specialized boutique headhunter (TalentFlow). Successful hire of Dr. Sarah Chen. Terms: 18% of base salary.',
    type: 'Human Resources',
    status: RequestStatus.APPROVED,
    priority: Priority.HIGH,
    amount: 28500,
    requester: 'Emily Watson',
    currentAssigneeRole: null,
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    comments: [
      { id: 'c3', author: 'Finance Lead', role: UserRole.FINANCE, text: 'Verified against talent acquisition budget. Approved.', timestamp: new Date(Date.now() - 86400000 * 13).toISOString() }
    ],
    history: []
  },
  {
    id: 'REQ-219',
    title: 'Legal Retainer Renewal: Baker & McKenzie',
    description: 'Monthly flat-fee retainer for intellectual property protection and general litigation services in the North American region.',
    type: 'Legal',
    status: RequestStatus.PENDING_FINANCE,
    priority: Priority.MEDIUM,
    amount: 5000,
    requester: 'Robert Stark',
    currentAssigneeRole: UserRole.FINANCE,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    comments: [],
    history: []
  },
  {
    id: 'REQ-105',
    title: 'Emergency Generator Maintenance',
    description: 'Scheduled semi-annual maintenance and load bank testing for the backup generators at the Dublin Data Center.',
    type: 'Maintenance',
    status: RequestStatus.DRAFT,
    priority: Priority.MEDIUM,
    amount: 4200,
    requester: 'Sean O\'Malley',
    currentAssigneeRole: UserRole.REQUESTER,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [],
    history: []
  },
  {
    id: 'REQ-012',
    title: 'Creative Cloud Team Licenses (50 Seats)',
    description: 'Annual renewal of Adobe Creative Cloud licenses for the global marketing and design teams. Includes Stock integration.',
    type: 'SaaS License',
    status: RequestStatus.REJECTED,
    priority: Priority.MEDIUM,
    amount: 18900,
    requester: 'Chloe Brooks',
    currentAssigneeRole: null,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    comments: [
      { id: 'c4', author: 'Procurement Admin', role: UserRole.FINANCE, text: 'We have consolidated seats into a new Enterprise Agreement. Please resubmit under the NEW-Adobe-EA code.', timestamp: new Date(Date.now() - 86400000 * 25).toISOString() }
    ],
    history: []
  }
];

export const STATUS_COLORS = {
  [RequestStatus.DRAFT]: 'bg-slate-100 text-slate-700 border-slate-200',
  [RequestStatus.PENDING_MANAGER]: 'bg-amber-50 text-amber-700 border-amber-200',
  [RequestStatus.PENDING_FINANCE]: 'bg-blue-50 text-blue-700 border-blue-200',
  [RequestStatus.APPROVED]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  [RequestStatus.REJECTED]: 'bg-rose-50 text-rose-700 border-rose-200',
  [RequestStatus.ESCALATED]: 'bg-violet-50 text-violet-700 border-violet-200',
};

export const PRIORITY_COLORS = {
  [Priority.LOW]: 'text-slate-500',
  [Priority.MEDIUM]: 'text-blue-600',
  [Priority.HIGH]: 'text-orange-600',
  [Priority.CRITICAL]: 'text-red-600 font-bold',
};
