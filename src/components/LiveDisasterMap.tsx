import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  IncidentReport,
  ReliefResource,
  EmergencyShelter,
  SeverityLevel,
  IncidentStatus,
  DisasterType
} from '../types';
import {
  Layers,
  Filter,
  Eye,
  AlertTriangle,
  Building2,
  Shield,
  MapPin,
  ExternalLink,
  Info,
  Maximize2,
  RotateCcw,
  Sparkles,
  Map as MapIcon,
  CheckCircle2,
  AlertOctagon,
  LifeBuoy
} from 'lucide-react';

interface LiveDisasterMapProps {
  incidents: IncidentReport[];
  resources: ReliefResource[];
  shelters: EmergencyShelter[];
  selectedIncident: IncidentReport | null;
  onSelectIncident: (incident: IncidentReport | null) => void;
  onOpenReportModalWithCoords?: (coords: { lat: number; lng: number }) => void;
}

export const LiveDisasterMap: React.FC<LiveDisasterMapProps> = ({
  incidents,
  resources,
  shelters,
  selectedIncident,
  onSelectIncident,
  onOpenReportModalWithCoords
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markerLayersRef = useRef<{ [key: string]: L.LayerGroup }>({});

  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showShelters, setShowShelters] = useState<boolean>(true);
  const [showResources, setShowResources] = useState<boolean>(true);
  const [showHazardZones, setShowHazardZones] = useState<boolean>(true);
  const [mapStyle, setMapStyle] = useState<'osm_dark' | 'osm_standard'>('osm_dark');
  const [pickedCoords, setPickedCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Helper for disaster-specific icon
  const getDisasterIcon = (type: DisasterType | string): string => {
    switch (type) {
      case 'Flood':
        return '🌊';
      case 'Wildfire':
        return '🔥';
      case 'Industrial Hazard':
        return '🏭';
      case 'Earthquake':
        return '🏚️';
      case 'Landslide':
        return '⛰️';
      case 'Severe Storm':
      case 'Cyclone':
        return '🌪️';
      case 'Heatwave':
        return '☀️';
      default:
        return '⚠️';
    }
  };

  // Helper for severity color
  const getSeverityColor = (severity: SeverityLevel): string => {
    switch (severity) {
      case 'Critical':
        return '#ef4444'; // Red
      case 'High':
        return '#f97316'; // Orange
      case 'Medium':
        return '#eab308'; // Yellow
      case 'Low':
        return '#22c55e'; // Green
      default:
        return '#94a3b8';
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Bangalore urban district (12.9716, 77.5946)
    const map = L.map(mapContainerRef.current, {
      center: [12.9716, 77.5946],
      zoom: 12,
      zoomControl: false,
    });

    // Tile Layer: Standard free OpenStreetMap tiles (no API key, token, or watermark)
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Layer groups for markers and hazard radiuses
    const incidentsLayer = L.layerGroup().addTo(map);
    const sheltersLayer = L.layerGroup().addTo(map);
    const resourcesLayer = L.layerGroup().addTo(map);
    const hazardZonesLayer = L.layerGroup().addTo(map);

    markerLayersRef.current = {
      incidents: incidentsLayer,
      shelters: sheltersLayer,
      resources: resourcesLayer,
      hazardZones: hazardZonesLayer
    };

    // Map click handler to pick coordinates
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setPickedCoords({ lat: Number(lat.toFixed(4)), lng: Number(lng.toFixed(4)) });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update container style when mapStyle changes (pure CSS, no external tile provider or API key)
  useEffect(() => {
    if (mapContainerRef.current) {
      if (mapStyle === 'osm_dark') {
        mapContainerRef.current.classList.add('map-dark-tiles');
      } else {
        mapContainerRef.current.classList.remove('map-dark-tiles');
      }
    }
  }, [mapStyle]);

  // Update Markers and Hazards when filters or data change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const { incidents: incLayer, shelters: shlLayer, resources: resLayer, hazardZones: hzLayer } = markerLayersRef.current;
    if (!incLayer || !shlLayer || !resLayer || !hzLayer) return;

    incLayer.clearLayers();
    shlLayer.clearLayers();
    resLayer.clearLayers();
    hzLayer.clearLayers();

    // 1. Filtered Incidents
    const filteredIncidents = incidents.filter((inc) => {
      if (severityFilter !== 'All' && inc.severity !== severityFilter) return false;
      if (typeFilter !== 'All' && inc.disasterType !== typeFilter) return false;
      if (statusFilter !== 'All' && inc.status !== statusFilter) return false;
      return true;
    });

    filteredIncidents.forEach((inc) => {
      const color = getSeverityColor(inc.severity);
      const iconEmoji = getDisasterIcon(inc.disasterType);
      const isCritical = inc.severity === 'Critical';

      // Custom HTML Marker Icon with severity halo & disaster emoji
      const customIcon = L.divIcon({
        className: 'custom-incident-marker',
        html: `
          <div style="
            position: relative;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          ">
            <div style="
              position: absolute;
              width: ${isCritical ? '36px' : '30px'};
              height: ${isCritical ? '36px' : '30px'};
              border-radius: 50%;
              background: ${color}40;
              ${isCritical ? 'animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;' : ''}
            "></div>
            <div style="
              width: 26px;
              height: 26px;
              border-radius: 50%;
              background: ${color};
              border: 2px solid #ffffff;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 13px;
              line-height: 1;
            ">${iconEmoji}</div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([inc.coordinates.lat, inc.coordinates.lng], { icon: customIcon });

      // Interactive popup
      const popupHtml = `
        <div style="padding: 6px; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; min-width: 210px; max-width: 280px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 4px;">
            <span style="background: ${color}30; color: ${color}; border: 1px solid ${color}60; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 9999px; text-transform: uppercase;">
              ${inc.severity} Severity
            </span>
            <span style="font-family: monospace; font-size: 10px; color: #94a3b8;">${inc.id}</span>
          </div>

          <div style="font-weight: 700; font-size: 13px; color: #f8fafc; line-height: 1.3;">
            ${inc.title}
          </div>

          <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">
            📍 ${inc.locationName}
          </div>

          <div style="margin-top: 6px; padding: 6px; background: rgba(15, 23, 42, 0.8); border: 1px solid #334155; border-radius: 6px; font-size: 11px; color: #cbd5e1;">
            <div><strong>Impact:</strong> ${inc.peopleAffected} affected (${inc.injuredCount} casualties)</div>
            <div style="margin-top: 2px;"><strong>Status:</strong> ${inc.status}</div>
          </div>

          <div style="margin-top: 8px; font-size: 10px; color: #38bdf8;">
            Click marker or panel to inspect 5-agent dossier
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        onSelectIncident(inc);
      });

      incLayer.addLayer(marker);

      // Add simulated hazard perimeter buffer circle
      if (showHazardZones && (inc.severity === 'Critical' || inc.severity === 'High')) {
        const radiusMeters = inc.severity === 'Critical' ? 1200 : 700;
        const circle = L.circle([inc.coordinates.lat, inc.coordinates.lng], {
          radius: radiusMeters,
          color: color,
          fillColor: color,
          fillOpacity: 0.12,
          weight: 1.5,
          dashArray: '4, 6'
        });
        circle.bindTooltip(`Simulated Hazard Buffer (${radiusMeters}m)`, {
          permanent: false,
          direction: 'top',
          className: 'leaflet-custom-tooltip'
        });
        hzLayer.addLayer(circle);
      }
    });

    // 2. Shelters Layer
    if (showShelters) {
      shelters.forEach((s) => {
        const shelterIcon = L.divIcon({
          className: 'custom-shelter-marker',
          html: `
            <div style="
              width: 28px;
              height: 28px;
              border-radius: 8px;
              background: #0284c7;
              border: 2px solid #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 14px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
              cursor: pointer;
            ">🏕️</div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14]
        });

        const marker = L.marker([s.coordinates.lat, s.coordinates.lng], { icon: shelterIcon });
        marker.bindPopup(`
          <div style="padding: 6px; font-family: inherit; min-width: 200px;">
            <div style="font-weight: 700; font-size: 13px; color: #38bdf8;">${s.name}</div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">📍 ${s.address}</div>
            <div style="font-size: 12px; color: #e2e8f0; margin-top: 6px;">
              <strong>Occupancy:</strong> ${s.occupiedBeds} / ${s.totalBeds} Beds
            </div>
            <div style="font-size: 11px; color: #10b981; margin-top: 2px; font-weight: 600;">
              Status: ${s.status}
            </div>
            <div style="font-size: 10px; color: #64748b; margin-top: 4px;">
              Phone: ${s.contactNumber}
            </div>
          </div>
        `);
        shlLayer.addLayer(marker);
      });
    }

    // 3. Resources Depots Layer
    if (showResources) {
      resources.forEach((r) => {
        const resIcon = L.divIcon({
          className: 'custom-res-marker',
          html: `
            <div style="
              width: 28px;
              height: 28px;
              border-radius: 8px;
              background: #7c3aed;
              border: 2px solid #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 14px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
              cursor: pointer;
            ">🛡️</div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14]
        });

        const marker = L.marker([r.coordinates.lat, r.coordinates.lng], { icon: resIcon });
        marker.bindPopup(`
          <div style="padding: 6px; font-family: inherit; min-width: 200px;">
            <div style="font-weight: 700; font-size: 13px; color: #c084fc;">${r.name}</div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">📍 ${r.depotLocation}</div>
            <div style="font-size: 12px; color: #e2e8f0; margin-top: 6px;">
              <strong>Available:</strong> ${r.availableCapacity} / ${r.totalCapacity} ${r.unit}
            </div>
            <div style="font-size: 11px; color: #a855f7; margin-top: 2px;">
              Radio Channel: ${r.contactRadio}
            </div>
          </div>
        `);
        resLayer.addLayer(marker);
      });
    }
  }, [
    incidents,
    shelters,
    resources,
    severityFilter,
    typeFilter,
    statusFilter,
    showShelters,
    showResources,
    showHazardZones
  ]);

  // Pan to selected incident when selection changes
  useEffect(() => {
    if (selectedIncident && mapInstanceRef.current) {
      mapInstanceRef.current.setView(
        [selectedIncident.coordinates.lat, selectedIncident.coordinates.lng],
        14,
        { animate: true }
      );
    }
  }, [selectedIncident]);

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([12.9716, 77.5946], 12, { animate: true });
    }
  };

  const fitAllMarkers = () => {
    if (!mapInstanceRef.current || incidents.length === 0) return;
    const latLngs = incidents.map(i => [i.coordinates.lat, i.coordinates.lng] as [number, number]);
    const bounds = L.latLngBounds(latLngs);
    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Layer Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-lg space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Filter items */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mr-1">
              <Filter className="w-4 h-4 text-slate-400" />
              <span>Map Filters:</span>
            </div>

            {/* Severity selector */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-2.5 py-1.5 font-medium focus:ring-1 focus:ring-red-500 focus:outline-none"
            >
              <option value="All">All Severities</option>
              <option value="Critical">🔴 Critical</option>
              <option value="High">🟠 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>

            {/* Disaster Type selector */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-2.5 py-1.5 font-medium focus:ring-1 focus:ring-red-500 focus:outline-none"
            >
              <option value="All">All Disaster Types</option>
              <option value="Flood">🌊 Floods</option>
              <option value="Industrial Hazard">🏭 Industrial Hazards</option>
              <option value="Landslide">⛰️ Landslides</option>
              <option value="Earthquake">🏚️ Earthquakes</option>
              <option value="Heatwave">☀️ Heatwaves</option>
              <option value="Severe Storm">🌪️ Storms & Cyclones</option>
            </select>

            {/* Incident Status selector */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-2.5 py-1.5 font-medium focus:ring-1 focus:ring-red-500 focus:outline-none"
            >
              <option value="All">All Incident Statuses</option>
              <option value="Pending Triage">Pending Triage</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved & Dispatched">Approved & Dispatched</option>
              <option value="Active Response">Active Response</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Action buttons (Recenter & Fit) */}
          <div className="flex items-center gap-2">
            {/* Tile Style Toggle */}
            <button
              onClick={() => setMapStyle(mapStyle === 'osm_dark' ? 'osm_standard' : 'osm_dark')}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              title="Toggle OpenStreetMap Tile Style"
            >
              <MapIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>{mapStyle === 'osm_dark' ? 'OSM Dark' : 'OSM Standard'}</span>
            </button>

            <button
              onClick={fitAllMarkers}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              title="Fit all markers in view"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fit Bounds</span>
            </button>

            <button
              onClick={resetView}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-700"
              title="Recenter Map"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Layer Checkboxes */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
          <label className="flex items-center gap-1.5 font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showShelters}
              onChange={(e) => setShowShelters(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-sky-500 focus:ring-0"
            />
            <span>Shelters (🏕️)</span>
          </label>

          <label className="flex items-center gap-1.5 font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showResources}
              onChange={(e) => setShowResources(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-purple-500 focus:ring-0"
            />
            <span>Relief Depots (🛡️)</span>
          </label>

          <label className="flex items-center gap-1.5 font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showHazardZones}
              onChange={(e) => setShowHazardZones(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-red-500 focus:ring-0"
            />
            <span>Simulated Hazard Buffers</span>
          </label>

          <div className="ml-auto text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Leaflet + OpenStreetMap (No Google Maps API Key or Billing Required)</span>
          </div>
        </div>
      </div>

      {/* Map Canvas + Overlays */}
      <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
        <div ref={mapContainerRef} className={`w-full h-full ${mapStyle === 'osm_dark' ? 'map-dark-tiles' : ''}`} />

        {/* Map Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-800 p-3.5 rounded-2xl shadow-xl text-xs space-y-2 pointer-events-auto max-w-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 text-[11px] uppercase tracking-wider">
              OpenStreetMap Legend
            </span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
              Leaflet 1.9
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block shadow-sm shadow-red-500/50" />
              <span className="text-slate-300">Critical (Red)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 inline-block shadow-sm shadow-orange-500/50" />
              <span className="text-slate-300">High (Orange)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block shadow-sm shadow-yellow-500/50" />
              <span className="text-slate-300">Medium (Yellow)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-500/50" />
              <span className="text-slate-300">Low (Green)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs">🏕️</span>
              <span className="text-sky-300">Relief Shelter</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs">🛡️</span>
              <span className="text-purple-300">Resource Depot</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1.5 flex items-center justify-between">
            <span>Click map to pick coordinates</span>
            <span className="text-slate-500">Demo Data</span>
          </div>
        </div>

        {/* Coordinate Picker Banner if user clicked on map */}
        {pickedCoords && (
          <div className="absolute top-4 left-4 z-20 bg-slate-900/95 backdrop-blur-md border border-red-500/40 p-3 rounded-xl shadow-xl text-xs flex items-center gap-3">
            <div>
              <p className="font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-400" />
                <span>Selected Pin: {pickedCoords.lat}, {pickedCoords.lng}</span>
              </p>
              <p className="text-[11px] text-slate-400">Ready to lodge an emergency report at this location</p>
            </div>
            <button
              onClick={() => {
                if (onOpenReportModalWithCoords) {
                  onOpenReportModalWithCoords(pickedCoords);
                  setPickedCoords(null);
                }
              }}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-colors shadow-md shadow-red-700/30"
            >
              Report Here
            </button>
            <button
              onClick={() => setPickedCoords(null)}
              className="text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Selected Incident Inspector Floating Panel */}
        {selectedIncident && (
          <div className="absolute top-4 right-4 z-20 w-80 sm:w-96 max-h-[580px] overflow-y-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 p-5 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                  selectedIncident.severity === 'Critical'
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : selectedIncident.severity === 'High'
                    ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                    : selectedIncident.severity === 'Medium'
                    ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {selectedIncident.severity} Severity
                </span>
                <span className="ml-2 font-mono text-xs text-slate-400">{selectedIncident.id}</span>
              </div>
              <button
                onClick={() => onSelectIncident(null)}
                className="text-slate-400 hover:text-white text-base font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold mb-1">
                <span>{getDisasterIcon(selectedIncident.disasterType)}</span>
                <span>{selectedIncident.disasterType} Incident</span>
              </div>
              <h3 className="text-base font-bold text-white leading-snug">{selectedIncident.title}</h3>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{selectedIncident.locationName}</span>
              </p>
            </div>

            {selectedIncident.photoUrl && (
              <img
                src={selectedIncident.photoUrl}
                alt="Incident Ground"
                className="w-full h-36 object-cover rounded-xl border border-slate-800"
              />
            )}

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <p className="leading-relaxed">{selectedIncident.description}</p>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
                <span>Affected: <strong className="text-white">{selectedIncident.peopleAffected}</strong></span>
                <span>Injured: <strong className="text-red-400">{selectedIncident.injuredCount}</strong></span>
                <span>Status: <strong className="text-white">{selectedIncident.status}</strong></span>
              </div>
            </div>

            {/* AI Agent Triage Highlight */}
            {selectedIncident.agentAnalysis && (
              <div className="bg-indigo-950/40 border border-indigo-800/50 p-3 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-indigo-300 font-bold text-[11px]">
                  <span>Gemini Multi-Agent Triage</span>
                  <span>{selectedIncident.agentAnalysis.triage.priorityRank}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedIncident.agentAnalysis.triage.conciseSummary}
                </p>
                <div className="text-[10px] text-slate-400">
                  Confidence: {selectedIncident.agentAnalysis.monitoring.confidenceScore}% • Uncertainty: {selectedIncident.agentAnalysis.riskAssessment.uncertaintyRating}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectIncident(selectedIncident)}
                className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-red-700/30"
              >
                Inspect Incident Dossier
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
