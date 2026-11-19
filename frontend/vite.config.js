import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Stable vendor chunks: they rarely change, so browsers keep them cached
        // across deploys while page chunks update.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/.test(id)) return 'vendor-react';
          if (/[\\/]node_modules[\\/](framer-motion|motion|motion-dom|motion-utils)[\\/]/.test(id)) return 'vendor-motion';
        },
      },
    },
  },
  server: {
    host: '0.0.0.0', // biar bisa diakses dari luar (misalnya lewat ngrok)
    port: 5173,      // sesuaikan port Vite kamu
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '631c7dac2609.ngrok-free.app', // tambahkan domain ngrok kamu di sini
    ],
  },
})
