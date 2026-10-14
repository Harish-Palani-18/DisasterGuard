import React, { useState } from 'react';
import { ReliefResource, EmergencyShelter, IncidentReport } from '../types';
import {
  ShieldAlert,
  LifeBuoy,
  HeartPulse,
  Truck,
  Building2,
  Cpu,
  Plus,
  Minus,
  CheckCircle,
  AlertTriangle,
  Info,
  Radio,
  ExternalLink,
  MapPin
} from 'lucide-react';

interface ResourceManagementProps {
  resources: ReliefResource[];
  shelters: EmergencyShelter[];
  incidents: IncidentReport[];
  onUpdateResource: (resourceId: string, deltaAllocated: number) => void;
  onUpdateShelterOccupancy: (shelterId: string, newOccupancy: number) => void;
}

export const ResourceManagement: React.FC<ResourceManagementProps> = ({
  resources,
  shelters,
  incidents,
  onUpdateResource,
  onUpdateShelterOccupancy
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [allocationNotice, setAllocationNotice] = useState<string | null>(null);

  const categories = [
    'All',
    'Rescue Boats & Watercraft',
    'Emergency Ambulances',
    'NDRF / Disaster Response Teams',
    'Medical Trauma Kits',
    'Food & Clean Water Rations',
    'Mobile Emergency Generators',
    'Drone Surveillance Units'
  ];

  const filteredResources = selectedCategory === 'All'
    ? resources
    : resources.filter(r => r.category === selectedCategory);

  const handleAllocate = (res: ReliefResource, qty: number) => {
    if (res.availableCapacity < qty) {
      setAllocationNotice(`Cannot allocate: exceeds available capacity (${res.availableCapacity} ${res.unit} available).`);
      setTimeout(() => setAllocationNotice(null), 3000);
      return;
    }
    onUpdateResource(res.id, qty);
    setAllocationNotice(`Successfully allocated ${qty} ${res.unit} of ${res.name}.`);
    setTimeout(() => setAllocationNotice(null), 3000);
  };

  const handleRelease = (res: ReliefResource, qty: number) => {
    if (res.inUseCapacity < qty) {
      setAllocationNotice(`Cannot release: only ${res.inUseCapacity} in use.`);
      setTimeout(() => setAllocationNotice(null), 3000);
      return;
    }
    onUpdateResource(res.id, -qty);
    setAllocationNotice(`Released ${qty} ${res.unit} back to available inventory.`);
    setTimeout(() => setAllocationNotice(null), 3000);
  };

  // High-priority incidents with unmet needs
  const criticalIncidentsNeedingResources = incidents.filter(
    i => (i.severity === 'Critical' || i.severity === 'High') && i.status !== 'Resolved'
  );

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {allocationNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs animate-bounce">
          <Info className="w-4 h-4 text-indigo-400" />
          <span>{allocationNotice}</span>
        </div>
      )}

      {/* Top Resource Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Fleet Categories</span>
            <ShieldAlert className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">{resources.length} Depots</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Ready for disaster dispatch</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Rescue Boats & Watercraft</span>
            <LifeBuoy className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-400 mt-1">
            {resources.find(r => r.category === 'Rescue Boats & Watercraft')?.availableCapacity || 0} Ready
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Ulsoor Lake Aquatic Base</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>ALS Ambulances Available</span>
            <HeartPulse className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400 mt-1">
            {resources.find(r => r.category === 'Emergency Ambulances')?.availableCapacity || 0} Units
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Victoria Hospital Hub</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Shelter Bed Availability</span>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {shelters.reduce((acc, s) => acc + (s.totalBeds - s.occupiedBeds), 0)} Free Beds
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Across {shelters.length} evacuation hubs</p>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-red-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Resources Fleet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((res) => {
          const pctAvailable = Math.round((res.availableCapacity / res.totalCapacity) * 100);
          return (
            <div
              key={res.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">
                    {res.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    res.status === 'Ready'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {res.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{res.name}</h3>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{res.depotLocation}</span>
                </p>
              </div>

              {/* Capacity Progress Bar */}
              <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Available:</span>
                  <span className="font-mono font-bold text-white">
                    {res.availableCapacity} / {res.totalCapacity} {res.unit}
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      pctAvailable > 40 ? 'bg-emerald-500' : (pctAvailable > 15 ? 'bg-amber-500' : 'bg-red-500')
                    }`}
                    style={{ width: `${pctAvailable}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                  <span>In Use: {res.inUseCapacity}</span>
                  <span>{pctAvailable}% Ready</span>
                </div>
              </div>

              {/* Radio Band & Action Controls */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Radio className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{res.contactRadio}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleRelease(res, 1)}
                    disabled={res.inUseCapacity <= 0}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 transition-colors"
                    title="Release 1 unit back to pool"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleAllocate(res, 1)}
                    disabled={res.availableCapacity <= 0}
                    className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed border border-indigo-500 transition-colors"
                    title="Allocate 1 unit"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Shelters Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Emergency Evacuation Shelters & Relief Camps
            </h3>
          </div>
          <span className="text-xs text-slate-400">Total Capacity: {shelters.reduce((a, b) => a + b.totalBeds, 0)} Beds</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {shelters.map((s) => {
            const occPct = Math.round((s.occupiedBeds / s.totalBeds) * 100);
            return (
              <div key={s.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="text-xs font-bold text-white">{s.name}</h4>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    s.status === 'Accepting Evacuees' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                  }`}>
                    {s.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{s.address}</p>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>Occupancy:</span>
                    <span className="font-mono">{s.occupiedBeds} / {s.totalBeds} ({occPct}%)</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full ${occPct > 80 ? 'bg-red-500' : 'bg-sky-500'}`}
                      style={{ width: `${occPct}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
                  {s.facilities.slice(0, 3).map((f, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800">
                      {f}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Helpline: {s.contactNumber}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateShelterOccupancy(s.id, Math.max(0, s.occupiedBeds - 10))}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px]"
                    >
                      -10
                    </button>
                    <button
                      onClick={() => onUpdateShelterOccupancy(s.id, Math.min(s.totalBeds, s.occupiedBeds + 10))}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px]"
                    >
                      +10
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
