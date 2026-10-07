import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  Building2, 
  HardHat, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Mail, 
  ShieldCheck, 
  Zap,
  MapPin,
  Briefcase
} from 'lucide-react';
import { useCivic } from '../context/CivicContext.js';
import { UserRole } from '../types/civic.js';

export const AuthRoleModal: React.FC = () => {
  const { 
    authModalOpen, 
    closeAuthModal, 
    authTargetRole, 
    setAuthTargetRole, 
    authMode, 
    setAuthMode, 
    loginAsRole, 
    registerUser,
    loading 
  } = useCivic();

  // Custom form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState('Downtown Arts District');
  const [companyName, setCompanyName] = useState('');

  if (!authModalOpen) return null;

  const handleSelectRole = (role: UserRole) => {
    setAuthTargetRole(role);
  };

  const handle1ClickDemo = (role: UserRole) => {
    loginAsRole(role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'signin') {
      // Sign in as the chosen role
      if (authTargetRole) {
        loginAsRole(authTargetRole);
      }
    } else {
      // Sign up new user
      if (authTargetRole) {
        registerUser({
          name: name || `${authTargetRole} User`,
          email: email || `user_${Date.now()}@civicconnect.org`,
          role: authTargetRole,
          district: district || 'Metropolitan Core',
          companyName: companyName || undefined
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-blue-950/50 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-orange-500 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-teal-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-sm text-white">CivicConnect Auth</span>
              <span className="text-[11px] text-teal-400 font-medium block leading-none mt-0.5">
                Role-Gated City Management
              </span>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: STEP 1 (Choose Role) OR STEP 2 (Auth Form) */}
        <div className="p-6 sm:p-8">
          
          {!authTargetRole ? (
            /* ======================================================== */
            /* STEP 1: CHOOSE CIVIC ROLE PAGE */
            /* ======================================================== */
            <div className="space-y-6">
              <div className="text-center max-w-md mx-auto space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-bold border border-teal-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Step 1 of 2: Select Role
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Choose Your Civic Pathway
                </h2>
                <p className="text-xs text-slate-400">
                  Select your role to access specialized reporting tools, municipal oversight, or contractor tender centers.
                </p>
              </div>

              {/* Role Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                
                {/* 1. Citizen */}
                <div 
                  onClick={() => handleSelectRole('Citizen')}
                  className="group relative rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-teal-500/80 p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/10 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                      <UserIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Residents</span>
                      <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                        Citizen
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Snap & geotag community defects, receive AI triage alerts, and track progress.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-teal-400">
                    <span>Select Citizen</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 2. Municipality */}
                <div 
                  onClick={() => handleSelectRole('Municipality')}
                  className="group relative rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-blue-500/80 p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">City Hall</span>
                      <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                        Municipality
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Citywide triage grid, contractor tender management, and district heatmaps.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-blue-400">
                    <span>Select Official</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 3. Contractor */}
                <div 
                  onClick={() => handleSelectRole('Contractor')}
                  className="group relative rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-orange-500/80 p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                      <HardHat className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Providers</span>
                      <h3 className="text-base font-bold text-white group-hover:text-orange-300 transition-colors">
                        Contractor
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Browse open municipal tenders, submit bids, and upload Before/After proof.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-orange-400">
                    <span>Select Contractor</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>

              {/* Fast 1-Click Demo Evaluation Strip */}
              <div className="pt-4 border-t border-slate-800/80 bg-slate-950/50 p-4 rounded-2xl border border-slate-800 text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  ⚡ 1-Click Instant Evaluator Access:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handle1ClickDemo('Citizen')}
                    className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 px-3 py-1.5 rounded-xl font-medium transition-colors"
                  >
                    Demo Citizen (Elena)
                  </button>
                  <button
                    onClick={() => handle1ClickDemo('Municipality')}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 px-3 py-1.5 rounded-xl font-medium transition-colors"
                  >
                    Demo Municipality (Dir. Jenkins)
                  </button>
                  <button
                    onClick={() => handle1ClickDemo('Contractor')}
                    className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 px-3 py-1.5 rounded-xl font-medium transition-colors"
                  >
                    Demo Contractor (Apex Civil)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ======================================================== */
            /* STEP 2: AUTH SCREEN ADAPTED TO CHOSEN ROLE */
            /* ======================================================== */
            <div className="space-y-6">
              
              {/* Header with back button */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setAuthTargetRole(null)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Choose Different Role</span>
                </button>

                <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                  authTargetRole === 'Citizen' ? 'bg-teal-500/15 text-teal-300 border-teal-500/30' :
                  authTargetRole === 'Municipality' ? 'bg-blue-500/15 text-blue-300 border-blue-500/30' :
                  'bg-orange-500/15 text-orange-300 border-orange-500/30'
                }`}>
                  {authTargetRole === 'Citizen' && <UserIcon className="w-3 h-3" />}
                  {authTargetRole === 'Municipality' && <Building2 className="w-3 h-3" />}
                  {authTargetRole === 'Contractor' && <HardHat className="w-3 h-3" />}
                  <span>{authTargetRole} Role</span>
                </div>
              </div>

              {/* Sign In vs Sign Up Tab Toggle */}
              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    authMode === 'signin'
                      ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    authMode === 'signup'
                      ? 'bg-gradient-to-r from-teal-500 to-orange-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Create New Account
                </button>
              </div>

              {/* 1-Click Fast Track Button */}
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Instant Verified Persona:
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {authTargetRole === 'Citizen' && 'Elena Rostova (Downtown Resident)'}
                    {authTargetRole === 'Municipality' && 'Dir. Sarah Jenkins (Metro Operations)'}
                    {authTargetRole === 'Contractor' && 'Dave Walker (Apex Civil Infrastructure)'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handle1ClickDemo(authTargetRole)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md shrink-0 ${
                    authTargetRole === 'Citizen' ? 'bg-teal-600 hover:bg-teal-500 shadow-teal-600/20' :
                    authTargetRole === 'Municipality' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20' :
                    'bg-orange-600 hover:bg-orange-500 shadow-orange-600/20'
                  }`}
                >
                  1-Click Sign In →
                </button>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-800 w-full"></div>
                <span className="bg-slate-900 px-3 text-[11px] font-mono text-slate-500 uppercase">
                  or enter credentials
                </span>
              </div>

              {/* Credentials Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alexander Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder={
                        authTargetRole === 'Citizen' ? 'citizen@civicconnect.org' :
                        authTargetRole === 'Municipality' ? 'supervisor@metrogov.city' :
                        'contact@contracting-firm.com'
                      }
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                {authMode === 'signup' && authTargetRole === 'Contractor' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Company / Contracting Entity Name
                    </label>
                    <div className="relative">
                      <Briefcase className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. Apex Civil & Roadworks Inc."
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                )}

                {authMode === 'signup' && authTargetRole === 'Citizen' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Neighborhood District
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. Downtown Central"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-2xl text-xs font-bold text-white transition-all shadow-xl active:scale-95 ${
                    authTargetRole === 'Citizen'
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-teal-500/20'
                      : authTargetRole === 'Municipality'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-600/20'
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-500/20'
                  }`}
                >
                  {loading ? 'Authenticating...' : authMode === 'signin' ? `Sign In to ${authTargetRole} Dashboard` : `Create ${authTargetRole} Account`}
                </button>
              </form>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
