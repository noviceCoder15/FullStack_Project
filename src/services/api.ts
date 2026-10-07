import { Issue, Bid, User, CivicStats, AIClassificationResult, UserRole } from '../types/civic.js';

export const api = {
  // Auth
  async getCurrentUser(): Promise<User> {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    return data.user;
  },

  async quickSwitchRole(role?: UserRole, userId?: string): Promise<User> {
    const res = await fetch('/api/auth/quick-switch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, userId })
    });
    const data = await res.json();
    return data.user;
  },

  async registerUser(userData: {
    name: string;
    email: string;
    role: UserRole;
    district?: string;
    companyName?: string;
    specialties?: string[];
  }): Promise<User> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    return data.user;
  },

  // AI Classification
  async classifyIssue(payload: {
    title: string;
    description: string;
    imageBase64?: string;
    mimeType?: string;
  }): Promise<AIClassificationResult> {
    const res = await fetch('/api/ai/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'AI classification failed');
    return data.analysis;
  },

  // Issues
  async getIssues(filters?: {
    department?: string;
    severity?: string;
    status?: string;
    district?: string;
    search?: string;
    reporterId?: string;
    contractorId?: string;
  }): Promise<Issue[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v && v !== 'All') params.append(k, v);
      });
    }
    const res = await fetch(`/api/issues?${params.toString()}`);
    const data = await res.json();
    return data.issues || [];
  },

  async getIssueById(id: string): Promise<{ issue: Issue; bids: Bid[] }> {
    const res = await fetch(`/api/issues/${id}`);
    const data = await res.json();
    return { issue: data.issue, bids: data.bids || [] };
  },

  async createIssue(payload: {
    title: string;
    description: string;
    images: string[];
    location: {
      lat: number;
      lng: number;
      address: string;
      district: string;
    };
    department?: string;
    severity?: string;
    aiAnalysis?: AIClassificationResult;
    runAI?: boolean;
  }): Promise<{ issue: Issue; isDuplicate?: boolean; message?: string }> {
    const res = await fetch('/api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status === 409 && data.isDuplicate) {
      return { issue: data.issue, isDuplicate: true, message: data.error };
    }
    if (!data.success) throw new Error(data.error || 'Failed to submit issue');
    return { issue: data.issue, isDuplicate: false };
  },

  async updateIssueStatus(id: string, payload: {
    status?: string;
    note?: string;
    contractorWorkNotes?: string;
    afterImage?: string;
    beforeImage?: string;
    resolutionNotes?: string;
  }): Promise<Issue> {
    const res = await fetch(`/api/issues/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data.issue;
  },

  async upvoteIssue(id: string): Promise<Issue> {
    const res = await fetch(`/api/issues/${id}/upvote`, {
      method: 'POST'
    });
    const data = await res.json();
    return data.issue;
  },

  // Bids
  async getBids(params?: { issueId?: string; contractorId?: string }): Promise<Bid[]> {
    const q = new URLSearchParams();
    if (params?.issueId) q.append('issueId', params.issueId);
    if (params?.contractorId) q.append('contractorId', params.contractorId);
    const res = await fetch(`/api/bids?${q.toString()}`);
    const data = await res.json();
    return data.bids || [];
  },

  async submitBid(payload: {
    issueId: string;
    bidAmount: number;
    estimatedDays: number;
    proposedPlan: string;
  }): Promise<{ bid: Bid; isDuplicate?: boolean; message?: string }> {
    const res = await fetch('/api/bids', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status === 409 && data.isDuplicate) {
      return { bid: data.bid, isDuplicate: true, message: data.error };
    }
    if (!data.success) throw new Error(data.error || 'Failed to place bid');
    return { bid: data.bid, isDuplicate: false };
  },

  async acceptBid(bidId: string): Promise<{ issue: Issue; bid: Bid }> {
    const res = await fetch(`/api/bids/${bidId}/accept`, {
      method: 'POST'
    });
    const data = await res.json();
    return { issue: data.issue, bid: data.bid };
  },

  async directAssign(issueId: string, contractorId: string, allocatedBudget?: number): Promise<Issue> {
    const res = await fetch(`/api/issues/${issueId}/assign-direct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractorId, allocatedBudget })
    });
    const data = await res.json();
    return data.issue;
  },

  // Contractors
  async getContractors(): Promise<User[]> {
    const res = await fetch('/api/contractors');
    const data = await res.json();
    return data.contractors || [];
  },

  // Stats
  async getStats(): Promise<CivicStats> {
    const res = await fetch('/api/stats');
    const data = await res.json();
    return data.stats;
  },

  // Reset Seed
  async resetSeed(): Promise<void> {
    await fetch('/api/seed/reset', { method: 'POST' });
  }
};
