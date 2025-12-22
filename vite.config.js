import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',  // ← SIN subcarpeta
  plugins: [react()],
})