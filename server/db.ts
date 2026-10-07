import { User, Issue, Bid, CivicStats, DepartmentCategory, SeverityLevel } from '../src/types/civic.js';

export interface DatabaseState {
  users: User[];
  issues: Issue[];
  bids: Bid[];
}

export const INITIAL_USERS: User[] = [
  {
    id: 'user_cit_1',
    name: 'Elena Rostova',
    email: 'elena.citizen@civicconnect.org',
    role: 'Citizen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    district: 'Downtown Arts District'
  },
  {
    id: 'user_cit_2',
    name: 'Marcus Vance',
    email: 'marcus.vance@civicconnect.org',
    role: 'Citizen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    district: 'Westside Heights'
  },
  {
    id: 'user_mun_1',
    name: 'Dir. Sarah Jenkins',
    email: 's.jenkins@metrogov.city',
    role: 'Municipality',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    district: 'City Hall Operations'
  },
  {
    id: 'user_con_1',
    name: 'Dave Walker (Apex Civil)',
    email: 'dave@apexcivil.com',
    role: 'Contractor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    contractorProfile: {
      companyName: 'Apex Civil & Asphalt Infrastructure',
      licenseNumber: 'LIC-CA-99421',
      rating: 4.9,
      completedJobsCount: 142,
      specialties: ['Roads & Potholes', 'Traffic & Signals', 'Parks & Environment'],
      verified: true,
      phone: '+1 (555) 392-8101',
      hourlyRate: 85
    }
  },
  {
    id: 'user_con_2',
    name: 'Carlos Rivera (Metro EcoWaste)',
    email: 'carlos@metroecowaste.com',
    role: 'Contractor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    contractorProfile: {
      companyName: 'Metro EcoWaste & Rapid Sanitation',
      licenseNumber: 'LIC-CA-77145',
      rating: 4.8,
      completedJobsCount: 98,
      specialties: ['Garbage & Waste', 'Parks & Environment'],
      verified: true,
      phone: '+1 (555) 781-4402',
      hourlyRate: 70
    }
  },
  {
    id: 'user_con_3',
    name: 'Lisa Wong (BrightVolt)',
    email: 'lisa@brightvoltgrid.com',
    role: 'Contractor',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    contractorProfile: {
      companyName: 'BrightVolt Municipal Electrical Corp',
      licenseNumber: 'LIC-CA-83210',
      rating: 4.95,
      completedJobsCount: 215,
      specialties: ['Electricity & Lighting', 'Traffic & Signals'],
      verified: true,
      phone: '+1 (555) 604-9921',
      hourlyRate: 95
    }
  }
];

