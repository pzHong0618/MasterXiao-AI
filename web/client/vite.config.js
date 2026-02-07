import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    host: true,  // 监听所有网络接口，支持局域网访问
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'development' 
          ? 'http://localhost:3000' 
          : 'http://43.143.84.132:3000',
        changeOrigin: true,
      }
    }
  },
  preview: {
    host: true,
    port: 4173,
  },
});
