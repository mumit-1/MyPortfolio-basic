import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Split heavy third-party libraries into separate chunks so the browser
    // can cache them independently and the initial JS payload is smaller.
    rollupOptions: {
      output: {
        manualChunks: {
          'motion': ['framer-motion'],
          'icons': ['react-icons'],
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
})
