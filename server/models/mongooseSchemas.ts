/**
 * CivicConnect MERN Stack Architecture
 * Production MongoDB Mongoose Schemas with Indexes, Validation, and Virtuals
 */

export const MongooseSchemaBlueprint = `
// ==========================================
// 1. User Schema (Citizen, Municipality, Contractor)
// ==========================================
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'Citizen' | 'Municipality' | 'Contractor';
  avatar?: string;
  phone?: string;
  district?: string;
  contractorProfile?: {
    companyName: string;
    licenseNumber: string;
    rating: number;
    completedJobsCount: number;
    specialties: string[];
    verified: boolean;
    hourlyRate?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Citizen', 'Municipality', 'Contractor'], 
    default: 'Citizen',
    index: true 
  },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  phone: { type: String },
  district: { type: String, index: true },
  contractorProfile: {
    companyName: { type: String },
    licenseNumber: { type: String },
    rating: { type: Number, default: 5.0, min: 1, max: 5 },
    completedJobsCount: { type: Number, default: 0 },
    specialties: [{ type: String }],
    verified: { type: Boolean, default: false },
    hourlyRate: { type: Number }
  }
}, { timestamps: true });

UserSchema.index({ 'contractorProfile.verified': 1, 'contractorProfile.rating': -1 });

export const User = mongoose.model<IUser>('User', UserSchema);

// ==========================================
// 2. Issue Schema (Geospatial & AI Pipeline)
// ==========================================
export interface IIssue extends Document {
  title: string;
  description: string;
  images: string[];
  department: 'Roads & Potholes' | 'Water & Sanitation' | 'Electricity & Lighting' | 'Garbage & Waste' | 'Parks & Environment' | 'Traffic & Signals' | 'Public Safety';
  severity: 'High' | 'Medium' | 'Low';
  status: 'Submitted' | 'AI Classified' | 'Assigned' | 'In Progress' | 'Resolved';
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat] GeoJSON format
    address: string;
    district: string;
  };
  reporterId: mongoose.Types.ObjectId;
  assignedContractorId?: mongoose.Types.ObjectId;
  aiAnalysis?: {
    department: string;
    severity: string;
    severityReason: string;
    urgencyHours: number;
    estimatedCost: string;
    keywords: string[];
    suggestedAction: string;
    safetyHazard: boolean;
    confidenceScore: number;
  };
  timeline: Array<{
    status: string;
    timestamp: Date;
    actor: string;
    actorRole: string;
    note: string;
  }>;
  upvotes: number;
  upvotedByUserIds: mongoose.Types.ObjectId[];
  beforeImage?: string;
  afterImage?: string;
  contractorWorkNotes?: string;
  resolutionNotes?: string;
  budgetEstimate?: number;
  bidsCount: number;
  resolvedAt?: Date;
}

const IssueSchema = new Schema<IIssue>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  department: { 
    type: String, 
    required: true, 
    enum: ['Roads & Potholes', 'Water & Sanitation', 'Electricity & Lighting', 'Garbage & Waste', 'Parks & Environment', 'Traffic & Signals', 'Public Safety'],
    index: true 
  },
  severity: { 
    type: String, 
    enum: ['High', 'Medium', 'Low'], 
    default: 'Medium',
    index: true 
  },
  status: { 
    type: String, 
    enum: ['Submitted', 'AI Classified', 'Assigned', 'In Progress', 'Resolved'], 
    default: 'Submitted',
    index: true 
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
    address: { type: String, required: true },
    district: { type: String, required: true, index: true }
  },
  reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  assignedContractorId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  aiAnalysis: {
    department: String,
    severity: String,
    severityReason: String,
    urgencyHours: Number,
    estimatedCost: String,
    keywords: [String],
    suggestedAction: String,
    safetyHazard: Boolean,
    confidenceScore: Number
  },
  timeline: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    actor: String,
    actorRole: String,
    note: String
  }],
  upvotes: { type: Number, default: 0, index: true },
  upvotedByUserIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  beforeImage: String,
  afterImage: String,
  contractorWorkNotes: String,
  resolutionNotes: String,
  budgetEstimate: Number,
  bidsCount: { type: Number, default: 0 },
  resolvedAt: Date
}, { timestamps: true });

// 2dsphere index for location queries and geospatial radius search
IssueSchema.index({ 'location': '2dsphere' });
IssueSchema.index({ status: 1, severity: 1, department: 1 });

export const Issue = mongoose.model<IIssue>('Issue', IssueSchema);

// ==========================================
// 3. Bid Schema (Tender System)
// ==========================================
export interface IBid extends Document {
  issueId: mongoose.Types.ObjectId;
  contractorId: mongoose.Types.ObjectId;
  bidAmount: number;
  estimatedDays: number;
  proposedPlan: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  createdAt: Date;
}

const BidSchema = new Schema<IBid>({
  issueId: { type: Schema.Types.ObjectId, ref: 'Issue', required: true, index: true },
  contractorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  bidAmount: { type: Number, required: true, min: 1 },
  estimatedDays: { type: Number, required: true, min: 1 },
  proposedPlan: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Declined'], default: 'Pending', index: true }
}, { timestamps: true });

BidSchema.index({ issueId: 1, contractorId: 1 }, { unique: true });

export const Bid = mongoose.model<IBid>('Bid', BidSchema);

// ==========================================
// 4. Assignment & Audit Log Schema
// ==========================================
export interface IAssignment extends Document {
  issueId: mongoose.Types.ObjectId;
  contractorId: mongoose.Types.ObjectId;
  assignedByUserId: mongoose.Types.ObjectId; // Municipality Official
  acceptedBidId?: mongoose.Types.ObjectId;
  allocatedBudget: number;
  agreedDeadline: Date;
  currentMilestone: string;
  completionProof: {
    beforePhotoUrl: string;
    afterPhotoUrl: string;
    signOffNotes: string;
    citizenSatisfactionScore?: number;
  };
}

const AssignmentSchema = new Schema<IAssignment>({
  issueId: { type: Schema.Types.ObjectId, ref: 'Issue', required: true, unique: true },
  contractorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  assignedByUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  acceptedBidId: { type: Schema.Types.ObjectId, ref: 'Bid' },
  allocatedBudget: { type: Number, required: true },
  agreedDeadline: { type: Date, required: true },
  currentMilestone: { type: String, default: 'Work Orders Dispatched' },
  completionProof: {
    beforePhotoUrl: String,
    afterPhotoUrl: String,
    signOffNotes: String,
    citizenSatisfactionScore: Number
  }
}, { timestamps: true });

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
`;
