import { List, ListItemButton, ListItemText } from '@mui/material';
import { BoroughName, boroughs, formatBoroughName } from '../hooks/use-boroughs';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useMap } from 'react-map-gl';
import { FloatingPanel } from '../components/floating-panel';

const LONDON_VIEW_STATE = {
  latitude: 51.497513229840536,
  longitude: -0.1402852849394094,
  zoom: 11,
};

export const Boroughs = () => {
  const map = useMap();
  const navigate = useNavigate();
  const { borough: selectedBorough } = useParams() as { borough?: BoroughName };

  const listItems = useMemo(
    () =>
      boroughs.map((borough) => (
        <ListItemButton
          key={borough}
          selected={selectedBorough === borough}
          onClick={() => navigate(`/boroughs/${borough}`)}
        >
          <ListItemText primary={formatBoroughName(borough)} />
        </ListItemButton>
      )),
    [selectedBorough, navigate],
  );

  useEffect(() => {
    if (!map.current) return;
    if (selectedBorough) return;

    map.current.flyTo({
      center: [LONDON_VIEW_STATE.longitude, LONDON_VIEW_STATE.latitude],
      padding: {
        top: 0,
        left: 400,
        right: 0,
        bottom: 0,
      },
      zoom: 11,
    });
  }, [selectedBorough]);

  return (
    <>
      <Outlet />
      <FloatingPanel>
        <List component="nav">{listItems}</List>
      </FloatingPanel>
    </>
  );
};
