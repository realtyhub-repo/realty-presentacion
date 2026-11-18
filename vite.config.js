import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export default defineConfig({
  plugins: [react()],
  cacheDir: join(tmpdir(), 'vite-presentacion-realty'),
})
