import { defineConfig } from "vite";
import path from "path";
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // 设置 @ 指向 src 目录
    },
  },
  server: {
    port: 8000, // 设置端口号为 3000
    host: "0.0.0.0", // 可选：监听所有地址
    open: true, // 可选：启动后自动打开浏览器
  },
});
