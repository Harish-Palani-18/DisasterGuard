import React from 'react';
import { IncidentReport, ReliefResource, EmergencyShelter } from '../types';
import {
  BarChart3,
  Download,
  PieChart,
  TrendingUp,
  AlertOctagon,
  Users,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';

interface AnalyticsReportsProps {
  incidents: IncidentReport[];
  resources: ReliefResource[];
  shelters: EmergencyShelter[];
}

export const AnalyticsReports: React.FC<AnalyticsReportsProps> = ({
  incidents,
  resources,
  shelters
}) => {
  // Counts by severity
  const severityBreakdown = {
    Critical: incidents.filter(i => i.severity === 'Critical').length,
    High: incidents.filter(i => i.severity === 'High').length,
    Medium: incidents.filter(i => i.severity === 'Medium').length,
    Low: incidents.filter(i => i.severity === 'Low').length
  };

  // Counts by disaster type
  const typeMap: { [key: string]: number } = {};
  incidents.forEach(i => {
    typeMap[i.disasterType] = (typeMap[i.disasterType] || 0) + 1;
  });

  // Export to CSV functionality
  const handleExportCSV = () => {
    const headers = [
      'Incident ID',
      'Title',
      'Disaster Type',
      'Severity',
      'Status',
      'Location',
      'Latitude',
      'Longitude',
      'People Affected',
      'Injured Count',
      'Immediate Threat',
      'Reported At',
      'AI Priority Rank',
      'AI Risk Score',
      'Assigned Resources'
    ];

    const rows = incidents.map(i => [
      `"${i.id}"`,
      `"${i.title.replace(/"/g, '""')}"`,
      `"${i.disasterType}"`,
      `"${i.severity}"`,
      `"${i.status}"`,
      `"${i.locationName.replace(/"/g, '""')}"`,
      i.coordinates.lat,
      i.coordinates.lng,
      i.peopleAffected,
      i.injuredCount,
      i.immediateThreat ? 'YES' : 'NO',
      `"${i.reportedAt}"`,
      `"${i.agentAnalysis?.triage.priorityRank || 'N/A'}"`,
      i.agentAnalysis?.riskAssessment.riskScore || 'N/A',
      `"${i.assignedResources?.map(r => `${r.name} (${r.quantity})`).join('; ') || 'None'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DisasterGuard_Incidents_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPeopleAffected = incidents.reduce((sum, i) => sum + (i.peopleAffected || 0), 0);
  const totalInjured = incidents.reduce((sum, i) => sum + (i.injuredCount || 0), 0);
  const resolvedCount = incidents.filter(i => i.status === 'Resolved').length;
  const dispatchedCount = incidents.filter(i => i.status === 'Approved & Dispatched' || i.status === 'Active Response').length;
  const pendingCount = incidents.filter(i => i.status === 'Pending Triage' || i.status === 'Under Review').length;

  return (
    <div className="space-y-6">
      {/* Top Banner with CSV Export */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <span>Disaster Intelligence Analytics & Incident Reporting</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated operational metrics, resource utilization, and decision-support audit logs.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-700/30 transition-all hover:scale-[1.02]"
        >
          <Download className="w-4 h-4" />
          <span>Export Incidents to CSV</span>
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400">Total Population Impact</span>
          <div className="text-2xl font-black text-white mt-1">~{totalPeopleAffected}</div>
          <span className="text-[11px] text-red-400 font-medium">{totalInjured} casualties recorded</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400">Response Pipeline</span>
          <div className="text-2xl font-black text-indigo-300 mt-1">{dispatchedCount} Active</div>
          <span className="text-[11px] text-slate-400">{pendingCount} pending authorization</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400">Resolution Rate</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {Math.round((resolvedCount / (incidents.length || 1)) * 100)}%
          </div>
          <span className="text-[11px] text-slate-400">{resolvedCount} incidents closed</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400">AI Triage Speed</span>
          <div className="text-2xl font-black text-sky-400 mt-1">&lt; 1.2s</div>
          <span className="text-[11px] text-slate-400">Across 5-agent Gemini pipeline</span>
        </div>
      </div>

      {/* Grid: Charts & Distributions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Severity Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-red-400" />
            <span>Incidents by Severity Level</span>
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-red-300 mb-1">
                <span>Critical (Immediate Life Threat)</span>
                <span className="font-bold">{severityBreakdown.Critical}</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full"
                  style={{ width: `${(severityBreakdown.Critical / (incidents.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-orange-300 mb-1">
                <span>High (Urgent Infrastructure / Escalation)</span>
                <span className="font-bold">{severityBreakdown.High}</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-orange-500 h-full rounded-full"
                  style={{ width: `${(severityBreakdown.High / (incidents.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-yellow-300 mb-1">
                <span>Medium (Localized Hazard)</span>
                <span className="font-bold">{severityBreakdown.Medium}</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-yellow-500 h-full rounded-full"
                  style={{ width: `${(severityBreakdown.Medium / (incidents.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-emerald-300 mb-1">
                <span>Low (Controlled / Monitored)</span>
                <span className="font-bold">{severityBreakdown.Low}</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${(severityBreakdown.Low / (incidents.length || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Disaster Type Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <PieChart className="w-4 h-4 text-sky-400" />
            <span>Hazard Type Breakdown</span>
          </h3>

          <div className="space-y-2.5">
            {Object.entries(typeMap).map(([type, count]) => {
              const pct = Math.round((count / incidents.length) * 100);
              return (
                <div key={type} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>{type}</span>
                    <span className="font-mono text-slate-400">{count} reports ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resource Allocation vs Demand Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Resource Demand vs Availability Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Resource Asset</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Total Fleet</th>
                <th className="py-2.5 px-3">Available</th>
                <th className="py-2.5 px-3">In Active Ops</th>
                <th className="py-2.5 px-3">Readiness Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {resources.map((r) => {
                const util = Math.round((r.inUseCapacity / r.totalCapacity) * 100);
                return (
                  <tr key={r.id}>
                    <td className="py-2.5 px-3 font-semibold text-white">{r.name}</td>
                    <td className="py-2.5 px-3 text-slate-400">{r.category}</td>
                    <td className="py-2.5 px-3 font-mono">{r.totalCapacity} {r.unit}</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">{r.availableCapacity}</td>
                    <td className="py-2.5 px-3 font-mono text-amber-400">{r.inUseCapacity} ({util}%)</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 border border-slate-800 text-slate-300">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
