// app/api/constraints/check/route.ts
import { NextRequest, NextResponse } from 'next/server';

const DMW = 'https://datamap.gov.wales/geoserver/ows';

interface LayerConfig {
  layer: string;
  label: string;
  triggered: string;
  clear: string;
}

const LAYERS: Record<string, LayerConfig> = {
  flood: {
    layer: 'inspire-nrw:NRW_FLOODZONE_RIVERS_SEAS_MERGED',
    label: 'Flood Risk Zone',
    triggered: 'Site within NRW Flood Zone 2/3 — TAN15 applies',
    clear: 'Outside NRW flood zones',
  },
  monuments: {
    layer: 'inspire-wg:Cadw_SAM',
    label: 'Scheduled Monument',
    triggered: 'Site intersects a Scheduled Monument — Cadw consent required',
    clear: 'No scheduled monument at site',
  },
  listed: {
    layer: 'inspire-wg:Cadw_ListedBuildings',
    label: 'Listed Building',
    triggered: 'Listed Building at site — Planning Act 1990',
    clear: 'No listed building at site',
  },
  worldheritage: {
    layer: 'inspire-wg:WorldHeritageSites',
    label: 'World Heritage Site',
    triggered: 'Within UNESCO World Heritage Site',
    clear: 'Outside World Heritage Sites',
  },
  sssi: {
    layer: 'inspire-nrw:NRW_SSSI',
    label: 'SSSI',
    triggered: 'Within Site of Special Scientific Interest — Wildlife & Countryside Act 1981',
    clear: 'No SSSI at site',
  },
  nationalpark: {
    layer: 'inspire-nrw:NRW_NATIONALPARK',
    label: 'National Park',
    triggered: 'Within a Welsh National Park',
    clear: 'Outside Welsh National Parks',
  },
};

// Hit one WFS layer with a tiny bbox around the point — returns true if any feature exists there
async function checkLayer(lat: number, lng: number, layer: string): Promise<boolean> {
  // ~10m buffer around point in lat/lng degrees
  const buf = 0.0001;
  const bbox = `${lng - buf},${lat - buf},${lng + buf},${lat + buf},EPSG:4326`;

  const params = new URLSearchParams({
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typeNames: layer,
    bbox,
    outputFormat: 'application/json',
    count: '1',
  });

  try {
    const res = await fetch(`${DMW}?${params}`, { next: { revalidate: 3600 } });
    const text = await res.text();
    // Guard: if GeoServer errored, it returns XML — don't try to JSON.parse it
    if (text.trim().startsWith('<')) return false;
    const data = JSON.parse(text);
    return Array.isArray(data.features) && data.features.length > 0;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get('lat'));
  const lng = Number(searchParams.get('lng'));

  if (!isFinite(lat) || !isFinite(lng)) {
    return NextResponse.json({ error: 'lat and lng required' }, { status: 400 });
  }

  // The interesting bit: ALL 6 layers checked in parallel
  const entries = Object.entries(LAYERS);
  const results = await Promise.all(
    entries.map(async ([key, cfg]) => {
      const hit = await checkLayer(lat, lng, cfg.layer);
      return [
        key,
        {
          status: hit ? 'red' : 'green',
          label: cfg.label,
          detail: hit ? cfg.triggered : cfg.clear,
        },
      ] as const;
    })
  );

  return NextResponse.json(Object.fromEntries(results));
}