import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('/src/dashboard/') || id.includes('\\src\\dashboard\\')) {
            return 'dashboard';
          }
          if (id.includes('/src/pages/') || id.includes('\\src\\pages\\')) {
            return 'pages';
          }
        },
      },
    },
  },
});
