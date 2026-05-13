import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiProxyTarget = process.env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8000';
const usePolling = ['1', 'true', 'yes'].includes(String(process.env.VITE_USE_POLLING || process.env.CHOKIDAR_USEPOLLING || '').toLowerCase());
const devPort = Number(process.env.VITE_DEV_PORT || 5173);

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: devPort,
    strictPort: true,
    watch: usePolling
      ? {
          usePolling: true,
          interval: 1000,
        }
      : undefined,
    proxy: {
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true,
      },
    },
  },
});
