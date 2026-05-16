import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,   // Fail if 3000 is taken (judges need 127.0.0.1:3000)
    host: '127.0.0.1',
  },
  preview: {
    port: 3000,
    strictPort: true,
    host: '127.0.0.1',
  },
});
