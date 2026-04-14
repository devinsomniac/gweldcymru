// components/Map.tsx
'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, WMSTileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DMW = 'https://datamap.gov.wales/geoserver/ows';

const WMS_LAYERS: Record<string, string> = {
  wimd: 'inspire-wg:wimd2019',
  flood: 'inspire-nrw:NRW_FLOODZONE_RIVERS_SEAS_MERGED',
  floodwarn: 'inspire-nrw:NRW_FLOOD_WARNING',
  lsoa: 'inspire-wg:lsoa2011',
};

const WMS_OPACITY: Record<string, number> = {
  wimd: 0.55,
  flood: 0.5,
  floodwarn: 0.45,
  lsoa: 0.3,
};

// Custom red marker
const markerIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 22px;
    height: 22px;
    background: #d4243b;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 10px rgba(0,0,0,0.5), 0 0 20px rgba(212,36,59,0.18);
  "></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

// Fly to location when it changes
function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 14, { duration: 1.2 });
  }, [lat, lng, map]);
  return null;
}

// Handle map clicks
function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface MapProps {
  activeLayers: Record<string, boolean>;
  markerPosition: { lat: number; lng: number } | null;
  flyTo: { lat: number; lng: number } | null;
  onMapClick: (lat: number, lng: number) => void;
  loading: boolean;
}

export default function Map({ activeLayers, markerPosition, flyTo, onMapClick, loading }: MapProps) {
  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[52.1, -3.6]}
        zoom={8}
        className="w-full h-full z-0"
        zoomControl={true}
        attributionControl={false}
      >
        {/* Dark basemap */}
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" maxZoom={19} />

        {/* WMS layers from DataMapWales */}
        {Object.entries(WMS_LAYERS).map(([key, layerName]) =>
          activeLayers[key] ? (
            <WMSTileLayer
              key={key}
              url={DMW}
              layers={layerName}
              transparent={true}
              format="image/png"
              opacity={WMS_OPACITY[key]}
            />
          ) : null
        )}

        {/* Marker */}
        {markerPosition && (
          <Marker position={[markerPosition.lat, markerPosition.lng]} icon={markerIcon} />
        )}

        {/* Fly to searched location */}
        {flyTo && <FlyTo lat={flyTo.lat} lng={flyTo.lng} />}

        {/* Click handler */}
        <MapClickHandler onClick={onMapClick} />
      </MapContainer>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 bg-[var(--surface)] border border-[var(--border)] rounded-full px-5 py-2 flex items-center gap-2.5 z-[1000]">
          <div className="w-3.5 h-3.5 border-2 border-[var(--border)] border-t-[var(--welsh-red)] rounded-full animate-spin" />
          <span className="text-xs text-[var(--text-muted)] font-medium">Fetching neighbourhood data…</span>
        </div>
      )}

      {/* Attribution */}
      <div className="absolute bottom-2 left-2 z-[800] bg-[rgba(8,12,16,0.88)] px-3 py-1.5 rounded-md text-[10px] text-[var(--text-dim)] border border-[var(--border)] backdrop-blur-sm">
        Data: <a href="https://datamap.gov.wales" target="_blank" className="text-[var(--text-muted)] hover:text-[var(--welsh-green)] no-underline">DataMapWales</a> · <a href="https://naturalresources.wales" target="_blank" className="text-[var(--text-muted)] hover:text-[var(--welsh-green)] no-underline">NRW</a> · <a href="https://postcodes.io" target="_blank" className="text-[var(--text-muted)] hover:text-[var(--welsh-green)] no-underline">postcodes.io</a> · OGL v3.0
      </div>
    </div>
  );
}