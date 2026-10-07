import React, { useState } from 'react';
import { 
  Building2, 
  AlertTriangle, 
  Clock, 
  FileCheck2, 
  DollarSign, 
  CheckCircle2, 
  Filter, 
  Search, 
  HardHat, 
  Sparkles, 
  MapPin, 
  ArrowUpRight, 
  Eye, 
  ChevronRight,
  TrendingUp,
  Map as MapIcon,
  List
} from 'lucide-react';
import { useCivic } from '../context/CivicContext.js';
import { CivicMap } from './CivicMap.js';
import { Issue, DepartmentCategory, SeverityLevel } from '../types/civic.js';
import { DEFAULT_IMAGES, handleImageError } from '../utils/imageUtils.js';

export const MunicipalityDashboard: React.FC = () => {
  const { 
    user, 
    issues, 
    bids, 
    contractors, 
    stats, 
    setSelectedIssue, 
    acceptBid, 
    directAssign 
  } = useCivic();

  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filterDept, setFilterDept] = useState<string>('All');
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Direct assign modal state
  const [assigningIssue, setAssigningIssue] = useState<Issue | null>(null);
  const [selectedContractorId, setSelectedContractorId] = useState('');
  const [allocatedBudget, setAllocatedBudget] = useState(650);

  const departments: DepartmentCategory[] = [
    'Roads & Potholes',
    'Water & Sanitation',
    'Electricity & Lighting',
    'Garbage & Waste',
    'Parks & Environment',
    'Traffic & Signals',
    'Public Safety'
  ];

  const filteredIssues = issues.filter(issue => {
    if (filterDept !== 'All' && issue.department !== filterDept) return false;
    if (filterSeverity !== 'All' && issue.severity !== filterSeverity) return false;
    if (filterStatus !== 'All' && issue.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = issue.title.toLowerCase().includes(q) ||
                    issue.description.toLowerCase().includes(q) ||
                    issue.id.toLowerCase().includes(q) ||
                    issue.location.address.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleOpenDirectAssign = (issue: Issue, e: React.MouseEvent) => {
    e.stopPropagation();
    setAssigningIssue(issue);
    setSelectedContractorId(contractors[0]?.id || '');
    setAllocatedBudget(issue.budgetEstimate || 700);
  };

  const handleConfirmDirectAssign = async () => {
    if (!assigningIssue || !selectedContractorId) return;
    try {
      await directAssign(assigningIssue.id, selectedContractorId, allocatedBudget);
      setAssigningIssue(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Municipality Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/60 border border-blue-700/40 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-500/30">
              Executive Municipal Operations
            </span>
            <span className="text-xs text-slate-400">
              Supervisor: <strong className="text-white">{user?.name}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Metropolitan Works & Infrastructure Triage
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Real-time urban operations oversight. AI triages incoming citizen incident reports, scores safety severity, coordinates competitive contractor tenders, and audits before-and-after proof.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Triage Grid</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'map'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>Geospatial Map</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. OVERVIEW STATS CARDS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Active Issues */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Incidents</span>
            <AlertTriangle className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-3xl font-black text-white font-mono mt-2">
            {stats?.activeIssues ?? issues.filter(i => i.status !== 'Resolved').length}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-orange-400 mt-2 font-medium">
            <span>High Severity: {issues.filter(i => i.severity === 'High' && i.status !== 'Resolved').length}</span>
            <span>•</span>
            <span>Require Action</span>
          </div>
        </div>

        {/* Unassigned Issues */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Unassigned Tenders</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400 font-mono mt-2">
            {stats?.unassignedIssues ?? issues.filter(i => i.status === 'Submitted' || i.status === 'AI Classified').length}
          </p>
          <div className="text-[11px] text-slate-400 mt-2 font-medium">
            Open for bidding or direct dispatch
          </div>
        </div>

        {/* Pending Bids */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Contractor Bids</span>
            <FileCheck2 className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-blue-400 font-mono mt-2">
            {stats?.pendingBids ?? bids.filter(b => b.status === 'Pending').length}
          </p>
          <div className="text-[11px] text-teal-400 mt-2 font-medium">
            Across {contractors.length} Certified Companies
          </div>
        </div>

        {/* Completed Issues */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Resolved & Audited</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400 font-mono mt-2">
            {stats?.completedIssues ?? issues.filter(i => i.status === 'Resolved').length}
          </p>
          <div className="text-[11px] text-slate-400 mt-2 font-medium">
            Total Budget: ${stats?.totalCommittedBudget?.toLocaleString() || '3,800'}
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* MAP VIEW TOGGLE */}
      {/* ========================================================= */}
      {viewMode === 'map' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400" />
                Citywide Incident Heatmap & Dispatch Coordinates
              </h3>
              <p className="text-xs text-slate-400">
                Markers color-coded by severity (Red = High, Orange = Medium, Teal = Low). Click any marker to view triage card and dispatch contractors.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> High</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Medium</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span> Low</span>
            </div>
          </div>

          <CivicMap
            mode="view"
            height="460px"
            issues={filteredIssues}
            onIssueSelect={(issue) => setSelectedIssue(issue)}
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. ISSUE TRIAGE GRID & FILTERS */}
      {/* ========================================================= */}
      <div className="space-y-4">
        
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search triage by title, ID, address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500"
              />
            </div>

            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200"
            >
              <option value="All">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200"
            >
              <option value="All">All Severities</option>
              <option value="High">High Severity</option>
              <option value="Medium">Medium Severity</option>
              <option value="Low">Low Severity</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="AI Classified">AI Classified (Needs Dispatch)</option>
              <option value="Assigned">Assigned to Contractor</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {filteredIssues.length} Matches
          </span>

        </div>

        {/* Triage Table / List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Issue / Title</th>
                  <th className="py-3.5 px-4">Department & AI Triage</th>
                  <th className="py-3.5 px-4">Severity & SLA</th>
                  <th className="py-3.5 px-4">Status & Assigned Contractor</th>
                  <th className="py-3.5 px-4">Bids</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredIssues.map((issue) => {
                  const issueBids = bids.filter(b => b.issueId === issue.id);
                  const isHigh = issue.severity === 'High';
                  const needsAssignment = issue.status === 'Submitted' || issue.status === 'AI Classified';

                  return (
                    <tr 
                      key={issue.id}
                      onClick={() => setSelectedIssue(issue)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      {/* Title & Photo */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={issue.status === 'Resolved' && issue.afterImage ? issue.afterImage : (issue.images[0] || DEFAULT_IMAGES.pothole)}
                            alt={issue.title}
                            onError={(e) => handleImageError(e, DEFAULT_IMAGES.pothole)}
                            className="w-12 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <span className="font-mono text-[10px] text-teal-400 font-bold block">{issue.id}</span>
                            <span className="font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1 max-w-xs">
                              {issue.title}
                            </span>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              {issue.location.address}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Department & AI Confidence */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-200 block">
                          {issue.department}
                        </span>
                        {issue.aiAnalysis ? (
                          <span className="text-[10px] text-teal-400 font-mono flex items-center gap-1 mt-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            AI Conf: {(issue.aiAnalysis.confidenceScore * 100).toFixed(0)}%
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500">Heuristic Triage</span>
                        )}
                      </td>

                      {/* Severity & SLA */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                          isHigh ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          issue.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                        }`}>
                          {issue.severity} Priority
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                          Target: {issue.aiAnalysis?.urgencyHours || 24}h SLA
                        </span>
                      </td>

                      {/* Status & Contractor */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          issue.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          issue.status === 'In Progress' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                          issue.status === 'Assigned' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {issue.status}
                        </span>

                        {issue.assignedContractor ? (
                          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-300">
                            <HardHat className="w-3 h-3 text-orange-400" />
                            <span className="truncate max-w-[120px]">{issue.assignedContractor.companyName}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 block mt-0.5">Unassigned</span>
                        )}
                      </td>

                      {/* Bids */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs font-bold text-slate-200">
                          {issueBids.length} Bid{issueBids.length === 1 ? '' : 's'}
                        </span>
                        {issueBids.length > 0 && (
                          <span className="text-[10px] text-teal-400 block">
                            Min: ${Math.min(...issueBids.map(b => b.bidAmount))}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          {needsAssignment ? (
                            <button
                              onClick={(e) => handleOpenDirectAssign(issue, e)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shadow-sm"
                            >
                              Dispatch
                            </button>
                          ) : null}

                          <button
                            onClick={() => setSelectedIssue(issue)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-1.5 rounded-lg text-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* DIRECT ASSIGN MODAL FOR MUNICIPALITY */}
      {/* ========================================================= */}
      {assigningIssue && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                Dispatch Certified Contractor
              </h3>
              <button
                onClick={() => setAssigningIssue(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                &times;
              </button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1">
              <p className="font-bold text-white">{assigningIssue.title}</p>
              <p className="text-slate-400">{assigningIssue.location.address}</p>
              <p className="text-teal-400 font-mono">Department: {assigningIssue.department}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Select Certified Provider
                </label>
                <div className="space-y-2">
                  {contractors.map(c => (
                    <label 
                      key={c.id} 
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedContractorId === c.id
                          ? 'bg-blue-950/30 border-blue-500'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="contractor"
                        value={c.id}
                        checked={selectedContractorId === c.id}
                        onChange={() => setSelectedContractorId(c.id)}
                        className="text-blue-500"
                      />
                      <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{c.contractorProfile?.companyName || c.name}</span>
                          <span className="text-teal-400 font-semibold">★ {c.contractorProfile?.rating}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {c.contractorProfile?.licenseNumber} • {c.contractorProfile?.specialties.join(', ')}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Allocated Municipal Budget ($ USD)
                </label>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={allocatedBudget}
                  onChange={(e) => setAllocatedBudget(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setAssigningIssue(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDirectAssign}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all"
              >
                Confirm Direct Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