export const INITIAL_ISSUES: Issue[] = [
  {
    id: 'ISSUE-1001',
    title: 'Hazardous Sinkhole & Asphalt Crater on 4th & Market',
    description: 'Deep road depression roughly 3 feet wide near the pedestrian crosswalk. Several vehicles have damaged tires and cyclists are forced into incoming traffic lane.',
    images: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
    ],
    department: 'Roads & Potholes',
    severity: 'High',
    status: 'AI Classified',
    location: {
      lat: 37.7858,
      lng: -122.4065,
      address: '742 Market St, Downtown',
      district: 'Downtown Central'
    },
    reporter: {
      id: 'user_cit_1',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      email: 'elena.citizen@civicconnect.org'
    },
    aiAnalysis: {
      department: 'Roads & Potholes',
      severity: 'High',
      severityReason: 'Severe sub-base degradation creating immediate collision and pedestrian trip hazards during peak commuter hours.',
      urgencyHours: 18,
      estimatedCost: '$650 - $950',
      keywords: ['sinkhole', 'asphalt collapse', 'crosswalk', 'traffic safety'],
      suggestedAction: 'Deploy asphalt cold-patch emergency crew followed by full subsurface compaction.',
      safetyHazard: true,
      confidenceScore: 0.97
    },
    timeline: [
      {
        status: 'Submitted',
        timestamp: '2026-10-06T14:20:00Z',
        actor: 'Elena Rostova',
        actorRole: 'Citizen',
        note: 'Citizen captured geotagged photo with high priority warning.'
      },
      {
        status: 'AI Classified',
        timestamp: '2026-10-06T14:20:04Z',
        actor: 'Civic AI Engine (Gemini 3.8 Flash)',
        actorRole: 'AI Engine',
        note: 'Categorized as High Severity Roads & Potholes. Open for contractor bidding.'
      }
    ],
    upvotes: 42,
    upvotedByUserIds: ['user_cit_1', 'user_cit_2'],
    budgetEstimate: 850,
    bidsCount: 2,
    createdAt: '2026-10-06T14:20:00Z',
    updatedAt: '2026-10-06T14:20:04Z'
  },
  {
    id: 'ISSUE-1002',
    title: 'Ruptured Water Main Flooding Sidewalk & Basement Access',
    description: 'High pressure water valve leaking heavily onto sidewalk near school entrance. Water is pooling rapidly and approaching storefront basements.',
    images: [
      'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80'
    ],
    department: 'Water & Sanitation',
    severity: 'High',
    status: 'Assigned',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: '1120 Van Ness Ave, Civic Center',
      district: 'Civic Center'
    },
    reporter: {
      id: 'user_cit_2',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      email: 'marcus.vance@civicconnect.org'
    },
    aiAnalysis: {
      department: 'Water & Sanitation',
      severity: 'High',
      severityReason: 'Continuous pressurized flow threatening building structural foundations and severe potable water loss.',
      urgencyHours: 8,
      estimatedCost: '$1,200 - $1,800',
      keywords: ['water line', 'valve rupture', 'flooding risk', 'sidewalk'],
      suggestedAction: 'Emergency main valve shutoff followed by hydraulic sleeve replacement.',
      safetyHazard: true,
      confidenceScore: 0.98
    },
    assignedContractor: {
      id: 'user_con_1',
      name: 'Dave Walker',
      companyName: 'Apex Civil & Asphalt Infrastructure',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      assignedAt: '2026-10-06T16:45:00Z'
    },
    timeline: [
      {
        status: 'Submitted',
        timestamp: '2026-10-06T15:10:00Z',
        actor: 'Marcus Vance',
        actorRole: 'Citizen',
        note: 'Submitted with live GPS coordinate lock.'
      },
      {
        status: 'AI Classified',
        timestamp: '2026-10-06T15:10:03Z',
        actor: 'Civic AI Engine (Gemini 3.8 Flash)',
        actorRole: 'AI Engine',
        note: 'Urgency escalated to 8h max turnaround.'
      },
      {
        status: 'Assigned',
        timestamp: '2026-10-06T16:45:00Z',
        actor: 'Dir. Sarah Jenkins',
        actorRole: 'Municipality',
        note: 'Emergency work order directly awarded to Apex Civil.'
      }
    ],
    upvotes: 35,
    upvotedByUserIds: ['user_cit_2'],
    budgetEstimate: 1400,
    bidsCount: 1,
    createdAt: '2026-10-06T15:10:00Z',
    updatedAt: '2026-10-06T16:45:00Z'
  },
  {
    id: 'ISSUE-1003',
    title: 'Exposed High-Voltage Cable on Damaged Light Post',
    description: 'Vehicle collision knocked the service door off a street lighting post, exposing dangling insulated and live conductors next to bus stop.',
    images: [
      'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=800&q=80'
    ],
    department: 'Electricity & Lighting',
    severity: 'High',
    status: 'In Progress',
    location: {
      lat: 37.7649,
      lng: -122.4312,
      address: '2280 Mission St, Mission District',
      district: 'Mission District'
    },
    reporter: {
      id: 'user_cit_1',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      email: 'elena.citizen@civicconnect.org'
    },
    aiAnalysis: {
      department: 'Electricity & Lighting',
      severity: 'High',
      severityReason: 'Active 240V circuit exposed within reach of pedestrians and children at transit stop.',
      urgencyHours: 6,
      estimatedCost: '$450 - $750',
      keywords: ['live wires', 'lamp post', 'electrocution risk', 'transit stop'],
      suggestedAction: 'Immediate breaker isolation and replacement of security panel with grounded cover.',
      safetyHazard: true,
      confidenceScore: 0.99
    },
    assignedContractor: {
      id: 'user_con_3',
      name: 'Lisa Wong',
      companyName: 'BrightVolt Municipal Electrical Corp',
      rating: 4.95,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      assignedAt: '2026-10-06T17:00:00Z'
    },
    contractorWorkNotes: 'Crew arrived at 17:30. Power isolated at junction box. Fitting weatherproof conduit and junction terminal.',
    timeline: [
      {
        status: 'Submitted',
        timestamp: '2026-10-06T16:00:00Z',
        actor: 'Elena Rostova',
        actorRole: 'Citizen',
        note: 'Reported with warning flasher tag.'
      },
      {
        status: 'AI Classified',
        timestamp: '2026-10-06T16:00:02Z',
        actor: 'Civic AI Engine (Gemini 3.8 Flash)',
        actorRole: 'AI Engine',
        note: 'Ranked High Hazard (Score 0.99).'
      },
      {
        status: 'Assigned',
        timestamp: '2026-10-06T17:00:00Z',
        actor: 'Dir. Sarah Jenkins',
        actorRole: 'Municipality',
        note: 'BrightVolt dispatched on rapid SLA contract.'
      },
      {
        status: 'In Progress',
        timestamp: '2026-10-06T17:35:00Z',
        actor: 'Lisa Wong',
        actorRole: 'Contractor',
        note: 'Electrician unit on site; repairs in progress.'
      }
    ],
    upvotes: 56,
    upvotedByUserIds: ['user_cit_1', 'user_cit_2'],
    budgetEstimate: 600,
    bidsCount: 1,
    createdAt: '2026-10-06T16:00:00Z',
    updatedAt: '2026-10-06T17:35:00Z'
  },
  {
    id: 'ISSUE-1004',
    title: 'Severe Commercial Waste Dumping & Debris at Waterfront',
    description: 'Over 15 large industrial bags of broken plaster, tiles, and rotting food packaging dumped illegally behind pier warehouses attracting gulls and rodents.',
    images: [
      'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80'
    ],
    department: 'Garbage & Waste',
    severity: 'Medium',
    status: 'Resolved',
    location: {
      lat: 37.8012,
      lng: -122.3988,
      address: 'Pier 28 Embarcadero Way',
      district: 'Waterfront North'
    },
    reporter: {
      id: 'user_cit_2',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      email: 'marcus.vance@civicconnect.org'
    },
    aiAnalysis: {
      department: 'Garbage & Waste',
      severity: 'Medium',
      severityReason: 'Sanitation violation and rodent attraction in high foot-traffic waterfront tourist district.',
      urgencyHours: 24,
      estimatedCost: '$300 - $550',
      keywords: ['illegal dumping', 'commercial waste', 'bio-sanitation', 'waterfront'],
      suggestedAction: 'Heavy haul waste truck deployment, site decontamination spray, and anti-dumping signage check.',
      safetyHazard: false,
      confidenceScore: 0.95
    },
    assignedContractor: {
      id: 'user_con_2',
      name: 'Carlos Rivera',
      companyName: 'Metro EcoWaste & Rapid Sanitation',
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      assignedAt: '2026-10-05T09:15:00Z'
    },
    beforeImage: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    resolutionNotes: 'Removed 1.4 tons of debris. Area pressure-washed and sanitized. Anti-dumping ordinance placards installed.',
    resolvedAt: '2026-10-05T15:30:00Z',
    timeline: [
      {
        status: 'Submitted',
        timestamp: '2026-10-05T08:00:00Z',
        actor: 'Marcus Vance',
        actorRole: 'Citizen',
        note: 'Reported with 3 geotagged photos.'
      },
      {
        status: 'AI Classified',
        timestamp: '2026-10-05T08:00:03Z',
        actor: 'Civic AI Engine (Gemini 3.8 Flash)',
        actorRole: 'AI Engine',
        note: 'Identified as Garbage & Waste. Priority medium.'
      },
      {
        status: 'Assigned',
        timestamp: '2026-10-05T09:15:00Z',
        actor: 'Dir. Sarah Jenkins',
        actorRole: 'Municipality',
        note: 'Tender accepted from Metro EcoWaste ($380 bid).'
      },
      {
        status: 'In Progress',
        timestamp: '2026-10-05T11:00:00Z',
        actor: 'Carlos Rivera',
        actorRole: 'Contractor',
        note: 'Compactor trucks mobilized to site.'
      },
      {
        status: 'Resolved',
        timestamp: '2026-10-05T15:30:00Z',
        actor: 'Carlos Rivera',
        actorRole: 'Contractor',
        note: 'Site thoroughly cleaned, pressure-washed, and verified with after-photo.'
      }
    ],
    upvotes: 68,
    upvotedByUserIds: ['user_cit_1', 'user_cit_2'],
    budgetEstimate: 380,
    bidsCount: 2,
    createdAt: '2026-10-05T08:00:00Z',
    updatedAt: '2026-10-05T15:30:00Z'
  },
  {
    id: 'ISSUE-1005',
    title: 'Traffic Signal Stuck on Flashing Amber at Busy School Crossing',
    description: 'Intersection lights between Oak and Presidio Blvd are completely unsynchronized, causing near-misses during morning school drop-off hours.',
    images: [
      'https://images.unsplash.com/photo-1542314831-c6a4d27ffc7c?auto=format&fit=crop&w=800&q=80'
    ],
    department: 'Traffic & Signals',
    severity: 'High',
    status: 'AI Classified',
    location: {
      lat: 37.7712,
      lng: -122.4430,
      address: 'Oak St & Presidio Blvd',
      district: 'Western Additions'
    },
    reporter: {
      id: 'user_cit_1',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      email: 'elena.citizen@civicconnect.org'
    },
    aiAnalysis: {
      department: 'Traffic & Signals',
      severity: 'High',
      severityReason: 'High risk of vehicular collision with school-age pedestrians during morning drop-off rush.',
      urgencyHours: 6,
      estimatedCost: '$400 - $700',
      keywords: ['traffic signal', 'flashing amber', 'school zone', 'pedestrian safety'],
      suggestedAction: 'Dispatch signal technician for controller reboot and traffic controller replacement.',
      safetyHazard: true,
      confidenceScore: 0.98
    },
    timeline: [
      {
        status: 'Submitted',
        timestamp: '2026-10-07T08:15:00Z',
        actor: 'Elena Rostova',
        actorRole: 'Citizen',
        note: 'Reported with video and audio proof.'
      },
      {
        status: 'AI Classified',
        timestamp: '2026-10-07T08:15:03Z',
        actor: 'Civic AI Engine (Gemini 3.8 Flash)',
        actorRole: 'AI Engine',
        note: 'Triage rank: High Priority School Zone.'
      }
    ],
    upvotes: 29,
    upvotedByUserIds: ['user_cit_1'],
    budgetEstimate: 500,
    bidsCount: 1,
    createdAt: '2026-10-07T08:15:00Z',
    updatedAt: '2026-10-07T08:15:03Z'
  },
  {
    id: 'ISSUE-1006',
    title: 'Fallen Willow Tree Limb Crushing Park Benches & Walking Trail',
    description: 'Heavy limb snapped during nighttime wind gusts and is blocking the primary accessible ramp into Golden Gate Green Park.',
    images: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
    ],
    department: 'Parks & Environment',
    severity: 'Medium',
    status: 'Submitted',
    location: {
      lat: 37.7690,
      lng: -122.4660,
      address: 'Green Park North Trailhead',
      district: 'Sunset & Parks'
    },
    reporter: {
      id: 'user_cit_2',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      email: 'marcus.vance@civicconnect.org'
    },
    timeline: [
      {
        status: 'Submitted',
        timestamp: '2026-10-07T09:30:00Z',
        actor: 'Marcus Vance',
        actorRole: 'Citizen',
        note: 'Reported by morning park runner.'
      }
    ],
    upvotes: 18,
    upvotedByUserIds: ['user_cit_2'],
    bidsCount: 0,
    createdAt: '2026-10-07T09:30:00Z',
    updatedAt: '2026-10-07T09:30:00Z'
  }
];

