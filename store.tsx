
import React, { createContext, useContext, useState, useCallback } from 'react';
import { UserRole, AppState, Request, AuditEntry, RequestStatus, Comment } from './types';
import { MOCK_REQUESTS, INITIAL_WORKFLOWS } from './constants';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  read: boolean;
  action?: {
    view: string;
    requestId?: string;
  };
}

interface AppContextType extends AppState {
  activeView: string;
  setActiveView: (view: string) => void;
  selectedRequestId: string | null;
  setSelectedRequestId: (id: string | null) => void;
  notifications: AppNotification[];
  setRole: (role: UserRole) => void;
  updateRequest: (requestId: string, updates: Partial<Request>) => void;
  advanceWorkflow: (requestId: string, action: 'APPROVE' | 'REJECT' | 'ESCALATE') => void;
  addRequest: (request: Request) => void;
  deleteRequest: (requestId: string) => void;
  addComment: (requestId: string, comment: Comment) => void;
  addAuditLog: (entry: Omit<AuditEntry, 'id' | 'timestamp'>) => void;
  updateWorkflow: (workflows: any[]) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Urgent Approval Required',
    message: 'REQ-882 (AWS Scaling) is approaching SLA breach threshold.',
    type: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read: false,
    action: { view: 'requests', requestId: 'REQ-882' }
  },
  {
    id: 'n2',
    title: 'Compliance Audit Triggered',
    message: 'Weekly integrity report for Q4 is now available for review.',
    type: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
    action: { view: 'audit' }
  },
  {
    id: 'n3',
    title: 'Budget Approved',
    message: 'REQ-441 has been successfully authorized by Finance.',
    type: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
    action: { view: 'requests', requestId: 'REQ-441' }
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState({ name: 'Alexander Senior', role: UserRole.ADMIN });
  const [requests, setRequests] = useState<Request[]>(MOCK_REQUESTS);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [workflows, setWorkflows] = useState(INITIAL_WORKFLOWS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const addAuditLog = useCallback((entry: Omit<AuditEntry, 'id' | 'timestamp'>) => {
    const newEntry: AuditEntry = {
      ...entry,
      id: `LOG-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  }, []);

  const setRole = (role: UserRole) => {
    setCurrentUser(prev => ({ ...prev, role }));
    addAuditLog({
      user: currentUser.name,
      role: UserRole.ADMIN,
      action: 'Role Switched',
      details: `Account access updated to: ${role}`
    });
  };

  const updateRequest = useCallback((requestId: string, updates: Partial<Request>) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return { ...req, ...updates, updatedAt: new Date().toISOString() };
      }
      return req;
    }));
  }, []);

  const advanceWorkflow = useCallback((requestId: string, action: 'APPROVE' | 'REJECT' | 'ESCALATE') => {
    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;

      let newStatus = req.status;
      let newAssignee = req.currentAssigneeRole;

      if (action === 'REJECT') {
        newStatus = RequestStatus.REJECTED;
        newAssignee = null;
      } else if (action === 'ESCALATE') {
        newStatus = RequestStatus.ESCALATED;
        newAssignee = UserRole.ADMIN;
      } else if (action === 'APPROVE') {
        const currentStepIndex = workflows.findIndex(w => w.requiredRole === req.currentAssigneeRole);
        const nextStep = workflows[currentStepIndex + 1];

        if (nextStep) {
          newAssignee = nextStep.requiredRole;
          newStatus = nextStep.requiredRole === UserRole.FINANCE 
            ? RequestStatus.PENDING_FINANCE 
            : RequestStatus.PENDING_MANAGER;
        } else {
          newStatus = RequestStatus.APPROVED;
          newAssignee = null;
        }
      }

      addAuditLog({
        requestId,
        user: currentUser.name,
        role: currentUser.role,
        action: action === 'APPROVE' ? 'Authorization' : action === 'REJECT' ? 'Rejection' : 'Escalation',
        details: `Request ${action.toLowerCase()}d. Status: ${newStatus}`
      });

      return { ...req, status: newStatus, currentAssigneeRole: newAssignee, updatedAt: new Date().toISOString() };
    }));
  }, [workflows, currentUser, addAuditLog]);

  const addRequest = useCallback((request: Request) => {
    setRequests(prev => [request, ...prev]);
    addAuditLog({
      requestId: request.id,
      user: currentUser.name,
      role: currentUser.role,
      action: 'Request Created',
      details: `Initialized requisition: ${request.title}`
    });
  }, [currentUser, addAuditLog]);

  const deleteRequest = useCallback((requestId: string) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
  }, []);

  const addComment = useCallback((requestId: string, comment: Comment) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return { ...req, comments: [...req.comments, comment] };
      }
      return req;
    }));
  }, []);

  const updateWorkflow = (newWorkflows: any[]) => {
    setWorkflows(newWorkflows);
    addAuditLog({
      user: currentUser.name,
      role: currentUser.role,
      action: 'Workflow Schema Updated',
      details: 'Organizational decision tree logic was modified'
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider value={{
      activeView,
      setActiveView,
      selectedRequestId,
      setSelectedRequestId,
      currentUser,
      requests,
      auditLogs,
      workflows,
      notifications,
      setRole,
      updateRequest,
      advanceWorkflow,
      addRequest,
      deleteRequest,
      addComment,
      addAuditLog,
      updateWorkflow,
      markNotificationRead,
      clearNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
