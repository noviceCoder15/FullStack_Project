/**
 * CivicConnect - Smart Citizen-Led City Management
 * Full-Stack Platform with Google Gemini 3.8 Flash Multimodal Triage
 */

import React from 'react';
import { CivicProvider, useCivic } from './context/CivicContext.js';
import { Navbar } from './components/Navbar.js';
import { LandingPage } from './components/LandingPage.js';
import { CitizenDashboard } from './components/CitizenDashboard.js';
import { MunicipalityDashboard } from './components/MunicipalityDashboard.js';
import { ContractorDashboard } from './components/ContractorDashboard.js';
import { IssueReportModal } from './components/IssueReportModal.js';
import { IssueDetailModal } from './components/IssueDetailModal.js';
import { AuthRoleModal } from './components/AuthRoleModal.js';
import { ShieldAlert, Building2, HardHat, User, LogOut } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    activeTab, 
    isAuthenticated, 
    user, 
    logout,
    openAuthModal,
    selectedIssue, 
    setSelectedIssue 
  } = useCivic();

  // If user is not authenticated, strictly show LandingPage
  // If user is authenticated, strictly show their role dashboard
  const renderMainView = () => {
    if (!isAuthenticated) {
      return <LandingPage />;
    }

    // Authenticated views: exclusively their role dashboard
    switch (activeTab) {
      case 'citizen':
        return <CitizenDashboard />;
      case 'municipality':
        return <MunicipalityDashboard />;
      case 'contractor':
        return <ContractorDashboard />;
      default:
        // Fallback based on user role
        if (user?.role === 'Citizen') return <CitizenDashboard />;
        if (user?.role === 'Municipality') return <MunicipalityDashboard />;
        if (user?.role === 'Contractor') return <ContractorDashboard />;
        return <CitizenDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Sticky Navigation */}
      <Navbar />

      {/* Main Dynamic View */}
      <main className="flex-1">
        {renderMainView()}
      </main>

      {/* Global Modals */}
      <AuthRoleModal />
      <IssueReportModal />
      <IssueDetailModal issue={selectedIssue} onClose={() => setSelectedIssue(null)} />

      {/* Global Civic Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 via-teal-500 to-orange-500 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-teal-400" />
              </div>
            </div>
            <div>
              <p className="font-extrabold text-sm text-white">CivicConnect</p>
              <p className="text-[11px] text-slate-500">Autonomous Municipal Infrastructure Orchestration</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            {!isAuthenticated ? (
              <>
                <button 
                  onClick={() => openAuthModal('Citizen', 'signup')} 
                  className="hover:text-teal-400 flex items-center gap-1.5 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  Citizen Access
                </button>
                <button 
                  onClick={() => openAuthModal('Municipality', 'signup')} 
                  className="hover:text-blue-400 flex items-center gap-1.5 transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Municipality Access
                </button>
                <button 
                  onClick={() => openAuthModal('Contractor', 'signup')} 
                  className="hover:text-orange-400 flex items-center gap-1.5 transition-colors"
                >
                  <HardHat className="w-3.5 h-3.5" />
                  Contractor Access
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-slate-300">
                  Signed in as <strong className="text-white">{user?.name}</strong> ({user?.role})
                </span>
                <button 
                  onClick={logout} 
                  className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 transition-colors ml-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 font-mono">
            Powered by Google Gemini 3.8 Flash
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <CivicProvider>
      <AppContent />
    </CivicProvider>
  );
}