export const INITIAL_BIDS: Bid[] = [
  {
    id: 'BID-501',
    issueId: 'ISSUE-1001',
    contractorId: 'user_con_1',
    contractorName: 'Apex Civil & Asphalt Infrastructure',
    contractorRating: 4.9,
    contractorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    licenseNumber: 'LIC-CA-99421',
    bidAmount: 780,
    estimatedDays: 1,
    proposedPlan: 'Full depth asphalt cutout, compacted aggregate base, thermal infrared bonding, and thermoplastic line restriping. Crew ready for tonight 8 PM nightshift.',
    status: 'Pending',
    createdAt: '2026-10-06T15:30:00Z'
  },
  {
    id: 'BID-502',
    issueId: 'ISSUE-1001',
    contractorId: 'user_con_2',
    contractorName: 'Metro EcoWaste & Rapid Sanitation',
    contractorRating: 4.8,
    contractorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    licenseNumber: 'LIC-CA-77145',
    bidAmount: 720,
    estimatedDays: 2,
    proposedPlan: 'Sub-base cleanout and rapid setting concrete-asphalt composite patch.',
    status: 'Pending',
    createdAt: '2026-10-06T16:00:00Z'
  },
  {
    id: 'BID-503',
    issueId: 'ISSUE-1005',
    contractorId: 'user_con_3',
    contractorName: 'BrightVolt Municipal Electrical Corp',
    contractorRating: 4.95,
    contractorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    licenseNumber: 'LIC-CA-83210',
    bidAmount: 480,
    estimatedDays: 1,
    proposedPlan: 'Immediate diagnostic replacement of NEMA TS2 traffic cabinet logic card and pedestrian sensor sync.',
    status: 'Pending',
    createdAt: '2026-10-07T08:45:00Z'
  }
];

