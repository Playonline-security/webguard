import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/webguard/' : '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
}))
