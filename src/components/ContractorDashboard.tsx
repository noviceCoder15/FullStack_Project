import React, { useState } from 'react';
import { 
  HardHat, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Upload, 
  FileText, 
  ChevronRight, 
  Sparkles,
  Phone,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { useCivic } from '../context/CivicContext.js';
import { Issue } from '../types/civic.js';
import { DEFAULT_IMAGES, handleImageError } from '../utils/imageUtils.js';

export const ContractorDashboard: React.FC = () => {
  const { 
    user, 
    issues, 
    bids, 
    setSelectedIssue, 
    submitBid, 
    updateIssueStatus 
  } = useCivic();

  const [activeTab, setActiveTab] = useState<'bidding_center' | 'active_jobs' | 'completed_jobs'>('active_jobs');
  
  // Quick Bid modal state
  const [biddingIssue, setBiddingIssue] = useState<Issue | null>(null);
  const [bidAmount, setBidAmount] = useState(620);
  const [estimatedDays, setEstimatedDays] = useState(2);
  const [proposedPlan, setProposedPlan] = useState('');
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);

  // Quick Resolve modal state
  const [resolvingIssue, setResolvingIssue] = useState<Issue | null>(null);
  const [workNotes, setWorkNotes] = useState('');
  const [afterPhoto, setAfterPhoto] = useState(
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
  );
  const [isSubmittingResolution, setIsSubmittingResolution] = useState(false);

  // Filter issues for contractor
  const openTenders = issues.filter(i => i.status === 'Submitted' || i.status === 'AI Classified');
  const myAssignedJobs = issues.filter(i => 
    i.assignedContractor?.id === user?.id && (i.status === 'Assigned' || i.status === 'In Progress')
  );
  const myCompletedJobs = issues.filter(i => 
    i.assignedContractor?.id === user?.id && i.status === 'Resolved'
  );

  const myBids = bids.filter(b => b.contractorId === user?.id);
  const totalEarned = myCompletedJobs.reduce((sum, i) => sum + (i.budgetEstimate || 0), 0);

  const handleOpenBid = (issue: Issue, e: React.MouseEvent) => {
    e.stopPropagation();
    const existing = bids.find(b => b.issueId === issue.id && b.contractorId === user?.id && b.status !== 'Declined');
    if (existing) return;
    setBiddingIssue(issue);
    setBidAmount(issue.budgetEstimate || 650);
    setEstimatedDays(1);
    setProposedPlan(`Full professional execution by ${user?.contractorProfile?.companyName || user?.name}. Guaranteed adherence to municipal safety protocols.`);
  };

  const handleConfirmBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!biddingIssue) return;
    setIsSubmittingBid(true);
    try {
      await submitBid({
        issueId: biddingIssue.id,
        bidAmount,
        estimatedDays,
        proposedPlan
      });
      setBiddingIssue(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingBid(false);
    }
  };

  const handleProgressStatus = async (issueId: string, nextStatus: 'In Progress' | 'Resolved') => {
    if (nextStatus === 'Resolved') {
      const target = issues.find(i => i.id === issueId);
      if (target) setResolvingIssue(target);
      return;
    }

    try {
      await updateIssueStatus(issueId, {
        status: nextStatus,
        note: `Contractor unit on site; status moved to ${nextStatus}.`
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmResolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingIssue) return;
    setIsSubmittingResolution(true);
    try {
      await updateIssueStatus(resolvingIssue.id, {
        status: 'Resolved',
        contractorWorkNotes: workNotes,
        afterImage: afterPhoto,
        resolutionNotes: workNotes || 'Restoration complete and verified with after-photo.',
        note: 'Contractor uploaded completion photo and marked resolved.'
      });
      setResolvingIssue(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingResolution(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Contractor Header Banner & Profile */}
      <div className="rounded-3xl bg-gradient-to-r from-orange-950/70 via-slate-900 to-amber-950/60 border border-orange-700/40 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <img 
            src={user?.avatar || DEFAULT_IMAGES.avatarContractor} 
            alt="Profile" 
            onError={(e) => handleImageError(e, DEFAULT_IMAGES.avatarContractor)}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-500 shadow-xl shrink-0"
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold bg-orange-500/20 text-orange-300 px-2.5 py-0.5 rounded-full border border-orange-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Municipal Contractor
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {user?.contractorProfile?.licenseNumber || 'LIC-CA-99421'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {user?.contractorProfile?.companyName || user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Representative: <strong className="text-white">{user?.name}</strong> • Phone: {user?.contractorProfile?.phone || '+1 (555) 392-8101'}
            </p>
          </div>
        </div>

        {/* Rating and Badges */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center gap-6 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Performance Score</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-xl font-black text-white font-mono">
                {user?.contractorProfile?.rating || 4.9}
              </span>
              <span className="text-xs text-slate-400">/ 5.0</span>
            </div>
          </div>
          <div className="border-l border-slate-800 pl-6">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Completed Works</span>
            <span className="text-xl font-black text-teal-400 font-mono block mt-0.5">
              {user?.contractorProfile?.completedJobsCount || 142}
            </span>
          </div>
        </div>
      </div>

      {/* Contractor KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Active Dispatched Jobs
          </span>
          <p className="text-3xl font-black text-orange-400 font-mono mt-1">
            {myAssignedJobs.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">In Progress / Assigned</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Open City Tenders
          </span>
          <p className="text-3xl font-black text-teal-400 font-mono mt-1">
            {openTenders.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Ready for contractor bidding</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            My Pending Bids
          </span>
          <p className="text-3xl font-black text-blue-400 font-mono mt-1">
            {myBids.filter(b => b.status === 'Pending').length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Awaiting Municipality approval</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Total Payout Disbursed
          </span>
          <p className="text-3xl font-black text-emerald-400 font-mono mt-1">
            ${totalEarned > 0 ? totalEarned.toLocaleString() : '1,980'}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Municipal fund releases</span>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="border-b border-slate-800 flex items-center gap-3">
        <button
          onClick={() => setActiveTab('active_jobs')}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'active_jobs'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HardHat className="w-4 h-4" />
          <span>Active Assigned Jobs ({myAssignedJobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bidding_center')}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'bidding_center'
              ? 'border-teal-500 text-teal-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Bidding Center & Tenders ({openTenders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('completed_jobs')}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'completed_jobs'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Completed & Proof Archive ({myCompletedJobs.length})</span>
        </button>
      </div>

      {/* TAB 1: ACTIVE JOBS HUB */}
      {activeTab === 'active_jobs' && (
        <div className="space-y-4">
          {myAssignedJobs.length === 0 ? (
            <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800">
              <HardHat className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No Active Jobs Right Now</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Visit the Bidding Center to submit proposals on open tenders.
              </p>
              <button
                onClick={() => setActiveTab('bidding_center')}
                className="mt-4 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Explore Open Tenders
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myAssignedJobs.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue)}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl space-y-4 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={issue.images[0] || DEFAULT_IMAGES.pothole}
                        alt={issue.title}
                        onError={(e) => handleImageError(e, DEFAULT_IMAGES.pothole)}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <span className="font-mono text-[10px] text-teal-400 font-bold block">{issue.id}</span>
                        <h4 className="font-bold text-sm text-white line-clamp-1">{issue.title}</h4>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {issue.location.address}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      issue.status === 'In Progress' 
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {issue.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    {issue.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Allocated Budget</span>
                      <span className="font-mono font-bold text-white">${issue.budgetEstimate || 750}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Severity</span>
                      <span className="font-bold text-orange-400">{issue.severity} Priority</span>
                    </div>
                  </div>

                  {issue.contractorWorkNotes && (
                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                      <strong className="text-slate-400">On-Site Log:</strong> {issue.contractorWorkNotes}
                    </div>
                  )}

                  {/* Operational Action Controls */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                    {issue.status === 'Assigned' && (
                      <button
                        onClick={() => handleProgressStatus(issue.id, 'In Progress')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
                      >
                        ⚡ Dispatch Crew & Start Work
                      </button>
                    )}

                    {issue.status === 'In Progress' && (
                      <button
                        onClick={() => setResolvingIssue(issue)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Upload Proof & Complete Job</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedIssue(issue)}
                      className="text-xs text-slate-400 hover:text-white font-medium"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BIDDING CENTER */}
      {activeTab === 'bidding_center' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Active Municipal Tenders Open for Bidding</h3>
              <p className="text-xs text-slate-400">
                Submit competitive bids with cost and turnaround estimates. Municipal directors review and award tenders.
              </p>
            </div>
            <span className="text-xs font-mono text-teal-400 font-bold bg-teal-500/10 px-2 py-1 rounded">
              {openTenders.length} Open Opportunities
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openTenders.map((issue) => {
              const myExistingBid = bids.find(b => b.issueId === issue.id && b.contractorId === user?.id);

              return (
                <div
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue)}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800">
                      <img 
                        src={issue.images[0] || DEFAULT_IMAGES.pothole} 
                        alt={issue.title} 
                        onError={(e) => handleImageError(e, DEFAULT_IMAGES.pothole)}
                        className="w-full h-full object-cover" 
                      />
                      <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded ${
                        issue.severity === 'High' ? 'bg-red-500 text-white' : 'bg-amber-500 text-slate-950'
                      }`}>
                        {issue.severity} Priority
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-teal-400">{issue.department}</span>
                      <h4 className="font-bold text-sm text-white line-clamp-1">{issue.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{issue.description}</p>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Estimated Budget:</span>
                      <span className="font-bold text-white">${issue.budgetEstimate || 750}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800" onClick={(e) => e.stopPropagation()}>
                    {myExistingBid ? (
                      <div className="bg-teal-950/40 border border-teal-800/60 p-2 rounded-xl text-center text-xs text-teal-300 font-medium">
                        Bid Submitted: ${myExistingBid.bidAmount} ({myExistingBid.status})
                      </div>
                    ) : (
                      <button
                        onClick={(e) => handleOpenBid(issue, e)}
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-2 rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
                      >
                        Place Tender Bid
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: COMPLETED JOBS & PROOF ARCHIVE */}
      {activeTab === 'completed_jobs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myCompletedJobs.map((issue) => (
              <div 
                key={issue.id}
                onClick={() => setSelectedIssue(issue)}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-teal-400 font-bold">{issue.id}</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Verified Resolution ✓
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white">{issue.title}</h4>

                {/* Before & After Preview */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Before:</span>
                    <div className="aspect-video rounded-xl overflow-hidden border border-slate-800">
                      <img 
                        src={issue.beforeImage || issue.images[0] || DEFAULT_IMAGES.pothole} 
                        alt="Before" 
                        onError={(e) => handleImageError(e, DEFAULT_IMAGES.pothole)}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">After (Repaired):</span>
                    <div className="aspect-video rounded-xl overflow-hidden border border-emerald-500/40">
                      <img 
                        src={issue.afterImage || DEFAULT_IMAGES.resolved} 
                        alt="After" 
                        onError={(e) => handleImageError(e, DEFAULT_IMAGES.resolved)}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <strong className="text-slate-400">Sign-Off Notes:</strong> {issue.resolutionNotes || 'Restoration complete.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUICK BID MODAL */}
      {biddingIssue && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HardHat className="w-4 h-4 text-orange-400" />
                Submit Tender Bid
              </h3>
              <button onClick={() => setBiddingIssue(null)} className="text-slate-400 hover:text-white text-sm">
                &times;
              </button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1">
              <p className="font-bold text-white">{biddingIssue.title}</p>
              <p className="text-slate-400">{biddingIssue.location.address}</p>
            </div>

            <form onSubmit={handleConfirmBid} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Quoted Amount ($ USD)
                  </label>
                  <input
                    type="number"
                    min="50"
                    step="25"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Turnaround (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={estimatedDays}
                    onChange={(e) => setEstimatedDays(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Proposed Repair Methodology
                </label>
                <textarea
                  rows={3}
                  value={proposedPlan}
                  onChange={(e) => setProposedPlan(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setBiddingIssue(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBid}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  {isSubmittingBid ? 'Submitting...' : 'Confirm Bid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK RESOLUTION & PHOTO UPLOAD MODAL */}
      {resolvingIssue && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Upload Resolution Proof & Sign Off
              </h3>
              <button onClick={() => setResolvingIssue(null)} className="text-slate-400 hover:text-white text-sm">
                &times;
              </button>
            </div>

            <form onSubmit={handleConfirmResolution} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Field Completion Notes
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Cleared 1.4 tons of debris, patched road with thermal bitumen, certified safe for traffic."
                  value={workNotes}
                  onChange={(e) => setWorkNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  "After" Photo URL (Verification Proof)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={afterPhoto}
                    onChange={(e) => setAfterPhoto(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <div className="w-12 h-9 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                    <img src={afterPhoto} alt="After" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setResolvingIssue(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingResolution}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  {isSubmittingResolution ? 'Submitting...' : 'Mark Job Resolved'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
