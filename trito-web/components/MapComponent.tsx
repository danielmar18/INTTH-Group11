"use client";

import React, { useMemo, useState } from 'react';
import {Map, Layer, LayerProps} from 'react-map-gl';
import { Material} from '@deck.gl/core';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Color, ColumnLayer, DeckGL, MapViewState, PickingInfo, PolygonLayer, Position } from 'deck.gl';
import { DeviceInfo } from '@/types/client';
import { mapValueToColorScale } from '@/utils/colorScale';

const MAPBOX_TOKEN  = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type Building = {
  polygon: Position[];
  height: number;
};

type Theme = {
  buildingColor: Color;
  trailColor0: Color;
  trailColor1: Color;
  material: Material;
};

const DEFAULT_THEME: Theme = {
  buildingColor: [74, 80, 87],
  trailColor0: [253, 128, 93],
  trailColor1: [23, 184, 190],
  material: {
    ambient: 0.1,
    diffuse: 0.6,
    shininess: 32,
    specularColor: [60, 64, 70]
  },
};

const buildings3DLayer: LayerProps = {
  id: '3d-buildings',
  source: 'composite',
  'source-layer': 'building',
  filter: ['==', 'extrude', 'true'],
  type: 'fill-extrusion',
  minzoom: 15,
  paint: {
    'fill-extrusion-color': '#ccc',
    'fill-extrusion-height': ['get', 'height']
  }
};

function getTooltip({object}: PickingInfo) {
  if (!object) {
    return null;
  }
  const lat = object.position[1];
  const lng = object.position[0];

  return `\
    Name: ${object.name || 'N/A'}
    Latitude: ${Number.isFinite(lat) ? lat.toFixed(6) : ''}
    Longitude: ${Number.isFinite(lng) ? lng.toFixed(6) : ''}`;
}

type Props = {
  onClick: (info: any) => void;
  devices: DeviceInfo[];
  view: MapViewState;
}

const TestComp = ({onClick, devices, view}: Props) => {
  const [show, setShow] = useState<boolean>(false);

  const layers = useMemo(() => { 
    return [
    new PolygonLayer<Building>({
      id: 'buildings',
      data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/trips/buildings.json',
      extruded: true,
      wireframe: false,
      opacity: 0.5,
      getPolygon: f => f.polygon,
      getElevation: f => f.height,
      getFillColor: DEFAULT_THEME.buildingColor,
      material: DEFAULT_THEME.material
    }),
    new ColumnLayer({
      id: 'deckgl-circle',
      data: devices,
      getFillColor: (d: any) => mapValueToColorScale(d.dataAmount),
      getRadius: 10,
      radius: 15,
      extruded: true,
      elevationScale: show ? 15 : 0,
      transitions: {
        elevationScale: 400,
        elevation: 200,
        getElevation: 200,
        opacity: 250
      },
      getElevation: (d: any) => 3 + d.dataAmount * 7,
      onClick: (info: PickingInfo) => onClick(info),
      pickable: true,
      opacity: show ? 1 : 0,
    })
  ]}, [devices, show]);

  return (
    <>
      <DeckGL
        layers={layers}
        initialViewState={view}
        controller={true}
        getTooltip={getTooltip}
        
      >
        <Map mapStyle="mapbox://styles/mapbox/dark-v9" mapboxAccessToken={MAPBOX_TOKEN} onLoad={() => setShow(true)} >
          <Layer {...buildings3DLayer} />
        </Map>
      </DeckGL>
    </>
  );
}

export default TestComp;