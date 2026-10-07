export type UserRole = 'Citizen' | 'Municipality' | 'Contractor';

export type IssueStatus = 
  | 'Submitted' 
  | 'AI Classified' 
  | 'Assigned' 
  | 'In Progress' 
  | 'Resolved';

export type SeverityLevel = 'High' | 'Medium' | 'Low';

export type DepartmentCategory = 
  | 'Roads & Potholes'
  | 'Water & Sanitation'
  | 'Electricity & Lighting'
  | 'Garbage & Waste'
  | 'Parks & Environment'
  | 'Traffic & Signals'
  | 'Public Safety';

export interface ContractorProfile {
  companyName: string;
  licenseNumber: string;
  rating: number; // 0 - 5
  completedJobsCount: number;
  specialties: DepartmentCategory[];
  verified: boolean;
  phone: string;
  hourlyRate?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  district?: string;
  contractorProfile?: ContractorProfile;
}

export interface AIClassificationResult {
  department: DepartmentCategory;
  severity: SeverityLevel;
  severityReason: string;
  urgencyHours: number;
  estimatedCost: string;
  keywords: string[];
  suggestedAction: string;
  safetyHazard: boolean;
  confidenceScore: number;
}

export interface TimelineEvent {
  status: IssueStatus;
  timestamp: string;
  actor: string;
  actorRole: UserRole | 'AI Engine';
  note: string;
}

export interface Bid {
  id: string;
  issueId: string;
  contractorId: string;
  contractorName: string;
  contractorRating: number;
  contractorAvatar: string;
  licenseNumber: string;
  bidAmount: number;
  estimatedDays: number;
  proposedPlan: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  createdAt: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  images: string[];
  department: DepartmentCategory;
  severity: SeverityLevel;
  status: IssueStatus;
  location: {
    lat: number;
    lng: number;
    address: string;
    district: string;
  };
  reporter: {
    id: string;
    name: string;
    avatar: string;
    email: string;
  };
  aiAnalysis?: AIClassificationResult;
  assignedContractor?: {
    id: string;
    name: string;
    companyName: string;
    rating: number;
    avatar: string;
    assignedAt: string;
  };
  timeline: TimelineEvent[];
  upvotes: number;
  upvotedByUserIds: string[];
  beforeImage?: string;
  afterImage?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  contractorWorkNotes?: string;
  budgetEstimate?: number;
  bidsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CivicStats {
  activeIssues: number;
  unassignedIssues: number;
  pendingBids: number;
  completedIssues: number;
  avgResolutionDays: number;
  totalCommittedBudget: number;
  byDepartment: Record<string, number>;
  bySeverity: Record<string, number>;
  byStatus: Record<string, number>;
}
