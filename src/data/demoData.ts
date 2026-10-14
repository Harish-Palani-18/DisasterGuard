import { IncidentReport, ReliefResource, EmergencyShelter, OfficialAlert } from '../types';

export const INITIAL_RESOURCES: ReliefResource[] = [
  {
    id: 'RES-NDRF-01',
    name: 'NDRF Quick Response Battalion Alpha',
    category: 'NDRF / Disaster Response Teams',
    totalCapacity: 12,
    availableCapacity: 7,
    inUseCapacity: 5,
    unit: 'tactical squads (8 members each)',
    depotLocation: 'Central Emergency Depot, MG Road',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    status: 'Ready',
    contactRadio: 'CH-09 / 142.85 MHz'
  },
  {
    id: 'RES-BOAT-02',
    name: 'Inflatable Jet Rescue Watercraft Fleet',
    category: 'Rescue Boats & Watercraft',
    totalCapacity: 20,
    availableCapacity: 12,
    inUseCapacity: 8,
    unit: 'motorized boats (6-person capacity)',
    depotLocation: 'Ulsoor Aquatic Rescue Base',
    coordinates: { lat: 12.9818, lng: 77.6253 },
    status: 'Ready',
    contactRadio: 'CH-04 / 141.20 MHz'
  },
  {
    id: 'RES-AMB-03',
    name: 'ALS Advanced Life Support Ambulances',
    category: 'Emergency Ambulances',
    totalCapacity: 16,
    availableCapacity: 10,
    inUseCapacity: 6,
    unit: 'paramedic ambulances',
    depotLocation: 'Victoria Hospital Emergency Hub',
    coordinates: { lat: 12.9634, lng: 77.5755 },
    status: 'Ready',
    contactRadio: 'CH-12 / 143.10 MHz'
  },
  {
    id: 'RES-MED-04',
    name: 'Mobile Disaster Trauma & Triage Units',
    category: 'Medical Trauma Kits',
    totalCapacity: 8,
    availableCapacity: 5,
    inUseCapacity: 3,
    unit: 'mobile clinic vans',
    depotLocation: 'Bowring Institute Emergency Staging',
    coordinates: { lat: 12.9822, lng: 77.6033 },
    status: 'Ready',
    contactRadio: 'CH-07 / 142.15 MHz'
  },
  {
    id: 'RES-RAT-05',
    name: 'Emergency Food, Milk & Potable Water Kits',
    category: 'Food & Clean Water Rations',
    totalCapacity: 4000,
    availableCapacity: 2650,
    inUseCapacity: 1350,
    unit: 'family emergency packs (3-day sustenance)',
    depotLocation: 'Food Corporation Logistics Depot, Yeshwanthpur',
    coordinates: { lat: 13.0232, lng: 77.5511 },
    status: 'Ready',
    contactRadio: 'CH-02 / 139.90 MHz'
  },
  {
    id: 'RES-GEN-06',
    name: 'Heavy Duty 45kVA Mobile Power Generators',
    category: 'Mobile Emergency Generators',
    totalCapacity: 14,
    availableCapacity: 9,
    inUseCapacity: 5,
    unit: 'towable diesel generator sets',
    depotLocation: 'BESCOM Emergency Substation, Rajajinagar',
    coordinates: { lat: 12.9982, lng: 77.5530 },
    status: 'Ready',
    contactRadio: 'CH-15 / 144.50 MHz'
  },
  {
    id: 'RES-DRN-07',
    name: 'Thermal Vision Night-Search Drones',
    category: 'Drone Surveillance Units',
    totalCapacity: 6,
    availableCapacity: 4,
    inUseCapacity: 2,
    unit: 'heavy-lift quadcopters with infrared',
    depotLocation: 'State Command Center, Vidhana Soudha',
    coordinates: { lat: 12.9797, lng: 77.5907 },
    status: 'Ready',
    contactRadio: 'CH-01 / 138.50 MHz'
  }
];

