import React, { useState, useEffect } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  InfoWindow, 
  useMap 
} from '@vis.gl/react-google-maps';

declare const google: any;
import { Issue, DepartmentCategory } from '../types/civic.js';
import { DEFAULT_IMAGES, handleImageError } from '../utils/imageUtils.js';
import { 
  AlertTriangle, 
  Droplet, 
  Zap, 
  Trash2, 
  Trees, 
  TrafficCone, 
  ShieldAlert,
  MapPin,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

const GOOGLE_MAPS_API_KEY = 
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCQ61ORrdnJRJcJ6ONPXFo92VLzfRMHdy4';

interface CivicMapProps {
  issues?: Issue[];
  mode?: 'view' | 'picker';
  selectedLocation?: { lat: number; lng: number };
  onLocationSelect?: (loc: { lat: number; lng: number; address: string }) => void;
  onIssueSelect?: (issue: Issue) => void;
  height?: string;
  zoom?: number;
}

// Helper to get issue-appropriate icon
const getDepartmentIcon = (dept: DepartmentCategory) => {
  switch (dept) {
    case 'Roads & Potholes':
      return <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />;
    case 'Water & Sanitation':
      return <Droplet className="w-3.5 h-3.5 text-cyan-300" />;
    case 'Electricity & Lighting':
      return <Zap className="w-3.5 h-3.5 text-yellow-300" />;
    case 'Garbage & Waste':
      return <Trash2 className="w-3.5 h-3.5 text-rose-300" />;
    case 'Parks & Environment':
      return <Trees className="w-3.5 h-3.5 text-emerald-300" />;
    case 'Traffic & Signals':
      return <TrafficCone className="w-3.5 h-3.5 text-orange-300" />;
    case 'Public Safety':
    default:
      return <ShieldAlert className="w-3.5 h-3.5 text-teal-300" />;
  }
};

// Component to auto-fit bounds on view mode
const MapBoundsAdjuster: React.FC<{ issues: Issue[] }> = ({ issues }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || issues.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    issues.forEach(issue => {
      bounds.extend({ lat: issue.location.lat, lng: issue.location.lng });
    });
    map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
  }, [map, issues]);

  return null;
};

