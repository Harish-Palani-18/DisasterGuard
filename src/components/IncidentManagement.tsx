import React, { useState } from 'react';
import {
  IncidentReport,
  SeverityLevel,
  IncidentStatus,
  ReliefResource,
  DisasterType
} from '../types';
import {
  Search,
  Filter,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Cpu,
  UserCheck,
  Send,
  LifeBuoy,
  Globe2,
  FileCheck,
  RotateCw,
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { orchestrateIncidentAnalysis } from '../services/agentService';

interface IncidentManagementProps {
  incidents: IncidentReport[];
  resources: ReliefResource[];
  selectedIncident: IncidentReport | null;
  onSelectIncident: (incident: IncidentReport | null) => void;
  onUpdateIncident: (updated: IncidentReport) => void;
  onDispatchResources: (incidentId: string, resourceAllocations: { resourceId: string; quantity: number }[]) => void;
}

export const IncidentManagement: React.FC<IncidentManagementProps> = ({
  incidents,
  resources,
  selectedIncident,
  onSelectIncident,
  onUpdateIncident,
  onDispatchResources
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [activeCommsLang, setActiveCommsLang] = useState<'en' | 'hi' | 'kn'>('en');
  const [isReevaluating, setIsReevaluating] = useState(false);

  // Filter incidents
  const filtered = incidents.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'All' || inc.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || inc.status === statusFilter;
    const matchesType = typeFilter === 'All' || inc.disasterType === typeFilter;
    return matchesSearch && matchesSeverity && matchesStatus && matchesType;
  });

  const handleApproveDispatch = (inc: IncidentReport) => {
    const recommendations = inc.agentAnalysis?.resourceCoordination.recommendations || [];
    const allocations = recommendations.map(r => ({
      resourceId: r.resourceId,
      quantity: r.quantityAllocated || r.quantityRequested || 1
    }));

    onDispatchResources(inc.id, allocations);

    const updated: IncidentReport = {
      ...inc,
      status: 'Approved & Dispatched',
      humanApproval: {
        approvedBy: 'Emergency Command Duty Officer',
        approvedAt: new Date().toISOString(),
        notes: `Authorized AI-recommended deployment of ${allocations.length} asset groups.`,
        status: 'Approved'
      },
      updatedAt: new Date().toISOString()
    };
    onUpdateIncident(updated);
  };

  const handleStatusChange = (inc: IncidentReport, newStatus: IncidentStatus) => {
    const updated: IncidentReport = {
      ...inc,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
    onUpdateIncident(updated);
  };

  const handleSeverityChange = (inc: IncidentReport, newSeverity: SeverityLevel) => {
    const updated: IncidentReport = {
      ...inc,
      severity: newSeverity,
      updatedAt: new Date().toISOString()
    };
    onUpdateIncident(updated);
  };

  const handleRerunAgents = async (inc: IncidentReport) => {
    setIsReevaluating(true);
    try {
      const analysis = await orchestrateIncidentAnalysis(inc, resources);
      const updated: IncidentReport = {
        ...inc,
        agentAnalysis: analysis,
        severity: analysis.riskAssessment.calculatedSeverity || inc.severity,
        updatedAt: new Date().toISOString()
      };
      onUpdateIncident(updated);
    } catch (err) {
      console.error('Failed to rerun agents:', err);
    } finally {
      setIsReevaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, keyword, or landmark..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* Incident counts summary */}
          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
            <span>Showing <strong>{filtered.length}</strong> of <strong>{incidents.length}</strong> incidents</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-2.5 py-1 focus:outline-none"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-2.5 py-1 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending Triage">Pending Triage</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved & Dispatched">Approved & Dispatched</option>
            <option value="Active Response">Active Response</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-2.5 py-1 focus:outline-none"
          >
            <option value="All">All Disaster Types</option>
            <option value="Flood">Flood</option>
            <option value="Industrial Hazard">Industrial Hazard</option>
            <option value="Landslide">Landslide</option>
            <option value="Earthquake">Earthquake</option>
            <option value="Heatwave">Heatwave</option>
            <option value="Severe Storm">Severe Storm</option>
          </select>

          {(searchTerm || severityFilter !== 'All' || statusFilter !== 'All' || typeFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSeverityFilter('All');
                setStatusFilter('All');
                setTypeFilter('All');
              }}
              className="text-xs text-red-400 hover:text-red-300 ml-2 underline underline-offset-2"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Incidents Table / Cards Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Incident ID & Type</th>
                <th className="py-3 px-4">Title & Location</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Impact</th>
                <th className="py-3 px-4">Status & Approval</th>
                <th className="py-3 px-4">Triage Priority</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((inc) => {
                const isSelected = selectedIncident?.id === inc.id;
                const isCrit = inc.severity === 'Critical';
                const isHigh = inc.severity === 'High';
                const isMed = inc.severity === 'Medium';

                const badgeColor = isCrit
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : isHigh
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                  : isMed
                  ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

                return (
                  <tr
                    key={inc.id}
                    className={`hover:bg-slate-850/60 transition-colors cursor-pointer ${
                      isSelected ? 'bg-slate-800/80 font-medium' : ''
                    }`}
                    onClick={() => onSelectIncident(inc)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-white">{inc.id}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{inc.disasterType}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-white truncate">{inc.title}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{inc.locationName}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${badgeColor}`}>
                        {inc.severity}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">
                        {inc.peopleAffected} affected
                      </div>
                      <div className="text-[11px] text-red-400">
                        {inc.injuredCount > 0 ? `${inc.injuredCount} casualties` : '0 injured'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="inline-block px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-semibold text-slate-200">
                        {inc.status}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {inc.humanApproval?.status === 'Approved' ? '✓ Human Authorized' : 'Pending Authorization'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {inc.agentAnalysis ? (
                        <div className="text-indigo-300 font-semibold flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-indigo-400" />
                          <span>{inc.agentAnalysis.triage.priorityRank}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Evaluating</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectIncident(inc);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Dossier</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Multi-Agent Incident Inspection Modal / Drawer */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-6 my-auto text-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${
                    selectedIncident.severity === 'Critical'
                      ? 'bg-red-500/20 text-red-300 border-red-500/40'
                      : 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                  }`}>
                    {selectedIncident.severity} Severity
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-400">{selectedIncident.id}</span>
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                    {selectedIncident.disasterType}
                  </span>
                  <span className="text-xs text-slate-400">
                    Reported: {new Date(selectedIncident.reportedAt).toLocaleString()}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">{selectedIncident.title}</h2>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{selectedIncident.locationName} (GPS: {selectedIncident.coordinates.lat}, {selectedIncident.coordinates.lng})</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRerunAgents(selectedIncident)}
                  disabled={isReevaluating}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Re-run Multi-Agent Pipeline"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isReevaluating ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Re-analyze</span>
                </button>
                <button
                  onClick={() => onSelectIncident(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reporter On-Ground Description */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Ground Situation Narrative</span>
                <span>Reporter: {selectedIncident.reporterName} ({selectedIncident.reporterContactMasked})</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{selectedIncident.description}</p>
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-4 text-xs">
                <div>People in Danger: <strong className="text-white">{selectedIncident.peopleAffected}</strong></div>
                <div>Injuries: <strong className="text-red-400">{selectedIncident.injuredCount}</strong></div>
                <div>Life Threat Flag: <strong className={selectedIncident.immediateThreat ? 'text-red-400' : 'text-slate-400'}>{selectedIncident.immediateThreat ? 'Active P1' : 'None'}</strong></div>
                <div>Requested Needs: <strong className="text-indigo-300">{selectedIncident.requestedAssistance.join(', ') || 'General Aid'}</strong></div>
              </div>
            </div>

            {/* 5-Agent Structured Intelligence Dossier */}
            {selectedIncident.agentAnalysis && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Specialized 5-Agent Intelligence Output
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Engine: <strong className="text-indigo-300">{selectedIncident.agentAnalysis.usedEngine}</strong> ({selectedIncident.agentAnalysis.overallExecutionTimeMs}ms)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Agent 1: Monitoring */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-sky-400">
                      <span>Agent 1: Disaster Monitoring</span>
                      <span className="text-slate-400">{selectedIncident.agentAnalysis.monitoring.confidenceScore}% Conf</span>
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong>Hazard:</strong> {selectedIncident.agentAnalysis.monitoring.hazardIdentified}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {selectedIncident.agentAnalysis.monitoring.summary}
                    </p>
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                      Met Corroboration: {selectedIncident.agentAnalysis.monitoring.weatherCorroboration}
                    </div>
                  </div>

                  {/* Agent 2: Risk Assessment */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>Agent 2: Risk Assessment</span>
                      <span className="text-red-400">Risk Score: {selectedIncident.agentAnalysis.riskAssessment.riskScore}/100</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400">
                      <div>Life Threat: <strong className="text-red-300">{selectedIncident.agentAnalysis.riskAssessment.impactFactors.lifeThreat}%</strong></div>
                      <div>Infra Damage: <strong className="text-amber-300">{selectedIncident.agentAnalysis.riskAssessment.impactFactors.infrastructureDamage}%</strong></div>
                    </div>
                    <ul className="text-[11px] text-slate-300 list-disc pl-4 space-y-0.5">
                      {selectedIncident.agentAnalysis.riskAssessment.evidenceRationale.map((ev, i) => (
                        <li key={i}>{ev}</li>
                      ))}
                    </ul>
                    <div className="text-[10px] text-slate-500 italic">
                      {selectedIncident.agentAnalysis.riskAssessment.disclaimer}
                    </div>
                  </div>

                  {/* Agent 3: Emergency Triage */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-red-400">
                      <span>Agent 3: Emergency Triage</span>
                      <span className="bg-red-950 px-2 py-0.5 rounded text-[10px] text-red-300 border border-red-800 font-mono">
                        {selectedIncident.agentAnalysis.triage.priorityRank}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium">
                      {selectedIncident.agentAnalysis.triage.conciseSummary}
                    </p>
                    <div className="text-[11px] text-slate-300">
                      <strong>Immediate Actions:</strong>
                      <ol className="list-decimal pl-4 mt-1 space-y-0.5 text-slate-400">
                        {selectedIncident.agentAnalysis.triage.suggestedFirstSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Agent 4: Resource Coordination */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                      <span>Agent 4: Resource Coordination</span>
                      <span className="text-[10px] text-emerald-300">Human Approval Required</span>
                    </div>
                    <div className="space-y-1.5">
                      {selectedIncident.agentAnalysis.resourceCoordination.recommendations.map((rec, i) => (
                        <div key={i} className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-200">{rec.resourceName}</p>
                            <p className="text-[10px] text-slate-400">{rec.purpose} (ETA ~{rec.etaMinutes}m)</p>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                            Qty: {rec.quantityAllocated}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {selectedIncident.agentAnalysis.resourceCoordination.rationale}
                    </p>
                  </div>
                </div>

                {/* Agent 5: Public Safety Communication (Multilingual) */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                      <Globe2 className="w-4 h-4" />
                      <span>Agent 5: Public Communication & Localization</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setActiveCommsLang('en')}
                        className={`px-2.5 py-1 rounded text-xs font-bold ${
                          activeCommsLang === 'en' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => setActiveCommsLang('hi')}
                        className={`px-2.5 py-1 rounded text-xs font-bold ${
                          activeCommsLang === 'hi' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        हिंदी (Hindi)
                      </button>
                      <button
                        onClick={() => setActiveCommsLang('kn')}
                        className={`px-2.5 py-1 rounded text-xs font-bold ${
                          activeCommsLang === 'kn' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        ಕನ್ನಡ (Kannada)
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-950/20 border border-purple-800/40 rounded-xl text-xs text-purple-200 leading-relaxed font-medium">
                    {selectedIncident.agentAnalysis.publicCommunication.multilingual[activeCommsLang]}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <strong className="text-slate-300">For Citizens:</strong>
                      <p className="text-slate-400 mt-1">{selectedIncident.agentAnalysis.publicCommunication.audienceVariants.citizens}</p>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <strong className="text-slate-300">For Responders:</strong>
                      <p className="text-slate-400 mt-1">{selectedIncident.agentAnalysis.publicCommunication.audienceVariants.firstResponders}</p>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <strong className="text-slate-300">For Admins:</strong>
                      <p className="text-slate-400 mt-1">{selectedIncident.agentAnalysis.publicCommunication.audienceVariants.administrators}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Human-in-the-Loop Administrator Approval Controls */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-red-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-red-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Authorized Human Command Oversight
                  </h4>
                </div>
                <span className="text-[11px] text-amber-400 font-medium">
                  {selectedIncident.humanApproval?.status === 'Approved' ? '✓ Authorized' : 'Sign-Off Pending'}
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Safety Principle: DisasterGuard AI generates decision-support proposals. Committing real-world response teams and ambulances requires authorized officer approval.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {selectedIncident.status !== 'Approved & Dispatched' && (
                  <button
                    onClick={() => handleApproveDispatch(selectedIncident)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-700/30 transition-all hover:scale-[1.02]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authorize & Dispatch Recommended Fleet</span>
                  </button>
                )}

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>Update Status:</span>
                  <select
                    value={selectedIncident.status}
                    onChange={(e) => handleStatusChange(selectedIncident, e.target.value as IncidentStatus)}
                    className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2 py-1"
                  >
                    <option value="Pending Triage">Pending Triage</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved & Dispatched">Approved & Dispatched</option>
                    <option value="Active Response">Active Response</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>Adjust Severity:</span>
                  <select
                    value={selectedIncident.severity}
                    onChange={(e) => handleSeverityChange(selectedIncident, e.target.value as SeverityLevel)}
                    className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2 py-1"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
