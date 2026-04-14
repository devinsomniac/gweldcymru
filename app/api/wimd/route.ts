// app/api/wimd/route.ts
import { NextRequest, NextResponse } from 'next/server';

const WFS_URL = 'https://datamap.gov.wales/geoserver/ows';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 });
  }

  try {
    const size = 0.005;
    const bbox = `${Number(lng) - size},${Number(lat) - size},${Number(lng) + size},${Number(lat) + size},EPSG:4326`;

    const params = new URLSearchParams({
      service: 'WFS',
      version: '1.1.0',
      request: 'GetFeature',
      typeName: 'inspire-wg:wimd2019_overall',
      outputFormat: 'application/json',
      bbox: bbox,
      maxFeatures: '1',
    });

    const res = await fetch(`${WFS_URL}?${params.toString()}`, {
      next: { revalidate: 3600 },
    });

    const text = await res.text();

    if (text.startsWith('<?xml') || text.includes('ServiceException')) {
      return NextResponse.json({ error: 'WFS error' }, { status: 502 });
    }

    const geojson = JSON.parse(text);

    if (!geojson.features || geojson.features.length === 0) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    const props = geojson.features[0].properties;

    return NextResponse.json({
      lsoaCode: props.lsoa_code,
      lsoaNameEn: props.lsoa_name_en,
      lsoaNameCy: props.lsoa_name_cy,
      overallRank: props.rank,
      overallDecile: props.decile,
      quintile: props.quintile,
      mapGroup: props.map_group,
    });
  } catch (err) {
    console.error('WIMD error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}