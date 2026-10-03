import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const frontendDirectory = fileURLToPath(new URL('.', import.meta.url));
const backendDirectory = fileURLToPath(new URL('..', import.meta.url));

export default defineConfig(({ mode }) => {
  // Read only the backend port; backend secrets never enter the client bundle.
  const backendEnvironment = loadEnv(mode, backendDirectory, 'PORT');
  const frontendEnvironment = loadEnv(
    mode,
    frontendDirectory,
    'API_PROXY_TARGET',
  );
  const backendPort = backendEnvironment.PORT || '3000';
  const proxyTarget =
    frontendEnvironment.API_PROXY_TARGET || `http://127.0.0.1:${backendPort}`;

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
