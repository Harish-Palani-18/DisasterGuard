import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Globe2,
  LifeBuoy,
  ShieldAlert,
  Radio,
  Clock,
  Layers,
  Code
} from 'lucide-react';
import { IncidentReport, ReliefResource, MultiAgentAnalysis } from '../types';
import { orchestrateIncidentAnalysis } from '../services/agentService';

interface AgentPipelineViewerProps {
  incidents: IncidentReport[];
  resources: ReliefResource[];
  onUpdateIncidentAnalysis: (incidentId: string, analysis: MultiAgentAnalysis) => void;
}

export const AgentPipelineViewer: React.FC<AgentPipelineViewerProps> = ({
  incidents,
  resources,
  onUpdateIncidentAnalysis
}) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || '');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(5); // 0 to 5
  const [showJsonInspector, setShowJsonInspector] = useState<boolean>(false);
  const [activeCommsLang, setActiveCommsLang] = useState<'en' | 'hi' | 'kn'>('en');

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];
  const analysis = selectedIncident?.agentAnalysis;

  const handleRunPipeline = async () => {
    if (!selectedIncident) return;
    setIsRunning(true);
    setActiveStep(1);

    try {
      setTimeout(() => setActiveStep(2), 350);
      setTimeout(() => setActiveStep(3), 700);
      setTimeout(() => setActiveStep(4), 1050);
      setTimeout(() => setActiveStep(5), 1400);

      const result = await orchestrateIncidentAnalysis(selectedIncident, resources);
      onUpdateIncidentAnalysis(selectedIncident.id, result);

      setTimeout(() => {
        setIsRunning(false);
      }, 1600);
    } catch (err) {
      console.error('Error running pipeline:', err);
      setIsRunning(false);
    }
  };

  const agents = [
    {
      num: 1,
      name: 'Disaster Monitoring Agent',
      badge: 'Agent 1',
      color: 'sky',
      role: 'Hazard Detection & Weather Corroboration',
      summary: analysis?.monitoring ? (
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-sky-300 font-bold">{analysis.monitoring.hazardIdentified}</span>
            <span className="text-slate-400 font-mono">{analysis.monitoring.confidenceScore}% Confidence</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">{analysis.monitoring.summary}</p>
          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
            Source: {analysis.monitoring.source} • {analysis.monitoring.weatherCorroboration}
          </div>
        </div>
      ) : null
    },
    {
      num: 2,
      name: 'Risk Assessment Agent',
      badge: 'Agent 2',
      color: 'amber',
      role: 'Severity Categorization & Impact Evidence',
      summary: analysis?.riskAssessment ? (
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-amber-300 font-bold">Severity: {analysis.riskAssessment.calculatedSeverity}</span>
            <span className="text-red-400 font-mono">Risk Score: {analysis.riskAssessment.riskScore}/100</span>
          </div>
          <ul className="text-[11px] text-slate-300 list-disc pl-4 space-y-0.5">
            {analysis.riskAssessment.evidenceRationale.map((ev, i) => (
              <li key={i}>{ev}</li>
            ))}
          </ul>
          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
            Uncertainty: {analysis.riskAssessment.uncertaintyRating} • {analysis.riskAssessment.disclaimer}
          </div>
        </div>
      ) : null
    },
    {
      num: 3,
      name: 'Emergency Triage Agent',
      badge: 'Agent 3',
      color: 'red',
      role: 'Casualty Prioritization & First Actions',
      summary: analysis?.triage ? (
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 font-bold text-[10px] border border-red-800">
              {analysis.triage.priorityRank}
            </span>
            <span className="text-slate-400 text-[11px]">{analysis.triage.extractedNeeds.length} Needs Identified</span>
          </div>
          <p className="text-slate-200 text-[11px] font-medium leading-relaxed">
            {analysis.triage.conciseSummary}
          </p>
          <div className="text-[10px] text-slate-400">
            Reporter Advisory: "{analysis.triage.safetyAdvisoryForReporter}"
          </div>
        </div>
      ) : null
    },
    {
      num: 4,
      name: 'Resource Coordination Agent',
      badge: 'Agent 4',
      color: 'emerald',
      role: 'Depot Fleet Matching & Allocation Reasoning',
      summary: analysis?.resourceCoordination ? (
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-emerald-300 font-bold">
              {analysis.resourceCoordination.recommendations.length} Assets Staged
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">Human Approval Gate: Active</span>
          </div>
          <div className="space-y-1">
            {analysis.resourceCoordination.recommendations.map((r, i) => (
              <div key={i} className="p-1.5 bg-slate-900 rounded border border-slate-800 text-[10px] flex justify-between">
                <span className="text-slate-200 font-medium">{r.resourceName}</span>
                <span className="text-emerald-400 font-mono">Qty: {r.quantityAllocated} (ETA ~{r.etaMinutes}m)</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400">{analysis.resourceCoordination.rationale}</p>
        </div>
      ) : null
    },
    {
      num: 5,
      name: 'Public Communication Agent',
      badge: 'Agent 5',
      color: 'purple',
      role: 'Multilingual Warning & Audience Adaptation',
      summary: analysis?.publicCommunication ? (
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-purple-300 font-bold">Multilingual Broadcast</span>
            <div className="flex gap-1 text-[10px]">
              <button
                onClick={() => setActiveCommsLang('en')}
                className={`px-1.5 py-0.5 rounded font-bold ${activeCommsLang === 'en' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                EN
              </button>
              <button
                onClick={() => setActiveCommsLang('hi')}
                className={`px-1.5 py-0.5 rounded font-bold ${activeCommsLang === 'hi' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                HI
              </button>
              <button
                onClick={() => setActiveCommsLang('kn')}
                className={`px-1.5 py-0.5 rounded font-bold ${activeCommsLang === 'kn' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                KN
              </button>
            </div>
          </div>
          <p className="p-2 rounded bg-purple-950/30 border border-purple-800/40 text-purple-200 text-[11px] leading-relaxed">
            {analysis.publicCommunication.multilingual[activeCommsLang]}
          </p>
          <div className="text-[10px] text-slate-400">
            Audience Segments: Citizens • First Responders • Incident Commanders
          </div>
        </div>
      ) : null
    }
  ];

  return (
    <div className="space-y-6">
      {/* Console Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Cpu className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-white">Multi-Agent Coordination Pipeline Console</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
              Orchestrator v2.4
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Watch the 5 specialized AI agents process raw emergency signals into verified risk ratings, triage priorities, matched resource dispatches, and localized public advisories.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedIncidentId}
            onChange={(e) => setSelectedIncidentId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 font-medium focus:outline-none"
          >
            {incidents.map((inc) => (
              <option key={inc.id} value={inc.id}>
                {inc.id} - {inc.disasterType} ({inc.severity})
              </option>
            ))}
          </select>

          <button
            onClick={handleRunPipeline}
            disabled={isRunning}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-700/30 transition-all hover:scale-[1.02]"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Orchestrating...' : 'Trigger Live Pipeline'}</span>
          </button>

          <button
            onClick={() => setShowJsonInspector(!showJsonInspector)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 flex items-center gap-1 transition-colors"
            title="Inspect Agent JSON Output"
          >
            <Code className="w-4 h-4" />
            <span className="hidden sm:inline">JSON</span>
          </button>
        </div>
      </div>

      {/* Selected Incident Context Strip */}
      {selectedIncident && (
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
              selectedIncident.severity === 'Critical'
                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                : 'bg-orange-500/20 text-orange-300 border-orange-500/40'
            }`}>
              {selectedIncident.severity}
            </span>
            <span className="font-bold text-white">{selectedIncident.title}</span>
            <span className="text-slate-400">({selectedIncident.locationName})</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Affected: <strong className="text-slate-200">{selectedIncident.peopleAffected}</strong></span>
            <span>Casualties: <strong className="text-red-400">{selectedIncident.injuredCount}</strong></span>
            <span>Immediate Threat: <strong className="text-amber-300">{selectedIncident.immediateThreat ? 'YES' : 'NO'}</strong></span>
          </div>
        </div>
      )}

      {/* Interactive Visual Pipeline Flow */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {agents.map((agent) => {
            const isStepActive = isRunning && activeStep === agent.num;
            const isStepDone = (!isRunning && !!analysis) || (isRunning && activeStep > agent.num);

            return (
              <div
                key={agent.num}
                className={`bg-slate-900 border rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 shadow-xl ${
                  isStepActive
                    ? 'border-indigo-500 ring-2 ring-indigo-500/40 scale-[1.02]'
                    : isStepDone
                    ? 'border-slate-800 hover:border-slate-700'
                    : 'border-slate-800 opacity-60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      {agent.badge}
                    </span>
                    {isStepActive ? (
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                    ) : isStepDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-700" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-white">{agent.name}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">{agent.role}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    {agent.summary || (
                      <div className="py-6 text-center text-[11px] text-slate-600 italic">
                        Awaiting orchestration trigger
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Pipeline Node #{agent.num}</span>
                  <span>{isStepDone ? 'Completed' : (isStepActive ? 'Running...' : 'Queued')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Structured JSON Inspector */}
      {showJsonInspector && analysis && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
            <span className="font-bold text-indigo-300">Raw Gemini Structured Agent Output</span>
            <span>Execution Time: {analysis.overallExecutionTimeMs}ms • Engine: {analysis.usedEngine}</span>
          </div>
          <pre className="p-3 bg-slate-900 rounded-xl text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-96">
            {JSON.stringify(analysis, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
