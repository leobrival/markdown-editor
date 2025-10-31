import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages configuration
  // For project repository (https://username.github.io/markdown-editor/)
  // Set base to '/markdown-editor/' for project sites
  // Set base to '/' for user/org sites (username.github.io repo)
  base: process.env.GITHUB_PAGES === 'true' ? '/markdown-editor/' : '/',
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    target: 'ES2020',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