export const CivicMap: React.FC<CivicMapProps> = ({
  issues = [],
  mode = 'view',
  selectedLocation = { lat: 37.7749, lng: -122.4194 },
  onLocationSelect,
  onIssueSelect,
  height = '380px',
  zoom = 13,
}) => {
  const [selectedIssueInfo, setSelectedIssueInfo] = useState<Issue | null>(null);

  // Picker mode map click handler
  const handleMapClick = (e: any) => {
    if (mode !== 'picker' || !onLocationSelect) return;
    const latLng = e.detail?.latLng;
    if (latLng) {
      const lat = latLng.lat;
      const lng = latLng.lng;
      const address = `Civic GPS Point (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      onLocationSelect({ lat, lng, address });
    }
  };

  const handleMarkerDragEnd = (e: any) => {
    if (mode !== 'picker' || !onLocationSelect) return;
    const latLng = e.latLng;
    if (latLng) {
      const lat = latLng.lat();
      const lng = latLng.lng();
      const address = `Selected Pin Point (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      onLocationSelect({ lat, lng, address });
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950">
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <div style={{ height, width: '100%' }}>
          <Map
            defaultCenter={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            defaultZoom={zoom}
            mapId="DEMO_MAP_ID"
            onClick={handleMapClick}
            disableDefaultUI={false}
            zoomControl={true}
            streetViewControl={false}
            mapTypeControl={true}
            fullscreenControl={true}
            internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
            style={{ width: '100%', height: '100%' }}
          >
            {/* Auto fit markers in view mode */}
            {mode === 'view' && issues.length > 0 && (
              <MapBoundsAdjuster issues={issues} />
            )}

            {/* PICKER MODE: Single Draggable Marker with Pulse */}
            {mode === 'picker' && (
              <AdvancedMarker
                position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                draggable={true}
                onDragEnd={handleMarkerDragEnd}
              >
                <div className="relative flex flex-col items-center cursor-grab active:cursor-grabbing transform -translate-y-full hover:scale-110 transition-transform">
                  <div className="relative">
                    <span className="absolute -inset-1 rounded-full bg-orange-500/40 animate-ping"></span>
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 border-2 border-white shadow-2xl flex items-center justify-center text-white">
                      <MapPin className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="bg-slate-900/90 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow mt-1 border border-slate-700 whitespace-nowrap">
                    Drag or Click Map
                  </div>
                </div>
              </AdvancedMarker>
            )}

            {/* VIEW MODE: Multiple Issues with issue-appropriate images & badges */}
            {mode === 'view' &&
              issues.map((issue) => {
                const isHigh = issue.severity === 'High';
                const isResolved = issue.status === 'Resolved';
                const issuePhoto = issue.status === 'Resolved' && issue.afterImage 
                  ? issue.afterImage 
                  : (issue.images[0] || DEFAULT_IMAGES.pothole);

                return (
                  <AdvancedMarker
                    key={issue.id}
                    position={{ lat: issue.location.lat, lng: issue.location.lng }}
                    onClick={() => {
                      setSelectedIssueInfo(issue);
                      if (onIssueSelect) onIssueSelect(issue);
                    }}
                  >
                    <div className="group relative flex flex-col items-center cursor-pointer transform -translate-y-1/2 hover:scale-115 transition-all">
                      {/* Outer Pulse for High Severity */}
                      {isHigh && (
                        <span className="absolute -inset-1 rounded-2xl bg-red-500/50 animate-ping"></span>
                      )}

                      {/* Issue Identification Marker Card */}
                      <div className={`relative flex items-center gap-1.5 p-1 rounded-2xl shadow-2xl backdrop-blur-md border-2 ${
                        isResolved ? 'bg-emerald-950/90 border-emerald-400' :
                        isHigh ? 'bg-red-950/90 border-red-500' :
                        issue.severity === 'Medium' ? 'bg-amber-950/90 border-amber-400' :
                        'bg-teal-950/90 border-teal-400'
                      }`}>
                        {/* Issue-appropriate thumbnail photo */}
                        <div className="w-7 h-7 rounded-xl overflow-hidden border border-white/30 shrink-0">
                          <img
                            src={issuePhoto}
                            alt={issue.title}
                            onError={(e) => handleImageError(e, DEFAULT_IMAGES.pothole)}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Department Icon */}
                        <div className="pr-1.5 flex items-center gap-1">
                          {getDepartmentIcon(issue.department)}
                          <span className="text-[10px] font-bold text-white whitespace-nowrap max-w-[80px] truncate">
                            {issue.department.split(' ')[0]}
                          </span>
                        </div>
                      </div>

                      {/* Mini pointer arrow */}
                      <div className={`w-2 h-2 rotate-45 -mt-1 ${
                        isResolved ? 'bg-emerald-600' :
                        isHigh ? 'bg-red-500' :
                        issue.severity === 'Medium' ? 'bg-amber-500' : 'bg-teal-500'
                      }`}></div>
                    </div>
                  </AdvancedMarker>
                );
              })}

            {/* INFO WINDOW FOR SELECTED ISSUE IN GOOGLE MAPS */}
            {selectedIssueInfo && (
              <InfoWindow
                position={{
                  lat: selectedIssueInfo.location.lat,
                  lng: selectedIssueInfo.location.lng
                }}
                onCloseClick={() => setSelectedIssueInfo(null)}
              >
                <div className="p-1 max-w-[240px] text-slate-900 font-sans space-y-2">
                  {/* Issue Appropriate Image Thumbnail */}
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200">
                    <img
                      src={selectedIssueInfo.status === 'Resolved' && selectedIssueInfo.afterImage 
                        ? selectedIssueInfo.afterImage 
                        : (selectedIssueInfo.images[0] || DEFAULT_IMAGES.pothole)}
                      alt={selectedIssueInfo.title}
                      onError={(e) => handleImageError(e, DEFAULT_IMAGES.pothole)}
                      className="w-full h-full object-cover"
                    />
                    <span className={`absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.2 rounded text-white ${
                      selectedIssueInfo.severity === 'High' ? 'bg-red-600' :
                      selectedIssueInfo.severity === 'Medium' ? 'bg-amber-600' : 'bg-teal-600'
                    }`}>
                      {selectedIssueInfo.severity}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                      {selectedIssueInfo.department}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 leading-tight mt-0.5 line-clamp-2">
                      {selectedIssueInfo.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{selectedIssueInfo.location.address}</span>
                    </p>
                  </div>

                  <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-slate-700">{selectedIssueInfo.status}</span>
                    <button
                      onClick={() => {
                        if (onIssueSelect) onIssueSelect(selectedIssueInfo);
                        setSelectedIssueInfo(null);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm transition-colors"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </div>
      </APIProvider>

      {/* Floating GPS Status Pill for Picker Mode */}
      {mode === 'picker' && (
        <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-700 text-xs text-slate-200 flex items-center justify-between z-10 shadow-xl">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></span>
            <span>Google Maps Location: Click or drag marker to set GPS</span>
          </span>
          <span className="font-mono text-teal-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
          </span>
        </div>
      )}
    </div>
  );
};
