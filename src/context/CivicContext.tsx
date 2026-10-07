import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Issue, Bid, CivicStats, UserRole, AIClassificationResult } from '../types/civic.js';
import { api } from '../services/api.js';

interface CivicContextType {
  user: User | null;
  isAuthenticated: boolean;
  issues: Issue[];
  bids: Bid[];
  contractors: User[];
  stats: CivicStats | null;
  loading: boolean;
  activeTab: 'landing' | 'citizen' | 'municipality' | 'contractor';
  setActiveTab: (tab: 'landing' | 'citizen' | 'municipality' | 'contractor') => void;
  selectedIssue: Issue | null;
  setSelectedIssue: (issue: Issue | null) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  
  // Auth Modal State & Handlers
  authModalOpen: boolean;
  authTargetRole: UserRole | null;
  authMode: 'signin' | 'signup';
  openAuthModal: (role?: UserRole, mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  setAuthTargetRole: (role: UserRole | null) => void;
  setAuthMode: (mode: 'signin' | 'signup') => void;
  
  // Authentication Actions
  loginAsRole: (role: UserRole, customUser?: any) => Promise<void>;
  logout: () => void;
  registerUser: (data: any) => Promise<void>;
  
  // App Actions
  refreshAll: () => Promise<void>;
  refreshIssues: (filters?: any) => Promise<void>;
  submitIssue: (data: any) => Promise<{ issue: Issue; isDuplicate?: boolean; message?: string }>;
  findPotentialDuplicate: (title: string, location?: { lat: number; lng: number }) => Issue | undefined;
  classifyWithAI: (payload: { title: string; description: string; imageBase64?: string }) => Promise<AIClassificationResult>;
  updateIssueStatus: (id: string, payload: any) => Promise<Issue>;
  upvoteIssue: (id: string) => Promise<void>;
  submitBid: (payload: { issueId: string; bidAmount: number; estimatedDays: number; proposedPlan: string }) => Promise<{ bid: Bid; isDuplicate?: boolean; message?: string }>;
  acceptBid: (bidId: string) => Promise<void>;
  directAssign: (issueId: string, contractorId: string, budget?: number) => Promise<void>;
  resetDemoData: () => Promise<void>;
}

const CivicContext = createContext<CivicContextType | undefined>(undefined);

export const CivicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [contractors, setContractors] = useState<User[]>([]);
  const [stats, setStats] = useState<CivicStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTabState] = useState<'landing' | 'citizen' | 'municipality' | 'contractor'>('landing');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Auth modal controls
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authTargetRole, setAuthTargetRole] = useState<UserRole | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Enforce no toggling to landing page while authenticated
  const setActiveTab = (tab: 'landing' | 'citizen' | 'municipality' | 'contractor') => {
    if (isAuthenticated && tab === 'landing') {
      // Do not allow toggling to landing page while authenticated
      return;
    }
    setActiveTabState(tab);
  };

  const refreshAll = useCallback(async () => {
    try {
      const [iss, b, c, s] = await Promise.all([
        api.getIssues(),
        api.getBids(),
        api.getContractors(),
        api.getStats()
      ]);
      setIssues(iss);
      setBids(b);
      setContractors(c);
      setStats(s);
    } catch (err) {
      console.error('Error loading civic data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const openAuthModal = (role?: UserRole, mode: 'signin' | 'signup' = 'signin') => {
    setAuthTargetRole(role || null);
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const loginAsRole = async (role: UserRole, customUser?: any) => {
    setLoading(true);
    try {
      let loggedUser: User;
      if (customUser) {
        loggedUser = customUser;
      } else {
        loggedUser = await api.quickSwitchRole(role);
      }
      setUser(loggedUser);
      setIsAuthenticated(true);
      setAuthModalOpen(false);

      // Route exclusively to respective dashboard based on role
      if (role === 'Citizen') {
        setActiveTabState('citizen');
      } else if (role === 'Municipality') {
        setActiveTabState('municipality');
      } else if (role === 'Contractor') {
        setActiveTabState('contractor');
      }
      await refreshAll();
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setActiveTabState('landing');
  };

  const registerUser = async (data: any) => {
    setLoading(true);
    try {
      const newUser = await api.registerUser(data);
      setUser(newUser);
      setIsAuthenticated(true);
      setAuthModalOpen(false);

      if (newUser.role === 'Citizen') setActiveTabState('citizen');
      else if (newUser.role === 'Municipality') setActiveTabState('municipality');
      else if (newUser.role === 'Contractor') setActiveTabState('contractor');
      await refreshAll();
    } finally {
      setLoading(false);
    }
  };

  const refreshIssues = async (filters?: any) => {
    try {
      const iss = await api.getIssues(filters);
      setIssues(iss);
    } catch (err) {
      console.error('Error refreshing issues:', err);
    }
  };

  const findPotentialDuplicate = (title: string, location?: { lat: number; lng: number }): Issue | undefined => {
    const clean = (title || '').trim().toLowerCase();
    if (!clean && !location) return undefined;

    return issues.find(i => {
      if (i.status === 'Resolved') return false;
      const exClean = i.title.trim().toLowerCase();
      if (clean && (clean === exClean || (clean.length > 10 && exClean.includes(clean)))) {
        return true;
      }
      if (location && i.location) {
        const dLat = Math.abs(i.location.lat - location.lat);
        const dLng = Math.abs(i.location.lng - location.lng);
        if (dLat < 0.0006 && dLng < 0.0006) {
          if (clean) {
            const words = clean.split(/\s+/).filter(w => w.length > 3);
            if (words.some(w => exClean.includes(w))) return true;
          }
        }
      }
      return false;
    });
  };

  const submitIssue = async (data: any): Promise<{ issue: Issue; isDuplicate?: boolean; message?: string }> => {
    const res = await api.createIssue(data);
    await refreshAll();
    return res;
  };

  const classifyWithAI = async (payload: { title: string; description: string; imageBase64?: string }) => {
    return await api.classifyIssue(payload);
  };

  const updateIssueStatus = async (id: string, payload: any): Promise<Issue> => {
    const updated = await api.updateIssueStatus(id, payload);
    if (selectedIssue && selectedIssue.id === id) {
      setSelectedIssue(updated);
    }
    await refreshAll();
    return updated;
  };

  const upvoteIssue = async (id: string) => {
    try {
      const updated = await api.upvoteIssue(id);
      setIssues(prev => prev.map(item => item.id === id ? updated : item));
      if (selectedIssue && selectedIssue.id === id) {
        setSelectedIssue(updated);
      }
    } catch (err) {
      console.error('Error upvoting:', err);
    }
  };

  const submitBid = async (payload: { issueId: string; bidAmount: number; estimatedDays: number; proposedPlan: string }): Promise<{ bid: Bid; isDuplicate?: boolean; message?: string }> => {
    const res = await api.submitBid(payload);
    await refreshAll();
    return res;
  };

  const acceptBid = async (bidId: string) => {
    await api.acceptBid(bidId);
    await refreshAll();
  };

  const directAssign = async (issueId: string, contractorId: string, budget?: number) => {
    await api.directAssign(issueId, contractorId, budget);
    await refreshAll();
  };

  const resetDemoData = async () => {
    setLoading(true);
    try {
      await api.resetSeed();
      await refreshAll();
    } finally {
      setLoading(false);
    }
  };

  return (
    <CivicContext.Provider
      value={{
        user,
        isAuthenticated,
        issues,
        bids,
        contractors,
        stats,
        loading,
        activeTab,
        setActiveTab,
        selectedIssue,
        setSelectedIssue,
        isReportModalOpen,
        setIsReportModalOpen,
        authModalOpen,
        authTargetRole,
        authMode,
        openAuthModal,
        closeAuthModal,
        setAuthTargetRole,
        setAuthMode,
        loginAsRole,
        logout,
        registerUser,
        refreshAll,
        refreshIssues,
        submitIssue,
        findPotentialDuplicate,
        classifyWithAI,
        updateIssueStatus,
        upvoteIssue,
        submitBid,
        acceptBid,
        directAssign,
        resetDemoData
      }}
    >
      {children}
    </CivicContext.Provider>
  );
};

export const useCivic = () => {
  const context = useContext(CivicContext);
  if (!context) {
    throw new Error('useCivic must be used within a CivicProvider');
  }
  return context;
};
