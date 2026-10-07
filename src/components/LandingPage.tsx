import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  HardHat, 
  Building2, 
  User as UserIcon, 
  MapPin, 
  Cpu, 
  Zap, 
  Check, 
  Camera, 
  Flame, 
  ShieldCheck
} from 'lucide-react';
import { useCivic } from '../context/CivicContext.js';
import { DEFAULT_IMAGES, handleImageError } from '../utils/imageUtils.js';

export const LandingPage: React.FC = () => {
  const { openAuthModal, issues, stats, setSelectedIssue } = useCivic();

  // Interactive Live AI Triage Demo State
  const [activeAiDemo, setActiveAiDemo] = useState<number>(0);

  const aiDemos = [
    {
      title: 'Deep Roadway Crater & Asphalt Breakdown',
      department: 'Roads & Potholes',
      severity: 'High Priority',
      severityColor: 'from-red-500 to-rose-600',
      sla: '18 Hours',
      cost: '$650 - $950',
      reason: 'Asphalt sub-base collapse near crosswalk posing acute tire puncture & motorcycle blowout hazard.',
      directive: 'Emergency asphalt cold-patch & night shift compaction.',
      image: DEFAULT_IMAGES.pothole,
      location: 'Market St & 4th Ave'
    },
    {
      title: 'Pressurized Water Main Rupture Flooding Walkway',
      department: 'Water & Sanitation',
      severity: 'Critical Hazard',
      severityColor: 'from-blue-500 to-cyan-600',
      sla: '8 Hours',
      cost: '$1,200 - $1,800',
      reason: 'High velocity flow flooding sidewalk and undermining adjacent foundation walls.',
      directive: 'Emergency isolation gate valve shutoff and hydraulic coupling sleeve fitment.',
      image: DEFAULT_IMAGES.water,
      location: '1120 Van Ness Ave'
    },
    {
      title: 'Exposed Dangling Live Conductor on Streetlight',
      department: 'Electricity & Lighting',
      severity: 'High Priority',
      severityColor: 'from-amber-500 to-orange-600',
      sla: '6 Hours',
      cost: '$450 - $750',
      reason: 'Active 240V lighting circuit exposed at pedestrian height near transit bus shelter.',
      directive: 'Line breaker de-energization and weatherproof security hatch rebuild.',
      image: DEFAULT_IMAGES.electric,
      location: 'Mission St & 19th Ave'
    }
  ];

  return (
    <div className="relative overflow-hidden bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-white">
      
      {/* Radiant Background Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-blue-600/25 via-teal-500/15 to-transparent blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-[600px] right-[-100px] w-[600px] h-[600px] bg-orange-500/15 blur-3xl pointer-events-none -z-0 animate-glow-pulse" />
      <div className="absolute top-[1200px] left-[-100px] w-[600px] h-[600px] bg-teal-500/15 blur-3xl pointer-events-none -z-0" />

      {/* ======================================================== */}
      {/* 1. HERO SECTION WITH VIBRANT FLOATING ANIMATIONS */}
      {/* ======================================================== */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-teal-500/30 text-teal-300 text-xs font-semibold shadow-lg shadow-teal-500/15 backdrop-blur-md">
              <span className="flex h-2.5 w-2.5 rounded-full bg-teal-400 animate-ping" />
              <span>Next-Gen Smart City Infrastructure</span>
              <span className="text-slate-600">•</span>
              <span className="text-orange-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Gemini 3.8 Flash AI Triage
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.04]">
              <span className="block text-white">Connect.</span>
              <span className="block bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
                Report.
              </span>
              <span className="block bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                Resolve.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              Transforming how citizens, municipal leaders, and local repair contractors cooperate. Snap photos of neighborhood hazards, let multimodal AI prioritize the repair in under 2 seconds, and track verified before-and-after proof.
            </p>

            {/* Primary Get Started & Sign In CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={() => openAuthModal(undefined, 'signup')}
                className="group relative flex items-center gap-3 bg-gradient-to-r from-orange-500 via-amber-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 text-white px-7 py-4 rounded-2xl font-extrabold text-sm sm:text-base shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                <span>Get Started — Choose Role</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => openAuthModal(undefined, 'signin')}
                className="flex items-center gap-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white px-6 py-4 rounded-2xl font-bold text-sm sm:text-base border border-slate-700/90 hover:border-teal-400/60 shadow-xl transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Sign In to Dashboard</span>
              </button>
            </div>

            {/* Live Stats Row */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {stats?.completedIssues ? `${stats.completedIssues * 240}+` : '1,840+'}
                </p>
                <p className="text-xs text-slate-400 font-medium">Repairs Completed</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-teal-400 font-mono">
                  &lt;1.8s
                </p>
                <p className="text-xs text-slate-400 font-medium">Gemini AI SLA Score</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-orange-400 font-mono">
                  98.4%
                </p>
                <p className="text-xs text-slate-400 font-medium">Citizen Satisfaction</p>
              </div>
            </div>

          </div>

          {/* Right Floating Visual Showcase with City Card & Floating Elements (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main City Graphic Card with Vivid Imagery */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-900">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={DEFAULT_IMAGES.city}
                    alt="Smart Connected City"
                    onError={(e) => handleImageError(e, DEFAULT_IMAGES.city)}
                    className="w-full h-full object-cover scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Status Tag Overlay */}
                  <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-white font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Metro Operations Live Grid</span>
                  </div>
                </div>

                {/* Bottom Card Summary */}
                <div className="p-5 bg-slate-950/95 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">Incident Dispatch Feed</span>
                    <span className="text-teal-400 font-bold font-mono">42 Contractors Active</span>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                    <img 
                      src={DEFAULT_IMAGES.resolved} 
                      alt="Verified Resolution" 
                      onError={(e) => handleImageError(e, DEFAULT_IMAGES.resolved)}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">Waterfront Debris Cleared & Restored</p>
                      <p className="text-[11px] text-emerald-400 font-medium">Before/After Verified by Apex Civil</p>
                    </div>
                    <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                      ✓ Done
                    </span>
                  </div>
                </div>
              </div>

              {/* FLOATING ANIMATED BADGE 1: Top-Left Floating Incident */}
              <div className="absolute -top-6 -left-6 bg-slate-900/95 border border-red-500/40 p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-float-slow hidden sm:flex">
                <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 font-bold shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">4th St Sinkhole</span>
                    <span className="text-[9px] font-bold bg-red-500/20 text-red-300 px-1.5 py-0.2 rounded">HIGH</span>
                  </div>
                  <p className="text-[10px] text-teal-400 font-mono mt-0.5">Gemini Triage SLA: 18h</p>
                </div>
              </div>

              {/* FLOATING ANIMATED BADGE 2: Bottom-Right Floating Tender */}
              <div className="absolute -bottom-6 -right-6 bg-slate-900/95 border border-orange-500/40 p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-float-reverse hidden sm:flex">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold shrink-0">
                  <HardHat className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Apex Civil Works</span>
                    <span className="text-[9px] font-bold bg-orange-500/20 text-orange-300 px-1.5 py-0.2 rounded">DISPATCHED</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">$780 Municipal Contract</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. 'HOW IT WORKS' 4-STEP VISUAL JOURNEY */}
      {/* ======================================================== */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
            Clear, Transparent Process
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            How CivicConnect Solves City Problems
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            From the moment a resident spots a problem on their morning commute to verified photo sign-off.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between space-y-4 hover:border-teal-500/50 transition-all shadow-xl group">
            <div className="space-y-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-700">
                <img 
                  src={DEFAULT_IMAGES.pothole} 
                  alt="Citizen reporting" 
                  onError={(e) => handleImageError(e, DEFAULT_IMAGES.pothole)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-sm text-teal-400 font-mono text-[11px] font-bold px-2 py-0.5 rounded">
                  STEP 01
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                1. Snap & Geotag
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Resident captures high-resolution evidence photos on their phone and pins the exact GPS coordinates on our interactive map.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-teal-400 font-mono flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" />
              <span>Multi-Image + Geopoint Lock</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between space-y-4 hover:border-blue-500/50 transition-all shadow-xl group">
            <div className="space-y-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-700 bg-gradient-to-br from-blue-950 via-slate-900 to-teal-950 flex items-center justify-center p-4">
                <div className="text-center space-y-1">
                  <Sparkles className="w-8 h-8 text-teal-400 mx-auto animate-pulse" />
                  <span className="text-[10px] font-mono text-teal-300 block">Gemini 3.8 Flash Vision</span>
                  <span className="text-[11px] font-bold text-white bg-blue-600/40 px-2 py-0.5 rounded">Autonomous Triage</span>
                </div>
                <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-sm text-blue-400 font-mono text-[11px] font-bold px-2 py-0.5 rounded">
                  STEP 02
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                2. AI Diagnosis & SLA
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multimodal AI analyzes road surface, pipe pressure, or electrical hazard to classify department, urgency, cost, and maximum SLA.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-blue-400 font-mono flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>&lt;2s Multimodal Scoring</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between space-y-4 hover:border-orange-500/50 transition-all shadow-xl group">
            <div className="space-y-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-700">
                <img 
                  src={DEFAULT_IMAGES.electric} 
                  alt="Contractor tender" 
                  onError={(e) => handleImageError(e, DEFAULT_IMAGES.electric)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-sm text-orange-400 font-mono text-[11px] font-bold px-2 py-0.5 rounded">
                  STEP 03
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-orange-300 transition-colors">
                3. Bidding & Dispatch
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tender opens to registered municipal contractors. Municipal officials award contracts with 1 click based on quote & track record.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-orange-400 font-mono flex items-center gap-1">
              <HardHat className="w-3.5 h-3.5" />
              <span>Competitive Tender Award</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-all shadow-xl group">
            <div className="space-y-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-700">
                <img 
                  src={DEFAULT_IMAGES.resolved} 
                  alt="Verified resolution" 
                  onError={(e) => handleImageError(e, DEFAULT_IMAGES.resolved)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-sm text-emerald-400 font-mono text-[11px] font-bold px-2 py-0.5 rounded">
                  STEP 04
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                4. Verified Resolution
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Contractor submits high-res "After" photos upon completing repairs. City supervisors audit and residents rate the work.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Before & After Audit</span>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. INTERACTIVE AI TRIAGE SIMULATOR */}
      {/* ======================================================== */}
      <section id="triage" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left explanation */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                Live Multimodal Demonstration
              </div>

              <h3 className="text-3xl font-extrabold text-white leading-tight">
                Experience Gemini AI Civic Triage in Real Time
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Click different civic incidents below to see how our AI models extract actionable hazard categories, turnaround SLAs, and budgetary estimates.
              </p>

              {/* Scenario Selector Pills */}
              <div className="space-y-2 pt-2">
                {aiDemos.map((demo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveAiDemo(idx)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between text-xs font-bold ${
                      activeAiDemo === idx
                        ? 'bg-blue-600/30 border-teal-400 text-white shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <span className="truncate pr-2">{demo.title}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 shrink-0">
                      {demo.department.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => openAuthModal(undefined, 'signup')}
                className="mt-4 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-5 py-3 rounded-xl text-xs font-bold shadow-lg shadow-orange-500/25 transition-all"
              >
                <span>Report an Issue in Your Neighborhood</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Live AI Diagnostic HUD */}
            <div className="lg:col-span-7">
              {(() => {
                const current = aiDemos[activeAiDemo];
                return (
                  <div className="rounded-3xl bg-slate-950 border border-slate-700/80 overflow-hidden shadow-2xl space-y-4 p-5 sm:p-6">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping"></div>
                        <span className="text-xs font-mono text-teal-400 font-bold">GEMINI 3.8 FLASH CLASSIFIER</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 font-semibold">{current.location}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Incident Photo */}
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800">
                        <img 
                          src={current.image} 
                          alt={current.title} 
                          onError={(e) => handleImageError(e, current.image)}
                          className="w-full h-full object-cover" 
                        />
                        <span className="absolute bottom-2 left-2 text-[10px] font-mono font-bold bg-black/70 text-white px-2 py-0.5 rounded">
                          Evidence Locked
                        </span>
                      </div>

                      {/* AI Diagnostic Metrics */}
                      <div className="space-y-2.5 text-xs">
                        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Department</span>
                          <span className="font-bold text-white text-sm">{current.department}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Severity</span>
                            <span className="font-bold text-orange-400">{current.severity}</span>
                          </div>
                          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Turnaround SLA</span>
                            <span className="font-bold text-teal-300 font-mono">{current.sla}</span>
                          </div>
                        </div>

                        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Repair Budget</span>
                          <span className="font-mono font-bold text-emerald-400">{current.cost}</span>
                        </div>
                      </div>
                    </div>

                    {/* Reasoning & Directive */}
                    <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-xs space-y-1.5">
                      <p className="text-slate-300 leading-relaxed">
                        <strong className="text-slate-400">Risk Assessment:</strong> {current.reason}
                      </p>
                      <p className="text-teal-300 font-medium">
                        <strong className="text-slate-400">Supervisor Directive:</strong> {current.directive}
                      </p>
                    </div>

                  </div>
                );
              })()}
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. CHOOSE YOUR ROLE / GET STARTED SHOWCASE */}
      {/* ======================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
            Tailored Gateways
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Choose Your Role to Get Started
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Sign up or sign in to your dedicated portal. Dashboards are strictly authenticated for safety and accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Citizen */}
          <div 
            onClick={() => openAuthModal('Citizen', 'signup')}
            className="group relative rounded-3xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/80 p-8 shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-white transition-all duration-300">
                <UserIcon className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">For Residents</span>
                <h3 className="text-2xl font-bold text-white group-hover:text-teal-300 transition-colors">
                  Citizen Portal
                </h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Empower your neighborhood. Snap photos of broken roads, water leaks, and power outages. Track repair stages and upvote critical issues.
              </p>

              <ul className="space-y-2.5 pt-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Geotagged Photo Submissions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Gemini Multimodal Triage</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Community Voting & Impact Karma</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-teal-400 group-hover:text-teal-300">
                Get Started as Citizen
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-teal-500 group-hover:text-white flex items-center justify-center text-slate-400 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 2: Municipality */}
          <div 
            onClick={() => openAuthModal('Municipality', 'signup')}
            className="group relative rounded-3xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/80 p-8 shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Building2 className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">For City Officials</span>
                <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                  Municipality HQ
                </h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Centralized municipal cockpit. Review triaged issues by urgency, inspect city heatmaps, manage budget tenders, and dispatch verified contractors.
              </p>

              <ul className="space-y-2.5 pt-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Live GIS Heatmap & Pin Clusters</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>1-Click Contractor Tender Awards</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>District Budget & SLA Dashboards</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 group-hover:text-blue-300">
                Get Started as Municipality
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-slate-400 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 3: Contractor */}
          <div 
            onClick={() => openAuthModal('Contractor', 'signup')}
            className="group relative rounded-3xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-orange-500/80 p-8 shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                <HardHat className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">For Certified Providers</span>
                <h3 className="text-2xl font-bold text-white group-hover:text-orange-300 transition-colors">
                  Contractor Hub
                </h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Connect with municipal revenue opportunities. Bid on neighborhood tenders, advance job milestones, and upload before-and-after proof.
              </p>

              <ul className="space-y-2.5 pt-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Competitive Municipal Tenders</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Active Work Orders & Crew Notes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Before/After Photographic Proof</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-orange-400 group-hover:text-orange-300">
                Get Started as Contractor
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center text-slate-400 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. VERIFIED BEFORE & AFTER RESOLUTIONS SHOWCASE */}
      {/* ======================================================== */}
      <section id="impact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2 uppercase tracking-wider">
              Photo-Verified Outcomes
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Recent Restorations in the Community
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Transparent before and after photographs submitted by certified municipal crews.
            </p>
          </div>

          <button
            onClick={() => openAuthModal(undefined, 'signin')}
            className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 shrink-0"
          >
            <span>Sign In to View Full City Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.slice(0, 3).map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedIssue(item)}
              className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={item.afterImage || item.images[0] || DEFAULT_IMAGES.pothole} 
                  alt={item.title} 
                  onError={(e) => handleImageError(e, DEFAULT_IMAGES.pothole)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                
                <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.status === 'Resolved' ? 'bg-emerald-500 text-white' :
                  item.status === 'In Progress' ? 'bg-orange-500 text-white' :
                  'bg-teal-500 text-white'
                }`}>
                  {item.status}
                </span>

                <span className="absolute top-3 right-3 text-[10px] font-mono font-bold bg-slate-900/80 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                  {item.department.split(' ')[0]}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-teal-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-[11px] truncate max-w-[150px]">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    {item.location.address}
                  </span>
                  <span className="text-teal-400 font-bold font-mono">
                    {item.upvotes} Upvotes
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. BOTTOM CALL-TO-ACTION BANNER */}
      {/* ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="rounded-3xl bg-gradient-to-r from-teal-900/60 via-slate-900 to-orange-950/60 border border-slate-700 p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Ready to Upgrade Your City’s Infrastructure?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Join thousands of residents, municipal directors, and certified engineering contractors actively solving urban issues with CivicConnect.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => openAuthModal(undefined, 'signup')}
              className="bg-gradient-to-r from-orange-500 via-amber-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 text-white px-8 py-4 rounded-2xl font-extrabold text-sm shadow-xl shadow-orange-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Get Started Now — Choose Role
            </button>

            <button
              onClick={() => openAuthModal(undefined, 'signin')}
              className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-4 rounded-2xl font-bold text-sm border border-slate-700 transition-all"
            >
              Sign In to Your Account
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
