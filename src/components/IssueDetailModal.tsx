import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  MapPin, 
  Sparkles, 
  ThumbsUp, 
  CheckCircle2, 
  HardHat, 
  DollarSign, 
  Calendar, 
  Upload, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Check,
  Star
} from 'lucide-react';
import { useCivic } from '../context/CivicContext.js';
import { Issue, IssueStatus } from '../types/civic.js';
import { DEFAULT_IMAGES, handleImageError } from '../utils/imageUtils.js';

interface IssueDetailModalProps {
  issue: Issue | null;
  onClose: () => void;
}

const STATUS_STEPS: IssueStatus[] = [
  'Submitted',
  'AI Classified',
  'Assigned',
  'In Progress',
  'Resolved'
];

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({ issue, onClose }) => {
  const { 
    user, 
    bids, 
    contractors, 
    upvoteIssue, 
    submitBid, 
    acceptBid, 
    directAssign, 
    updateIssueStatus 
  } = useCivic();

  const [activeTab, setActiveTab] = useState<'overview' | 'bids' | 'contractor_action'>('overview');
  
  // Bidding form state
  const [bidAmount, setBidAmount] = useState<number>(650);
  const [estimatedDays, setEstimatedDays] = useState<number>(2);
  const [proposedPlan, setProposedPlan] = useState('');
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);

  // Contractor resolution form state
  const [workNotes, setWorkNotes] = useState('');
  const [afterPhotoUrl, setAfterPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
  );
  const [isResolving, setIsResolving] = useState(false);

  // Direct assign state
  const [selectedContractorId, setSelectedContractorId] = useState('');
  const [assignBudget, setAssignBudget] = useState(700);

  if (!issue) return null;

  const currentStepIndex = STATUS_STEPS.indexOf(issue.status);
  const issueBids = bids.filter(b => b.issueId === issue.id);
  const isAssignedToCurrentUser = user?.role === 'Contractor' && issue.assignedContractor?.id === user.id;

  const handleUpvote = () => {
    upvoteIssue(issue.id);
  };

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBid(true);
    try {
      await submitBid({
        issueId: issue.id,
        bidAmount,
        estimatedDays,
        proposedPlan: proposedPlan || 'Full professional repair to municipal engineering specifications.'
      });
      setActiveTab('bids');
      setProposedPlan('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingBid(false);
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    try {
      await acceptBid(bidId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDirectAssign = async () => {
    if (!selectedContractorId) return;
    try {
      await directAssign(issue.id, selectedContractorId, assignBudget);
    } catch (err) {
      console.error(err);
    }
  };

  const handleContractorProgressUpdate = async (nextStatus: IssueStatus) => {
    setIsResolving(true);
    try {
      await updateIssueStatus(issue.id, {
        status: nextStatus,
        contractorWorkNotes: workNotes || undefined,
        afterImage: nextStatus === 'Resolved' ? afterPhotoUrl : undefined,
        resolutionNotes: nextStatus === 'Resolved' ? workNotes || 'Repairs completed and site cleaned.' : undefined,
        note: `Contractor progressed work to ${nextStatus}.`
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border-b border-slate-800 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                {issue.id}
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">
                {issue.department}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                issue.severity === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                issue.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-teal-500/20 text-teal-400 border border-teal-500/30'
              }`}>
                {issue.severity} Priority
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {issue.location.address}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white leading-tight">
              {issue.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* PROGRESS TRACKER: VISUAL INTERACTIVE TIMELINE */}
        {/* ========================================================= */}
        <div className="px-6 py-5 bg-slate-950/80 border-b border-slate-800/80">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            Civic Resolution Timeline Tracker
          </p>

          <div className="relative flex items-center justify-between">
            {/* Connecting progress bar track */}
            <div className="absolute top-4 left-6 right-6 h-1 bg-slate-800 -z-0">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 transition-all duration-500"
                style={{ width: `${(Math.max(0, currentStepIndex) / (STATUS_STEPS.length - 1)) * 100}%` }}
              />
            </div>

            {STATUS_STEPS.map((stepName, idx) => {
              const isPast = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div key={stepName} className="flex flex-col items-center relative z-10 text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCurrent
                      ? 'bg-orange-500 text-white ring-4 ring-orange-500/20 scale-110 shadow-lg shadow-orange-500/40'
                      : isPast
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    {isPast && !isCurrent ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-[11px] font-semibold mt-2 ${
                    isCurrent ? 'text-orange-400 font-bold' : isPast ? 'text-slate-200' : 'text-slate-500'
                  }`}>
                    {stepName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Subtabs */}
        <div className="px-6 border-b border-slate-800 flex items-center gap-2 bg-slate-900/60">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-teal-500 text-teal-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Evidence
          </button>

          <button
            onClick={() => setActiveTab('bids')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'bids'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Contractor Bids ({issueBids.length})
          </button>

          {(user?.role === 'Contractor' || issue.assignedContractor) && (
            <button
              onClick={() => setActiveTab('contractor_action')}
              className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'contractor_action'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              Contractor Operations & Proof
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Details & Photos */}
              <div className="lg:col-span-2 space-y-5">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Citizen Description
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                    {issue.description}
                  </p>
                </div>

                {/* Before / After Photos or Gallery */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Visual Evidence ({issue.status === 'Resolved' ? 'Before & After Verification' : 'Site Photos'})
                  </h4>

                  {issue.status === 'Resolved' && issue.afterImage ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block">
                          Before (Reported Hazard)
                        </span>
                        <div className="aspect-video rounded-xl overflow-hidden border border-slate-700">
                          <img 
                            src={issue.beforeImage || issue.images[0] || DEFAULT_IMAGES.pothole} 
                            alt="Before" 
                            onError={(e) => handleImageError(e, DEFAULT_IMAGES.pothole)}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          After (Verified Resolution)
                        </span>
                        <div className="aspect-video rounded-xl overflow-hidden border border-emerald-500/50">
                          <img 
                            src={issue.afterImage || DEFAULT_IMAGES.resolved} 
                            alt="After" 
                            onError={(e) => handleImageError(e, DEFAULT_IMAGES.resolved)}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {issue.images.map((img, i) => (
                        <div key={i} className="aspect-video rounded-xl overflow-hidden border border-slate-700">
                          <img 
                            src={img || DEFAULT_IMAGES.pothole} 
                            alt="Evidence" 
                            onError={(e) => handleImageError(e, DEFAULT_IMAGES.pothole)}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Audit Timeline Notes */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Action History & Audit Log
                  </h4>
                  <div className="space-y-2">
                    {issue.timeline.map((event, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-slate-950/40 rounded-xl border border-slate-800/80 text-xs">
                        <div className="w-2 h-2 rounded-full bg-teal-400 mt-1.5 shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-200">{event.status}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-400 mt-0.5">{event.note}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">By {event.actor} ({event.actorRole})</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Col: AI Card, Assigned Contractor & Citizen Action */}
              <div className="space-y-4">
                
                {/* AI Triage Card */}
                {issue.aiAnalysis && (
                  <div className="bg-gradient-to-br from-teal-950/40 via-slate-900 to-slate-900 border border-teal-600/40 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-teal-400" />
                        Gemini AI Assessment
                      </span>
                      <span className="text-[11px] font-mono text-teal-300 font-bold">
                        {(issue.aiAnalysis.confidenceScore * 100).toFixed(0)}% Match
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-snug">
                      {issue.aiAnalysis.severityReason}
                    </p>

                    <div className="pt-2 border-t border-teal-800/40 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Target SLA:</span>
                        <span className="font-semibold text-slate-200">{issue.aiAnalysis.urgencyHours} Hours</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Estimated Cost:</span>
                        <span className="font-semibold text-slate-200">{issue.aiAnalysis.estimatedCost}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Hazard Status:</span>
                        <span className={`font-semibold ${issue.aiAnalysis.safetyHazard ? 'text-red-400' : 'text-emerald-400'}`}>
                          {issue.aiAnalysis.safetyHazard ? 'Hazardous' : 'Non-Critical'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Assigned Contractor Card */}
                {issue.assignedContractor ? (
                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <HardHat className="w-3.5 h-3.5 text-orange-400" />
                        Dispatched Contractor
                      </span>
                      <span className="text-[11px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full font-bold">
                        ★ {issue.assignedContractor.rating}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img 
                        src={issue.assignedContractor.avatar || DEFAULT_IMAGES.avatarContractor} 
                        alt="Contractor" 
                        onError={(e) => handleImageError(e, DEFAULT_IMAGES.avatarContractor)}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <h5 className="font-bold text-sm text-white">{issue.assignedContractor.companyName}</h5>
                        <p className="text-xs text-slate-400">{issue.assignedContractor.name}</p>
                      </div>
                    </div>

                    {issue.contractorWorkNotes && (
                      <div className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <p className="font-bold text-[10px] uppercase text-slate-400 mb-0.5">Field Dispatch Notes:</p>
                        {issue.contractorWorkNotes}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-950/40 border border-dashed border-slate-800 rounded-2xl p-4 text-center">
                    <Building2 className="w-6 h-6 text-slate-500 mx-auto mb-1" />
                    <p className="text-xs text-slate-400 font-medium">Unassigned Tender</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Open for contractor bids or direct municipal assignment.
                    </p>
                  </div>
                )}

                {/* Upvote & Citizen Community Endorsement */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-white block">
                      {issue.upvotes} Citizen Upvotes
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Higher community endorsements accelerate SLA triage.
                    </span>
                  </div>

                  <button
                    onClick={handleUpvote}
                    className="flex items-center gap-1.5 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>+1 Affected</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: Contractor Bids Management */}
          {activeTab === 'bids' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Active Tenders & Contractor Bids</h3>
                  <p className="text-xs text-slate-400">
                    Municipal supervisors review and award contracts. Contractors can submit pricing and SLA timelines.
                  </p>
                </div>
              </div>

              {/* Bids List */}
              <div className="space-y-3">
                {issueBids.length === 0 ? (
                  <div className="py-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800">
                    <HardHat className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-300 font-semibold">No Bids Submitted Yet</p>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-1">
                      Certified contractors can place competitive repair bids below.
                    </p>
                  </div>
                ) : (
                  issueBids.map(bid => (
                    <div 
                      key={bid.id} 
                      className={`p-4 rounded-2xl border transition-all ${
                        bid.status === 'Accepted'
                          ? 'bg-emerald-950/20 border-emerald-500/40'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={bid.contractorAvatar || DEFAULT_IMAGES.avatarContractor} 
                            alt={bid.contractorName} 
                            onError={(e) => handleImageError(e, DEFAULT_IMAGES.avatarContractor)}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-sm text-white">{bid.contractorName}</h5>
                              <span className="text-[11px] bg-slate-800 text-teal-400 px-1.5 py-0.2 rounded font-semibold">
                                ★ {bid.contractorRating}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {bid.licenseNumber}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 mt-1 leading-snug">{bid.proposedPlan}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-base font-extrabold text-orange-400 block font-mono">
                              ${bid.bidAmount}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Estimated {bid.estimatedDays} Day{bid.estimatedDays > 1 ? 's' : ''}
                            </span>
                          </div>

                          {user?.role === 'Municipality' && bid.status === 'Pending' && issue.status !== 'Resolved' && (
                            <button
                              onClick={() => handleAcceptBid(bid.id)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
                            >
                              Award Contract
                            </button>
                          )}

                          {bid.status === 'Accepted' && (
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
                              Awarded ✓
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Direct Assign by Municipality option */}
              {user?.role === 'Municipality' && issue.status !== 'Resolved' && (
                <div className="pt-4 border-t border-slate-800 bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    Direct Dispatch from Certified Contractor Roster
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <select
                        value={selectedContractorId}
                        onChange={(e) => setSelectedContractorId(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                      >
                        <option value="">Select a Verified Contractor...</option>
                        {contractors.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.contractorProfile?.companyName || c.name} (★ {c.contractorProfile?.rating} - {c.contractorProfile?.specialties.join(', ')})
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      disabled={!selectedContractorId}
                      onClick={handleDirectAssign}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                    >
                      Direct Dispatch
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Bid Form for Contractors (with duplicate bid prevention) */}
              {user?.role === 'Contractor' && issue.status !== 'Resolved' && (
                (() => {
                  const myExistingBid = issueBids.find(b => b.contractorId === user?.id && b.status !== 'Declined');
                  if (myExistingBid) {
                    return (
                      <div className="pt-4 border-t border-slate-800 bg-slate-950/60 p-4 rounded-2xl border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold shrink-0">
                            <Check className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white flex items-center gap-2">
                              <span>Your Tender Bid is Active</span>
                              <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full font-mono border border-teal-500/30">
                                {myExistingBid.status}
                              </span>
                            </h4>
                            <p className="text-xs text-slate-300 mt-1">
                              Quote: <strong className="text-orange-400 font-mono">${myExistingBid.bidAmount}</strong> • Turnaround: <strong className="text-white">{myExistingBid.estimatedDays} days</strong>
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Duplicate tenders from the same contractor are prohibited.
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-3 py-1.5 rounded-xl border border-teal-500/30 self-start sm:self-auto">
                          Bid Placed ✓
                        </span>
                      </div>
                    );
                  }

                  return (
                    <form onSubmit={handlePlaceBid} className="pt-4 border-t border-slate-800 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-4">
                      <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                        <HardHat className="w-3.5 h-3.5" />
                        Submit Contractor Tender Bid
                      </h4>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">
                            Proposed Price Quote ($)
                          </label>
                          <input
                            type="number"
                            min="50"
                            step="25"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">
                            Estimated Work Days
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="30"
                            value={estimatedDays}
                            onChange={(e) => setEstimatedDays(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">
                          Technical Repair Plan & Equipment
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Outline repair methodology, materials (e.g. cold-patch mix, PVC fittings), and safety protocol..."
                          value={proposedPlan}
                          onChange={(e) => setProposedPlan(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingBid}
                        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-orange-500/20"
                      >
                        {isSubmittingBid ? 'Submitting Bid...' : 'Submit Tender Bid'}
                      </button>
                    </form>
                  );
                })()
              )}
            </div>
          )}

          {/* TAB 3: Contractor Operations & Photo Proof */}
          {activeTab === 'contractor_action' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white">Contractor Field Management & Verification</h3>
                <p className="text-xs text-slate-400">
                  Update on-site milestones and submit photographic evidence of completed civic restoration.
                </p>
              </div>

              {/* Status Update Buttons */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-4">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Current Status: <span className="text-orange-400">{issue.status}</span>
                </span>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleContractorProgressUpdate('In Progress')}
                    disabled={issue.status === 'In Progress' || issue.status === 'Resolved' || isResolving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    ⚡ Set "In Progress" (Crew on Site)
                  </button>

                  <button
                    onClick={() => handleContractorProgressUpdate('Resolved')}
                    disabled={issue.status === 'Resolved' || isResolving}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Complete & Submit Resolution Proof
                  </button>
                </div>
              </div>

              {/* Resolution Form */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Resolution Proof & "After" Photo
                </h4>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Completion Notes / Materials Used
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Cleared 1.2 tons of debris, patched road with thermal bitumen, certified safe for traffic."
                    value={workNotes}
                    onChange={(e) => setWorkNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    "After" Photo URL (Verification Proof)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={afterPhotoUrl}
                      onChange={(e) => setAfterPhotoUrl(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <div className="w-12 h-9 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                      <img src={afterPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            District: {issue.location.district}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
