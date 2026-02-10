
export enum UserRole {
  REQUESTER = 'Requester',
  MANAGER = 'Manager',
  FINANCE = 'Finance',
  ADMIN = 'Admin',
  AUDITOR = 'Auditor'
}

export enum RequestStatus {
  DRAFT = 'Draft',
  PENDING_MANAGER = 'Pending Manager Approval',
  PENDING_FINANCE = 'Pending Finance Approval',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  ESCALATED = 'Escalated'
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface WorkflowStep {
  id: string;
  name: string;
  requiredRole: UserRole;
  order: number;
}

export interface Comment {
  id: string;
  author: string;
  role: UserRole;
  text: string;
  timestamp: string;
}

export interface Request {
  id: string;
  title: string;
  description: string;
  type: string;
  status: RequestStatus;
  priority: Priority;
  amount?: number;
  requester: string;
  currentAssigneeRole: UserRole | null;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  history: AuditEntry[];
}

export interface AuditEntry {
  id: string;
  requestId?: string;
  user: string;
  role: UserRole;
  action: string;
  details: string;
  timestamp: string;
}

export interface AppState {
  currentUser: {
    name: string;
    role: UserRole;
  };
  requests: Request[];
  auditLogs: AuditEntry[];
  workflows: WorkflowStep[];
}
