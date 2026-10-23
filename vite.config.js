import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * ClickGuard local development proxy.
 * Browser calls same-origin /api/*; Vite forwards those requests to Express.
 * This removes the browser CORS requirement for local development only.
 * Production hosting must configure an equivalent reverse proxy or set VITE_API_URL.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = (env.VITE_API_PROXY_TARGET || 'http://localhost:5000').replace(/\/+$/, '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '/health': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
