import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/deep_questions/',
  plugins: [vue()],
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0'  // This makes it accessible on the local network
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
}) 