import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MainDashboard } from './components/MainDashboard';
import { LiveDisasterMap } from './components/LiveDisasterMap';
import { IncidentManagement } from './components/IncidentManagement';
import { ResourceManagement } from './components/ResourceManagement';
import { AIAssistant } from './components/AIAssistant';
import { AnalyticsReports } from './components/AnalyticsReports';
import { AgentPipelineViewer } from './components/AgentPipelineViewer';
import { ReportEmergencyModal } from './components/ReportEmergencyModal';
import {
  INITIAL_INCIDENTS,
  INITIAL_RESOURCES,
  INITIAL_SHELTERS,
  INITIAL_OFFICIAL_ALERTS,
  FLOOD_DEMO_SCENARIO_INPUT
} from './data/demoData';
import {
  IncidentReport,
  ReliefResource,
  EmergencyShelter,
  OfficialAlert,
  MultiAgentAnalysis
} from './types';
import { checkSystemHealth, orchestrateIncidentAnalysis } from './services/agentService';
import { Sparkles, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function App() {
  const [incidents, setIncidents] = useState<IncidentReport[]>(() => {
    try {
      const saved = localStorage.getItem('disasterguard_incidents');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_INCIDENTS;
  });

  const [resources, setResources] = useState<ReliefResource[]>(() => {
    try {
      const saved = localStorage.getItem('disasterguard_resources');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_RESOURCES;
  });

  const [shelters, setShelters] = useState<EmergencyShelter[]>(() => {
    try {
      const saved = localStorage.getItem('disasterguard_shelters');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_SHELTERS;
  });

  const [alerts] = useState<OfficialAlert[]>(INITIAL_OFFICIAL_ALERTS);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [mapCoordsForReport, setMapCoordsForReport] = useState<{ lat: number; lng: number } | null>(null);
  const [isGeminiConfigured, setIsGeminiConfigured] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('disasterguard_incidents', JSON.stringify(incidents));
    } catch (e) {}
  }, [incidents]);

  useEffect(() => {
    try {
      localStorage.setItem('disasterguard_resources', JSON.stringify(resources));
    } catch (e) {}
  }, [resources]);

  useEffect(() => {
    try {
      localStorage.setItem('disasterguard_shelters', JSON.stringify(shelters));
    } catch (e) {}
  }, [shelters]);

  // Check health on boot
  useEffect(() => {
    checkSystemHealth().then((res) => {
      setIsGeminiConfigured(res.geminiConfigured);
    });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // One-click interactive flood scenario trigger for hackathon demo
  const handleLoadFloodScenario = async () => {
    showToast('Executing Live Multi-Agent Simulation: Flash Flood Surge Scenario...');
    const scenario = FLOOD_DEMO_SCENARIO_INPUT;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const incidentId = `DG-2026-FL-${randomSuffix}`;

    const rawIncident: IncidentReport = {
      id: incidentId,
      title: scenario.title,
      disasterType: 'Flood',
      description: scenario.description,
      locationName: scenario.locationName,
      coordinates: scenario.coordinates,
      reportedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      peopleAffected: scenario.peopleAffected,
      injuredCount: scenario.injuredCount,
      immediateThreat: scenario.immediateThreat,
      requestedAssistance: scenario.requestedAssistance,
      photoUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
      reporterName: scenario.reporterName,
      reporterContactMasked: '+91 98860 ••••9',
      severity: 'Critical',
      status: 'Under Review',
      verificationStatus: 'Crowdsourced - High Confidence',
      assignedResources: []
    };

    // Run 5-agent pipeline
    try {
      const analysis = await orchestrateIncidentAnalysis(rawIncident, resources);
      const fullIncident = { ...rawIncident, agentAnalysis: analysis };

      setIncidents((prev) => [fullIncident, ...prev]);
      setSelectedIncident(fullIncident);
      setActiveTab('agents');
      showToast(`Scenario active: 5 Agents completed triage for ${incidentId}!`);
    } catch (err) {
      setIncidents((prev) => [rawIncident, ...prev]);
      setSelectedIncident(rawIncident);
      setActiveTab('agents');
    }
  };

  const handleResetData = () => {
    localStorage.removeItem('disasterguard_incidents');
    localStorage.removeItem('disasterguard_resources');
    localStorage.removeItem('disasterguard_shelters');
    setIncidents(INITIAL_INCIDENTS);
    setResources(INITIAL_RESOURCES);
    setShelters(INITIAL_SHELTERS);
    setSelectedIncident(null);
    showToast('System reset to default initial demonstration state.');
  };

  const handleUpdateIncident = (updated: IncidentReport) => {
    setIncidents((prev) => prev.map((inc) => (inc.id === updated.id ? updated : inc)));
    if (selectedIncident?.id === updated.id) {
      setSelectedIncident(updated);
    }
    showToast(`Updated incident ${updated.id} status to ${updated.status}.`);
  };

  const handleUpdateIncidentAnalysis = (incidentId: string, analysis: MultiAgentAnalysis) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === incidentId ? { ...inc, agentAnalysis: analysis } : inc))
    );
    showToast('Agent pipeline re-analyzed incident intelligence.');
  };

  const handleDispatchResources = (
    incidentId: string,
    allocations: { resourceId: string; quantity: number }[]
  ) => {
    setResources((prev) =>
      prev.map((res) => {
        const alloc = allocations.find((a) => a.resourceId === res.id);
        if (alloc) {
          const newAllocated = res.inUseCapacity + alloc.quantity;
          const newAvailable = Math.max(0, res.totalCapacity - newAllocated);
          return {
            ...res,
            inUseCapacity: newAllocated,
            availableCapacity: newAvailable,
            status: newAvailable === 0 ? 'Depleted' : 'Mobilizing'
          };
        }
        return res;
      })
    );
    showToast('Command approval registered: Resources mobilized for incident.');
  };

  const handleUpdateResource = (resourceId: string, deltaAllocated: number) => {
    setResources((prev) =>
      prev.map((res) => {
        if (res.id === resourceId) {
          const newInUse = Math.max(0, Math.min(res.totalCapacity, res.inUseCapacity + deltaAllocated));
          const newAvail = Math.max(0, res.totalCapacity - newInUse);
          return {
            ...res,
            inUseCapacity: newInUse,
            availableCapacity: newAvail,
            status: newAvail === 0 ? 'Depleted' : 'Ready'
          };
        }
        return res;
      })
    );
  };

  const handleUpdateShelterOccupancy = (shelterId: string, newOccupancy: number) => {
    setShelters((prev) =>
      prev.map((s) => {
        if (s.id === shelterId) {
          const occ = Math.max(0, Math.min(s.totalBeds, newOccupancy));
          return {
            ...s,
            occupiedBeds: occ,
            status: occ >= s.totalBeds ? 'Full' : (occ > s.totalBeds * 0.85 ? 'Near Capacity' : 'Accepting Evacuees')
          };
        }
        return s;
      })
    );
  };

  const handleOpenReportWithCoords = (coords: { lat: number; lng: number }) => {
    setMapCoordsForReport(coords);
    setIsReportModalOpen(true);
  };

  const criticalCount = incidents.filter((i) => i.severity === 'Critical').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-red-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs animate-in slide-in-from-top-2 duration-300">
          <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => {
          setMapCoordsForReport(null);
          setIsReportModalOpen(true);
        }}
        onLoadScenario={handleLoadFloodScenario}
        onResetData={handleResetData}
        incidentCount={incidents.length}
        criticalCount={criticalCount}
        isGeminiConfigured={isGeminiConfigured}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <MainDashboard
            incidents={incidents}
            resources={resources}
            shelters={shelters}
            alerts={alerts}
            onSelectIncident={(inc) => {
              setSelectedIncident(inc);
              setActiveTab('incidents');
            }}
            onNavigateTab={setActiveTab}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onLoadScenario={handleLoadFloodScenario}
          />
        )}

        {activeTab === 'map' && (
          <LiveDisasterMap
            incidents={incidents}
            resources={resources}
            shelters={shelters}
            selectedIncident={selectedIncident}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            onOpenReportModalWithCoords={handleOpenReportWithCoords}
          />
        )}

        {activeTab === 'incidents' && (
          <IncidentManagement
            incidents={incidents}
            resources={resources}
            selectedIncident={selectedIncident}
            onSelectIncident={setSelectedIncident}
            onUpdateIncident={handleUpdateIncident}
            onDispatchResources={handleDispatchResources}
          />
        )}

        {activeTab === 'resources' && (
          <ResourceManagement
            resources={resources}
            shelters={shelters}
            incidents={incidents}
            onUpdateResource={handleUpdateResource}
            onUpdateShelterOccupancy={handleUpdateShelterOccupancy}
          />
        )}

        {activeTab === 'agents' && (
          <AgentPipelineViewer
            incidents={incidents}
            resources={resources}
            onUpdateIncidentAnalysis={handleUpdateIncidentAnalysis}
          />
        )}

        {activeTab === 'assistant' && (
          <AIAssistant
            onNavigateTab={setActiveTab}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsReports
            incidents={incidents}
            resources={resources}
            shelters={shelters}
          />
        )}
      </main>

      {/* Report Emergency Modal */}
      <ReportEmergencyModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitIncident={(newInc) => {
          setIncidents((prev) => [newInc, ...prev]);
          setSelectedIncident(newInc);
        }}
        resources={resources}
        initialCoordinates={mapCoordsForReport}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-4 text-center text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-400">DisasterGuard AI</span>
            <span>•</span>
            <span>Multi-Agent Emergency Response Orchestration System</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] text-slate-500">
            <span>Powered by Google Gemini</span>
            <span>•</span>
            <span className="text-amber-500/80 font-semibold">Simulated Demonstration Environment</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
