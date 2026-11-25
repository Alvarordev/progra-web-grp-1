import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const { BACKEND_URL } = loadEnv(mode, '.', 'BACKEND_')
  const proxy = {
    '/api': { target: BACKEND_URL || 'http://127.0.0.1:3000' },
  }
  return {
    plugins: [react()],
    server: { proxy },
    preview: { proxy },
  }
})
