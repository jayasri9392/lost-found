import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    open: true,        // auto-open browser on start
    strictPort: false, // try next port if 5173 is taken
    hmr: {
      overlay: true,   // show build errors in browser overlay
    },
  },
  preview: {
    port: 4173,
  },
  build: {
    sourcemap: false,
  },
});
