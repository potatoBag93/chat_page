import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './', // GitHub Pages 등 하위 경로 배포 시 필요
  plugins: [react()],
})
