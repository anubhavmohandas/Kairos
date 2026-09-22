import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    open: false,
    proxy: {
      // Proxy all /api/* requests from frontend dev server to backend
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    target: 'esnext',
    outDir: 'dist'
  }
});
