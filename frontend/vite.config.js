import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Proxy API requests to the backend
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Your backend server
        changeOrigin: true, // Recommended for CORS
      },
    },
  },
})