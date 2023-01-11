import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';

export default defineConfig({
  server: { hmr: true },
  plugins: [react(), tsconfigPaths(), checker({ typescript: true })],
});
