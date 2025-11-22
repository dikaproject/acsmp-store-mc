import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