export const INITIAL_SHELTERS: EmergencyShelter[] = [
  {
    id: 'SHL-KOR-01',
    name: 'Koramangala Indoor Stadium Evacuation Hub',
    address: '80ft Road, 6th Block, Koramangala',
    coordinates: { lat: 12.9352, lng: 77.6245 },
    totalBeds: 400,
    occupiedBeds: 210,
    facilities: ['Emergency Medical Bay', 'Infant Care Zone', '24h Hot Meals', 'Backup Generator', 'Hygiene Station'],
    contactNumber: '+91 80 2553 4401',
    status: 'Accepting Evacuees'
  },
  {
    id: 'SHL-PEE-02',
    name: 'Peenya Govt Technical College Relief Shelter',
    address: 'Ring Road, Near Peenya 2nd Stage',
    coordinates: { lat: 13.0315, lng: 77.5186 },
    totalBeds: 350,
    occupiedBeds: 310,
    facilities: ['Clean Potable Water', 'Blanket Storage', 'Charging Kiosk', 'Decontamination Wash'],
    contactNumber: '+91 80 2839 1290',
    status: 'Near Capacity'
  },
  {
    id: 'SHL-IND-03',
    name: 'Indiranagar Multi-Purpose Community Shelter',
    address: '100ft Road, 12th Main, Indiranagar',
    coordinates: { lat: 12.9719, lng: 77.6412 },
    totalBeds: 250,
    occupiedBeds: 85,
    facilities: ['First-Aid Post', 'Senior Citizen Cots', 'Community Kitchen', 'Wheelchair Ramp'],
    contactNumber: '+91 80 2520 7823',
    status: 'Accepting Evacuees'
  },
  {
    id: 'SHL-YEL-04',
    name: 'Yelahanka North Disaster Safe-Zone Pavilion',
    address: 'BBMP Complex, Yelahanka New Town',
    coordinates: { lat: 13.1007, lng: 77.5963 },
    totalBeds: 500,
    occupiedBeds: 120,
    facilities: ['Helipad Access', 'Trauma Stabilization', 'Large Animal Holding Area', 'RO Water Plant'],
    contactNumber: '+91 80 2856 9912',
    status: 'Accepting Evacuees'
  }
];

export const INITIAL_OFFICIAL_ALERTS: OfficialAlert[] = [
  {
    id: 'ALT-IMD-2026-08',
    hazardType: 'Flood',
    severity: 'Critical',
    agency: 'India Meteorological Dept (IMD) / BBMP Disaster Cell',
    headline: 'RED ALERT: Heavy Rainfall & Rapid Lake Catchment Overflow',
    summary: 'Bellandur and Varthur drainage catchments receiving intense continuous rainfall (>110mm/3hr). Low-lying basements and ground floors advised to relocate to designated relief shelters immediately.',
    affectedRegions: ['Bellandur', 'HSR Layout Sector 6', 'Varthur', 'Koramangala 4th Block'],
    issuedAt: '2026-10-14T03:15:00Z',
    validUntil: '2026-10-14T18:00:00Z',
    verifiedOfficial: true
  },
  {
    id: 'ALT-FIRE-2026-03',
    hazardType: 'Industrial Hazard',
    severity: 'High',
    agency: 'Karnataka State Fire & Emergency Services',
    headline: 'ORANGE ADVISORY: Chemical Smoke Hazard - 500m Buffer Zone',
    summary: 'Solvent storage facility fire contained to primary shed; toxic vapor plume moving north-west due to 18 km/h wind. Residents downwind advised to seal doors/windows and wear N95 or damp cloth masks.',
    affectedRegions: ['Peenya Industrial Area Stage 1 & 2', 'Jalahalli Cross'],
    issuedAt: '2026-10-14T04:30:00Z',
    validUntil: '2026-10-14T12:00:00Z',
    verifiedOfficial: true
  },
  {
    id: 'ALT-TRAF-2026-19',
    hazardType: 'Landslide',
    severity: 'Medium',
    agency: 'State Highway Traffic Police & PWD',
    headline: 'YELLOW WARNING: Hillside Slip on Coorg Ghat Road (SH-88)',
    summary: 'Single lane blocked by loose soil and rock debris at Km 42. Heavy commercial vehicles diverted via alternate bypass. Road-clearing excavators currently active on site.',
    affectedRegions: ['Madikeri Ghat Section', 'Sampaje Road'],
    issuedAt: '2026-10-14T01:00:00Z',
    validUntil: '2026-10-14T16:00:00Z',
    verifiedOfficial: true
  }
];

