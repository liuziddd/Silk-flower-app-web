// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// 简单稳定的配置
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    minify: false, // 禁用最小化，减少构建复杂度
    sourcemap: false,
    cssCodeSplit: false,
    ssrManifest: false,
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
})
