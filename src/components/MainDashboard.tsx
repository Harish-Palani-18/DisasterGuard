import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Users,
  ShieldCheck,
  Building2,
  Cpu,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle,
  FileText,
  LifeBuoy,
  Sparkles
} from 'lucide-react';
import { IncidentReport, ReliefResource, EmergencyShelter, OfficialAlert } from '../types';

interface MainDashboardProps {
  incidents: IncidentReport[];
  resources: ReliefResource[];
  shelters: EmergencyShelter[];
  alerts: OfficialAlert[];
  onSelectIncident: (incident: IncidentReport) => void;
  onNavigateTab: (tab: string) => void;
  onOpenReportModal: () => void;
  onLoadScenario: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  incidents,
  resources,
  shelters,
  alerts,
  onSelectIncident,
  onNavigateTab,
  onOpenReportModal,
  onLoadScenario,
}) => {
  const criticalCount = incidents.filter(i => i.severity === 'Critical').length;
  const highCount = incidents.filter(i => i.severity === 'High').length;
  const mediumCount = incidents.filter(i => i.severity === 'Medium').length;
  const lowCount = incidents.filter(i => i.severity === 'Low').length;
  const pendingTriageCount = incidents.filter(i => i.status === 'Pending Triage' || i.status === 'Under Review').length;

  const totalPeopleAffected = incidents.reduce((sum, i) => sum + (i.peopleAffected || 0), 0);
  const totalInjured = incidents.reduce((sum, i) => sum + (i.injuredCount || 0), 0);

  const totalShelterBeds = shelters.reduce((sum, s) => sum + s.totalBeds, 0);
  const occupiedShelterBeds = shelters.reduce((sum, s) => sum + s.occupiedBeds, 0);
  const shelterOccupancyRate = Math.round((occupiedShelterBeds / (totalShelterBeds || 1)) * 100);

  const totalResourceUnits = resources.reduce((sum, r) => sum + r.totalCapacity, 0);
  const availableResourceUnits = resources.reduce((sum, r) => sum + r.availableCapacity, 0);

  return (
    <div className="space-y-6">
      {/* Official Weather/Disaster Broadcast Alerts Banner */}
      {alerts.length > 0 && (
        <div className="bg-gradient-to-r from-red-950/60 via-slate-900 to-amber-950/60 border border-red-800/60 rounded-2xl p-4 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 shrink-0 mt-0.5">
                <AlertOctagon className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-red-600 text-white uppercase tracking-wider">
                    Official Active Bulletin
                  </span>
                  <span className="text-xs text-red-300 font-semibold">{alerts[0].agency}</span>
                  <span className="text-xs text-slate-400">• Verified by Met Authority</span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">{alerts[0].headline}</h4>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {alerts[0].summary}
                </p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                  <span>Affected Regions: {alerts[0].affectedRegions.join(', ')}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('map')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold shrink-0 transition-colors"
            >
              <span>View On Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Operations KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Incidents */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Incidents</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-white">{incidents.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
              <span className="text-amber-400 font-semibold">{pendingTriageCount}</span> awaiting action
            </div>
          </div>
        </div>

        {/* Critical Incidents */}
        <div className="bg-red-950/30 border border-red-800/40 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-red-400">
            <span className="text-xs font-semibold">Critical Threats</span>
            <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-red-300">{criticalCount}</div>
            <div className="text-[11px] text-red-400/80 mt-0.5">Immediate Life Threat</div>
          </div>
        </div>

        {/* High Severity */}
        <div className="bg-orange-950/30 border border-orange-800/40 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-orange-400">
            <span className="text-xs font-semibold">High Priority</span>
            <AlertTriangle className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-orange-300">{highCount}</div>
            <div className="text-[11px] text-orange-400/80 mt-0.5">Elevated Danger Zone</div>
          </div>
        </div>

        {/* Population Impact */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Affected People</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-white">~{totalPeopleAffected}</div>
            <div className="text-[11px] text-red-400 mt-0.5 font-medium">{totalInjured} reported casualties</div>
          </div>
        </div>

        {/* Shelters */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Shelter Capacity</span>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-emerald-300">{shelterOccupancyRate}%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {occupiedShelterBeds} / {totalShelterBeds} beds
            </div>
          </div>
        </div>

        {/* 5-Agent Status */}
        <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-semibold">Agent Engine</span>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2">
            <div className="text-lg font-bold text-indigo-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>5 / 5 Active</span>
            </div>
            <div className="text-[11px] text-indigo-300/80 mt-0.5">Avg Response: 850ms</div>
          </div>
        </div>
      </div>

      {/* Main Split: Triage Queue & Operations Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priority Incident Triage Stream */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white tracking-tight">Active Incident Triage Stream</h3>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                {incidents.length} Records
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('incidents')}
              className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
            >
              <span>View Full Incident Roster</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {incidents.slice(0, 4).map((inc) => {
              const isCrit = inc.severity === 'Critical';
              const isHigh = inc.severity === 'High';
              const isMed = inc.severity === 'Medium';

              const severityBadgeColor = isCrit
                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                : isHigh
                ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                : isMed
                ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

              return (
                <div
                  key={inc.id}
                  onClick={() => onSelectIncident(inc)}
                  className="group bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${severityBadgeColor}`}>
                          {inc.severity}
                        </span>
                        <span className="text-xs font-mono font-semibold text-slate-400">{inc.id}</span>
                        <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          {inc.disasterType}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(inc.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-red-300 transition-colors">
                        {inc.title}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{inc.locationName}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                        {inc.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    {inc.description}
                  </p>

                  {/* Multi-agent summary pill */}
                  {inc.agentAnalysis && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2 text-indigo-300">
                        <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                        <span>AI Triage: {inc.agentAnalysis.triage.priorityRank}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">Confidence: {inc.agentAnalysis.monitoring.confidenceScore}%</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-400 group-hover:text-white flex items-center gap-1">
                        Review Dossier <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Multi-Agent Quick Hub & Resource Status */}
        <div className="space-y-6">
          {/* Quick Demo Workflow Showcase Card */}
          <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-800/50 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
              <span>Multi-Agent Orchestration Demo</span>
            </div>
            <h4 className="text-sm font-bold text-white">Experience End-to-End Triage</h4>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Launch our pre-configured Bangalore flash-flood incident to watch all 5 Gemini agents coordinate in real time: Monitoring, Risk, Triage, Resource, and Multilingual Comms.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                onClick={onLoadScenario}
                className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-900/40 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulate Flood Scenario</span>
              </button>
              <button
                onClick={onOpenReportModal}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
              >
                Custom Report
              </button>
            </div>
          </div>

          {/* Quick Resources Availability Snapshot */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <LifeBuoy className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Critical Resource Fleet</h4>
              </div>
              <button
                onClick={() => onNavigateTab('resources')}
                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300"
              >
                Manage All
              </button>
            </div>

            <div className="space-y-3">
              {resources.slice(0, 4).map((res) => {
                const pctAvailable = Math.round((res.availableCapacity / res.totalCapacity) * 100);
                return (
                  <div key={res.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200 truncate pr-2">{res.name}</span>
                      <span className="font-mono text-[11px] text-slate-400 shrink-0">
                        {res.availableCapacity} / {res.totalCapacity} {res.unit}
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pctAvailable > 50
                            ? 'bg-emerald-500'
                            : pctAvailable > 20
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${pctAvailable}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Emergency Shelters Status */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Emergency Shelters</h4>
              </div>
              <span className="text-[11px] text-slate-400">{shelters.length} Designated</span>
            </div>

            <div className="space-y-2">
              {shelters.map((s) => (
                <div
                  key={s.id}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="truncate pr-2">
                    <p className="font-semibold text-slate-200 truncate">{s.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{s.address}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      s.status === 'Accepting Evacuees'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {s.occupiedBeds} / {s.totalBeds} Beds
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