// Persistent state class
class CivicDatabase {
  private users: User[] = [...INITIAL_USERS];
  private issues: Issue[] = [...INITIAL_ISSUES];
  private bids: Bid[] = [...INITIAL_BIDS];

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  addUser(user: User): User {
    this.users.push(user);
    return user;
  }

  getIssues(filters?: {
    department?: string;
    severity?: string;
    status?: string;
    district?: string;
    search?: string;
    reporterId?: string;
    contractorId?: string;
  }): Issue[] {
    let result = [...this.issues];

    if (!filters) return result;

    if (filters.department && filters.department !== 'All') {
      result = result.filter(i => i.department === filters.department);
    }
    if (filters.severity && filters.severity !== 'All') {
      result = result.filter(i => i.severity === filters.severity);
    }
    if (filters.status && filters.status !== 'All') {
      result = result.filter(i => i.status === filters.status);
    }
    if (filters.district && filters.district !== 'All') {
      result = result.filter(i => i.location.district.toLowerCase().includes(filters.district!.toLowerCase()));
    }
    if (filters.reporterId) {
      result = result.filter(i => i.reporter.id === filters.reporterId);
    }
    if (filters.contractorId) {
      result = result.filter(i => i.assignedContractor?.id === filters.contractorId);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(i => 
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.location.address.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getIssueById(id: string): Issue | undefined {
    return this.issues.find(i => i.id === id);
  }

  findDuplicateIssue(title: string, description?: string, location?: { lat: number; lng: number }): Issue | undefined {
    const cleanTitle = (title || '').trim().toLowerCase();
    if (!cleanTitle) return undefined;

    return this.issues.find(issue => {
      // Do not treat resolved issues as duplicates for new reports
      if (issue.status === 'Resolved') return false;

      const existingCleanTitle = issue.title.trim().toLowerCase();
      // Exact title match
      if (cleanTitle === existingCleanTitle) return true;

      // Substring containment if sufficiently long
      if (cleanTitle.length > 10 && existingCleanTitle.includes(cleanTitle)) return true;
      if (existingCleanTitle.length > 10 && cleanTitle.includes(existingCleanTitle)) return true;

      // Proximity check: within ~50 meters (0.0006 deg) with common keywords
      if (location && issue.location) {
        const dLat = Math.abs(issue.location.lat - location.lat);
        const dLng = Math.abs(issue.location.lng - location.lng);
        const isNearby = dLat < 0.0006 && dLng < 0.0006;
        
        if (isNearby) {
          const words = cleanTitle.split(/\s+/).filter(w => w.length > 3);
          const hasCommonWord = words.some(w => existingCleanTitle.includes(w));
          if (hasCommonWord) return true;
        }
      }

      return false;
    });
  }

  hasContractorBid(issueId: string, contractorId: string): Bid | undefined {
    return this.bids.find(b => b.issueId === issueId && b.contractorId === contractorId && b.status !== 'Declined');
  }

  createIssue(issue: Issue): Issue {
    this.issues.unshift(issue);
    return issue;
  }

  updateIssue(id: string, updates: Partial<Issue>): Issue | undefined {
    const index = this.issues.findIndex(i => i.id === id);
    if (index === -1) return undefined;

    this.issues[index] = {
      ...this.issues[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.issues[index];
  }

  toggleUpvote(issueId: string, userId: string): Issue | undefined {
    const issue = this.getIssueById(issueId);
    if (!issue) return undefined;

    const hasUpvoted = issue.upvotedByUserIds.includes(userId);
    if (hasUpvoted) {
      issue.upvotedByUserIds = issue.upvotedByUserIds.filter(id => id !== userId);
      issue.upvotes = Math.max(0, issue.upvotes - 1);
    } else {
      issue.upvotedByUserIds.push(userId);
      issue.upvotes += 1;
    }
    issue.updatedAt = new Date().toISOString();
    return issue;
  }

  getBids(issueId?: string, contractorId?: string): Bid[] {
    let result = [...this.bids];
    if (issueId) {
      result = result.filter(b => b.issueId === issueId);
    }
    if (contractorId) {
      result = result.filter(b => b.contractorId === contractorId);
    }
    return result;
  }

  createBid(bid: Bid): Bid {
    this.bids.push(bid);
    // update issue bidsCount
    const issue = this.getIssueById(bid.issueId);
    if (issue) {
      issue.bidsCount = (issue.bidsCount || 0) + 1;
      issue.updatedAt = new Date().toISOString();
    }
    return bid;
  }

  acceptBid(bidId: string, acceptedByOfficial: string): { issue?: Issue; bid?: Bid } {
    const bidIndex = this.bids.findIndex(b => b.id === bidId);
    if (bidIndex === -1) return {};

    const bid = this.bids[bidIndex];
    bid.status = 'Accepted';

    // Decline other bids for the same issue
    this.bids.forEach(b => {
      if (b.issueId === bid.issueId && b.id !== bid.id) {
        b.status = 'Declined';
      }
    });

    const contractorUser = this.getUserById(bid.contractorId);
    const issue = this.getIssueById(bid.issueId);

    if (issue && contractorUser) {
      issue.status = 'Assigned';
      issue.budgetEstimate = bid.bidAmount;
      issue.assignedContractor = {
        id: contractorUser.id,
        name: contractorUser.name,
        companyName: contractorUser.contractorProfile?.companyName || contractorUser.name,
        rating: contractorUser.contractorProfile?.rating || 4.9,
        avatar: contractorUser.avatar,
        assignedAt: new Date().toISOString()
      };

      issue.timeline.push({
        status: 'Assigned',
        timestamp: new Date().toISOString(),
        actor: acceptedByOfficial,
        actorRole: 'Municipality',
        note: `Tender awarded to ${bid.contractorName} for $${bid.bidAmount} (${bid.estimatedDays} days SLA).`
      });

      issue.updatedAt = new Date().toISOString();
    }

    return { issue, bid };
  }

  assignDirectly(issueId: string, contractorId: string, officialName: string, allocatedBudget: number): Issue | undefined {
    const issue = this.getIssueById(issueId);
    const contractor = this.getUserById(contractorId);
    if (!issue || !contractor) return undefined;

    issue.status = 'Assigned';
    issue.budgetEstimate = allocatedBudget || issue.budgetEstimate || 500;
    issue.assignedContractor = {
      id: contractor.id,
      name: contractor.name,
      companyName: contractor.contractorProfile?.companyName || contractor.name,
      rating: contractor.contractorProfile?.rating || 4.9,
      avatar: contractor.avatar,
      assignedAt: new Date().toISOString()
    };

    issue.timeline.push({
      status: 'Assigned',
      timestamp: new Date().toISOString(),
      actor: officialName,
      actorRole: 'Municipality',
      note: `Direct assignment to certified contractor ${contractor.contractorProfile?.companyName || contractor.name}.`
    });

    issue.updatedAt = new Date().toISOString();
    return issue;
  }

  getStats(): CivicStats {
    const total = this.issues.length;
    const active = this.issues.filter(i => i.status !== 'Resolved').length;
    const unassigned = this.issues.filter(i => i.status === 'Submitted' || i.status === 'AI Classified').length;
    const pendingBids = this.bids.filter(b => b.status === 'Pending').length;
    const completed = this.issues.filter(i => i.status === 'Resolved').length;

    const committedBudget = this.issues.reduce((sum, i) => sum + (i.budgetEstimate || 0), 0);

    const byDepartment: Record<string, number> = {};
    const bySeverity: Record<string, number> = { High: 0, Medium: 0, Low: 0 };
    const byStatus: Record<string, number> = {};

    this.issues.forEach(i => {
      byDepartment[i.department] = (byDepartment[i.department] || 0) + 1;
      bySeverity[i.severity] = (bySeverity[i.severity] || 0) + 1;
      byStatus[i.status] = (byStatus[i.status] || 0) + 1;
    });

    return {
      activeIssues: active,
      unassignedIssues: unassigned,
      pendingBids,
      completedIssues: completed,
      avgResolutionDays: 1.8,
      totalCommittedBudget: committedBudget,
      byDepartment,
      bySeverity,
      byStatus
    };
  }

  resetSeed() {
    this.users = [...INITIAL_USERS];
    this.issues = [...INITIAL_ISSUES];
    this.bids = [...INITIAL_BIDS];
  }
}

export const db = new CivicDatabase();
