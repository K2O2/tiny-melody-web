import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'path';
export default defineConfig({
  plugins: [vue()],
  //src path config 
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src')
    } 
  }
})


