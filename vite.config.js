import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  base: '/kotoba-23-app/', // <-- Tambahkan baris ini agar sesuai dengan nama repository
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})