import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
  server: {
    proxy: {
      '/health': {
        target: 'http://localhost:8080', // 로컬 API 서버
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/health/, '/health'),
        // 느린 외부 API를 중계할 때 게이트웨이 타임아웃 완화
        timeout: 30000,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Connection', 'keep-alive')
          })
        }
      }
    }
  }
})
