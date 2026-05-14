import fs from 'node:fs';
import path from 'node:path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backendRoot = path.resolve(process.cwd(), '../backend');

function stripWrappingQuotes(value) {
  if (!value) {
    return value;
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function loadBackendEnv() {
  const values = {};

  for (const filename of ['.env', '.env.local']) {
    const filePath = path.join(backendRoot, filename);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    for (const rawLine of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) {
        continue;
      }

      const separatorIndex = line.indexOf('=');
      if (separatorIndex === -1) {
        continue;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = stripWrappingQuotes(line.slice(separatorIndex + 1).trim());
      if (key) {
        values[key] = value;
      }
    }
  }

  return values;
}

const backendEnv = loadBackendEnv();
const configuredBackendHost = backendEnv.BACKEND_HOST || '127.0.0.1';
const configuredBackendPort = backendEnv.BACKEND_PORT || '8000';
const backendHost = configuredBackendHost === '0.0.0.0' ? '127.0.0.1' : configuredBackendHost;
const apiProxyTarget =
  process.env.VITE_API_PROXY_TARGET || `http://${backendHost}:${configuredBackendPort}`;
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
      '/media': {
        target: apiProxyTarget,
        changeOrigin: true,
      },
    },
  },
});
