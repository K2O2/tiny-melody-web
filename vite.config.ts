import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 配置代理
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "http://localhost:8848",
  //       changeOrigin: true,
  //       // rewrite: (path) => path.replace(/^\/api/, '')
  //     },
  //   },
  // },
});
