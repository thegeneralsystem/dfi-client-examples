import { Layer, LayerProps, Popup, Source, useMap } from 'react-map-gl';
import { useState } from 'react';
import bbox from '@turf/bbox';
import { useQuery } from '@tanstack/react-query';
import {
  postPolygonPoints,
  PostPolygonPointsBody,
  Point,
  idTransform,
  payloadToMarker,
} from 'dfi-utils';

import { BusMarker } from '../components/bus-marker';
import { GeoJsonFileData, useBoroughGeoJsonQuery, BoroughName } from '../hooks/use-boroughs';
import { useNavigate, useParams } from 'react-router-dom';
import { RefreshControl } from '../components/refresh-control';
import { AppFramePortal } from '../components/app-frame';

const fillLayerStyle: LayerProps = {
  id: 'polygon-fill',
  type: 'fill',
  paint: {
    'fill-color': '#000',
    'fill-opacity': 0.2,
  },
};

const outlineLayerStyle: LayerProps = {
  id: 'polygon-outline',
  type: 'line',
  paint: {
    'line-color': '#000',
    'line-width': 20,
    'line-opacity': 0.1,
  },
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
};

const usePolygonPointsQuery = (
  borough: GeoJsonFileData | null,
  params?: Omit<PostPolygonPointsBody, 'polygon'>,
) => {
  const payload = borough ? { ...params, polygon: borough.geometry.coordinates[0][0] } : null;
  return useQuery(
    payload ? (['polygon', 'points', payload] as const) : [],
    async ({ queryKey: [, , body] }) => {
      if (!body) throw new Error('Empty body');

      return postPolygonPoints(
        { ...body, instance: import.meta.env.VITE_DFI_INSTANCE },
        {
          baseURL: import.meta.env.VITE_DFI_URL,
          headers: {
            'X-API-TOKEN': `Bearer ${import.meta.env.VITE_DFI_API_TOKEN}`,
          },
        },
      );
    },
    {
      enabled: Boolean(payload),
      refetchInterval: 60000, // 1 minute
      select: ({ points, ...data }) => ({
        ...data,
        // transform the results - get unique vehicles
        points: Object.values(
          points
            .sort((a, b) => ((a.time || Date.now()) < (b.time || Date.now()) ? -1 : 1))
            .map((point) => {
              const newId = idTransform(point.id, point.payload);
              point.id = newId;
              return { [newId]: point };
            })
            .reduce((acc, cur) => ({ ...cur, ...acc }), {}),
        ),
      }),
    },
  );
};

const fiveMinutesAgo = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - 5, 0, 0);
  return date;
};

export const Borough = () => {
  const map = useMap();
  const { borough } = useParams() as { borough: BoroughName };
  const navigate = useNavigate();

  const { data: boroughGeoJson } = useBoroughGeoJsonQuery(borough, {
    onSuccess: (feature) => {
      if (!map.current) return;

      const [minLng, minLat, maxLng, maxLat] = bbox(feature);

      map.current.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        {
          padding: {
            top: 100,
            left: 100,
            right: 100,
            bottom: 100,
          },
        },
      );
    },
    onError: () => {
      navigate('/boroughs', {
        replace: true,
      });
    },
  });

  const polygonQuery = usePolygonPointsQuery(boroughGeoJson ?? null, {
    startTime: fiveMinutesAgo(),
  });
  const [hoveredPoint, setHoveredPoint] = useState<Point | null>(null);

  const handleMouseEnter = (point: Point) => {
    setHoveredPoint(point);
  };

  const handleMouseLeave = (point: Point) => {
    setHoveredPoint((currentHoveredPoint) =>
      currentHoveredPoint === point ? null : currentHoveredPoint,
    );
  };

  const handleMarkerClick = ({ coordinate: center, id }: Point) => {
    if (map.current) {
      map.current.flyTo({
        center,
        zoom: 16,
      });
    }

    navigate(`/buses/${id}`, {
      state: {
        borough,
      },
    });
  };

  return (
    <>
      {boroughGeoJson ? (
        <Source id="borough" type="geojson" data={boroughGeoJson}>
          <Layer {...fillLayerStyle} />
          <Layer {...outlineLayerStyle} />
        </Source>
      ) : null}
      {polygonQuery.data?.points
        ? polygonQuery.data.points.map((point) => (
            <BusMarker
              key={point.id}
              point={point}
              onClick={handleMarkerClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          ))
        : null}
      {hoveredPoint ? (
        <Popup
          anchor="bottom"
          longitude={hoveredPoint.coordinate[0]}
          latitude={hoveredPoint.coordinate[1]}
          onClose={() => setHoveredPoint(null)}
          closeButton={false}
          offset={[0, -20]}
          style={{
            backgroundColor: 'transparent',
          }}
        >
          {payloadToMarker(String(hoveredPoint.id), String(hoveredPoint.payload))}
        </Popup>
      ) : null}
      <AppFramePortal>
        <RefreshControl query={polygonQuery} />
      </AppFramePortal>
    </>
  );
};
