import React, { useState } from 'react';
import { 
  PlusCircle, 
  MapPin, 
  ThumbsUp, 
  Clock, 
  Sparkles, 
  Filter, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  User, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useCivic } from '../context/CivicContext.js';
import { Issue, DepartmentCategory } from '../types/civic.js';
import { DEFAULT_IMAGES, handleImageError } from '../utils/imageUtils.js';

export const CitizenDashboard: React.FC = () => {
  const { 
    user, 
    issues, 
    setIsReportModalOpen, 
    setSelectedIssue, 
    upvoteIssue 
  } = useCivic();

  const [filterView, setFilterView] = useState<'all' | 'my_reports'>('all');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

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
    if (filterView === 'my_reports' && issue.reporter.id !== user?.id) {
      return false;
    }
    if (selectedDept !== 'All' && issue.department !== selectedDept) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = issue.title.toLowerCase().includes(q) ||
                    issue.description.toLowerCase().includes(q) ||
                    issue.location.address.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const myReportCount = issues.filter(i => i.reporter.id === user?.id).length;
  const myResolvedCount = issues.filter(i => i.reporter.id === user?.id && i.status === 'Resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Citizen Welcome & Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-950/70 via-slate-900 to-slate-900 border border-teal-700/40 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full border border-teal-500/30">
              Citizen Portal
            </span>
            <span className="text-xs text-slate-400">
              Welcome back, <strong className="text-white">{user?.name}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Make Your Neighborhood Safer & Cleaner
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Report infrastructure defects with photos. Our Google Gemini Vision AI will triage your report within seconds and dispatch certified municipal teams.
          </p>
        </div>

        {/* CTA to Open Reporting Modal */}
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="flex items-center gap-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all shrink-0 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Problem</span>
        </button>
      </div>

      {/* Mini Stats Grid for Citizen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            My Submissions
          </span>
          <p className="text-2xl font-black text-white font-mono mt-1">{myReportCount}</p>
          <span className="text-[10px] text-teal-400 mt-0.5 block">{myResolvedCount} Resolved Successfully</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Total City Reports
          </span>
          <p className="text-2xl font-black text-teal-400 font-mono mt-1">{issues.length}</p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Live community issues</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Avg Turnaround SLA
          </span>
          <p className="text-2xl font-black text-orange-400 font-mono mt-1">18 Hours</p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">AI-Assisted Dispatch</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            My Home District
          </span>
          <p className="text-base font-bold text-slate-200 truncate mt-1">
            {user?.district || 'Downtown District'}
          </p>
          <span className="text-[10px] text-teal-400 mt-0.5 block">Civic Precinct #4</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        
        {/* Toggle View: All vs My Reports */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setFilterView('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterView === 'all'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Neighborhood Reports ({issues.length})
          </button>
          <button
            onClick={() => setFilterView('my_reports')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterView === 'my_reports'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            My Reports ({myReportCount})
          </button>
        </div>

        {/* Search & Department Dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search issues, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="All">All Categories</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Issues Grid with Timeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIssues.map((issue) => {
          const isMine = issue.reporter.id === user?.id;
          const isResolved = issue.status === 'Resolved';
          const isHigh = issue.severity === 'High';

          return (
            <div
              key={issue.id}
              onClick={() => setSelectedIssue(issue)}
              className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={isResolved && issue.afterImage ? issue.afterImage : (issue.images[0] || DEFAULT_IMAGES.pothole)}
                    alt={issue.title}
                    onError={(e) => handleImageError(e, DEFAULT_IMAGES.pothole)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                  {/* Severity Badge */}
                  <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isHigh ? 'bg-red-500 text-white' :
                    issue.severity === 'Medium' ? 'bg-amber-500 text-slate-950' :
                    'bg-teal-500 text-white'
                  }`}>
                    {issue.severity} Priority
                  </span>

                  {/* Status Badge */}
                  <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isResolved ? 'bg-emerald-500 text-white' :
                    issue.status === 'In Progress' ? 'bg-orange-500 text-white' :
                    'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {issue.status}
                  </span>

                  {isMine && (
                    <span className="absolute bottom-3 left-3 text-[9px] bg-teal-500/90 text-white font-bold px-1.5 py-0.5 rounded">
                      My Submission
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                      {issue.department}
                    </span>
                    <h3 className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors line-clamp-2 mt-0.5">
                      {issue.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {issue.description}
                  </p>

                  {/* AI Quick Insight */}
                  {issue.aiAnalysis && (
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-teal-400" />
                        AI Triage Conf:
                      </span>
                      <span className="text-teal-300 font-mono font-bold">
                        {(issue.aiAnalysis.confidenceScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}

                  {/* Progress Milestone Line Indicator */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>Status Stage</span>
                      <span className="font-bold text-slate-200">{issue.status}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-orange-400 rounded-full"
                        style={{
                          width: 
                            issue.status === 'Submitted' ? '20%' :
                            issue.status === 'AI Classified' ? '40%' :
                            issue.status === 'Assigned' ? '60%' :
                            issue.status === 'In Progress' ? '80%' : '100%'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1 text-[11px] truncate max-w-[150px]">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                  {issue.location.address}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    upvoteIssue(issue.id);
                  }}
                  className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
                >
                  <ThumbsUp className="w-3 h-3 text-teal-400" />
                  <span>{issue.upvotes}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {filteredIssues.length === 0 && (
        <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800">
          <AlertTriangle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Issues Match Filters</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, selecting another category, or report a new neighborhood problem.
          </p>
        </div>
      )}

    </div>
  );
};
