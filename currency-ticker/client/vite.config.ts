import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts'
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:3001',
    }
  },
  preview: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:3001',
    }
  }
})
