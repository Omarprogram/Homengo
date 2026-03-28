import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,       // ← change port here
    strictPort: true  // ← optional, fails if port 3000 is in use
  }
});
