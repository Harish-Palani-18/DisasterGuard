import React, { useState } from 'react';
import {
  ShieldAlert,
  Activity,
  Flame,
  Radio,
  MapPin,
  FilePlus,
  Layers,
  Cpu,
  Bot,
  RotateCcw,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReportModal: () => void;
  onLoadScenario: () => void;
  onResetData: () => void;
  incidentCount: number;
  criticalCount: number;
  isGeminiConfigured: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenReportModal,
  onLoadScenario,
  onResetData,
  incidentCount,
  criticalCount,
  isGeminiConfigured
}) => {
  const [showDemoInfo, setShowDemoInfo] = useState(false);
  const [showEmergencyHelp, setShowEmergencyHelp] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'map', label: 'Live Map', icon: MapPin },
    { id: 'incidents', label: 'Incidents', icon: Layers, badge: criticalCount > 0 ? `${criticalCount} crit` : undefined },
    { id: 'resources', label: 'Resource Fleet', icon: ShieldAlert },
    { id: 'agents', label: 'Multi-Agent Console', icon: Cpu, highlight: true },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
    { id: 'analytics', label: 'Analytics & CSV', icon: Radio },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* Top emergency status bar */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-amber-950/40 border-b border-slate-800/80 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-semibold tracking-wide uppercase text-[10px]">DEMO MODE</span>
          </div>
          <button
            onClick={() => setShowDemoInfo(!showDemoInfo)}
            className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-[11px] underline underline-offset-2 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Simulated Environment for Hackathon / Demonstration</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-slate-300">
            <span className="text-[11px] text-slate-400">Multi-Agent Engine:</span>
            {isGeminiConfigured ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                <Sparkles className="w-3 h-3" /> Gemini 3.8 Flash
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-cyan-400 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Autonomous Multi-Agent Core
              </span>
            )}
          </div>

          <button
            onClick={() => setShowEmergencyHelp(true)}
            className="flex items-center gap-1 text-red-300 hover:text-red-200 bg-red-950/60 hover:bg-red-900/60 px-2.5 py-0.5 rounded border border-red-700/50 font-semibold transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-red-400" />
            <span>Official Helpline: 112</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 flex items-center justify-center shadow-lg shadow-red-900/40 border border-red-400/30">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white">DisasterGuard</span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-widest">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight">
              5-Agent Disaster Response Orchestrator
            </p>
          </div>
        </div>

        {/* Action Controls & Scenario Trigger */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onLoadScenario}
            title="Load realistic flash flood scenario and run all 5 agents"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span className="hidden sm:inline">Simulate Flood Scenario</span>
            <span className="sm:hidden">Flood Demo</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-700/30 border border-red-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <FilePlus className="w-4 h-4" />
            <span>Report Emergency</span>
          </button>

          <button
            onClick={onResetData}
            title="Reset system to default initial demonstration state"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="px-4 lg:px-6 flex items-center space-x-1 overflow-x-auto scrollbar-none border-t border-slate-800/60">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-red-500 text-white bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              } ${item.highlight && !isActive ? 'text-indigo-300' : ''}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : (item.highlight ? 'text-indigo-400' : 'text-slate-400')}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Demo Info Modal */}
      {showDemoInfo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                <AlertTriangle className="w-5 h-5" />
                <span>Simulated Demonstration Environment</span>
              </div>
              <button
                onClick={() => setShowDemoInfo(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              DisasterGuard AI is configured in <strong>Hackathon Demo Mode</strong>. All alerts, incidents, coordinates, and telemetry displayed in this prototype represent realistic emergency simulations to showcase multi-agent AI orchestration with Google Gemini.
            </p>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
              <p className="font-semibold text-slate-200">System Safety Rules:</p>
              <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                <li>Risk assessment scores are preliminary decision-support indicators, not official determinations.</li>
                <li>Resource dispatch recommendations require authorized human approval before real-world mobilization.</li>
                <li>In actual real-life emergencies, always contact your local official emergency authorities via <strong>112</strong> (Universal Helpline) or <strong>1078</strong> (NDRF).</li>
              </ul>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowDemoInfo(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Helpline Guidance Modal */}
      {showEmergencyHelp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-800/80 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-400 font-bold text-base">
                <PhoneCall className="w-5 h-5 text-red-500" />
                <span>Official Emergency Numbers</span>
              </div>
              <button
                onClick={() => setShowEmergencyHelp(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-300">
              If you or anyone near you is in immediate physical peril, contact authorized national emergency services directly:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">112</p>
                  <p className="text-[11px] text-red-300">Universal Emergency Police / Fire / Medical (India)</p>
                </div>
                <span className="px-2 py-1 bg-red-600 text-white font-mono rounded font-bold text-xs">24x7</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">1078</p>
                  <p className="text-[11px] text-slate-400">National Disaster Response Force (NDRF Control Room)</p>
                </div>
                <span className="px-2 py-1 bg-slate-800 text-slate-300 font-mono rounded font-bold text-xs">Direct</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">108</p>
                  <p className="text-[11px] text-slate-400">Emergency Medical Ambulance & Paramedic Dispatch</p>
                </div>
                <span className="px-2 py-1 bg-slate-800 text-slate-300 font-mono rounded font-bold text-xs">Ambulance</span>
              </div>
            </div>
            <button
              onClick={() => setShowEmergencyHelp(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
            >
              Return to Operations Console
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
