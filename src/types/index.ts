export type DisasterType =
  | 'Flood'
  | 'Wildfire'
  | 'Earthquake'
  | 'Cyclone'
  | 'Landslide'
  | 'Industrial Hazard'
  | 'Severe Storm'
  | 'Heatwave';

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type IncidentStatus =
  | 'Pending Triage'
  | 'Under Review'
  | 'Approved & Dispatched'
  | 'Active Response'
  | 'Resolved'
  | 'Rejected';

export type VerificationStatus =
  | 'Verified Official'
  | 'Crowdsourced - High Confidence'
  | 'Unverified Report'
  | 'Simulated Demo';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MonitoringAgentOutput {
  hazardIdentified: DisasterType | string;
  confidenceScore: number; // 0 - 100
  affectedArea: string;
  summary: string;
  source: string;
  verified: boolean;
  weatherCorroboration: string;
  timestamp: string;
}

export interface RiskAssessmentAgentOutput {
  calculatedSeverity: SeverityLevel;
  riskScore: number; // 0 - 100
  impactFactors: {
    lifeThreat: number;
    infrastructureDamage: number;
    populationVulnerability: number;
    environmentalHazard: number;
  };
  evidenceRationale: string[];
  missingInformation: string[];
  uncertaintyRating: 'Low' | 'Moderate' | 'High';
  disclaimer: string;
}

export interface EmergencyTriageAgentOutput {
  immediateLifeThreat: boolean;
  priorityRank: 'P1 - Immediate' | 'P2 - High' | 'P3 - Standard' | 'P4 - Non-Urgent';
  extractedNeeds: string[];
  estimatedPeopleAffected: number;
  reportedInjuries: number;
  duplicateOrConflictingNotice?: string;
  conciseSummary: string;
  suggestedFirstSteps: string[];
  safetyAdvisoryForReporter: string;
}

export interface AllocatedResourceItem {
  resourceId: string;
  resourceName: string;
  quantityRequested: number;
  quantityAllocated: number;
  etaMinutes: number;
  purpose: string;
  status: 'Proposed' | 'Approved' | 'Dispatched' | 'Released';
}

export interface ResourceCoordinationAgentOutput {
  recommendations: AllocatedResourceItem[];
  rationale: string;
  unmetNeeds: string[];
  requiresHumanApproval: boolean;
  deploymentFeasibility: 'High' | 'Moderate' | 'Constrained';
}

export interface MultilingualAlerts {
  en: string;
  hi: string;
  kn: string;
}

export interface PublicCommunicationAgentOutput {
  multilingual: MultilingualAlerts;
  audienceVariants: {
    citizens: string;
    firstResponders: string;
    administrators: string;
  };
  broadcastChannels: string[];
  officialDisclaimer: string;
}

export interface MultiAgentAnalysis {
  pipelineCompletedAt: string;
  overallExecutionTimeMs: number;
  usedEngine: 'gemini-3.8-flash' | 'simulated-engine';
  monitoring: MonitoringAgentOutput;
  riskAssessment: RiskAssessmentAgentOutput;
  triage: EmergencyTriageAgentOutput;
  resourceCoordination: ResourceCoordinationAgentOutput;
  publicCommunication: PublicCommunicationAgentOutput;
}

export interface IncidentReport {
  id: string;
  title: string;
  disasterType: DisasterType;
  description: string;
  locationName: string;
  coordinates: Coordinates;
  reportedAt: string;
  updatedAt: string;
  peopleAffected: number;
  injuredCount: number;
  immediateThreat: boolean;
  requestedAssistance: string[];
  photoUrl?: string;
  reporterName: string;
  reporterContactMasked: string;
  severity: SeverityLevel;
  status: IncidentStatus;
  verificationStatus: VerificationStatus;
  agentAnalysis?: MultiAgentAnalysis;
  humanApproval?: {
    approvedBy?: string;
    approvedAt?: string;
    notes?: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Modified';
  };
  assignedResources: {
    resourceId: string;
    name: string;
    quantity: number;
    dispatchedAt?: string;
  }[];
}

export interface ReliefResource {
  id: string;
  name: string;
  category:
    | 'Rescue Boats & Watercraft'
    | 'Emergency Ambulances'
    | 'NDRF / Disaster Response Teams'
    | 'Medical Trauma Kits'
    | 'Food & Clean Water Rations'
    | 'Mobile Emergency Generators'
    | 'Drone Surveillance Units';
  totalCapacity: number;
  availableCapacity: number;
  inUseCapacity: number;
  unit: string;
  depotLocation: string;
  coordinates: Coordinates;
  status: 'Ready' | 'Mobilizing' | 'Depleted';
  contactRadio: string;
}

export interface EmergencyShelter {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  totalBeds: number;
  occupiedBeds: number;
  facilities: string[];
  contactNumber: string;
  status: 'Accepting Evacuees' | 'Near Capacity' | 'Full';
}

export interface OfficialAlert {
  id: string;
  hazardType: DisasterType;
  severity: SeverityLevel;
  agency: string;
  headline: string;
  summary: string;
  affectedRegions: string[];
  issuedAt: string;
  validUntil: string;
  verifiedOfficial: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  sources?: string[];
}
