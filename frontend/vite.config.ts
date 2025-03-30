import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "global": {}
  },
  base: "./",
  build: {
    minify: false, // Disable minification for debugging
    sourcemap: true, // Helps with debugging
  },
})
