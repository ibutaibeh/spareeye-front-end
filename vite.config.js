import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: { three: path.resolve(__dirname, 'node_modules/three') },
    dedupe: ['three']
  },
  plugins: [react()],
});
