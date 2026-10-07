import React, { useState } from 'react';
import { 
  Building2, 
  HardHat, 
  User as UserIcon, 
  PlusCircle, 
  ChevronDown,
  ShieldAlert,
  LogOut,
  LogIn,
  ArrowRight
} from 'lucide-react';
import { useCivic } from '../context/CivicContext.js';
import { DEFAULT_IMAGES, handleImageError } from '../utils/imageUtils.js';

export const Navbar: React.FC = () => {
  const { 
    user, 
    isAuthenticated,
    activeTab, 
    setActiveTab, 
    openAuthModal,
    logout,
    setIsReportModalOpen
  } = useCivic();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // When authenticated, clicking the brand stays on the active dashboard
  const handleBrandClick = () => {
    if (!isAuthenticated) {
      setActiveTab('landing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div 
          onClick={handleBrandClick}
          className={`flex items-center gap-3 select-none ${!isAuthenticated ? 'cursor-pointer group' : ''}`}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-teal-500 to-orange-500 p-0.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-teal-400 group-hover:text-orange-400 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-teal-200 bg-clip-text text-transparent">
                CivicConnect
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30">
                AI 3.8
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none font-medium hidden sm:block">
              {isAuthenticated ? `${user?.role} Workspace` : 'Smart Citizen-Led City Management'}
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* NAVIGATION: GATED (NO TOGGLING TO LANDING IN DASHBOARD) */}
        {/* ========================================================= */}
        
        {!isAuthenticated ? (
          /* Public Landing Navigation (No dashboard toggles!) */
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#how-it-works"
              className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="#triage"
              className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Gemini AI Triage
            </a>
            <a
              href="#impact"
              className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Live Impact
            </a>
          </nav>
        ) : (
          /* Authenticated Dashboard Header Indicator (Strictly Dashboard Mode) */
          <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-1.5 rounded-2xl border border-slate-800">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
              user?.role === 'Citizen' ? 'bg-teal-400' :
              user?.role === 'Municipality' ? 'bg-blue-400' : 'bg-orange-400'
            }`} />
            <span className="text-xs font-bold text-white">
              {user?.role === 'Citizen' && 'Citizen Portal Dashboard'}
              {user?.role === 'Municipality' && 'Municipality Operations HQ'}
              {user?.role === 'Contractor' && 'Contractor Tenders Hub'}
            </span>
          </div>
        )}

        {/* ========================================================= */}
        {/* RIGHT CTAs: SIGN IN / GET STARTED OR USER PROFILE */}
        {/* ========================================================= */}
        <div className="flex items-center gap-3">
          
          {!isAuthenticated ? (
            /* Visitor CTA: Sign In & Get Started Buttons */
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => openAuthModal(undefined, 'signin')}
                className="text-xs font-bold text-slate-200 hover:text-white px-3.5 py-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/80 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-teal-400" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => openAuthModal(undefined, 'signup')}
                className="bg-gradient-to-r from-orange-500 via-amber-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Logged In User Profile & Quick Actions */
            <div className="flex items-center gap-3">
              
              {user?.role === 'Citizen' && (
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all active:scale-95"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Report Issue</span>
                </button>
              )}

              {/* Profile Dropdown & Sign Out */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 bg-slate-900 border border-slate-700/80 hover:border-slate-600 px-3 py-1.5 rounded-xl text-xs text-slate-200 transition-colors"
                >
                  <img
                    src={user?.avatar || DEFAULT_IMAGES.avatarCitizen}
                    alt={user?.name}
                    onError={(e) => handleImageError(e, DEFAULT_IMAGES.avatarCitizen)}
                    className="w-6 h-6 rounded-full object-cover border border-slate-600"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="font-semibold text-slate-100 leading-tight">{user?.name?.split(' ')[0]}</p>
                    <p className="text-[10px] text-teal-400 font-medium leading-none">{user?.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-white">{user?.name}</p>
                      <p className="text-[11px] text-teal-400 mt-0.5">{user?.role} • {user?.district || user?.contractorProfile?.companyName}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={logout}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out (Exit to Landing)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
