import { Box, AppBar, Toolbar, Tabs, Tab, Portal } from '@mui/material';
import { ComponentProps, createContext, useContext, useMemo, useRef } from 'react';
import { Map, MapProvider } from 'react-map-gl';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import type { BoroughName } from '../hooks/use-boroughs';
import 'mapbox-gl/dist/mapbox-gl.css';

interface AppFrameContextValue {
  portalContainerRef: React.RefObject<HTMLDivElement>;
}

const AppFrameContext = createContext<AppFrameContextValue | null>(null);

export const useAppFrame = () => {
  const context = useContext(AppFrameContext);

  if (!context) throw new Error('useAppFrame must be used within AppFrame');
  return context;
};

export interface AppFrameProps extends Omit<ComponentProps<typeof Map>, 'style'> {
  children: React.ReactNode;
}

export const AppFrame = ({ children, ...rest }: AppFrameProps) => {
  const portalContainerRef = useRef<HTMLDivElement>(null);
  const boroughsPath = useMatch({ path: '/boroughs', end: false });
  const busPath = useMatch('/buses/:bus');
  const { state } = useLocation() as { state: { borough: BoroughName } | null };
  const navigate = useNavigate();

  const contextValue = useMemo(() => ({ portalContainerRef }), []);

  return (
    <AppFrameContext.Provider value={contextValue}>
      <Box display="flex" flexDirection="column" flex={1} height="100%">
        <AppBar position="static">
          <Toolbar
            sx={{
              justifyContent: 'flex-end',
            }}
          >
            <Box position="absolute" left={0} right={0}>
              <Tabs value={boroughsPath ? 0 : busPath ? 1 : false} textColor="inherit" centered>
                <Tab
                  label="Borough View"
                  onClick={() => navigate(`/boroughs${state?.borough ? `/${state.borough}` : ''}`)}
                />
                {busPath ? <Tab label="Bus View" /> : null}
              </Tabs>
            </Box>
            <Box ref={portalContainerRef} />
          </Toolbar>
        </AppBar>
        <Box display="flex" flexDirection="column" flex={1} height="100%">
          <MapProvider>
            <Map
              style={{ width: '100%', height: '100%' }}
              {...rest}
              mapStyle="mapbox://styles/mapbox/streets-v11"
            >
              {children}
            </Map>
          </MapProvider>
        </Box>
      </Box>
    </AppFrameContext.Provider>
  );
};

export const AppFramePortal = (props: { children: React.ReactNode }) => {
  const { portalContainerRef } = useAppFrame();

  return <Portal {...props} container={portalContainerRef.current} />;
};
