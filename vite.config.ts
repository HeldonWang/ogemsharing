import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use correct base path for GitHub Pages deployment
  base: '/ogemsharing/',
  build: {
    // Make sure the output assets use the correct relative paths
    assetsDir: 'assets',
    outDir: 'dist',
  }
})
