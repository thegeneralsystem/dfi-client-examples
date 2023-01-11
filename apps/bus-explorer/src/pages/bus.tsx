import { Layer, LayerProps, Source, useMap } from 'react-map-gl';
import bbox from '@turf/bbox';
import { useQuery } from '@tanstack/react-query';
import { getHistoryId, GetHistoryIdParams, Point } from 'dfi-utils';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { BusMarker } from '../components/bus-marker';
import { FloatingPanel } from '../components/floating-panel';
import { Button, CardContent } from '@mui/material';
import { BoroughName, formatBoroughName } from '../hooks/use-boroughs';
import { AppFramePortal } from '../components/app-frame';
import { RefreshControl } from '../components/refresh-control';
import { ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';

const busLayerStyle: LayerProps = {
  id: 'bus-line',
  type: 'line',
  paint: {
    'line-color': '#D01A1E',
    'line-width': 5,
  },
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
};

const useEntityHistoryQuery = (id: Point['id'], params?: GetHistoryIdParams) =>
  useQuery(
    ['history', id, params] as const,
    async ({ queryKey: [, busId, queryParams] }) =>
      getHistoryId(
        busId.toString(),
        { ...queryParams, instance: import.meta.env.VITE_DFI_INSTANCE },
        {
          baseURL: import.meta.env.VITE_DFI_URL,
          headers: {
            'X-API-TOKEN': `Bearer ${import.meta.env.VITE_DFI_API_TOKEN}`,
          },
        },
      ),
    {
      refetchInterval: 30000,
      enabled: !!id,
    },
  );

const startOfToday = () => {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

export const Bus = () => {
  const map = useMap();
  const navigate = useNavigate();
  const { state } = useLocation() as { state: { borough: BoroughName } | null };
  const { bus } = useParams() as { bus: Point['id'] };

  const [, filterReg] = String(bus).split('|');

  const busQuery = useEntityHistoryQuery(bus, {
    startTime: startOfToday(),
  });

  const busGeoJson = useMemo(() => {
    const filtered = busQuery.data?.points
      .filter(({ payload }) => {
        const [, reg] = payload.split('|');
        return reg === filterReg;
      })
      .sort((a, b) => (a.time > b.time ? -1 : 1));
    const geoJSON = filtered
      ? ({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: filtered.map(({ coordinate }) => coordinate),
          },
        } as const)
      : null;
    return geoJSON;
  }, [busQuery.data]);

  useEffect(() => {
    if (!busGeoJson) return;
    if (!map.current) return;
    if (!busGeoJson.geometry.coordinates.length) return;

    const [minLng, minLat, maxLng, maxLat] = bbox(busGeoJson);

    map.current.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      {
        padding: 100,
      },
    );
  }, [busGeoJson]);

  const [latestPoint] = busQuery.data?.points ?? [];

  return (
    <>
      {busGeoJson ? (
        <Source id="bus" type="geojson" data={busGeoJson}>
          <Layer {...busLayerStyle} />
        </Source>
      ) : null}
      <FloatingPanel sx={{ position: 'relative' }}>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<ChevronLeftIcon />}
            onClick={() => navigate(`/boroughs${state?.borough ? `/${state.borough}` : ''}`)}
          >
            Back to {state?.borough ? formatBoroughName(state.borough) : 'all boroughs'}
          </Button>
        </CardContent>
      </FloatingPanel>
      {latestPoint ? <BusMarker point={{ ...latestPoint, id: bus }} /> : null}
      <AppFramePortal>
        <RefreshControl query={busQuery} />
      </AppFramePortal>
    </>
  );
};
