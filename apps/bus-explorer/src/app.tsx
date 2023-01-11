import { QueryClientProvider } from '@tanstack/react-query';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import { Layout } from './pages/layout';
import { Boroughs } from './pages/boroughs';
import { Borough } from './pages/borough';
import { AppThemeProvider } from './theme';
import { QueryClient } from '@tanstack/react-query';
import { Bus } from './pages/bus';

const client = new QueryClient();

export const App = () => (
  <QueryClientProvider client={client}>
    <AppThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/boroughs" element={<Boroughs />}>
              <Route path=":borough" element={<Borough />} />
            </Route>
            <Route path="/buses/:bus" element={<Bus />} />
            <Route path="*" element={<Navigate to="/boroughs" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppThemeProvider>
  </QueryClientProvider>
);
