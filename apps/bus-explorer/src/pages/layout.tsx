import { AppFrame } from '../components/app-frame';

const LONDON_VIEW_STATE = {
  latitude: 51.497513229840536,
  longitude: -0.1402852849394094,
  zoom: 10.89165842009169,
};

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => (
  <AppFrame
    mapboxAccessToken={import.meta.env.VITE_MAPBOX_API_TOKEN}
    mapStyle="mapbox://styles/mapbox/streets-v11"
    initialViewState={LONDON_VIEW_STATE}
  >
    {children}
  </AppFrame>
);
