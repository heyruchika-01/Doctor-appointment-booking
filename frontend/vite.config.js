import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host: '0.0.0.0',
    port:5173,
     allowedHosts: [
      '77bf3d0e90b6.ngrok-free.app' // your ngrok domain here
    ]
  }
})
