import React, { useState } from 'react';
import {
  X,
  AlertOctagon,
  MapPin,
  Users,
  HeartPulse,
  Send,
  Loader2,
  Camera,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Cpu
} from 'lucide-react';
import { DisasterType, IncidentReport, MultiAgentAnalysis, ReliefResource } from '../types';
import { orchestrateIncidentAnalysis } from '../services/agentService';

interface ReportEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitIncident: (incident: IncidentReport) => void;
  resources: ReliefResource[];
  initialCoordinates?: { lat: number; lng: number } | null;
}

export const ReportEmergencyModal: React.FC<ReportEmergencyModalProps> = ({
  isOpen,
  onClose,
  onSubmitIncident,
  resources,
  initialCoordinates
}) => {
  const [disasterType, setDisasterType] = useState<DisasterType>('Flood');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [lat, setLat] = useState<number>(initialCoordinates?.lat || 12.9350);
  const [lng, setLng] = useState<number>(initialCoordinates?.lng || 77.6200);
  const [peopleAffected, setPeopleAffected] = useState<number>(1);
  const [injuredCount, setInjuredCount] = useState<number>(0);
  const [immediateThreat, setImmediateThreat] = useState<boolean>(true);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([
    'Inflatable Rescue Boats',
    'Emergency Paramedics'
  ]);
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Triage Execution State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orchestrationStep, setOrchestrationStep] = useState<string>('');
  const [completedIncident, setCompletedIncident] = useState<IncidentReport | null>(null);

  if (!isOpen) return null;

  const handleUseGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(Number(pos.coords.latitude.toFixed(4)));
          setLng(Number(pos.coords.longitude.toFixed(4)));
          if (!locationName) {
            setLocationName('Current GPS Coordinates');
          }
        },
        (err) => {
          console.warn('Geolocation denied or unavailable:', err);
        }
      );
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleNeed = (need: string) => {
    if (selectedNeeds.includes(need)) {
      setSelectedNeeds(selectedNeeds.filter(n => n !== need));
    } else {
      setSelectedNeeds([...selectedNeeds, need]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !locationName) return;

    setIsSubmitting(true);
    setOrchestrationStep('Disaster Monitoring Agent analyzing incoming alert...');

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const typeCode = disasterType.substring(0, 2).toUpperCase();
    const incidentId = `DG-2026-${typeCode}-${randomSuffix}`;

    // Mask phone for public privacy protection
    const maskedPhone = reporterPhone
      ? reporterPhone.replace(/(\+\d{1,3}\s?)?(\d{2,3})(\d+)(\d{3})/, '$1$2••••••$4')
      : '+91 ••••• ••112';

    const rawIncident: Partial<IncidentReport> = {
      id: incidentId,
      title,
      disasterType,
      description,
      locationName,
      coordinates: { lat, lng },
      reportedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      peopleAffected: Number(peopleAffected),
      injuredCount: Number(injuredCount),
      immediateThreat,
      requestedAssistance: selectedNeeds,
      photoUrl: photoPreview || undefined,
      reporterName: reporterName || 'Anonymous Citizen',
      reporterContactMasked: maskedPhone,
      severity: immediateThreat || peopleAffected > 8 ? 'Critical' : (peopleAffected > 3 ? 'High' : 'Medium'),
      status: 'Pending Triage',
      verificationStatus: 'Crowdsourced - High Confidence',
      assignedResources: []
    };

    try {
      // Step simulation for realistic feel of 5-agent pipeline
      setTimeout(() => setOrchestrationStep('Risk Assessment Agent computing vulnerability score...'), 400);
      setTimeout(() => setOrchestrationStep('Emergency Triage Agent extracting life-threat indicators...'), 800);
      setTimeout(() => setOrchestrationStep('Resource Coordination Agent calculating depot ETA...'), 1200);
      setTimeout(() => setOrchestrationStep('Public Communication Agent generating multilingual alerts...'), 1600);

      const agentAnalysis = await orchestrateIncidentAnalysis(rawIncident, resources);

      const fullIncident: IncidentReport = {
        ...(rawIncident as IncidentReport),
        severity: agentAnalysis.riskAssessment.calculatedSeverity || rawIncident.severity!,
        status: 'Under Review',
        agentAnalysis
      };

      setTimeout(() => {
        setIsSubmitting(false);
        setCompletedIncident(fullIncident);
        onSubmitIncident(fullIncident);
      }, 1900);
    } catch (err) {
      console.error('Submission failed:', err);
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    setCompletedIncident(null);
    onClose();
  };

  const commonNeedsList = [
    'Inflatable Rescue Boats',
    'Emergency Paramedics',
    'Clean Drinking Water',
    'Food Rations',
    'Power Backup Generator',
    'Mobile Trauma Clinic',
    'Search & Rescue Dogs/NDRF',
    'Temporary Evacuation Bedding'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative my-8 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Emergency Incident Report</h2>
              <p className="text-xs text-slate-400">
                Lodge an emergency request. Triggers instant 5-agent AI triage.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Multi-Agent Running Screen */}
        {isSubmitting && (
          <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-red-500/20 border-t-red-500 animate-spin" />
              <Cpu className="w-7 h-7 text-red-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Multi-Agent System Active</h3>
              <p className="text-xs text-indigo-300 font-mono mt-1 font-semibold">{orchestrationStep}</p>
            </div>
            <div className="max-w-md text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
              Google Gemini is orchestrating the 5 specialized agents to analyze hazard radius, triage urgency, and formulate initial relief recommendations.
            </div>
          </div>
        )}

        {/* Post-Submission Success Screen */}
        {!isSubmitting && completedIncident && (
          <div className="py-6 space-y-5 text-center">
            <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Emergency Successfully Triaged</h3>
              <p className="text-xs font-mono text-emerald-400 mt-1 font-semibold">
                Assigned ID: {completedIncident.id}
              </p>
            </div>

            {completedIncident.agentAnalysis && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">Preliminary AI Severity:</span>
                  <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                    completedIncident.severity === 'Critical'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                  }`}>
                    {completedIncident.severity} ({completedIncident.agentAnalysis.riskAssessment.riskScore}/100)
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  <strong>Triage Advisory: </strong>
                  {completedIncident.agentAnalysis.triage.conciseSummary}
                </div>
                <div className="text-[11px] text-indigo-300 bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-900/50">
                  <strong>Recommended Assets: </strong>
                  {completedIncident.agentAnalysis.resourceCoordination.recommendations.map(r => r.resourceName).join(', ') || 'Pending commander dispatch'}
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all"
              >
                View in Incident Queue
              </button>
            </div>
          </div>
        )}

        {/* The Form */}
        {!isSubmitting && !completedIncident && (
          <form onSubmit={handleSubmit} className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {/* Disaster Type & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Disaster / Hazard Category <span className="text-red-400">*</span>
                </label>
                <select
                  value={disasterType}
                  onChange={(e) => setDisasterType(e.target.value as DisasterType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-red-500 focus:outline-none"
                >
                  <option value="Flood">🌊 Flood / Water Surge</option>
                  <option value="Industrial Hazard">🏭 Industrial Hazard / Chemical Fire</option>
                  <option value="Landslide">⛰️ Landslide / Mudslide</option>
                  <option value="Earthquake">🏚️ Earthquake / Structural Damage</option>
                  <option value="Wildfire">🔥 Wildfire / Brushfire</option>
                  <option value="Severe Storm">🌪️ Severe Storm / Gale Winds</option>
                  <option value="Heatwave">☀️ Extreme Heatwave</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Threat Level Flag
                </label>
                <div
                  onClick={() => setImmediateThreat(!immediateThreat)}
                  className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer select-none transition-colors ${
                    immediateThreat
                      ? 'bg-red-950/40 border-red-600/80 text-red-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center space-x-2 text-xs">
                    <AlertOctagon className={`w-4 h-4 ${immediateThreat ? 'text-red-400 animate-pulse' : 'text-slate-500'}`} />
                    <span className="font-semibold">Immediate Threat to Life</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    immediateThreat ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {immediateThreat ? 'YES - P1' : 'Standard'}
                  </span>
                </div>
              </div>
            </div>

            {/* Title / Headline */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Incident Headline / Short Summary <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., 8 people stranded on terrace due to 5ft floodwater"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
              />
            </div>

            {/* Location & GPS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Specific Location / Landmark <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g., 4th Cross, Green Glen Layout, Bellandur"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-red-500 focus:outline-none pr-8"
                  />
                  <MapPin className="w-4 h-4 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  GPS Coordinates
                </label>
                <button
                  type="button"
                  onClick={handleUseGeolocation}
                  className="w-full py-2 px-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span>Use Device GPS</span>
                </button>
              </div>
            </div>

            {/* Coordinates display */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-400">Latitude:</span>
                <input
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 text-xs font-mono"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Longitude:</span>
                <input
                  type="number"
                  step="0.0001"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 text-xs font-mono"
                />
              </div>
            </div>

            {/* People & Injuries */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>People Affected</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={peopleAffected}
                  onChange={(e) => setPeopleAffected(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-red-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-red-400" />
                  <span>Injured / Casualties</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={injuredCount}
                  onChange={(e) => setInjuredCount(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-red-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Detailed On-Ground Description <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe current hazards (e.g. rising water speed, structural damage, trapped infants/elderly, electrical sparks, smell of gas)..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-red-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Requested Assistance Checkboxes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Required Assistance Capabilities
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {commonNeedsList.map((need) => {
                  const isChecked = selectedNeeds.includes(need);
                  return (
                    <button
                      type="button"
                      key={need}
                      onClick={() => toggleNeed(need)}
                      className={`p-2 rounded-xl border text-left text-[11px] font-medium transition-colors ${
                        isChecked
                          ? 'bg-red-950/40 border-red-500 text-red-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}{need}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Photo Upload Simulator & Reporter Privacy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-slate-400" />
                  <span>Attach Hazard Photo (Optional)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                />
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="mt-2 h-20 w-32 object-cover rounded-lg border border-slate-700"
                  />
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Reporter Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="e.g., Harish P."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contact Phone (Privacy Protected)
                  </label>
                  <input
                    type="tel"
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    placeholder="+91 98860 12345"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Phone numbers are automatically masked on public feeds.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-red-700/30 transition-all hover:scale-[1.02]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit & Run 5-Agent Triage</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