export const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: 'DG-2026-FL-081',
    title: 'Flash Flood Inundation & Trapped Families in Rainbow Residency',
    disasterType: 'Flood',
    description: 'Lake spillover caused water levels to surge 4.5 feet into ground-floor apartments. 4 senior citizens with limited mobility and 2 children are trapped on balcony. Power transformer submerged, arcing occurred. Immediate boat evacuation and rescue team required.',
    locationName: 'Rainbow Residency, Bellandur Lake Road, Bangalore',
    coordinates: { lat: 12.9260, lng: 77.6762 },
    reportedAt: '2026-10-14T04:15:20Z',
    updatedAt: '2026-10-14T04:35:10Z',
    peopleAffected: 38,
    injuredCount: 2,
    immediateThreat: true,
    requestedAssistance: ['Inflatable Rescue Boats', 'Emergency Paramedics', 'Power De-energization', 'Clean Drinking Water'],
    photoUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
    reporterName: 'Karthik Ramanathan',
    reporterContactMasked: '+91 ••••• ••482',
    severity: 'Critical',
    status: 'Approved & Dispatched',
    verificationStatus: 'Crowdsourced - High Confidence',
    humanApproval: {
      approvedBy: 'Incident Commander Suresh (Badge #401)',
      approvedAt: '2026-10-14T04:22:00Z',
      notes: 'Approved deployment of 2 Zodiac boats from Ulsoor depot and 1 NDRF squad. BESCOM grid isolation confirmed.',
      status: 'Approved'
    },
    assignedResources: [
      { resourceId: 'RES-BOAT-02', name: 'Inflatable Jet Rescue Watercraft Fleet', quantity: 2, dispatchedAt: '2026-10-14T04:25:00Z' },
      { resourceId: 'RES-NDRF-01', name: 'NDRF Quick Response Battalion Alpha', quantity: 1, dispatchedAt: '2026-10-14T04:25:00Z' }
    ],
    agentAnalysis: {
      pipelineCompletedAt: '2026-10-14T04:16:05Z',
      overallExecutionTimeMs: 1420,
      usedEngine: 'gemini-3.8-flash',
      monitoring: {
        hazardIdentified: 'Flash Flood / Urban Lake Surge',
        confidenceScore: 94,
        affectedArea: 'Bellandur Basin, Bangalore South-East',
        summary: 'Catastrophic lake drainage overflow corroborating IMD Red Alert. Radar shows continued precipitation of 35mm/hr in catchment.',
        source: 'Citizen Emergency Dispatch + IMD Doppler Radar Stream',
        verified: true,
        weatherCorroboration: 'Severe convective cloudburst cell active directly over Varthur-Bellandur corridor.',
        timestamp: '2026-10-14T04:15:30Z'
      },
      riskAssessment: {
        calculatedSeverity: 'Critical',
        riskScore: 92,
        impactFactors: {
          lifeThreat: 95,
          infrastructureDamage: 88,
          populationVulnerability: 90,
          environmentalHazard: 82
        },
        evidenceRationale: [
          'Direct threat to life: 4 mobility-impaired seniors and infants trapped in rapidly rising water (>4 feet).',
          'Active electrical hazard: Submerged transformer with reported arcing.',
          'Access routes cut off: Approach road completely impassable for standard wheeled vehicles.'
        ],
        missingInformation: ['Exact balcony load capacity', 'Contact status with BESCOM local line engineer'],
        uncertaintyRating: 'Low',
        disclaimer: 'Preliminary decision-support metric based on multi-agent synthesis. Requires on-scene incident commander validation.'
      },
      triage: {
        immediateLifeThreat: true,
        priorityRank: 'P1 - Immediate',
        extractedNeeds: ['Water rescue craft', 'Submerged power grid disconnection', 'Pediatric & geriatric stabilization'],
        estimatedPeopleAffected: 38,
        reportedInjuries: 2,
        duplicateOrConflictingNotice: 'Correlates with 2 previous distress calls from neighboring apartment block C.',
        conciseSummary: 'Critical flood inundation with 6 high-vulnerability victims trapped on balcony; imminent hypothermia and electrocution risk.',
        suggestedFirstSteps: [
          'Issue urgent kill-switch order to BESCOM Substation #14',
          'Deploy 2 shallow-draft inflatable rescue boats with outboard guards',
          'Direct evacuees to Koramangala Indoor Stadium Evacuation Hub'
        ],
        safetyAdvisoryForReporter: 'Do not enter floodwater due to submerged live currents. Remain on highest balcony structure. Signal with phone torch.'
      },
      resourceCoordination: {
        recommendations: [
          {
            resourceId: 'RES-BOAT-02',
            resourceName: 'Inflatable Jet Rescue Watercraft Fleet',
            quantityRequested: 2,
            quantityAllocated: 2,
            etaMinutes: 12,
            purpose: 'Extract 6 trapped vulnerable residents from balcony and ground level',
            status: 'Approved'
          },
          {
            resourceId: 'RES-NDRF-01',
            resourceName: 'NDRF Quick Response Battalion Alpha',
            quantityRequested: 1,
            quantityAllocated: 1,
            etaMinutes: 15,
            purpose: 'Establish rope safety line and conduct door-to-door sweep',
            status: 'Approved'
          }
        ],
        rationale: 'Ulsoor Aquatic depot is closest operational staging base (12 min ETA). NDRF squad trained in low-visibility swift water rescue.',
        unmetNeeds: ['High-capacity dewatering pump queued once flood crests'],
        requiresHumanApproval: true,
        deploymentFeasibility: 'High'
      },
      publicCommunication: {
        multilingual: {
          en: 'URGENT FLOOD ALERT: Bellandur Lake Road inundated. Avoid approach roads. Rescue boats active near Rainbow Residency. Emergency shelter open at Koramangala Indoor Stadium.',
          hi: 'आपातकालीन बाढ़ चेतावनी: बेलंदूर लेक रोड जलमग्न हो गया है। कृपया इन रास्तों पर न जाएं। रेनबो रेजिडेंसी के पास राहत नौकाएं सक्रिय हैं। कोरमंगला इंडोर स्टेडियम में सुरक्षित आश्रय खुला है।',
          kn: 'ತುರ್ತು ಪ್ರವಾಹ ಎಚ್ಚರಿಕೆ: ಬೆಳ್ಳಂದೂರು ಲೇಕ್ ರಸ್ತೆ ಜಲಾವೃತವಾಗಿದೆ. ದಯವಿಟ್ಟು ಈ ರಸ್ತೆಯಲ್ಲಿ ಸಂಚರಿಸಬೇಡಿ. ರೇನ್‌ಬೋ ರೆಸಿಡೆನ್ಸಿ ಬಳಿ ರಕ್ಷಣಾ ದೋಣಿಗಳು ಕಾರ್ಯಾಚರಣೆ ನಡೆಸುತ್ತಿವೆ. ಕೋರಮಂಗಲ ಒಳಾಂಗಣ ಕ್ರೀಡಾಂಗಣದಲ್ಲಿ ಪರಿಹಾರ ಕೇಂದ್ರ ತೆರೆಯಲಾಗಿದೆ.'
        },
        audienceVariants: {
          citizens: 'Stay on upper floors. Disconnect home master electrical breaker if accessible. Never wade through brown moving water.',
          firstResponders: 'Warning: 440V transformer submerged at East entrance. Verify grid power isolation before boat entry.',
          administrators: '38 evacuees routed to Koramangala Hub. 2 Zodiac boats committed. Bed occupancy now at 55%.'
        },
        broadcastChannels: ['SMS Cell Broadcast Cell #560103', 'Emergency Radio 106.4 FM', 'DisasterGuard Citizen Feed'],
        officialDisclaimer: 'Simulated demonstration alert aligned with official IMD warning protocols.'
      }
    }
  },
  {
    id: 'DG-2026-FR-092',
    title: 'Industrial Chemical Warehouse Solvent Fire & Toxic Fume Plume',
    disasterType: 'Industrial Hazard',
    description: 'Explosion reported in paint thinner blending storage. Thick black acrid smoke billowing across adjacent residential layout. 18 workers were on floor, 3 suffering respiratory distress. Fire spreading toward solvent drum stacks.',
    locationName: 'Plot 48, Peenya Industrial Area 2nd Phase',
    coordinates: { lat: 13.0285, lng: 77.5140 },
    reportedAt: '2026-10-14T04:28:10Z',
    updatedAt: '2026-10-14T04:42:00Z',
    peopleAffected: 24,
    injuredCount: 4,
    immediateThreat: true,
    requestedAssistance: ['Foam Tender Firetrucks', 'HAZMAT Respiratory Gear', 'ALS Ambulances', '500m Perimeter Evacuation'],
    photoUrl: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=600&q=80',
    reporterName: 'Devendra Gowda (Security Supervisor)',
    reporterContactMasked: '+91 ••••• ••913',
    severity: 'Critical',
    status: 'Active Response',
    verificationStatus: 'Verified Official',
    humanApproval: {
      approvedBy: 'Chief Fire Warden Hegde',
      approvedAt: '2026-10-14T04:32:00Z',
      notes: 'Dispatched chemical foam units and ordered precautionary 500m evacuation upwind.',
      status: 'Approved'
    },
    assignedResources: [
      { resourceId: 'RES-AMB-03', name: 'ALS Advanced Life Support Ambulances', quantity: 2, dispatchedAt: '2026-10-14T04:35:00Z' },
      { resourceId: 'RES-MED-04', name: 'Mobile Disaster Trauma & Triage Units', quantity: 1, dispatchedAt: '2026-10-14T04:36:00Z' }
    ]
  },
  {
    id: 'DG-2026-LS-044',
    title: 'Ghat Highway Mudslide Trapping Intercity Passenger Bus',
    disasterType: 'Landslide',
    description: 'Hillside earth slipped after 48 hours of torrential monsoon downpour. Heavy mud and boulders blocked both lanes. KSRTC bus with 32 passengers unable to turn around due to debris behind.',
    locationName: 'Madikeri-Mangalore Ghat Road (Km 38)',
    coordinates: { lat: 12.4244, lng: 75.7382 },
    reportedAt: '2026-10-14T02:50:00Z',
    updatedAt: '2026-10-14T03:40:00Z',
    peopleAffected: 32,
    injuredCount: 1,
    immediateThreat: false,
    requestedAssistance: ['Earth Movers / Excavator', 'Emergency Drinking Water & Rations', 'Highway Police Traffic Diversion'],
    photoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    reporterName: 'Driver Anand Murthy',
    reporterContactMasked: '+91 ••••• ••721',
    severity: 'High',
    status: 'Under Review',
    verificationStatus: 'Crowdsourced - High Confidence',
    humanApproval: {
      status: 'Pending'
    },
    assignedResources: [
      { resourceId: 'RES-RAT-05', name: 'Emergency Food, Milk & Potable Water Kits', quantity: 35, dispatchedAt: '2026-10-14T03:15:00Z' }
    ]
  },
  {
    id: 'DG-2026-EQ-018',
    title: 'Tremor Aftershock & Structural Cracks in Community Hall',
    disasterType: 'Earthquake',
    description: 'Felt 3.8 magnitude tremor. Deep diagonal cracks observed along load-bearing masonry walls of old school building currently serving as a daycare. All 25 children were safely evacuated to open football ground. Structural engineer inspection needed before re-entry.',
    locationName: 'Shivajinagar Govt School Ground, Bangalore',
    coordinates: { lat: 12.9860, lng: 77.6015 },
    reportedAt: '2026-10-14T01:10:00Z',
    updatedAt: '2026-10-14T02:00:00Z',
    peopleAffected: 25,
    injuredCount: 0,
    immediateThreat: false,
    requestedAssistance: ['Structural Engineering Inspection', 'Tarpaulin Sun Tents', 'Drinking Water'],
    reporterName: 'Sister Teresa (School Headmistress)',
    reporterContactMasked: '+91 ••••• ••604',
    severity: 'Medium',
    status: 'Under Review',
    verificationStatus: 'Crowdsourced - High Confidence',
    assignedResources: []
  },
  {
    id: 'DG-2026-HW-007',
    title: 'Severe Heatwave Dehydration Cluster at Construction Site',
    disasterType: 'Heatwave',
    description: 'Ambient wet-bulb temperature reached 41.5°C. 7 construction laborers exhibited signs of acute heat exhaustion and severe cramps. Basic shade provided, urgent oral rehydration salts and paramedic assessment requested.',
    locationName: 'Outer Ring Road Metro Pier 182 Construction Site',
    coordinates: { lat: 12.9150, lng: 77.6840 },
    reportedAt: '2026-10-14T05:00:00Z',
    updatedAt: '2026-10-14T05:10:00Z',
    peopleAffected: 7,
    injuredCount: 2,
    immediateThreat: false,
    requestedAssistance: ['ORS & Electrolytes', 'First-Aid Cooling Packs', 'Paramedic Ambulances'],
    reporterName: 'Site Safety Officer Ramesh',
    reporterContactMasked: '+91 ••••• ••339',
    severity: 'Medium',
    status: 'Pending Triage',
    verificationStatus: 'Unverified Report',
    assignedResources: []
  },
  {
    id: 'DG-2026-ST-003',
    title: 'Gale Winds Uprooted Ancient Tree over Power Lines',
    disasterType: 'Severe Storm',
    description: 'Squall wind knocked down huge rain tree across 100ft road. Live overhead electrical line snapped and sparking on asphalt. Traffic backed up 1.5 km in both directions.',
    locationName: '12th Main Road, HAL 2nd Stage, Indiranagar',
    coordinates: { lat: 12.9698, lng: 77.6480 },
    reportedAt: '2026-10-14T04:45:00Z',
    updatedAt: '2026-10-14T05:00:00Z',
    peopleAffected: 0,
    injuredCount: 0,
    immediateThreat: false,
    requestedAssistance: ['BESCOM Electrical Wire Crew', 'Tree Sawing & Clearing Team', 'Traffic Wardens'],
    reporterName: 'Resident Association President',
    reporterContactMasked: '+91 ••••• ••112',
    severity: 'Low',
    status: 'Active Response',
    verificationStatus: 'Verified Official',
    assignedResources: []
  }
];

export const FLOOD_DEMO_SCENARIO_INPUT = {
  title: 'Urgent Flood Surge: 14 Residents Trapped on Rooftop near Varthur Weir',
  disasterType: 'Flood' as const,
  locationName: 'Lake View Enclave, Varthur Spillway, Bangalore East',
  coordinates: { lat: 12.9420, lng: 77.7125 },
  peopleAffected: 14,
  injuredCount: 1,
  immediateThreat: true,
  description: 'Water has risen over 6 feet following sudden breach of the secondary lake bund. 14 people including 3 children and 1 injured person with a fractured leg are stranded on the flat concrete rooftop. Water is continuing to rise at 10cm every 15 minutes. Heavy current prevents swimming or walking through.',
  requestedAssistance: ['Rescue Boats & Watercraft', 'Emergency Ambulances', 'NDRF / Disaster Response Teams', 'Medical Trauma Kits'],
  reporterName: 'Praveen Kulkarni (Resident)',
  reporterPhone: '+91 98860 41239'
};
